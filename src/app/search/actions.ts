"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Fungsi untuk mencari berita (digunakan oleh live search di Navbar)
 */
export async function searchNews(query: string) {
  if (!query || query.length < 2) return [];

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("news")
      .select("id, title, slug, category, thumbnail_url")
      .or(`title.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(5);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Search News Error:", error);
    return [];
  }
}

/**
 * Mencatat bahwa artikel-artikel ini muncul dalam hasil pencarian.
 */
export async function incrementSearchCount(articleIds: string[]) {
  if (!articleIds || articleIds.length === 0) return;

  const supabase = await createClient();

  try {
    // Memanggil fungsi SQL RPC yang sudah kita buat sebelumnya
    await supabase.rpc('increment_search_count', {
      row_ids: articleIds
    });
  } catch (err) {
    console.error("Failed to increment search count:", err);
  }
}
