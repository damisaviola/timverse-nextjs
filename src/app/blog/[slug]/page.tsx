"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, MessageSquare, Heart } from "lucide-react";
import { getBlogPostBySlug, getLatestBlogPosts, getRelatedBlogPosts } from "@/data/mockBlogs";
import { formatDate } from "@/lib/utils";
import BlogCard from "@/components/blog/BlogCard";
import BlogComments from "@/components/blog/BlogComments";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = use(params);
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedBlogPosts(slug, post.category, 3);
  // Fallback to latest if no related posts
  const finalRelated = relatedPosts.length > 0 ? relatedPosts : getLatestBlogPosts(3).filter(p => p.id !== post.id);

  return (
    <div className="min-h-screen bg-background">
      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-20" id="blog-detail-page">
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-accent transition-colors"
          >
            <div className="p-2 rounded-full bg-surface border border-border/40 group-hover:border-accent/40 group-hover:bg-accent/5 transition-all">
              <ArrowLeft size={16} />
            </div>
            Kembali ke Blog
          </Link>
        </motion.div>

        {/* Blog Header */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <span className="px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">
              {post.category}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1] max-w-3xl">
              {post.title}
            </h1>

            <p className="text-xl text-secondary max-w-2xl font-medium leading-relaxed italic opacity-80">
              "{post.excerpt}"
            </p>

            <div className="pt-8 flex flex-col items-center gap-4">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-sm font-black text-accent border border-accent/20">
                    {post.authorAvatar}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-foreground">{post.author}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-widest">{post.authorRole}</span>
                  </div>
               </div>
               <div className="flex items-center gap-6 text-[11px] text-muted font-bold uppercase tracking-tighter">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-accent/40" /> {formatDate(post.date)}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-accent/40" /> {post.readTime} bacaan</span>
               </div>
            </div>
          </motion.div>

          {/* Featured Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-16 relative aspect-[21/9] w-full rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <div 
              className="w-full h-full opacity-90" 
              style={{ background: post.coverImage }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>
        </header>

        {/* Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sticky Sidebar (Actions) */}
          <aside className="lg:col-span-1 sticky top-32 hidden lg:flex flex-col gap-6 items-center">
            <button className="p-4 rounded-2xl bg-surface border border-border/60 text-secondary hover:text-red-500 hover:border-red-500/30 transition-all">
              <Heart size={20} />
            </button>
            <button className="p-4 rounded-2xl bg-surface border border-border/60 text-secondary hover:text-accent hover:border-accent/30 transition-all">
              <Share2 size={20} />
            </button>
            <button className="p-4 rounded-2xl bg-surface border border-border/60 text-secondary hover:text-indigo-500 hover:border-indigo-500/30 transition-all">
              <Bookmark size={20} />
            </button>
          </aside>

          {/* Main Article Text */}
          <main className="lg:col-span-10 xl:col-span-9">
             <div 
               className="prose prose-xl max-w-none
               [&_strong]:text-foreground [&_strong]:font-bold
               "
               dangerouslySetInnerHTML={{ __html: post.content }}
             />

             {/* Tags Section */}
             <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-2">
                {post.tags.map(tag => (
                   <span key={tag} className="px-4 py-2 bg-surface text-[11px] font-bold text-muted rounded-xl border border-border/40 hover:text-accent hover:border-accent/40 transition-colors cursor-pointer">
                     #{tag}
                   </span>
                ))}
             </div>

             {/* Author Bio Box */}
             <div className="mt-16 p-8 md:p-10 bg-surface-alt/30 border border-border/60 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <div className="w-20 h-20 rounded-[2rem] bg-accent/20 flex items-center justify-center text-xl font-black text-accent shrink-0">
                  {post.authorAvatar}
                </div>
                <div className="flex flex-col gap-3">
                  <h4 className="text-xl font-bold text-foreground">Tentang {post.author}</h4>
                  <p className="text-sm text-secondary font-medium leading-relaxed opacity-80">
                    Seorang pakar di bidang {post.category} yang telah berkontribusi dalam berbagai publikasi internasional. Melalui TIMVERSE, Fajar berbagi pandangan kritis tentang evolusi dunia informasi.
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                    <button className="text-[10px] font-black uppercase tracking-widest text-accent hover:underline">Ikuti Penulis</button>
                    <button className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-foreground transition-colors">Semua Artikel</button>
                  </div>
                </div>
             </div>

             {/* Related Read Section */}
             <div className="mt-24">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Baca Juga</h3>
                    <p className="text-xs text-muted font-bold uppercase tracking-widest mt-1">Artikel menarik lainnya di kategori {post.category}</p>
                  </div>
                  <Link href="/blog" className="px-6 py-2.5 bg-surface border border-border text-xs font-black text-foreground uppercase tracking-widest rounded-xl hover:bg-accent hover:text-white hover:border-accent transition-all">Lihat Semua</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch">
                  {finalRelated.map((rPost, idx) => (
                    <BlogCard key={rPost.id} post={rPost} index={idx} />
                  ))}
                </div>
             </div>

             {/* 4. Blog Comments Section */}
             <BlogComments />
          </main>
        </div>
      </article>

    </div>
  );
}
