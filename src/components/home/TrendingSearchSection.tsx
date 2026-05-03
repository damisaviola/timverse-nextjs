"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { NewsArticle } from "@/data/mockNews";

interface TrendingSearchSectionProps {
  articles: NewsArticle[];
}

export default function TrendingSearchSection({ articles }: TrendingSearchSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20" id="trending-searches">
      {/* Section Header - Minimalist Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div className="flex items-start gap-4">
          <div className="mt-1 p-2 bg-accent rounded-xl shadow-lg shadow-accent/20">
            <Search size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">Paling Dicari</h2>
            <p className="text-sm text-secondary font-medium mt-1 uppercase tracking-widest opacity-70">Trending Minggu Ini</p>
          </div>
        </div>
        <div className="h-px flex-1 bg-border/40 hidden md:block mx-8 mb-4" />
        <Link 
          href="/search" 
          className="text-[11px] font-black uppercase tracking-widest text-accent hover:opacity-70 transition-opacity flex items-center gap-2 mb-1"
        >
          Lihat Trend <ChevronRight size={14} />
        </Link>
      </div>

      {/* Minimalist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
        {articles.slice(0, 6).map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              href={`/article/${article.slug}`}
              className="flex items-start gap-6 group relative"
            >
              {/* Refined Numbering */}
              <div className="relative flex-shrink-0 pt-1">
                <span className="text-2xl font-black text-accent/10 group-hover:text-accent/30 transition-colors duration-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-accent/5 group-hover:bg-accent/20 transition-colors" />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Minimalist Metadata */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] font-black text-accent uppercase tracking-[0.2em] px-2 py-0.5 bg-accent/5 rounded-md">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted/60">
                    <TrendingUp size={12} className="text-accent/40" />
                    {article.search_count?.toLocaleString() || "0"} dicari
                  </div>
                </div>

                {/* Title - Clean & Sharp */}
                <h3 className="text-base font-bold text-foreground leading-[1.4] group-hover:text-accent transition-colors duration-300 line-clamp-2">
                  {article.title}
                </h3>

                {/* Subtle Hover Indicator */}
                <div className="mt-3 w-0 group-hover:w-8 h-0.5 bg-accent transition-all duration-500 rounded-full" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
