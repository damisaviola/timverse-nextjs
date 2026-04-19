"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

/** Reusable skeleton shimmer block */
export function Skeleton({ className = "", rounded = "xl" }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded-${rounded} ${className}`}
    />
  );
}

/** A circle skeleton (for avatars) */
export function SkeletonCircle({ className = "" }: { className?: string }) {
  return (
    <div className={`skeleton-shimmer rounded-full ${className}`} />
  );
}

/** Skeleton wrapper with stagger fade-in animation */
export function SkeletonGroup({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
