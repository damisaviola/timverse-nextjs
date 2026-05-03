"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function fetchComments() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        created_at,
        content,
        user_id,
        news_id,
        profiles!inner (
          username,
          full_name,
          avatar_url
        ),
        news!inner (
          title,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Comments Error:", error);
      return { error: error.message };
    }

    return { data };
  } catch (error: any) {
    console.error("Fetch Comments Server Error:", error);
    return { error: error.message || "Gagal mengambil data komentar." };
  }
}


export async function deleteComment(id: string) {
  try {
    const supabase = await createClient();

    // 1. Verifikasi Admin via Custom JWT Cookie
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;

    if (!adminToken) {
      return { error: "Akses ditolak. Sesi admin tidak ditemukan." };
    }

    try {
      const payload = await verifyJwt(adminToken);
      if (!payload || payload.role !== 'admin') {
        return { error: "Akses ditolak. Anda bukan administrator." };
      }
    } catch (jwtErr) {
      return { error: "Sesi admin tidak valid atau telah kadaluarsa." };
    }

    // 2. Jalankan penghapusan
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete Comment Error:", error);
      return { error: error.message };
    }

    revalidatePath("/admin/comments");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Comment Server Error:", error);
    return { error: error.message || "Gagal menghapus komentar." };
  }
}
