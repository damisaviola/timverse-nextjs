"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { mockComments, type Comment } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "Pengguna",
      avatar: "PG",
      date: new Date().toISOString().split("T")[0],
      content: newComment.trim(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <section className="mt-12 pt-8 border-t border-border" id="comment-section">
      <h3 className="text-xl font-bold text-foreground mb-6">
        Komentar ({comments.length})
      </h3>

      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
            PG
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar..."
              rows={3}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none transition-all"
              id="comment-input"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                id="submit-comment"
              >
                <Send size={14} />
                Kirim
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-5">
        {comments.map((comment, i) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex gap-3"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-xs font-bold text-secondary border border-border">
              {comment.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">
                  {comment.author}
                </span>
                <span className="text-xs text-muted">
                  {formatDate(comment.date)}
                </span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">
                {comment.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
