"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import type { NewsArticle } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";

interface RelatedNewsProps {
  articles: NewsArticle[];
}

export default function RelatedNews({ articles }: RelatedNewsProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border" id="related-news">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Berita Terkait</h3>
        <Link
          href="/category"
          className="flex items-center gap-1 text-sm text-accent hover:text-accent-dark transition-colors"
        >
          Lihat semua
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {articles.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="min-w-[80vw] max-w-[80vw] sm:min-w-0 sm:max-w-none snap-center sm:snap-align-none"
          >
            <Link
              href={`/article/${article.slug}`}
              className="block group"
              id={`related-${article.slug}`}
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-md hover:border-accent/20 transition-all duration-300">
                <div
                  className="aspect-[16/10] w-full group-hover:scale-105 transition-transform duration-500 overflow-hidden"
                  style={{ background: article.imageGradient }}
                />
                <div className="p-4">
                  <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h4 className="text-sm font-semibold text-foreground mt-1.5 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                    {article.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-2 text-muted">
                    <Clock size={12} />
                    <span className="text-xs">{formatDate(article.date)}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
