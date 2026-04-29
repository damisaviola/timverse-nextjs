"use client";

import { useState, useEffect } from "react";
import { Send, LogIn, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { postComment } from "@/app/article/actions";
import Link from "next/link";

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 1. Get User Session
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        // 2. Fetch Comments with Profiles
        const { data, error: fetchError } = await supabase
          .from("comments")
          .select(`
            id,
            content,
            created_at,
            user_id,
            profiles (
              full_name,
              username,
              avatar_url
            )
          `)
          .eq("article_id", articleId)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          // Don't show error if it's just "table not found" yet
          if (!fetchError.message.includes("does not exist")) {
            setError("Gagal memuat komentar.");
          }
        } else if (data) {
          setComments(data);
        }
      } catch (err) {
        console.error("Network error:", err);
        // Error "Failed to fetch" usually happens here
      } finally {
        setIsLoading(false);
      }
    };

    if (articleId) fetchData();
  }, [articleId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("articleId", articleId);
    formData.append("content", newComment.trim());

    const result = await postComment(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      setNewComment("");
      // Optimistic update or refetch
      const { data } = await supabase
        .from("comments")
        .select(`id, content, created_at, user_id, profiles(full_name, username, avatar_url)`)
        .eq("id", (await supabase.from("comments").select("id").eq("article_id", articleId).order("created_at", { ascending: false }).limit(1).single()).data?.id) // This is a bit hacky for a quick update
        .single();
      
      // Actually just refetch all for simplicity or revalidatePath handles it if using server components
      // Since this is client component, let's just refetch:
      const { data: refreshedData } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id, profiles(full_name, username, avatar_url)")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });
      
      if (refreshedData) setComments(refreshedData);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 pt-10 border-t border-border/40" id="comment-section">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 rounded-xl bg-accent/10 text-accent">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">
          Komentar <span className="text-muted font-bold ml-1">{comments.length}</span>
        </h3>
      </div>

      {/* Comment Input */}
      <div className="mb-10">
        {user ? (
          <form onSubmit={handleSubmit} className="group">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-border/40 bg-surface">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} 
                  alt="My Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Bagikan pemikiran Anda..."
                  rows={3}
                  className="w-full bg-surface/50 border border-border/60 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 resize-none transition-all"
                  id="comment-input"
                />
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    className="flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-accent-dark transition-all shadow-lg shadow-accent/20 disabled:opacity-40 disabled:scale-100 active:scale-95"
                    id="submit-comment"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Kirim
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-8 rounded-3xl bg-surface/30 border border-border/40 border-dashed text-center space-y-4">
            <p className="text-sm text-secondary font-medium">Anda harus masuk untuk ikut berdiskusi.</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
            >
              <LogIn size={14} /> Masuk Sekarang
            </Link>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-surface-alt" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-alt rounded w-24" />
                  <div className="h-3 bg-surface-alt rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl overflow-hidden border border-border/40 bg-surface shadow-sm">
                  <img 
                    src={comment.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.profiles?.username || comment.user_id}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="bg-surface/40 border border-border/40 rounded-2xl p-4 transition-colors group-hover:bg-surface/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-foreground tracking-tight">
                        {comment.profiles?.full_name || comment.profiles?.username || "Anonim"}
                      </span>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-secondary leading-relaxed font-medium">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="text-center py-12 space-y-2">
            <p className="text-secondary font-bold">Belum ada komentar.</p>
            <p className="text-xs text-muted">Jadilah yang pertama untuk berdiskusi!</p>
          </div>
        )}
      </div>
    </section>
  );
}
