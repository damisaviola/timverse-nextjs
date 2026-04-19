"use client";

import Link from "next/link";
import { MoveLeft, Home, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-[80dvh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated 404 Text */}
        <div className="relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-indigo-500 to-indigo-700/20 select-none"
          >
            404
          </motion.h1>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pt-8"
          >
            <div className="w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4 relative z-10"
        >
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-secondary text-base leading-relaxed">
            Sepertinya Anda tersesat di dimensi berita yang salah. Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Home size={16} />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface-alt text-secondary border border-border px-8 py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-border transition-all active:scale-95"
          >
            <MoveLeft size={16} />
            Halaman Sebelumnya
          </button>
        </motion.div>

        {/* Search Suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-12 text-muted text-xs font-medium flex items-center justify-center gap-2"
        >
          <Search size={14} />
          <span>Coba gunakan fitur pencarian di navigasi utama</span>
        </motion.div>
      </div>
    </div>
  );
}
