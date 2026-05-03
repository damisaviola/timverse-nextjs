"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  title: string;
  url?: string;
  variant?: "icon" | "full";
}

export default function ShareButton({ title, url, variant = "icon" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Baca berita ini: ${title}`,
          url: shareUrl,
        });
      } catch (err) {
        // Jika user membatalkan share, tidak perlu melakukan apa-apa
        if ((err as Error).name === "AbortError") return;
        
        // Jika ada error lain, fallback ke copy link
        copyToClipboard();
      }
    } else {
      // Fallback untuk desktop yang tidak support native share
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleShare}
        className={`flex items-center justify-center transition-all duration-300 border shadow-sm ${
          variant === "icon" 
            ? "p-2.5 rounded-xl bg-surface/50 border-border/40 text-secondary hover:border-accent/30 hover:text-accent"
            : "px-4 py-2.5 rounded-xl bg-surface/50 border-border/40 text-secondary hover:border-accent/30 hover:text-accent gap-2"
        }`}
        aria-label="Bagikan"
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Check size={18} className="text-emerald-500" />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Share2 size={18} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {variant === "full" && (
          <span className="text-xs font-black uppercase tracking-wider">
            {copied ? "Tersalin" : "Bagikan"}
          </span>
        )}
      </motion.button>

      {/* Mini Toast Feedback */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg shadow-lg whitespace-nowrap z-[100]"
          >
            Link berhasil disalin!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
