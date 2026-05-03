"use client";

import { motion } from "framer-motion";

interface AdminLoadingStateProps {
  type?: "cards" | "table" | "dashboard";
  count?: number;
}

export default function AdminLoadingState({
  type = "dashboard",
  count = 6
}: AdminLoadingStateProps) {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border/40 rounded-[2rem] p-6 h-56 space-y-4 animate-pulse"
          >
            <div className="flex justify-between items-start">
              <div className="h-5 w-24 bg-surface-alt rounded-full" />
              <div className="h-8 w-8 bg-surface-alt rounded-xl" />
            </div>
            <div className="space-y-3">
              <div className="h-10 w-1/2 bg-surface-alt rounded-lg" />
              <div className="h-4 w-full bg-surface-alt rounded-full" />
            </div>
            <div className="pt-4 border-t border-border/40 flex justify-between">
              <div className="h-8 w-24 bg-surface-alt rounded-lg" />
              <div className="h-8 w-8 bg-surface-alt rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-card border border-border/40 rounded-3xl overflow-hidden animate-pulse">
        <div className="h-16 bg-surface-alt border-b border-border/40" />
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-16 border-b border-border/20 flex items-center px-6 gap-4">
            <div className="h-10 w-10 bg-surface-alt rounded-xl" />
            <div className="h-4 w-1/4 bg-surface-alt rounded-full" />
            <div className="h-4 w-1/6 bg-surface-alt rounded-full ml-auto" />
            <div className="h-4 w-12 bg-surface-alt rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Default "Dashboard" skeleton matching page.tsx design
  return (
    <div className="space-y-10 w-full" id="admin-dashboard-skeleton">
      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`stat-${i}`}
            className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-surface-alt animate-pulse rounded" />
                <div className="h-8 w-16 bg-surface-alt animate-pulse rounded" />
              </div>
              <div className="p-2.5 rounded-xl bg-surface-alt animate-pulse h-10 w-10" />
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-1.5">
              <div className="h-3 w-3 bg-surface-alt animate-pulse rounded" />
              <div className="h-3 w-24 bg-surface-alt animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* News Table Skeleton */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-32 bg-surface-alt animate-pulse rounded" />
              <div className="h-7 w-7 bg-surface-alt animate-pulse rounded-lg" />
            </div>
            <div className="w-full sm:w-72 h-10 bg-surface-alt animate-pulse rounded-xl" />
          </div>

          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-surface-alt dark:bg-sidebar/50 border-b border-border/60 h-11">
                    <th className="w-[45%] px-5 py-3.5"><div className="h-3 w-16 bg-surface-alt animate-pulse rounded" /></th>
                    <th className="w-[18%] px-4 py-3.5"><div className="h-3 w-16 bg-surface-alt animate-pulse rounded" /></th>
                    <th className="w-[12%] px-4 py-3.5"><div className="h-3 w-10 bg-surface-alt animate-pulse rounded mx-auto" /></th>
                    <th className="w-[13%] px-4 py-3.5"><div className="h-3 w-16 bg-surface-alt animate-pulse rounded" /></th>
                    <th className="w-[12%] px-4 py-3.5"><div className="h-3 w-10 bg-surface-alt animate-pulse rounded mx-auto" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={`skeleton-row-${i}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-surface-alt animate-pulse shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-4 w-3/4 bg-surface-alt animate-pulse rounded-md" />
                            <div className="h-3 w-1/2 bg-surface-alt/50 animate-pulse rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><div className="h-6 w-20 bg-surface-alt animate-pulse rounded-lg" /></td>
                      <td className="px-4 py-4"><div className="h-5 w-10 bg-surface-alt animate-pulse rounded-md mx-auto" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-16 bg-surface-alt animate-pulse rounded-md" /></td>
                      <td className="px-4 py-4"><div className="h-7 w-16 bg-surface-alt animate-pulse rounded-lg mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-surface-alt/50 dark:bg-sidebar/30 px-5 py-3 border-t border-border/60 flex items-center justify-between h-12">
              <div className="h-3 w-32 bg-surface-alt animate-pulse rounded" />
              <div className="flex items-center gap-3">
                <div className="h-3 w-16 bg-surface-alt animate-pulse rounded" />
                <div className="flex gap-1.5">
                  <div className="h-7 w-16 bg-surface-alt animate-pulse rounded-lg" />
                  <div className="h-7 w-16 bg-surface-alt animate-pulse rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 h-7">
            <div className="w-7 h-7 bg-surface-alt animate-pulse rounded-lg" />
            <div className="h-5 w-24 bg-surface-alt animate-pulse rounded" />
          </div>

          <div className="bg-card rounded-2xl border border-border/60 p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-surface-alt animate-pulse rounded" />
              <div className="h-3 w-full bg-surface-alt animate-pulse rounded" />
              <div className="h-3 w-2/3 bg-surface-alt animate-pulse rounded" />
            </div>
            <div className="w-full h-16 bg-surface-alt animate-pulse rounded-2xl" />
          </div>

          <div className="bg-surface-alt rounded-2xl p-6 shadow-sm animate-pulse space-y-2">
            <div className="h-4 w-24 bg-surface-alt/80 rounded" />
            <div className="h-3 w-full bg-surface-alt/80 rounded" />
            <div className="h-3 w-2/3 bg-surface-alt/80 rounded" />
            <div className="mt-4 h-8 w-28 bg-surface-alt/80 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
