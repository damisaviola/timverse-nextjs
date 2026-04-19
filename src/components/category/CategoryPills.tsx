"use client";

import { motion } from "framer-motion";
import { categories } from "@/data/mockNews";
import { categoryIcons } from "@/lib/categoryIcons";

interface CategoryPillsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryPills({ activeCategory, onCategoryChange }: CategoryPillsProps) {
  return (
    <div className="mb-8" id="category-pills">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name;
          const iconData = categoryIcons[cat.name];
          const Icon = iconData?.icon;

          return (
            <motion.button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                isActive
                  ? "bg-accent text-white border-accent shadow-sm"
                  : "bg-card text-secondary border-border hover:border-accent/30 hover:text-foreground"
              }`}
              whileTap={{ scale: 0.95 }}
              id={`pill-${cat.name.toLowerCase()}`}
            >
              {Icon && (
                <Icon
                  size={15}
                  className={isActive ? "text-white" : iconData.color}
                />
              )}
              {cat.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
