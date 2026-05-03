"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateReportStatus(reportId: string, status: "pending" | "processing" | "resolved") {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("reports")
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", reportId);

    if (error) {
      console.error("Update Status Error:", error);
      throw new Error("Gagal memperbarui status laporan.");
    }

    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}

export async function cleanupOldReports() {
  const supabase = await createClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    // 1. Cari laporan resolved yang sudah lama
    const { data: oldReports, error: fetchError } = await supabase
      .from("reports")
      .select("id, attachment_url")
      .eq("status", "resolved")
      .lt("updated_at", thirtyDaysAgo.toISOString());

    if (fetchError) throw fetchError;
    if (!oldReports || oldReports.length === 0) return { success: true, count: 0 };

    // 2. Hapus file di Storage jika ada
    const filesToDelete = oldReports
      .filter(r => r.attachment_url)
      .map(r => {
        const url = r.attachment_url;
        // Ambil path setelah nama bucket
        return url.split("/report_attachments/")[1];
      });

    if (filesToDelete.length > 0) {
      await supabase.storage
        .from("report_attachments")
        .remove(filesToDelete);
    }

    // 3. Hapus data di database
    const { error: deleteError } = await supabase
      .from("reports")
      .delete()
      .in("id", oldReports.map(r => r.id));

    if (deleteError) throw deleteError;

    revalidatePath("/admin/complaints");
    return { success: true, count: oldReports.length };
  } catch (error: any) {
    console.error("Cleanup Error:", error);
    return { error: "Gagal membersihkan laporan lama." };
  }
}

export async function deleteReport(reportId: string) {
  const supabase = await createClient();

  try {
    // 1. Ambil data laporan untuk mengecek lampiran
    const { data: report, error: fetchError } = await supabase
      .from("reports")
      .select("attachment_url")
      .eq("id", reportId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Jika ada lampiran, hapus dari Storage
    if (report?.attachment_url) {
      const urlParts = report.attachment_url.split("/report_attachments/");
      const filePath = urlParts.length > 1 ? urlParts[1] : null;
      
      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("report_attachments")
          .remove([filePath]);
        
        if (storageError) {
          console.error("Storage Delete Error:", storageError);
          // Kita tetap lanjut hapus DB meskipun storage gagal (opsional)
        }
      }
    }

    // 3. Hapus data dari database
    const { error } = await supabase
      .from("reports")
      .delete()
      .eq("id", reportId);

    if (error) throw error;

    revalidatePath("/admin/complaints");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Report Error:", error);
    return { error: "Gagal menghapus laporan dan lampirannya." };
  }
}
