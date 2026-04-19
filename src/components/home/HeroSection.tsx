"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { newsArticles } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";

export default function HeroSection() {
  const featured = newsArticles[0]; // First article is featured

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4" id="hero-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link href={`/article/${featured.slug}`} className="block group">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Image Placeholder */}
            <div
              className="aspect-[21/9] sm:aspect-[21/8] w-full"
              style={{ background: featured.imageGradient }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
              {/* Category Badge */}
              <span className="inline-block bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4">
                {featured.category}
              </span>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight max-w-3xl group-hover:text-accent-dark transition-colors duration-300">
                {featured.title}
              </h2>

              {/* Excerpt */}
              <p className="hidden sm:block mt-3 text-sm sm:text-base text-gray-200 max-w-2xl leading-relaxed">
                {featured.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-4 mt-4 text-gray-300">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <User size={14} />
                  {featured.author}
                </span>
                <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Clock size={14} />
                  {formatDate(featured.date)}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
