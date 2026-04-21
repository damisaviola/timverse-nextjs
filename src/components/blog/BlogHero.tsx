"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, User, Calendar } from "lucide-react";
import { BlogPost } from "@/data/mockBlogs";
import { formatDate } from "@/lib/utils";

interface BlogHeroProps {
  post: BlogPost;
}

export default function BlogHero({ post }: BlogHeroProps) {
  return (
    <section className="relative py-12 mb-20 overflow-hidden">
      {/* Decorative Blur Backgrounds - Optimized for performance */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[60px] -z-10 opacity-60" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[50px] -z-10 opacity-60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-card border border-border/60 rounded-[3.5rem] p-8 md:p-12 lg:p-16 shadow-2xl shadow-accent/5 gpu-accelerated"
      >
        {/* Visual Side */}
        <div className="relative aspect-[16/10] lg:aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div 
            className="w-full h-full" 
            style={{ background: post.coverImage }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8">
            <span className="px-5 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-full text-[10px] font-black text-foreground uppercase tracking-[0.2em] shadow-xl border border-white/20 dark:border-white/10">
              Pilihan Editor
            </span>
          </div>
        </div>

        {/* Content Side */}
        <div className="space-y-8">
          <div className="space-y-4">
             <span className="inline-block text-[11px] font-black text-accent uppercase tracking-[0.2em]">
               {post.category}
             </span>
             <h1 
               id={`hero-blog-title`}
               className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tight"
             >
               {post.title}
             </h1>
             <p className="text-lg text-secondary leading-relaxed opacity-90 line-clamp-3">
               {post.excerpt}
             </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/40">
             <div className="flex items-center gap-3" aria-label={`Penulis: ${post.author}`}>
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-xs font-black text-accent">
                  {post.authorAvatar}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground leading-none">{post.author}</span>
                  <span className="text-[10px] text-muted font-bold mt-1 uppercase tracking-tighter">{post.authorRole}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-4 text-[11px] text-muted font-bold uppercase tracking-widest" aria-label="Informasi artikel">
                <span className="flex items-center gap-1.5"><Calendar size={14} aria-hidden="true" /> {formatDate(post.date)}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} aria-hidden="true" /> {post.readTime} Baca</span>
             </div>
          </div>

          <div className="pt-4">
             <motion.div whileTap={{ scale: 0.96 }}>
               <Link 
                 href={`/blog/${post.slug}`}
                 className="inline-flex items-center gap-4 bg-foreground text-card px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/10 hover:-translate-y-1 active:translate-y-0"
                 aria-label={`Lanjutkan membaca artikel: ${post.title}`}
               >
                  Lanjutkan Membaca
                  <ArrowRight size={16} aria-hidden="true" />
               </Link>
             </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
