"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";

/**
 * Mengambil semua berita dari database Supabase.
 */
export async function fetchNews() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch News Error:", error);
      return { error: "Gagal memuat berita: " + error.message, data: [] };
    }

    return { data: data || [] };
  } catch (error: any) {
    console.error("Fetch News Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem.", data: [] };
  }
}

/**
 * Membuat berita baru di database Supabase.
 * Menyesuaikan dengan skema tabel user yang menggunakan 'author' (text)
 * dan menambahkan dukungan untuk thumbnail_url serta tags.
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

    // Hitung estimasi waktu baca (sederhana)
    const wordsPerMinute = 200;
    const noHtmlContent = content.replace(/<[^>]*>/g, '');
    const wordCount = noHtmlContent.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    // 2. Simpan ke database (Sesuai skema user)
    const { error: dbError } = await supabase
      .from("news")
      .insert({
        title,
        slug,
        excerpt,
        content,
        category,
        author: admin.name || "Admin", // Menggunakan kolom 'author' (text) sesuai skema user
        author_avatar: "AD",
        thumbnail_url: thumbnailUrl, // Kolom tambahan (perlu dijalankan di SQL)
        tags: tags, // Kolom tambahan (perlu dijalankan di SQL)
        read_time: `${readTimeMinutes} menit`,
        featured: false,
        views: 0,
        date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
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

/**
 * Menghapus berita dari database Supabase.
 */
export async function deleteNews(newsId: string) {
  try {
    await requireAdmin();

    const supabase = await createClient();

    // 1. Ambil data berita untuk menghapus file dari storage
    const { data: newsData } = await supabase
      .from("news")
      .select("thumbnail_url")
      .eq("id", newsId)
      .single();

    // 2. Hapus thumbnail dari storage jika ada
    if (newsData?.thumbnail_url) {
      try {
        const url = new URL(newsData.thumbnail_url);
        const pathParts = url.pathname.split("/storage/v1/object/public/news-thumbnails/");
        if (pathParts[1]) {
          await supabase.storage
            .from("news-thumbnails")
            .remove([pathParts[1]]);
        }
      } catch (storageErr) {
        console.warn("Failed to delete thumbnail from storage:", storageErr);
      }
    }

    // 3. Hapus dari database
    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", newsId);

    if (error) {
      console.error("Delete News Error:", error);
      return { error: "Gagal menghapus berita: " + error.message };
    }

    revalidatePath("/");
    revalidatePath("/category");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Delete News Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}
