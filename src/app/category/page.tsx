"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getArticlesByCategory, searchArticles } from "@/data/mockNews";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryPills from "@/components/category/CategoryPills";
import NewsCard from "@/components/news/NewsCard";
import { useSearchParams } from "next/navigation";

function CategoryContent() {
  const searchParams = useSearchParams();
  const tagParam = searchParams.get("tag");
  
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  // Jika ada tagParam, gunakan searchArticles. Jika tidak, gunakan getArticlesByCategory.
  // Tapi kita set activeCategory ke tag jika tag cocok dengan kategori, 
  // atau "Semua" jika kita hanya mencari keyword.
  
  useEffect(() => {
    if (tagParam) {
      const isKnownCategory = ["Teknologi", "Bisnis", "Hiburan", "Olahraga", "Politik", "Gaya Hidup"].includes(tagParam);
      if (isKnownCategory) {
        setActiveCategory(tagParam);
      } else {
        setActiveCategory("Semua"); // Tetap di pill "Semua" karena tag bukan kategori utama
      }
    }
  }, [tagParam]);

  const isTagSearch = tagParam && !["Teknologi", "Bisnis", "Hiburan", "Olahraga", "Politik", "Gaya Hidup"].includes(tagParam);
  const articles = isTagSearch 
    ? searchArticles(tagParam) 
    : getArticlesByCategory(activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="category-page">
      <CategoryHeader activeCategory={isTagSearch ? `Tag: #${tagParam}` : activeCategory} totalArticles={articles.length} />
      
      {!isTagSearch && (
        <CategoryPills activeCategory={activeCategory} onCategoryChange={(cat) => {
          // Kalau user klik kategori lain, hapus query string dan ubah state
          window.history.replaceState(null, '', '/category');
          setActiveCategory(cat);
        }} />
      )}

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
          {articles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-secondary text-lg">Tidak ada berita yang ditemukan.</p>
        </div>
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
