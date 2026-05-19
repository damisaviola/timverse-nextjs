"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Eye, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { NewsArticle } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";
import { formatViews } from "@/data/mockNews";

interface FeaturedCarouselProps {
  articles: NewsArticle[];
}

export default function FeaturedCarousel({ articles }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay (4 seconds interval, resets on index change)
  useEffect(() => {
    if (articles.length <= 1) return;
    timerRef.current = setInterval(handleNext, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, articles.length, handleNext]);

  // Simultaneous slide animation for premium carousel feel
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      },
    }),
  };

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -50) handleNext();
    else if (info.offset.x > 50) handlePrev();
  };

  if (!articles || articles.length === 0) return null;

  const current = articles[currentIndex];

  return (
    <section
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
      id="featured-carousel-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Sparkles size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Pilihan Redaksi</h2>
            <p className="text-sm text-secondary">Berita pilihan yang patut dibaca</p>
          </div>
        </div>

        {/* Desktop Nav Arrows */}
        {articles.length > 1 && (
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-xs text-secondary mr-2 tabular-nums font-medium">
              {currentIndex + 1} / {articles.length}
            </span>
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-alt hover:border-accent/30 transition-all active:scale-95 cursor-pointer"
              aria-label="Sebelumnya"
            >
              <ChevronLeft size={16} className="text-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-alt hover:border-accent/30 transition-all active:scale-95 cursor-pointer"
              aria-label="Selanjutnya"
            >
              <ChevronRight size={16} className="text-foreground" />
            </button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[16/10] sm:aspect-[21/9] bg-surface-alt border border-border/40 shadow-lg">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
          >
            {/* Background */}
            {current.thumbnail_url ? (
              <img
                src={current.thumbnail_url}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            ) : (
              <div
                style={{ background: current.imageGradient }}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 lg:p-12 z-10 pointer-events-none">
              <div className="max-w-2xl space-y-2.5 sm:space-y-3">
                {/* Category Badge */}
                <span className="inline-block bg-accent text-white text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {current.category}
                </span>

                {/* Title */}
                <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-[1.2] line-clamp-2 sm:line-clamp-3">
                  {current.title}
                </h3>

                {/* Excerpt - hidden on mobile for cleanliness */}
                <p className="hidden sm:block text-sm md:text-base text-gray-200/90 leading-relaxed line-clamp-2 max-w-xl">
                  {current.excerpt}
                </p>

                {/* Meta + CTA Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1 sm:pt-2">
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
                    <span className="flex items-center gap-1.5">
                      <Eye size={13} className="opacity-70" />
                      {formatViews(current.views)} views
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="opacity-70" />
                      {formatDate(current.date || current.created_at || "")}
                    </span>
                  </div>

                  <Link
                    href={`/article/${current.slug}`}
                    className="pointer-events-auto inline-flex items-center gap-2 bg-white/95 hover:bg-white text-gray-900 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.97] w-fit"
                  >
                    Baca Selengkapnya
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots indicators (Small, elegant circles below carousel) */}
      {articles.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {articles.map((_, index) => (
            <span
              key={index}
              onClick={() => handleDotClick(index)}
              role="button"
              tabIndex={0}
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex
                  ? "bg-accent"
                  : "bg-border hover:bg-accent/40"
                }`}
              aria-label={`Buka slide ${index + 1}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleDotClick(index);
                }
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
