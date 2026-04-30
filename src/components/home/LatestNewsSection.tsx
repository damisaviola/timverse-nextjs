"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";
import NewsCard from "@/components/news/NewsCard";

interface LatestNewsSectionProps {
  latestArticles: NewsArticle[];
}

export default function LatestNewsSection({ latestArticles }: LatestNewsSectionProps) {
  if (!latestArticles || latestArticles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="latest-news">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Clock size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Berita Terbaru</h2>
            <p className="text-sm text-secondary">Update terkini hari ini</p>
          </div>
        </div>
        <Link
          href="/category"
          className="group flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
        >
          Lihat Semua
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {latestArticles.map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </section>
  );
}
