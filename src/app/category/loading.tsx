"use client";

import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";
import { NewsCardSkeleton } from "@/app/loading";

/** Category page loading skeleton */
export default function CategoryLoading() {
  return (
    <SkeletonGroup className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="w-12 h-12" rounded="2xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" rounded="md" />
            <Skeleton className="h-4 w-32" rounded="md" />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 mb-8 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-9 flex-shrink-0 ${i === 0 ? "w-16" : i % 2 === 0 ? "w-24" : "w-20"}`}
            rounded="full"
          />
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonGroup>
  );
}
