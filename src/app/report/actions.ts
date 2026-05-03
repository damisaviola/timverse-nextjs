"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function submitReport(formData: FormData) {
  const supabase = await createClient();
  
  const reportType = formData.get("report_type") as string;
  const category = formData.get("category") as string;
  const email = formData.get("email") as string;
  const description = formData.get("description") as string;
  const file = formData.get("attachment") as File | null;

  try {
    // 1. Get User Session (Hybrid Identification)
    const { data: { user } } = await supabase.auth.getUser();

    let attachmentUrl = null;

    // 2. Handle File Upload (Compressed with Sharp)
    if (file && file.size > 0) {
      // Kita tetap batasi input awal 1 MB agar server tidak berat mendownload, 
      // lalu kita kompres jadi sangat kecil di sini.
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Ukuran file awal terlalu besar (Maks 2MB).");
      }

      // Proses Kompresi di Backend
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const compressedBuffer = await sharp(fileBuffer)
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.webp`;
      const filePath = `user-reports/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("report_attachments")
        .upload(filePath, compressedBuffer, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        throw new Error("Gagal mengunggah lampiran.");
      }

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("report_attachments")
        .getPublicUrl(filePath);
        
      attachmentUrl = publicUrl;
    }

    // 3. Insert to Database
    const { error: dbError } = await supabase.from("reports").insert({
      report_type: reportType,
      category: category || null,
      email: email || null,
      description,
      attachment_url: attachmentUrl,
      user_id: user?.id || null, // Link to user if logged in
      status: "pending"
    });

    if (dbError) {
      console.error("Database Error:", dbError);
      throw new Error("Gagal menyimpan laporan ke database.");
    }

    revalidatePath("/admin/complaints"); // Refresh admin view
    return { success: true };

  } catch (error: any) {
    console.error("Submit Error:", error);
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}
