"use client";

import { motion } from "framer-motion";
import { categoryIcons } from "@/lib/categoryIcons";

interface CategoryHeaderProps {
  activeCategory: string;
  totalArticles: number;
}

export default function CategoryHeader({ activeCategory, totalArticles }: CategoryHeaderProps) {
  const descriptions: Record<string, string> = {
    Semua: "Jelajahi seluruh berita dari berbagai kategori.",
    Teknologi: "Inovasi terbaru dunia teknologi, AI, dan digital.",
    Bisnis: "Perkembangan ekonomi, startup, dan pasar global.",
    Olahraga: "Berita terkini dari dunia olahraga Indonesia dan dunia.",
    Hiburan: "Film, musik, seni, dan budaya populer.",
    Sains: "Penemuan ilmiah dan eksplorasi alam semesta.",
    Politik: "Kebijakan publik, pemerintahan, dan geopolitik.",
  };

  const iconData = categoryIcons[activeCategory];
  const Icon = iconData?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
      id="category-header"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 border border-accent/10 p-6 sm:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {Icon && (
              <div className={`p-2.5 bg-gradient-to-br ${iconData.gradient} rounded-xl shadow-sm`}>
                <Icon size={20} className="text-white" />
              </div>
            )}
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Kategori
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {activeCategory === "Semua" ? "Semua Berita" : activeCategory}
          </h1>
          <p className="mt-2 text-sm text-secondary max-w-xl leading-relaxed">
            {descriptions[activeCategory] || "Berita terbaru dan terpopuler."}
          </p>
          <p className="mt-3 text-xs text-muted">
            {totalArticles} artikel ditemukan
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-accent/5" />
        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-accent/5" />
      </div>
    </motion.div>
  );
}
