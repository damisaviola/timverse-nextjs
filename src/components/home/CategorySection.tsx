"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { categoryIcons } from "@/lib/categoryIcons";

const categoryItems = [
  { name: "Teknologi", description: "AI, Gadget & Digital" },
  { name: "Bisnis", description: "Ekonomi & Startup" },
  { name: "Olahraga", description: "Sepakbola & Esports" },
  { name: "Hiburan", description: "Film, Musik & Seni" },
  { name: "Sains", description: "Riset & Antariksa" },
  { name: "Politik", description: "Kebijakan & Pemerintahan" },
];

export default function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" id="category-section">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Sparkles size={18} className="text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Jelajahi Kategori</h2>
            <p className="text-sm text-secondary">Temukan berita sesuai minatmu</p>
          </div>
        </div>
        <Link
          href="/category"
          className="text-sm font-medium text-accent hover:text-accent-dark transition-colors hidden sm:block"
        >
          Lihat Semua →
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categoryItems.map((cat, i) => {
          const iconData = categoryIcons[cat.name];
          const Icon = iconData?.icon;

          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/category?cat=${encodeURIComponent(cat.name)}`}
                className="group block"
                id={`home-cat-${cat.name.toLowerCase()}`}
              >
                <div
                  className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 text-center hover:shadow-md hover:border-accent/20 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* Icon */}
                  {Icon && (
                    <div
                      className={`mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br ${iconData.gradient} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                  )}

                  {/* Label */}
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-muted mt-0.5 hidden sm:block">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
