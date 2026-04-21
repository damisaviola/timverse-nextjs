"use client";

import { motion } from "framer-motion";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background pt-12 pb-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-surface-alt/40 animate-pulse" />
            <div className="space-y-2">
              <div className="w-48 h-6 bg-surface-alt/40 animate-pulse rounded-lg" />
              <div className="w-32 h-3 bg-surface-alt/40 animate-pulse rounded-lg" />
            </div>
          </div>
        </div>

        {/* Hero Skeleton */}
        <div className="w-full h-[400px] bg-surface-alt/20 rounded-[3.5rem] animate-pulse mb-20 border border-border/40" />

        {/* Categories Skeleton */}
        <div className="flex gap-4 mb-16 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-24 h-10 bg-surface-alt/20 rounded-2xl animate-pulse shrink-0" />
          ))}
        </div>

        {/* Popular Section Skeleton */}
        <div className="mb-24">
          <div className="w-48 h-8 bg-surface-alt/20 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-32 bg-surface-alt/10 rounded-[2rem] animate-pulse" />
            <div className="h-32 bg-surface-alt/10 rounded-[2rem] animate-pulse" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/5] bg-surface-alt/10 rounded-[2.5rem] animate-pulse border border-border/40" />
          ))}
        </div>

      </div>
    </div>
  );
}
