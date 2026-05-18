import BreakingNewsTicker from "@/components/layout/BreakingNewsTicker";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import PopularNewsSection from "@/components/home/PopularNewsSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import OtherNewsSection from "@/components/home/OtherNewsSection";
import TrendingSearchSection from "@/components/home/TrendingSearchSection";
import { fetchNews } from "@/app/admin/news/actions";
import type { NewsArticle } from "@/data/mockNews";

// Mengaktifkan caching halaman utama (static page) dengan fallback revalidasi 1 jam.
// Saat admin menambah/mengubah berita, revalidatePath("/") di server actions akan membersihkan cache ini secara instan (on-demand).
export const revalidate = 3600; 

export default async function HomePage() {
  const result = await fetchNews();
  const dbNews = result.data || [];

  if (dbNews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 bg-surface border border-border rounded-[2rem] flex items-center justify-center mb-6">
          <LatestNewsSection latestArticles={[]} />
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Belum ada berita tersedia</h2>
        <p className="text-secondary text-lg">Silakan login sebagai admin dan tambahkan berita pertama Anda.</p>
      </div>
    );
  }

  // Map to NewsArticle
  const mappedNews: NewsArticle[] = dbNews.map((n: any) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    excerpt: n.excerpt || "",
    content: n.content || "",
    category: n.category,
    author: n.author || "Admin",
    authorAvatar: n.author_avatar || "AD",
    date: n.date || n.created_at,
    readTime: n.read_time || "5 menit",
    imageGradient: n.image_gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    thumbnail_url: n.thumbnail_url,
    featured: n.featured || false,
    views: n.views || 0,
    search_count: n.search_count || 0,
    created_at: n.created_at,
  }));

  // Logic distribution
  const sortedNews = [...mappedNews].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());

  const featured = sortedNews.find((n) => n.featured) || sortedNews[0];
  const headlines = sortedNews.slice(0, 5).map((n) => `🔥 ${n.title}`);

  // 1. Berita Populer: All-time views terbanyak
  const popularArticles = [...mappedNews].sort((a, b) => b.views - a.views).slice(0, 5);
  
  // 2. Berita Paling Dicari (Trending): Berita dengan search_count terbanyak
  const trendingArticles = [...mappedNews]
    .sort((a, b) => (b.search_count || 0) - (a.search_count || 0))
    .slice(0, 6);

  // Jika trendingArticles kosong, tampilkan saja berita terpopuler
  const displayTrending = trendingArticles.length > 0 ? trendingArticles : popularArticles;

  // 3. Latest News (Top 3 terbaru)
  const latestArticles = sortedNews.slice(0, 3);

  // 4. Other News (Sisa berita)
  const otherNews = sortedNews.length > 3 ? sortedNews.slice(3) : sortedNews;

  return (
    <>
      <BreakingNewsTicker headlines={headlines} />
      <HeroSection featured={featured} />
      <CategorySection />
      {popularArticles.length > 0 && <PopularNewsSection popularArticles={popularArticles} />}
      {displayTrending.length > 0 && <TrendingSearchSection articles={displayTrending} />}
      {latestArticles.length > 0 && <LatestNewsSection latestArticles={latestArticles} />}
      {otherNews.length > 0 && <OtherNewsSection articles={otherNews} />}
    </>
  );
}