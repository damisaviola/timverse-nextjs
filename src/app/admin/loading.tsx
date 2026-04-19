"use client";

import { Skeleton, SkeletonGroup } from "@/components/ui/Skeleton";

/** Admin dashboard page loading skeleton */
export default function AdminLoading() {
  return (
    <SkeletonGroup className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-40" rounded="md" />
        <Skeleton className="h-4 w-64" rounded="md" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border p-4 sm:p-5 space-y-3"
          >
            <Skeleton className="w-10 h-10" rounded="xl" />
            <Skeleton className="h-8 w-20" rounded="md" />
            <Skeleton className="h-3 w-24" rounded="md" />
          </div>
        ))}
      </div>

      {/* News Form Card */}
      <div className="bg-card rounded-2xl border border-border p-5 sm:p-8">
        <Skeleton className="h-6 w-40 mb-6" rounded="md" />

        <div className="space-y-5">
          {/* Title field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" rounded="md" />
            <Skeleton className="h-11 w-full" rounded="xl" />
          </div>

          {/* Category + Author row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" rounded="md" />
              <Skeleton className="h-11 w-full" rounded="xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" rounded="md" />
              <Skeleton className="h-11 w-full" rounded="xl" />
            </div>
          </div>

          {/* Excerpt field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" rounded="md" />
            <Skeleton className="h-20 w-full" rounded="xl" />
          </div>

          {/* Content field */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" rounded="md" />
            <Skeleton className="h-40 w-full" rounded="xl" />
          </div>

          {/* Submit button */}
          <Skeleton className="h-11 w-40" rounded="xl" />
        </div>
      </div>
    </SkeletonGroup>
  );
}
