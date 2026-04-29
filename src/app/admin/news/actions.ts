"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

/**
 * Membuat berita baru di database Supabase.
 */
export async function createNews(formData: FormData) {
  try {
    const admin = await requireAdmin();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const tagsString = formData.get("tags") as string;
    const thumbnail = formData.get("thumbnail") as File;

    if (!title || !category || !content) {
      return { error: "Judul, kategori, dan konten wajib diisi." };
    }

    const tags = tagsString ? JSON.parse(tagsString) : [];
    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const supabase = await createClient();

    let thumbnailUrl = null;

    // 1. Upload thumbnail jika ada
    if (thumbnail && thumbnail.size > 0) {
      const fileExt = thumbnail.name.split(".").pop();
      const fileName = `${slug}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("news-thumbnails")
        .upload(filePath, thumbnail);

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        return { error: "Gagal mengunggah gambar: " + uploadError.message };
      }

      // Dapatkan URL publik
      const { data: publicUrlData } = supabase.storage
        .from("news-thumbnails")
        .getPublicUrl(filePath);
      
      thumbnailUrl = publicUrlData.publicUrl;
    }

    // 2. Simpan ke database
    const { error: dbError } = await supabase
      .from("news")
      .insert({
        title,
        slug,
        excerpt,
        content,
        category,
        thumbnail_url: thumbnailUrl,
        author_id: admin.id,
        tags,
        featured: false,
        views: 0
      });

    if (dbError) {
      console.error("Database Error:", dbError);
      return { error: "Gagal menyimpan berita: " + dbError.message };
    }

    revalidatePath("/");
    revalidatePath("/category");
    revalidatePath("/admin");

    return { success: true, slug };
  } catch (error: any) {
    console.error("Create News Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}
