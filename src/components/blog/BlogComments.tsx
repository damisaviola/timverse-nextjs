"use client";

import { useState } from "react";
import { Send, MessageSquare, ThumbsUp, Reply } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { vibrateDevice } from "@/lib/vibrate";

// Mock comments for blog (could be expanded later)
const initialComments = [
  {
    id: "bc1",
    author: "Andi Wijaya",
    avatar: "AW",
    date: "2026-04-20",
    content: "Artikel yang sangat mencerahkan! Transparansi di era digital memang kunci utama untuk menjaga integritas jurnalisme.",
    likes: 12,
  },
  {
    id: "bc2",
    author: "Maya Sari",
    avatar: "MS",
    date: "2026-04-19",
    content: "Saya setuju dengan poin tentang kolaborasi AI dan manusia. Kita tidak bisa menolak teknologi, tapi harus bisa mengarahkannya.",
    likes: 8,
  }
];

export default function BlogComments() {
  const [comments, setComments] = useState(initialComments);
  const [formData, setFormData] = useState({ name: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    vibrateDevice(10);

    // Simulate API delay
    setTimeout(() => {
      const newComment = {
        id: `bc-${Date.now()}`,
        author: formData.name || "Anonim",
        avatar: (formData.name || "A").substring(0, 2).toUpperCase(),
        date: new Date().toISOString().split("T")[0],
        content: formData.content.trim(),
        likes: 0,
      };

      setComments([newComment, ...comments]);
      setFormData({ name: "", content: "" });
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section className="mt-24 pt-16 border-t border-border/60" id="blog-comments">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-accent/10 rounded-2xl text-accent">
          <MessageSquare size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">Diskusi Pembaca</h3>
          <p className="text-[11px] text-muted font-bold uppercase tracking-widest mt-1">Bagikan pandangan Anda bersama kami</p>
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-16 bg-surface/30 border border-border/40 rounded-[2.5rem] p-6 lg:p-10 shadow-xl shadow-black/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Nama Lengkap</label>
            <input 
               type="text"
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
               placeholder="Masukkan nama Anda..."
               className="w-full bg-background border border-border/60 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>
          <div className="flex items-end">
             <p className="text-[10px] text-muted italic ml-2 mb-4">Email Anda tidak akan dipublikasikan.</p>
          </div>
        </div>

        <div className="space-y-2 mb-8">
           <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Komentar</label>
           <textarea 
             rows={4}
             value={formData.content}
             onChange={(e) => setFormData({...formData, content: e.target.value})}
             placeholder="Apa pendapat Anda tentang artikel ini?"
             className="w-full bg-background border border-border/60 rounded-[2rem] px-6 py-5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all resize-none"
           />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !formData.content.trim()}
            className="flex items-center gap-4 bg-foreground text-card px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg"
          >
            {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="p-8 bg-card border border-border/40 rounded-[2.5rem] shadow-sm gpu-accelerated"
            >
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-surface-alt border border-border/60 flex items-center justify-center text-xs font-black text-secondary">
                  {comment.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-bold text-foreground">{comment.author}</span>
                       <span className="w-1 h-1 rounded-full bg-border" />
                       <span className="text-[10px] text-muted font-bold">{formatDate(comment.date)}</span>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-secondary leading-relaxed mb-6 font-medium">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest hover:text-accent transition-colors">
                      <ThumbsUp size={14} />
                      {comment.likes} Suka
                    </button>
                    <button className="flex items-center gap-2 text-[10px] font-black text-muted uppercase tracking-widest hover:text-accent transition-colors">
                      <Reply size={14} />
                      Balas
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
