"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenSquare, Sparkles, Filter, Newspaper, LayoutGrid } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import BlogHero from "@/components/blog/BlogHero";
import PopularBlogs from "@/components/blog/PopularBlogs";
import BlogCarousel from "@/components/blog/BlogCarousel";
import { blogPosts } from "@/data/mockBlogs";
import { categoryIcons } from "@/lib/categoryIcons";

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  
  const sortedPosts = useMemo(() => {
    return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);
  
  const featuredPost = sortedPosts.find(p => p.featured) || sortedPosts[0];
  
  // Filter out featured for the following sections
  const nonFeatured = sortedPosts.filter(p => p.id !== featuredPost.id);
  
  const newestPosts = nonFeatured.slice(0, 3);
  const carouselPosts = nonFeatured.slice(3, 7);
  const popularPosts = nonFeatured.slice(0, 2); 
  
  const filteredPosts = useMemo(() => {
    if (activeCategory === "Semua") return nonFeatured;
    return nonFeatured.filter(post => post.category === activeCategory);
  }, [activeCategory, nonFeatured]);

  const categories = ["Semua", "Media", "Career", "Psychology", "Inside TIMVERSE"];

  return (
    <div className="min-h-screen bg-background pt-12 pb-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Simple Page Header */}
        <header className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-accent/10 rounded-2xl text-accent">
              <PenSquare size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight">TIMVERSE Blog</h1>
              <p className="text-xs text-muted font-bold uppercase tracking-widest mt-0.5">Wawasan, Cerita & Budaya</p>
            </div>
          </motion.div>
        </header>

        {/* 1. Featured Section */}
        <BlogHero post={featuredPost} />

        {/* 2. NEW: Latest Stories (Section Blog Terbaru) */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-foreground tracking-tight">Cerita Terbaru</h3>
              <p className="text-[11px] text-muted font-bold uppercase tracking-widest mt-0.5">Baru saja diterbitkan hari ini</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newestPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </section>

        {/* 3. Spotlight Carousel */}
        <BlogCarousel posts={carouselPosts} />

        {/* 4. Topic Filter Section (UNIFORM GRID & MAGNETIC ANIMATION) */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-xl text-accent">
                   <Filter size={18} />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">Kategori Populer</h3>
              </div>
              <div className="text-[10px] font-black text-muted uppercase tracking-widest bg-surface px-4 py-2 rounded-full border border-border/40">
                {activeCategory}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map((cat) => {
                const IconData = categoryIcons[cat];
                const Icon = IconData?.icon || LayoutGrid;
                const isActive = activeCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`group relative flex flex-col items-center justify-center gap-3 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden border border-transparent
                      ${isActive 
                        ? "text-card" 
                        : "bg-surface border-border/40 text-secondary hover:border-accent/40 lg:hover:bg-accent/5 lg:hover:text-accent"
                      }
                    `}
                  >
                    {/* Magnetic Background Highlight */}
                    {isActive && (
                      <motion.div 
                        layoutId="active-category-bg"
                        className="absolute inset-0 bg-foreground z-0"
                        initial={false}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 30,
                          mass: 0.8
                        }}
                      />
                    )}

                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isActive ? "bg-accent/20 text-accent" : "bg-card text-muted group-hover:text-accent"}`}>
                        <Icon size={18} />
                      </div>
                      <span className="whitespace-nowrap">{cat}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. Popular Section */}
        <PopularBlogs posts={popularPosts} />

        {/* 6. All Stories (The Grid) */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Newspaper size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  {activeCategory === "Semua" ? "Jelajahi Semua Cerita" : `Cerita di ${activeCategory}`}
                </h3>
                <p className="text-[11px] text-muted font-bold uppercase tracking-widest mt-0.5">
                  {activeCategory === "Semua" ? "Selami seluruh arsip pemikiran kami" : `Menampilkan tulisan terbaru tentang ${activeCategory}`}
                </p>
              </div>
            </div>
            <div className="text-[10px] font-black text-muted uppercase tracking-widest bg-surface px-4 py-2 rounded-full border border-border/40">
              {filteredPosts.length} Artikel
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="gpu-accelerated"
                >
                  <BlogCard post={post} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredPosts.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-surface/30 border border-dashed border-border rounded-[2.5rem] p-20"
                >
                  <Filter size={48} className="mx-auto text-muted/30 mb-4" />
                  <p className="text-muted font-bold italic">Belum ada cerita di kategori ini. Kembali lagi nanti!</p>
                </motion.div>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 md:p-16 bg-card border border-border/60 rounded-[3.5rem] relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Sparkles size={120} className="text-accent" />
          </div>
          
          <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">Ingin Menjadi Penulis Tamu?</h2>
          <p className="text-secondary max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Punya pandangan unik atau keahlian di bidang tertentu? Kami selalu membuka pintu bagi kontributor eksternal untuk berbagi cerita di Blog TIMVERSE.
          </p>
          <button className="px-10 py-5 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-accent-dark transition-all shadow-xl shadow-accent/20">
            Kirimkan Draft Anda
          </button>
        </motion.div>

      </div>
    </div>
  );
}
