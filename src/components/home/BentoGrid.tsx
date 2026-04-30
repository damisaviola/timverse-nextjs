"use client";

import type { NewsArticle } from "@/data/mockNews";
import NewsCard from "@/components/news/NewsCard";
import { TrendingUp } from "lucide-react";

interface BentoGridProps {
  articles: NewsArticle[];
}

export default function BentoGrid({ articles: rawArticles }: BentoGridProps) {
  // Skip the first article (used in Hero)
  const articles = rawArticles.length > 1 ? rawArticles.slice(1) : rawArticles;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="bento-grid">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/10 rounded-xl">
          <TrendingUp size={18} className="text-accent" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Berita Terkini</h2>
          <p className="text-sm text-secondary">Pilihan editor hari ini</p>
        </div>
      </div>

      {/* Symmetric Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* First row — default cards */}
        {articles.slice(0, 3).map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}

        {/* Second row — default cards */}
        {articles.slice(3, 6).map((article, i) => (
          <NewsCard key={article.id} article={article} index={i + 3} />
        ))}
      </div>

      {/* Berita Lainnya */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <h3 className="text-lg font-bold text-foreground">Berita Lainnya</h3>
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.slice(6).map((article, i) => (
            <NewsCard key={article.id} article={article} index={i + 6} variant="horizontal" />
          ))}
        </div>
      </div>
    </section>
  );
}
