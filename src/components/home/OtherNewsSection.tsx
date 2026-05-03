"use client";

import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import type { NewsArticle } from "@/data/mockNews";
import NewsCard from "@/components/news/NewsCard";

interface OtherNewsSectionProps {
  articles: NewsArticle[];
}

export default function OtherNewsSection({ articles }: OtherNewsSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 border-t border-border/40" id="other-news">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-accent/10 rounded-2xl">
          <LayoutGrid size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground">Berita Lainnya</h2>
          <p className="text-sm text-secondary font-medium">Jelajahi lebih banyak konten menarik</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {articles.map((article, i) => (
          <NewsCard 
            key={article.id} 
            article={article} 
            index={i} 
            variant="default"
          />
        ))}
      </div>
      
      {/* Visual Decorative Element at Bottom */}
      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface border border-border/40 text-[11px] font-black uppercase tracking-widest text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Anda telah mencapai akhir halaman
        </div>
      </div>
    </section>
  );
}
