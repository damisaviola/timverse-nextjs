"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getArticlesByCategory } from "@/data/mockNews";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryPills from "@/components/category/CategoryPills";
import NewsCard from "@/components/news/NewsCard";

export default function CategoryPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const articles = getArticlesByCategory(activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="category-page">
      <CategoryHeader activeCategory={activeCategory} totalArticles={articles.length} />
      <CategoryPills activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Articles Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
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
          <p className="text-secondary text-lg">Tidak ada berita dalam kategori ini.</p>
        </div>
      )}
    </div>
  );
}
