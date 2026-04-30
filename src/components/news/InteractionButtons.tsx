"use client";

import { useState, useEffect } from "react";
import { Heart, Bookmark, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { toggleLike, toggleSave } from "@/app/article/actions";
import Link from "next/link";

interface InteractionButtonsProps {
  articleId: string;
}

export default function InteractionButtons({ articleId }: InteractionButtonsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        setIsLoading(true);

        // 1. Cek session user
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // 2. Ambil total like
        const { count } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("news_id", articleId);
        
        setLikeCount(count || 0);

        // 3. Cek apakah user sudah like & save
        if (session?.user) {
          const [likeRes, saveRes] = await Promise.all([
            supabase
              .from("likes")
              .select("id")
              .eq("news_id", articleId)
              .eq("user_id", session.user.id)
              .maybeSingle(),
            supabase
              .from("saved_news")
              .select("id")
              .eq("news_id", articleId)
              .eq("user_id", session.user.id)
              .maybeSingle(),
          ]);

          setIsLiked(!!likeRes.data);
          setIsSaved(!!saveRes.data);
        }
      } catch (err) {
        console.error("Fetch interactions error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) fetchInteractions();
  }, [articleId, supabase]);

  const handleLike = async () => {
    if (!user || isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    const result = await toggleLike(articleId);

    if (result?.error) {
      // Rollback
      setIsLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }

    setIsLiking(false);
  };

  const handleSave = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);

    // Optimistic update
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);

    const result = await toggleSave(articleId);

    if (result?.error) {
      // Rollback
      setIsSaved(wasSaved);
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-24 bg-surface rounded-xl animate-pulse" />
        <div className="h-10 w-10 bg-surface rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Like Button */}
      {user ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border shadow-sm ${
            isLiked
              ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
              : "bg-surface/50 border-border/40 text-secondary hover:border-rose-500/30 hover:text-rose-500"
          }`}
          aria-label={isLiked ? "Hapus Suka" : "Suka"}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLiked ? "liked" : "not-liked"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Heart
                size={18}
                fill={isLiked ? "currentColor" : "none"}
                strokeWidth={isLiked ? 0 : 2}
              />
            </motion.div>
          </AnimatePresence>
          <span className="text-xs font-black uppercase tracking-wider">
            {likeCount > 0 ? likeCount : "Suka"}
          </span>
        </motion.button>
      ) : (
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-surface/50 border border-border/40 text-secondary hover:border-rose-500/30 hover:text-rose-500 transition-all shadow-sm"
        >
          <Heart size={18} />
          <span className="text-xs font-black uppercase tracking-wider">Suka</span>
        </Link>
      )}

      {/* Save/Bookmark Button */}
      {user ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSave}
          disabled={isSaving}
          className={`p-2.5 rounded-xl transition-all duration-300 border shadow-sm ${
            isSaved
              ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
              : "bg-surface/50 border-border/40 text-secondary hover:border-blue-500/30 hover:text-blue-500"
          }`}
          aria-label={isSaved ? "Hapus Simpanan" : "Simpan"}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSaved ? "saved" : "not-saved"}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bookmark
                size={18}
                fill={isSaved ? "currentColor" : "none"}
                strokeWidth={isSaved ? 0 : 2}
              />
            </motion.div>
          </AnimatePresence>
        </motion.button>
      ) : (
        <Link
          href="/login"
          className="p-2.5 rounded-xl bg-surface/50 border border-border/40 text-secondary hover:border-blue-500/30 hover:text-blue-500 transition-all shadow-sm"
        >
          <Bookmark size={18} />
        </Link>
      )}
    </div>
  );
}
