"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { BlogPost } from "@/data/mockBlogs";
import { vibrateDevice } from "@/lib/vibrate";

interface BlogCarouselProps {
  posts: BlogPost[];
}

export default function BlogCarousel({ posts }: BlogCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      vibrateDevice(5);
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mb-24 relative group">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-fuchsia-500/10 rounded-2xl text-fuchsia-500">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-foreground tracking-tight">Spotlight Thoughts</h3>
            <p className="text-[11px] text-muted font-bold uppercase tracking-widest mt-1">Eksplorasi mendalam pilihan redaksi</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-12 h-12 rounded-full border border-border/60 flex items-center justify-center transition-all ${
              canScrollLeft ? "bg-surface hover:bg-accent hover:text-white hover:border-accent" : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Geser kiri"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-12 h-12 rounded-full border border-border/60 flex items-center justify-center transition-all ${
              canScrollRight ? "bg-surface hover:bg-accent hover:text-white hover:border-accent" : "opacity-30 cursor-not-allowed"
            }`}
            aria-label="Geser kanan"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-[85vw] md:w-[450px] lg:w-[500px] snap-center first:ml-0 gpu-accelerated"
          >
            <motion.div 
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="bg-card border border-border/60 rounded-[3rem] overflow-hidden group/card shadow-xl shadow-black/5 hover:shadow-accent/10 transition-all duration-500 h-full flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                <div 
                  className="w-full h-full transform group-hover/card:scale-110 transition-transform duration-700" 
                  style={{ background: post.coverImage }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors duration-500" />
                <div className="absolute bottom-6 left-6">
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-black/95 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest text-foreground shadow-2xl border border-white/20">
                     <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                     {post.category}
                   </div>
                </div>
              </Link>
              
              <div className="p-8 flex flex-col flex-1">
                <Link href={`/blog/${post.slug}`}>
                  <h4 className="text-2xl font-black text-foreground group-hover/card:text-accent transition-colors leading-tight mb-4">
                    {post.title}
                  </h4>
                </Link>
                <p className="text-secondary text-sm leading-relaxed line-clamp-3 mb-8">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent">
                      {post.authorAvatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-foreground">{post.author}</span>
                      <span className="text-[10px] text-muted font-bold uppercase tracking-tighter">{post.authorRole}</span>
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-black text-muted uppercase tracking-widest">{post.readTime} Baca</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Mobile Swipe Indicator */}
      <div className="flex md:hidden justify-center gap-1.5 mt-4">
        {posts.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
        ))}
      </div>
    </section>
  );
}
