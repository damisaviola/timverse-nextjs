"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-utils";

/**
 * Menyimpan komentar baru ke database.
 */
export async function postComment(formData: FormData) {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    const articleId = formData.get("articleId") as string;
    const content = formData.get("content") as string;

    if (!content || content.trim().length === 0) {
      return { error: "Komentar tidak boleh kosong." };
    }

    if (!articleId) {
      return { error: "ID Artikel tidak valid." };
    }

    const { error } = await supabase
      .from("comments")
      .insert({
        news_id: articleId,
        user_id: user.id,
        content: content.trim()
      });

    if (error) {
      console.error("Comment Error:", error);
      return { error: "Gagal mengirim komentar. Silakan coba lagi." };
    }

    revalidatePath(`/article/[slug]`, "page");
    
    return { success: true };
  } catch (error: any) {
    console.error("Post Comment Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * Toggle like pada berita. Jika sudah di-like, maka unlike. Jika belum, maka like.
 */
export async function toggleLike(articleId: string) {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    // Cek apakah sudah pernah like
    const { data: existing } = await supabase
      .from("likes")
      .select("id")
      .eq("news_id", articleId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Sudah like -> hapus (unlike)
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", existing.id);

      if (error) {
        console.error("Unlike Error:", error);
        return { error: "Gagal menghapus like." };
      }
      return { success: true, liked: false };
    } else {
      // Belum like -> tambah
      const { error } = await supabase
        .from("likes")
        .insert({ news_id: articleId, user_id: user.id });

      if (error) {
        console.error("Like Error:", error);
        return { error: "Gagal menyukai berita." };
      }
      return { success: true, liked: true };
    }
  } catch (error: any) {
    console.error("Toggle Like Exception:", error);
    return { error: error.message || "Anda harus login untuk menyukai berita." };
  }
}

/**
 * Toggle simpan berita. Jika sudah disimpan, hapus. Jika belum, simpan.
 */
export async function toggleSave(articleId: string) {
  try {
    const user = await requireUser();
    const supabase = await createClient();

    // Cek apakah sudah pernah simpan
    const { data: existing } = await supabase
      .from("saved_news")
      .select("id")
      .eq("news_id", articleId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Sudah disimpan -> hapus
      const { error } = await supabase
        .from("saved_news")
        .delete()
        .eq("id", existing.id);

      if (error) {
        console.error("Unsave Error:", error);
        return { error: "Gagal menghapus simpanan." };
      }
      return { success: true, saved: false };
    } else {
      // Belum disimpan -> simpan
      const { error } = await supabase
        .from("saved_news")
        .insert({ news_id: articleId, user_id: user.id });

      if (error) {
        console.error("Save Error:", error);
        return { error: "Gagal menyimpan berita." };
      }
      return { success: true, saved: true };
    }
  } catch (error: any) {
    console.error("Toggle Save Exception:", error);
    return { error: error.message || "Anda harus login untuk menyimpan berita." };
  }
}

/**
 * Menambah jumlah views pada berita.
 */
export async function incrementViews(articleId: string) {
  try {
    const supabase = await createClient();
    
    // Ambil data views saat ini
    const { data: currentData } = await supabase
      .from("news")
      .select("views")
      .eq("id", articleId)
      .single();
    
    const newViews = (currentData?.views || 0) + 1;
    
    // Update ke database
    await supabase
      .from("news")
      .update({ views: newViews })
      .eq("id", articleId);
      
  } catch (err) {
    console.error("Increment Views Error:", err);
  }
}
