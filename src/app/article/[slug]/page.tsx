"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark } from "lucide-react";
import { getArticleBySlug, getRelatedArticles } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";
import CommentSection from "@/components/news/CommentSection";
import RelatedNews from "@/components/news/RelatedNews";
import { use } from "react";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = use(params);
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, article.category);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-8" id="article-page">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors mb-6"
          id="back-to-home"
        >
          <ArrowLeft size={16} />
          Kembali ke Beranda
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Category */}
        <span className="inline-block bg-badge-bg text-badge-text text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="mt-4 text-lg text-secondary leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
              {article.authorAvatar}
            </div>
            <span className="text-sm font-medium text-foreground">{article.author}</span>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-secondary">
            <Calendar size={14} />
            {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-secondary">
            <Clock size={14} />
            {article.readTime} baca
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Share"
            >
              <Share2 size={16} className="text-secondary" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-surface transition-colors"
              aria-label="Bookmark"
            >
              <Bookmark size={16} className="text-secondary" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8"
      >
        <div
          className="aspect-[16/9] w-full rounded-2xl overflow-hidden"
          style={{ background: article.imageGradient }}
        />
      </motion.div>

      {/* Article Body */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 prose-custom"
      >
        <div
          className="text-base sm:text-lg text-secondary leading-relaxed sm:leading-loose space-y-5
            [&_p]:mb-0
            [&_strong]:text-foreground [&_strong]:font-semibold
          "
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-wrap gap-2 mt-8"
      >
        {["Berita", article.category, "Indonesia", "2026"].map((tag) => (
          <span
            key={tag}
            className="text-xs bg-surface text-secondary px-3 py-1.5 rounded-full border border-border hover:border-accent/30 hover:text-accent transition-colors cursor-pointer"
          >
            #{tag}
          </span>
        ))}
      </motion.div>

      {/* Related News */}
      <RelatedNews articles={relatedArticles} />

      {/* Comments */}
      <CommentSection />
    </article>
  );
}
