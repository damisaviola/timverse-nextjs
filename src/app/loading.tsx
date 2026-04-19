"use client";

import { Skeleton, SkeletonCircle, SkeletonGroup } from "@/components/ui/Skeleton";

/** Home page loading skeleton — mirrors HeroSection + CategorySection + PopularNews + LatestNews + BentoGrid */
export default function HomeLoading() {
  return (
    <SkeletonGroup>
      {/* ===== Breaking News Ticker Skeleton ===== */}
      <div className="w-full h-9 bg-ticker-bg" />

      {/* ===== Hero Section Skeleton ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="relative overflow-hidden rounded-3xl">
          <Skeleton className="aspect-[21/9] sm:aspect-[21/8] w-full" rounded="3xl" />
          {/* Overlay content placeholders */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 space-y-3">
            <Skeleton className="w-20 h-6" rounded="full" />
            <Skeleton className="h-8 sm:h-10 w-4/5 max-w-xl" rounded="lg" />
            <Skeleton className="h-5 w-3/5 max-w-md hidden sm:block" rounded="lg" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-4 w-24" rounded="md" />
              <Skeleton className="h-4 w-28" rounded="md" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Category Section Skeleton ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10" rounded="xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" rounded="md" />
            <Skeleton className="h-3 w-56" rounded="md" />
          </div>
        </div>
        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col items-center"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Skeleton className="w-12 h-12 mb-3" rounded="2xl" />
              <Skeleton className="h-4 w-16" rounded="md" />
              <Skeleton className="h-3 w-20 mt-1 hidden sm:block" rounded="md" />
            </div>
          ))}
        </div>
      </section>

      {/* ===== Popular News Section Skeleton ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10" rounded="xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" rounded="md" />
            <Skeleton className="h-3 w-52" rounded="md" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Big card */}
          <div className="lg:col-span-3">
            <Skeleton className="w-full min-h-[320px] sm:min-h-[380px]" rounded="2xl" />
          </div>
          {/* Ranked list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 bg-card rounded-2xl p-3.5 border border-border"
              >
                <Skeleton className="w-10 h-10 flex-shrink-0 self-center" rounded="xl" />
                <Skeleton className="w-20 h-20 flex-shrink-0" rounded="xl" />
                <div className="flex-1 flex flex-col justify-center gap-2">
                  <Skeleton className="h-3 w-16" rounded="md" />
                  <Skeleton className="h-4 w-full" rounded="md" />
                  <Skeleton className="h-4 w-3/4" rounded="md" />
                  <div className="flex gap-3 mt-1">
                    <Skeleton className="h-3 w-14" rounded="md" />
                    <Skeleton className="h-3 w-18" rounded="md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Latest News Section Skeleton ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10" rounded="xl" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" rounded="md" />
              <Skeleton className="h-3 w-44" rounded="md" />
            </div>
          </div>
          <Skeleton className="h-4 w-24" rounded="md" />
        </div>
        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* ===== Bento Grid Skeleton ===== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10" rounded="xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" rounded="md" />
            <Skeleton className="h-3 w-44" rounded="md" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>

        {/* Berita Lainnya */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <Skeleton className="h-5 w-36" rounded="md" />
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <HorizontalCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </SkeletonGroup>
  );
}

/** Skeleton for a default NewsCard */
export function NewsCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
      {/* Image placeholder */}
      <Skeleton className="aspect-[16/9] w-full" rounded="sm" />
      {/* Content */}
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-full" rounded="md" />
        <Skeleton className="h-5 w-3/4" rounded="md" />
        <Skeleton className="h-4 w-full" rounded="md" />
        <Skeleton className="h-4 w-2/3" rounded="md" />
        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-border-light">
          <div className="flex items-center gap-2">
            <SkeletonCircle className="w-6 h-6" />
            <Skeleton className="h-3 w-16" rounded="md" />
          </div>
          <Skeleton className="h-3 w-20" rounded="md" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for a horizontal NewsCard */
export function HorizontalCardSkeleton() {
  return (
    <div className="flex gap-4 bg-card rounded-2xl p-3 border border-border">
      <Skeleton className="flex-shrink-0 w-24 h-24" rounded="xl" />
      <div className="flex-1 flex flex-col justify-center gap-2">
        <Skeleton className="h-3 w-16" rounded="md" />
        <Skeleton className="h-4 w-full" rounded="md" />
        <Skeleton className="h-4 w-3/4" rounded="md" />
        <Skeleton className="h-3 w-20" rounded="md" />
      </div>
    </div>
  );
}
