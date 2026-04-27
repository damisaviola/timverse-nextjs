"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, MessageSquare } from "lucide-react";
import { BlogPost } from "@/data/mockBlogs";

interface PopularBlogsProps {
  posts: BlogPost[];
}

export default function PopularBlogs({ posts }: PopularBlogsProps) {
  return (
    <section className="mb-10 sm:mb-16">
      <div className="flex items-center justify-between mb-5 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">Pemikiran Populer</h3>
            <p className="text-[10px] sm:text-[11px] text-muted font-bold uppercase tracking-widest mt-0.5">Paling banyak didiskusikan pekan ini</p>
          </div>
        </div>
        <Link href="/blog" className="text-[10px] sm:text-xs font-black text-accent uppercase tracking-widest hover:underline">
          Lihat Semua
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-3.5 sm:p-5 bg-surface-alt/20 border border-border/40 rounded-2xl sm:rounded-[1.5rem] hover:bg-surface-alt/40 transition-all flex gap-3.5 sm:gap-5 items-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl sm:rounded-2xl shrink-0 overflow-hidden shadow-lg">
               <div 
                 className="w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                 style={{ background: post.coverImage }}
               />
            </div>
            
            <div className="flex-1 min-w-0">
               <span className="text-[9px] sm:text-[10px] font-black text-accent uppercase tracking-widest leading-none">
                 {post.category}
               </span>
               <Link href={`/blog/${post.slug}`}>
                 <h4 className="text-sm sm:text-base lg:text-lg font-bold text-foreground mt-1 sm:mt-2 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                   {post.title}
                 </h4>
               </Link>
               <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-[11px] text-muted font-medium">
                  <span className="flex items-center gap-1.5"><MessageSquare size={11} className="text-accent/40" /> 12 Diskusi</span>
                  <span>{post.readTime} Baca</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
