"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAnalyticsData() {
  const supabase = await createClient();

  // 1. Fetch all news for aggregations
  const { data: news, error: newsError } = await supabase
    .from("news")
    .select("id, title, views, search_count, category, created_at, read_time")
    .order("views", { ascending: false });

  if (newsError) {
    console.error("Error fetching news for analytics:", newsError);
    return { error: newsError.message };
  }

  // 2. Calculate Stats
  const totalViews = news.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalSearches = news.reduce((acc, curr) => acc + (curr.search_count || 0), 0);

  // 3. New Articles (Last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newArticlesCount = news.filter(n => new Date(n.created_at) >= thirtyDaysAgo).length;

  // 4. Category Breakdown
  const categoryCounts: Record<string, number> = {};
  news.forEach(n => {
    categoryCounts[n.category] = (categoryCounts[n.category] || 0) + 1;
  });
  
  const totalNews = news.length;
  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    percent: totalNews > 0 ? `${Math.round((count / totalNews) * 100)}%` : "0%"
  })).sort((a, b) => b.count - a.count);

  // 5. Interaction Stats (Likes & Comments)
  const [{ count: totalLikes }, { count: totalComments }, { data: allComments }] = await Promise.all([
    supabase.from("likes").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("created_at").order("created_at", { ascending: true })
  ]);

  // 6. Aggregate Comments by Date
  const commentTrend: Record<string, number> = {};
  allComments?.forEach(c => {
    const date = new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    commentTrend[date] = (commentTrend[date] || 0) + 1;
  });

  // 7. Top Articles (Full data for table)
  const topArticles = news.slice(0, 5).map(n => ({
    id: n.id,
    title: n.title,
    views: n.views >= 1000 ? `${(n.views / 1000).toFixed(1)}k` : n.views.toString(),
    searchCount: n.search_count || 0,
    readTime: n.read_time || "5m",
    growth: "+10%" // Placeholder growth
  }));

  // 8. Mock Chart Data based on news creation dates (for the visual trend)
  // We'll merge real comment counts into this chart data
  const chartData = news.slice(0, 10).map((n, i) => {
    const date = new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return {
      date,
      views: n.views,
      searches: n.search_count || 0,
      comments: commentTrend[date] || Math.floor(Math.random() * 5) // Use real data if exists, otherwise mock small numbers
    };
  }).reverse();

  return {
    data: {
      totalViews: totalViews.toLocaleString('id-ID'),
      totalSearches: totalSearches.toLocaleString('id-ID'),
      newArticlesCount,
      totalLikes,
      totalComments,
      categories,
      topArticles,
      chartData,
      totalNews
    }
  };
}

/**
 * Mengambil data artikel dengan pencarian, sorting, dan paginasi dari sisi server.
 */
export async function getPaginatedArticles({
  search = "",
  sortBy = "views",
  sortOrder = "desc",
  page = 1,
  pageSize = 5
}: {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) {
  const supabase = await createClient();
  
  let query = supabase
    .from("news")
    .select("id, title, views, search_count, read_time, created_at", { count: "exact" });

  // Server-side Search
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  // Server-side Sorting
  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching paginated articles:", error);
    return { data: [], total: 0 };
  }

  return {
    data: data.map(n => ({
      id: n.id,
      title: n.title,
      views: n.views >= 1000 ? `${(n.views / 1000).toFixed(1)}k` : n.views.toString(),
      searchCount: n.search_count || 0,
      readTime: n.read_time || "5m",
      growth: "+10%"
    })),
    total: count || 0
  };
}
