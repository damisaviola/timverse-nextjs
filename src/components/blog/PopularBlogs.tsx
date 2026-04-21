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
    <section className="mb-24">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">Pemikiran Populer</h3>
            <p className="text-[11px] text-muted font-bold uppercase tracking-widest mt-0.5">Paling banyak didiskusikan pekan ini</p>
          </div>
        </div>
        <Link href="/blog" className="text-xs font-black text-accent uppercase tracking-widest hover:underline">
          Lihat Semua
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group p-6 bg-surface-alt/20 border border-border/40 rounded-[2rem] hover:bg-surface-alt/40 transition-all flex gap-6 items-center"
          >
            <div className="w-24 h-24 rounded-2xl shrink-0 overflow-hidden shadow-lg">
               <div 
                 className="w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                 style={{ background: post.coverImage }}
               />
            </div>
            
            <div className="flex-1 min-w-0">
               <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">
                 {post.category}
               </span>
               <Link href={`/blog/${post.slug}`}>
                 <h4 className="text-lg font-bold text-foreground mt-2 line-clamp-2 leading-snug group-hover:text-accent transition-colors">
                   {post.title}
                 </h4>
               </Link>
               <div className="flex items-center gap-4 mt-3 text-[11px] text-muted font-medium">
                  <span className="flex items-center gap-1.5"><MessageSquare size={12} className="text-accent/40" /> 12 Diskusi</span>
                  <span>{post.readTime} Baca</span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
