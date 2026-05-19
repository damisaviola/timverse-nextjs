"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/data/mockNews";
import NewsCard from "@/components/news/NewsCard";

interface NasionalSectionProps {
  articles: NewsArticle[];
}

export default function NasionalSection({ articles }: NasionalSectionProps) {
  if (!articles || articles.length === 0) return null;

  // Show up to 3 articles in this section
  const displayArticles = articles.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 border-t border-border/20" id="nasional-news">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <Globe size={18} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Kabar Nasional</h2>
            <p className="text-sm text-secondary">Berita penting dari penjuru Nusantara</p>
          </div>
        </div>
        <Link
          href="/category/Nasional"
          className="group flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Lihat Semua
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {displayArticles.map((article, i) => (
          <div key={article.id} className="min-w-[85vw] max-w-[85vw] sm:min-w-0 sm:max-w-none snap-center sm:snap-align-none">
            <NewsCard article={article} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
