"use server";

import { createClient } from "@/lib/supabase/server";
import { categories as staticCategories } from "@/data/mockNews";

export async function fetchCategoryStats() {
  const supabase = await createClient();
  
  // Get all news to aggregate stats
  const { data: newsData, error } = await supabase
    .from("news")
    .select("category, views, created_at");

  if (error) {
    return { error: error.message };
  }

  const statsMap: Record<string, { count: number; views: number; last_updated: string | null }> = {};
  
  // Initialize with static categories to ensure all are shown
  staticCategories.filter(c => c.name !== "Semua").forEach(cat => {
    statsMap[cat.name] = { count: 0, views: 0, last_updated: null };
  });

  newsData.forEach((item) => {
    const cat = item.category || "Lainnya";
    if (!statsMap[cat]) {
      statsMap[cat] = { count: 0, views: 0, last_updated: item.created_at };
    }
    statsMap[cat].count += 1;
    statsMap[cat].views += (item.views || 0);
    
    // Update last updated
    if (!statsMap[cat].last_updated || new Date(item.created_at) > new Date(statsMap[cat].last_updated!)) {
      statsMap[cat].last_updated = item.created_at;
    }
  });

  const stats = Object.entries(statsMap).map(([name, stat]) => {
    const staticInfo = staticCategories.find(c => c.name === name);
    return {
      name,
      ...stat,
      color: staticInfo?.color || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
    };
  }).sort((a, b) => b.count - a.count);

  return { data: stats };
}
