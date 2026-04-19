"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { NewsArticle } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
  variant?: "default" | "compact" | "horizontal";
}

export default function NewsCard({ article, index, variant = "default" }: NewsCardProps) {
  if (variant === "horizontal") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link href={`/article/${article.slug}`} className="block group" id={`news-card-${article.slug}`}>
          <div className="flex gap-4 bg-card rounded-2xl p-3 border border-border hover:shadow-md hover:border-accent/20 transition-all duration-300">
            {/* Small Thumbnail */}
            <div
              className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden"
              style={{ background: article.imageGradient }}
            />

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                {article.category}
              </span>
              <h3 className="text-sm font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-muted">
                <Clock size={12} />
                <span className="text-xs">{formatDate(article.date)}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link href={`/article/${article.slug}`} className="block group" id={`news-card-${article.slug}`}>
          <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-md hover:border-accent/20 transition-all duration-300">
            {/* Thumbnail */}
            <div
              className="aspect-[16/10] w-full"
              style={{ background: article.imageGradient }}
            />

            {/* Content */}
            <div className="p-4">
              <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                {article.category}
              </span>
              <h3 className="text-sm font-semibold text-foreground mt-1.5 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-2 text-muted">
                <Clock size={12} />
                <span className="text-xs">{formatDate(article.date)}</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link href={`/article/${article.slug}`} className="block group" id={`news-card-${article.slug}`}>
        <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5 transition-all duration-300">
          {/* Image */}
          <div className="relative overflow-hidden">
            <div
              className="aspect-[16/9] w-full group-hover:scale-105 transition-transform duration-500"
              style={{ background: article.imageGradient }}
            />
            <div className="absolute top-3 left-3">
              <span className="inline-block bg-white/90 dark:bg-black/60 backdrop-blur-sm text-foreground text-[10px] font-semibold px-2.5 py-1 rounded-full">
                {article.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-200 leading-snug">
              {article.title}
            </h3>
            <p className="mt-2 text-sm text-secondary line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-light">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                  {article.authorAvatar}
                </div>
                <span className="text-xs text-secondary">{article.author}</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted">
                <Clock size={12} />
                <span className="text-xs">{formatDate(article.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
