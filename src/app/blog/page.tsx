"use client";

import { useState, useMemo } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PenSquare, Sparkles, Filter, Newspaper, LayoutGrid } from "lucide-react";
import BlogCard from "@/components/blog/BlogCard";
import BlogHero from "@/components/blog/BlogHero";
import PopularBlogs from "@/components/blog/PopularBlogs";
import BlogCarousel from "@/components/blog/BlogCarousel";
import { blogPosts } from "@/data/mockBlogs";
import { categoryIcons } from "@/lib/categoryIcons";

// 🔒 Blog is currently locked — remove notFound() below to unlock
export default function BlogListPage() {
  notFound();

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
    <div className="min-h-screen bg-background pt-6 sm:pt-10 pb-16 sm:pb-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Simple Page Header */}
        <header className="mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <div className="p-2.5 sm:p-3 bg-accent/10 rounded-xl sm:rounded-2xl text-accent">
              <PenSquare size={20} className="sm:hidden" />
              <PenSquare size={24} className="hidden sm:block" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">TIMVERSE Blog</h1>
              <p className="text-[10px] sm:text-xs text-muted font-bold uppercase tracking-widest mt-0.5">Wawasan, Cerita & Budaya</p>
            </div>
          </motion.div>
        </header>

        {/* 1. Featured Section */}
        <BlogHero post={featuredPost} />

        {/* 2. Latest Stories */}
        <section className="mb-10 sm:mb-16">
          <div className="flex items-center gap-3 mb-5 sm:mb-8">
            <div className="p-2 sm:p-2.5 bg-accent/10 rounded-xl text-accent">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">Cerita Terbaru</h3>
              <p className="text-[10px] sm:text-[11px] text-muted font-bold uppercase tracking-widest mt-0.5">Baru saja diterbitkan hari ini</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {newestPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </section>

        {/* 3. Spotlight Carousel */}
        <BlogCarousel posts={carouselPosts} />

        {/* 4. Topic Filter Section — matching homepage CategorySection */}
        <section className="mb-10 sm:mb-16">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-xl">
                <Filter size={18} className="text-accent" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">Jelajahi Kategori</h3>
                <p className="text-xs sm:text-sm text-secondary">Filter cerita sesuai minatmu</p>
              </div>
            </div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest bg-surface px-3 py-1.5 rounded-full border border-border/40 hidden sm:block">
              {activeCategory}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat, i) => {
              const iconData = categoryIcons[cat];
              const Icon = iconData?.icon || LayoutGrid;
              const isActive = activeCategory === cat;

              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`group block w-full relative overflow-hidden rounded-2xl border p-4 sm:p-5 text-center transition-all duration-300
                      ${isActive
                        ? "border-accent/40 bg-accent/5 shadow-md shadow-accent/10 ring-2 ring-accent/20"
                        : "border-border bg-card hover:shadow-md hover:border-accent/20 hover:-translate-y-0.5"
                      }
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${iconData?.gradient || "from-sky-500 to-cyan-400"} flex items-center justify-center mb-2 sm:mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={20} className="text-white" />
                    </div>

                    {/* Label */}
                    <h4 className={`text-xs sm:text-sm font-semibold transition-colors duration-200 ${isActive ? "text-accent" : "text-foreground group-hover:text-accent"}`}>
                      {cat}
                    </h4>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 5. Popular Section */}
        <PopularBlogs posts={popularPosts} />

        {/* 6. All Stories (The Grid) */}
        <section className="mb-10 sm:mb-16">
          <div className="flex items-center justify-between mb-5 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                <Newspaper size={18} />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
                  {activeCategory === "Semua" ? "Jelajahi Semua Cerita" : `Cerita di ${activeCategory}`}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-muted font-bold uppercase tracking-widest mt-0.5">
                  {activeCategory === "Semua" ? "Selami seluruh arsip pemikiran kami" : `Menampilkan tulisan terbaru tentang ${activeCategory}`}
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] font-black text-muted uppercase tracking-widest bg-surface px-4 py-2 rounded-full border border-border/40">
              {filteredPosts.length} Artikel
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              <div className="col-span-full py-12 sm:py-20 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-surface/30 border border-dashed border-border rounded-2xl sm:rounded-[2.5rem] p-10 sm:p-20"
                >
                  <Filter size={40} className="mx-auto text-muted/30 mb-4" />
                  <p className="text-muted font-bold italic text-sm">Belum ada cerita di kategori ini. Kembali lagi nanti!</p>
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
          className="p-6 sm:p-10 md:p-14 bg-card border border-border/60 rounded-2xl sm:rounded-[2.5rem] relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-10">
            <Sparkles size={80} className="sm:w-[120px] sm:h-[120px] text-accent" />
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-3 sm:mb-4">Ingin Menjadi Penulis Tamu?</h2>
          <p className="text-sm sm:text-base text-secondary max-w-xl mx-auto mb-6 sm:mb-10 leading-relaxed font-medium">
            Punya pandangan unik atau keahlian di bidang tertentu? Kami selalu membuka pintu bagi kontributor eksternal untuk berbagi cerita di Blog TIMVERSE.
          </p>
          <button className="px-6 sm:px-10 py-3.5 sm:py-4 bg-accent text-white rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-xs uppercase tracking-widest hover:bg-accent-dark transition-all shadow-xl shadow-accent/20">
            Kirimkan Draft Anda
          </button>
        </motion.div>

      </div>
    </div>
  );
}
