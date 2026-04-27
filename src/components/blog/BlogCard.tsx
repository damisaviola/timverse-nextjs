"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/data/mockBlogs";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

const BlogCard = memo(({ post, index }: BlogCardProps) => {
  return (
    <motion.div
      role="article"
      aria-labelledby={`blog-title-${post.id}`}
      whileTap={{ scale: 0.98 }}
      className="group bg-card border border-border/60 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 flex flex-col h-full cursor-pointer gpu-accelerated"
    >
      {/* Cover Image / Gradient */}
      <Link 
        href={`/blog/${post.slug}`} 
        className="block relative aspect-[16/10] overflow-hidden"
        aria-label={`Baca artikel: ${post.title}`}
      >
        <div 
          className="w-full h-full transform group-hover:scale-110 transition-transform duration-700" 
          style={{ background: post.coverImage }}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
          <span className="px-2.5 sm:px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full text-[9px] sm:text-[10px] font-bold text-foreground uppercase tracking-widest border border-border/20 shadow-sm">
            {post.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/10 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-accent border border-accent/20">
            {post.authorAvatar}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] font-bold text-foreground leading-none">{post.author}</span>
            <span className="text-[8px] sm:text-[9px] text-muted font-medium mt-0.5 uppercase tracking-tighter">{post.authorRole}</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="block group/title" aria-hidden="true">
          <h3 
            id={`blog-title-${post.id}`}
            className="text-base sm:text-lg font-bold text-foreground leading-tight group-hover/title:text-accent transition-colors duration-300 line-clamp-2"
          >
            {post.title}
          </h3>
        </Link>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-secondary line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 sm:pt-5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Clock size={11} />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
               {formatDate(post.date)}
            </span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-black text-accent uppercase tracking-widest hover:gap-2.5 transition-all"
            aria-label={`Baca selengkapnya tentang ${post.title}`}
          >
            <span className="hidden sm:inline">Selengkapnya</span>
            <span className="sm:hidden">Baca</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

BlogCard.displayName = "BlogCard";
export default BlogCard;
