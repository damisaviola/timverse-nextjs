"use client";

import { Skeleton, SkeletonCircle, SkeletonGroup } from "@/components/ui/Skeleton";

/** Article detail page loading skeleton */
export default function ArticleLoading() {
  return (
    <SkeletonGroup className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      {/* Back button */}
      <Skeleton className="h-4 w-40 mb-6" rounded="md" />

      {/* Category badge */}
      <Skeleton className="h-6 w-20 mb-4" rounded="full" />

      {/* Title */}
      <div className="space-y-3 mb-4">
        <Skeleton className="h-9 sm:h-12 w-full" rounded="lg" />
        <Skeleton className="h-9 sm:h-12 w-4/5" rounded="lg" />
      </div>

      {/* Excerpt */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-5 w-full" rounded="md" />
        <Skeleton className="h-5 w-3/4" rounded="md" />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-2">
          <SkeletonCircle className="w-8 h-8" />
          <Skeleton className="h-4 w-24" rounded="md" />
        </div>
        <Skeleton className="h-4 w-28" rounded="md" />
        <Skeleton className="h-4 w-20" rounded="md" />
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8" rounded="lg" />
          <Skeleton className="w-8 h-8" rounded="lg" />
        </div>
      </div>

      {/* Featured Image */}
      <Skeleton className="aspect-[16/9] w-full mt-8" rounded="2xl" />

      {/* Article Body */}
      <div className="mt-8 space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${i % 3 === 2 ? "w-4/5" : i % 3 === 1 ? "w-full" : "w-11/12"}`}
            rounded="md"
          />
        ))}
        {/* Paragraph break */}
        <div className="h-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={`p2-${i}`}
            className={`h-4 ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-11/12" : "w-3/4"}`}
            rounded="md"
          />
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-16" rounded="full" />
        ))}
      </div>

      {/* Related News Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <Skeleton className="h-6 w-40 mb-5" rounded="md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3 bg-card rounded-xl p-3 border border-border">
              <Skeleton className="flex-shrink-0 w-20 h-20" rounded="xl" />
              <div className="flex-1 flex flex-col justify-center gap-2">
                <Skeleton className="h-3 w-16" rounded="md" />
                <Skeleton className="h-4 w-full" rounded="md" />
                <Skeleton className="h-3 w-20" rounded="md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Section */}
      <div className="mt-12 pt-8 border-t border-border">
        <Skeleton className="h-6 w-32 mb-5" rounded="md" />
        {/* Comment input */}
        <Skeleton className="h-24 w-full mb-6" rounded="xl" />
        {/* Comment items */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-3 mb-5">
            <SkeletonCircle className="w-8 h-8 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20" rounded="md" />
                <Skeleton className="h-3 w-16" rounded="md" />
              </div>
              <Skeleton className="h-4 w-full" rounded="md" />
              <Skeleton className="h-4 w-2/3" rounded="md" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonGroup>
  );
}
