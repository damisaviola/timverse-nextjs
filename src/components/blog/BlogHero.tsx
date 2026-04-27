"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { BlogPost } from "@/data/mockBlogs";
import { formatDate } from "@/lib/utils";

interface BlogHeroProps {
  post: BlogPost;
}

export default function BlogHero({ post }: BlogHeroProps) {
  return (
    <section className="relative py-6 sm:py-10 mb-10 sm:mb-16 overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-accent/5 rounded-full blur-[60px] -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-indigo-500/5 rounded-full blur-[50px] -z-10 opacity-60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center bg-card border border-border/60 rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] p-4 sm:p-8 lg:p-12 shadow-2xl shadow-accent/5 gpu-accelerated"
      >
        {/* Visual Side */}
        <div className="relative aspect-[16/10] lg:aspect-square w-full rounded-xl sm:rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-2xl">
          <div 
            className="w-full h-full" 
            style={{ background: post.coverImage }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
            <span className="px-3 sm:px-4 py-1.5 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-full text-[9px] sm:text-[10px] font-black text-foreground uppercase tracking-[0.2em] shadow-xl border border-white/20 dark:border-white/10">
              Pilihan Editor
            </span>
          </div>
        </div>

        {/* Content Side */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
             <span className="inline-block text-[10px] sm:text-[11px] font-black text-accent uppercase tracking-[0.2em]">
               {post.category}
             </span>
             <h1 
               id={`hero-blog-title`}
               className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-[1.1] tracking-tight"
             >
               {post.title}
             </h1>
             <p className="text-sm sm:text-base lg:text-lg text-secondary leading-relaxed opacity-90 line-clamp-3">
               {post.excerpt}
             </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-3 sm:pt-4 border-t border-border/40">
             <div className="flex items-center gap-2 sm:gap-3" aria-label={`Penulis: ${post.author}`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center text-[10px] sm:text-xs font-black text-accent">
                  {post.authorAvatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground leading-none">{post.author}</span>
                  <span className="text-[9px] sm:text-[10px] text-muted font-bold mt-0.5 uppercase tracking-tighter">{post.authorRole}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-muted font-bold uppercase tracking-widest" aria-label="Informasi artikel">
                <span className="flex items-center gap-1.5"><Calendar size={12} aria-hidden="true" /> {formatDate(post.date)}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} aria-hidden="true" /> {post.readTime} Baca</span>
             </div>
          </div>

          <div className="pt-2 sm:pt-4">
             <motion.div whileTap={{ scale: 0.96 }}>
               <Link 
                 href={`/blog/${post.slug}`}
                 className="inline-flex items-center gap-3 sm:gap-4 bg-foreground text-card px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/10 hover:-translate-y-1 active:translate-y-0"
                 aria-label={`Lanjutkan membaca artikel: ${post.title}`}
               >
                  Lanjutkan Membaca
                  <ArrowRight size={14} aria-hidden="true" />
               </Link>
             </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
