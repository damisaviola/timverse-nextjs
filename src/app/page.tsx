import BreakingNewsTicker from "@/components/layout/BreakingNewsTicker";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import PopularNewsSection from "@/components/home/PopularNewsSection";
import LatestNewsSection from "@/components/home/LatestNewsSection";
import BentoGrid from "@/components/home/BentoGrid";
import { fetchNews } from "@/app/admin/news/actions";
import type { NewsArticle } from "@/data/mockNews";

export const revalidate = 0; // Ensure fresh data

export default async function HomePage() {
  const result = await fetchNews();
  const dbNews = result.data || [];

  if (dbNews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
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
    created_at: n.created_at,
  }));

  const featured = mappedNews.find((n) => n.featured) || mappedNews[0];
  const popularArticles = [...mappedNews].sort((a, b) => b.views - a.views).slice(0, 5);
  const latestArticles = [...mappedNews].sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()).slice(0, 6);
  const headlines = latestArticles.map((n) => `🔥 ${n.title}`);
  
  // Exclude featured from bento grid
  const bentoArticles = mappedNews.filter(n => n.id !== featured.id);

  return (
    <>
      <BreakingNewsTicker headlines={headlines} />
      <HeroSection featured={featured} />
      <CategorySection />
      {popularArticles.length > 0 && <PopularNewsSection popularArticles={popularArticles} />}
      {latestArticles.length > 0 && <LatestNewsSection latestArticles={latestArticles} />}
      {bentoArticles.length > 0 && <BentoGrid articles={bentoArticles} />}
    </>
  );
}