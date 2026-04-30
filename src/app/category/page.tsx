"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryPills from "@/components/category/CategoryPills";
import NewsCard from "@/components/news/NewsCard";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { NewsArticle } from "@/data/mockNews";

function CategoryContent() {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");
  
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Fetch semua berita dari Supabase
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        const mapped: NewsArticle[] = data.map((n: any) => ({
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
          tags: n.tags || [],
        }));
        setAllNews(mapped);
      }
      setIsLoading(false);
    };

    fetchNews();
  }, [supabase]);

  // Set active category dari tag param
  useEffect(() => {
    if (tagParam) {
      const categories = [...new Set(allNews.map(n => n.category))];
      if (categories.includes(tagParam)) {
        setActiveCategory(tagParam);
      } else {
        setActiveCategory("Semua");
      }
    }
  }, [tagParam, allNews]);

  // Cek apakah tagParam adalah tag (bukan kategori)
  const isTagSearch = useMemo(() => {
    if (!tagParam) return false;
    const categories = [...new Set(allNews.map(n => n.category))];
    return !categories.includes(tagParam);
  }, [tagParam, allNews]);

  // Filter berita
  const filteredArticles = useMemo(() => {
    if (isTagSearch && tagParam) {
      // Cari berita yang memiliki tag ini
      return allNews.filter((article: any) => {
        const tags: string[] = article.tags || [];
        return tags.some((t: string) => t.toLowerCase() === tagParam.toLowerCase());
      });
    }
    
    if (activeCategory === "Semua") {
      return allNews;
    }
    
    return allNews.filter(a => a.category === activeCategory);
  }, [allNews, activeCategory, isTagSearch, tagParam]);

  // Ambil semua kategori unik dari data
  const dynamicCategories = useMemo(() => {
    const cats = [...new Set(allNews.map(n => n.category))];
    return cats;
  }, [allNews]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="category-page">
      <CategoryHeader activeCategory={isTagSearch ? `Tag: #${tagParam}` : activeCategory} totalArticles={filteredArticles.length} />
      
      {!isTagSearch && (
        <CategoryPills activeCategory={activeCategory} onCategoryChange={(cat) => {
          window.history.replaceState(null, '', '/category');
          setActiveCategory(cat);
        }} />
      )}

      {/* Tag info banner */}
      {isTagSearch && tagParam && (
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-bold border border-accent/20">
            #{tagParam}
          </span>
          <button 
            onClick={() => {
              window.history.replaceState(null, '', '/category');
              window.location.reload();
            }}
            className="text-xs font-bold text-muted hover:text-foreground transition-colors"
          >
            ✕ Hapus filter
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
              <div className="aspect-[16/9] bg-surface-alt" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 bg-surface-alt rounded" />
                <div className="h-3 w-full bg-surface-alt/50 rounded" />
                <div className="h-3 w-1/2 bg-surface-alt/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Articles Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isTagSearch ? `tag-${tagParam}` : activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredArticles.map((article, i) => (
                <NewsCard key={article.id} article={article} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-border mt-4">
              <p className="text-secondary font-bold text-lg">Tidak ada berita ditemukan</p>
              <p className="text-muted text-sm mt-2">
                {isTagSearch
                  ? `Belum ada berita dengan tag "${tagParam}".`
                  : `Belum ada berita di kategori "${activeCategory}".`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
