"use client";

import { motion } from "framer-motion";

export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back button skeleton */}
        <div className="w-32 h-10 bg-surface-alt/40 rounded-full animate-pulse mb-12" />

        {/* Header skeleton */}
        <div className="flex flex-col items-center space-y-6 mb-16">
          <div className="w-24 h-6 bg-surface-alt/40 rounded-full animate-pulse" />
          <div className="w-full max-w-2xl h-16 bg-surface-alt/40 rounded-2xl animate-pulse" />
          <div className="w-full max-w-sm h-10 bg-surface-alt/20 rounded-xl animate-pulse" />
          
          <div className="pt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-surface-alt/40 animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-4 bg-surface-alt/40 rounded-md animate-pulse" />
                <div className="w-20 h-3 bg-surface-alt/20 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero image skeleton */}
        <div className="aspect-[21/9] w-full bg-surface-alt/20 rounded-[3rem] animate-pulse mb-16" />

        {/* Content body skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="w-12 h-12 bg-surface-alt/20 rounded-2xl animate-pulse" />
            <div className="w-12 h-12 bg-surface-alt/20 rounded-2xl animate-pulse" />
            <div className="w-12 h-12 bg-surface-alt/20 rounded-2xl animate-pulse" />
          </div>
          <div className="lg:col-span-10 xl:col-span-8 space-y-8">
            <div className="w-full h-4 bg-surface-alt/20 rounded-full animate-pulse" />
            <div className="w-full h-4 bg-surface-alt/20 rounded-full animate-pulse" />
            <div className="w-[90%] h-4 bg-surface-alt/20 rounded-full animate-pulse" />
            <div className="w-full h-4 bg-surface-alt/20 rounded-full animate-pulse" />
            <div className="w-[80%] h-4 bg-surface-alt/20 rounded-full animate-pulse" />
            
            <div className="py-8" />

            <div className="w-full h-4 bg-surface-alt/20 rounded-full animate-pulse" />
            <div className="w-full h-4 bg-surface-alt/20 rounded-full animate-pulse" />
            <div className="w-[85%] h-4 bg-surface-alt/20 rounded-full animate-pulse" />
          </div>
        </div>

      </article>
    </div>
  );
}
