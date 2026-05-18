"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";
import { requireAdmin } from "@/lib/auth-utils";
import sharp from "sharp";
import { sendPushNotification } from "@/app/actions/push-actions";

/**
 * Mengambil semua berita dari database Supabase.
 */
export async function fetchNews(options?: { includeDrafts?: boolean; onlyDrafts?: boolean }) {
  // Hanya bypass cache (noStore) untuk views admin/draft agar data selalu fresh
  if (options?.includeDrafts || options?.onlyDrafts) {
    noStore();
  }
  try {
    const supabase = await createClient();

    let query = supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (options?.onlyDrafts) {
      query = query.eq("status", "draft");
    } else if (!options?.includeDrafts) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query;

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
    const status = formData.get("status") as string || "published";
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
      const fileBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const compressedBuffer = await sharp(fileBuffer)
        .resize(1200, 800, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `${slug}-${Math.random().toString(36).substring(2)}.webp`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("news-thumbnails")
        .upload(filePath, compressedBuffer, {
          contentType: 'image/webp',
          upsert: true
        });

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
        status: status,
        date: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
      });

    if (dbError) {
      console.error("Database Error:", dbError);
      return { error: "Gagal menyimpan berita: " + dbError.message };
    }

    revalidatePath("/");
    revalidatePath("/category");
    revalidatePath("/admin");

    // Send push notification asynchronously only if published
    if (status === "published") {
      sendPushNotification({
        title: "Berita Terbaru: " + title,
        body: excerpt || "Baca selengkapnya di Timverse News.",
        url: `/article/${slug}`,
        image: thumbnailUrl || undefined
      }).catch(err => console.error("Push Notification Error:", err));
    }

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

/**
 * Menerbitkan berita yang sebelumnya berstatus draft.
 */
export async function publishNews(newsId: string) {
  try {
    const admin = await requireAdmin();
    const supabase = await createClient();

    // 1. Ambil data berita untuk push notification
    const { data: newsData, error: fetchError } = await supabase
      .from("news")
      .select("title, excerpt, slug, thumbnail_url")
      .eq("id", newsId)
      .single();

    if (fetchError || !newsData) {
      console.error("Fetch News for Publish Error:", fetchError);
      return { error: "Berita tidak ditemukan." };
    }

    // 2. Update status ke published
    const { error: updateError } = await supabase
      .from("news")
      .update({ status: "published" })
      .eq("id", newsId);

    if (updateError) {
      console.error("Publish News Error:", updateError);
      return { error: "Gagal menerbitkan berita: " + updateError.message };
    }

    revalidatePath("/");
    revalidatePath("/category");
    revalidatePath("/admin");

    // Kirim push notification
    sendPushNotification({
      title: "Berita Terbaru: " + newsData.title,
      body: newsData.excerpt || "Baca selengkapnya di Timverse News.",
      url: `/article/${newsData.slug}`,
      image: newsData.thumbnail_url || undefined
    }).catch(err => console.error("Push Notification Error:", err));

    return { success: true };
  } catch (error: any) {
    console.error("Publish News Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * Memperbarui berita yang sudah ada di database.
 */
export async function updateNews(newsId: string, formData: FormData) {
  try {
    const admin = await requireAdmin();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const tagsString = formData.get("tags") as string;
    const status = formData.get("status") as string || "draft";
    const thumbnail = formData.get("thumbnail") as File;

    if (!title || !category || !content) {
      return { error: "Judul, kategori, dan konten wajib diisi." };
    }

    const tags = tagsString ? JSON.parse(tagsString) : [];
    const supabase = await createClient();

    // Dapatkan data lama untuk thumbnail fallback
    const { data: oldNews, error: fetchError } = await supabase
      .from("news")
      .select("thumbnail_url, slug")
      .eq("id", newsId)
      .single();

    if (fetchError || !oldNews) {
      return { error: "Data berita tidak ditemukan." };
    }

    let thumbnailUrl = oldNews.thumbnail_url;

    // 1. Upload thumbnail baru jika ada
    if (thumbnail && thumbnail.size > 0) {
      const fileBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const compressedBuffer = await sharp(fileBuffer)
        .resize(1200, 800, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

      const fileName = `${oldNews.slug}-${Math.random().toString(36).substring(2)}.webp`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("news-thumbnails")
        .upload(filePath, compressedBuffer, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) {
        console.error("Storage Error:", uploadError);
        return { error: "Gagal mengunggah gambar: " + uploadError.message };
      }

      // Dapatkan URL publik
      const { data: publicUrlData } = supabase.storage
        .from("news-thumbnails")
        .getPublicUrl(filePath);
      
      thumbnailUrl = publicUrlData.publicUrl;

      // Hapus thumbnail lama jika ada dan berbeda
      if (oldNews.thumbnail_url) {
        try {
          const url = new URL(oldNews.thumbnail_url);
          const pathParts = url.pathname.split("/storage/v1/object/public/news-thumbnails/");
          if (pathParts[1]) {
            await supabase.storage.from("news-thumbnails").remove([pathParts[1]]);
          }
        } catch (storageErr) {
          console.warn("Gagal menghapus thumbnail lama:", storageErr);
        }
      }
    }

    // Hitung estimasi waktu baca
    const wordsPerMinute = 200;
    const noHtmlContent = content.replace(/<[^>]*>/g, '');
    const wordCount = noHtmlContent.split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

    // 2. Simpan perubahan ke database
    const { error: dbError } = await supabase
      .from("news")
      .update({
        title,
        excerpt,
        content,
        category,
        thumbnail_url: thumbnailUrl,
        tags: tags,
        read_time: `${readTimeMinutes} menit`,
        status: status,
        // Kita biarkan tanggal, slug, author tetap sama dengan aslinya
      })
      .eq("id", newsId);

    if (dbError) {
      console.error("Database Update Error:", dbError);
      return { error: "Gagal menyimpan perubahan berita: " + dbError.message };
    }

    revalidatePath("/");
    revalidatePath("/category");
    revalidatePath("/admin");
    revalidatePath("/admin/news/drafts");
    revalidatePath(`/article/${oldNews.slug}`);

    return { success: true, slug: oldNews.slug };
  } catch (error: any) {
    console.error("Update News Exception:", error);
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * Mengambil statistik jumlah data untuk sidebar admin.
 */
export async function getAdminStats() {
  try {
    const supabase = await createClient();

    const [newsRes, reportsRes, commentsRes, draftsRes] = await Promise.all([
      supabase.from("news").select("*", { count: "exact", head: true }),
      supabase.from("reports").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }),
      supabase.from("news").select("*", { count: "exact", head: true }).eq("status", "draft")
    ]);

    return {
      newsCount: newsRes.count || 0,
      reportsCount: reportsRes.count || 0,
      commentsCount: commentsRes.count || 0,
      draftsCount: draftsRes.count || 0,
    };
  } catch (error) {
    console.error("Get Admin Stats Error:", error);
    return { newsCount: 0, reportsCount: 0, commentsCount: 0, draftsCount: 0 };
  }
}
