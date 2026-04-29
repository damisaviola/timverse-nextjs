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
        article_id: articleId,
        user_id: user.id,
        content: content.trim()
      });

    if (error) {
      console.error("Comment Error:", error);
      return { error: "Gagal mengirim komentar. Silakan coba lagi." };
    }

    // Revalidasi agar komentar baru muncul
    revalidatePath(`/article/[slug]`, "page");
    
    return { success: true };
  } catch (error: any) {
    console.error("Post Comment Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}
