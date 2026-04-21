"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, User, ArrowRight } from "lucide-react";
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
      className="group bg-card border border-border/60 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 flex flex-col h-full cursor-pointer gpu-accelerated"
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
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full text-[10px] font-bold text-foreground uppercase tracking-widest border border-border/20 shadow-sm">
            {post.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-black text-accent border border-accent/20">
            {post.authorAvatar}
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-foreground leading-none">{post.author}</span>
            <span className="text-[9px] text-muted font-medium mt-1 uppercase tracking-tighter">{post.authorRole}</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`} className="block group/title" aria-hidden="true">
          <h3 
            id={`blog-title-${post.id}`}
            className="text-xl font-bold text-foreground leading-tight group-hover/title:text-accent transition-colors duration-300 line-clamp-2"
          >
            {post.title}
          </h3>
        </Link>
        <p className="mt-3 text-sm text-secondary line-clamp-2 leading-relaxed min-h-[3rem]">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1.5">
               {formatDate(post.date)}
            </span>
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1.5 text-[11px] font-black text-accent uppercase tracking-widest hover:gap-3 transition-all"
            aria-label={`Baca selengkapnya tentang ${post.title}`}
          >
            Selengkapnya
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

BlogCard.displayName = "BlogCard";
export default BlogCard;
