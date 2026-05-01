"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Eye, Clock } from "lucide-react";
import type { NewsArticle } from "@/data/mockNews";
import { formatViews } from "@/data/mockNews"; // Keep formatViews if needed, or inline it
import { formatDate } from "@/lib/utils";

interface PopularNewsSectionProps {
  popularArticles: NewsArticle[];
}

export default function PopularNewsSection({ popularArticles }: PopularNewsSectionProps) {
  if (!popularArticles || popularArticles.length === 0) return null;
  const [topArticle, ...restArticles] = popularArticles;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="popular-news">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
            <Flame size={18} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Berita Populer</h2>
            <p className="text-sm text-secondary">Paling banyak dibaca minggu ini</p>
          </div>
        </div>
      </div>

      {/* Two-column Layout: Featured + Ranked List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Top Popular Article (large card) */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/article/${topArticle.slug}`} className="block group h-full" id={`popular-top-${topArticle.slug}`}>
            <div className="relative overflow-hidden rounded-2xl h-full min-h-[320px] sm:min-h-[380px]">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-surface-alt flex items-center justify-center">
                {topArticle.thumbnail_url ? (
                  <img src={topArticle.thumbnail_url} alt={topArticle.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-muted font-black text-lg uppercase tracking-widest opacity-20">Popular #1 — No Image</div>
                )}
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Rank bubble */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">1</span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="inline-block bg-orange-500/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {topArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight max-w-xl group-hover:text-orange-200 transition-colors duration-300">
                  {topArticle.title}
                </h3>
                <p className="hidden sm:block mt-2 text-sm text-gray-200 max-w-lg leading-relaxed line-clamp-2">
                  {topArticle.excerpt}
                </p>
                <div className="flex items-center gap-4 mt-4 text-gray-300 text-xs sm:text-sm">
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} />
                    {formatViews(topArticle.views)} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {formatDate(topArticle.date)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Right: Ranked List (2–5) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {restArticles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: (i + 1) * 0.08 }}
            >
              <Link href={`/article/${article.slug}`} className="block group" id={`popular-${article.slug}`}>
                <div className="flex gap-4 bg-card rounded-2xl p-3.5 border border-border hover:shadow-md hover:border-orange-500/20 transition-all duration-300">
                  {/* Rank Number */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 rounded-xl flex items-center justify-center self-center">
                    <span className="text-orange-500 font-bold text-lg">{i + 2}</span>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-surface-alt flex items-center justify-center border border-border/40">
                    {article.thumbnail_url ? (
                      <img src={article.thumbnail_url} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="text-[8px] font-bold text-muted uppercase tracking-tighter">No Image</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <h3 className="text-sm font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-orange-500 transition-colors duration-200 leading-snug">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-muted">
                      <span className="flex items-center gap-1 text-xs">
                        <Eye size={11} />
                        {formatViews(article.views)}
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <Clock size={11} />
                        {formatDate(article.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
