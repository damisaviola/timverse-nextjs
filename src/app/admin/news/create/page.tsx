"use client";

import { motion } from "framer-motion";
import { ChevronLeft, FilePlus } from "lucide-react";
import Link from "next/link";
import NewsForm from "@/components/admin/NewsForm";

export default function CreateNewsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-indigo-600 transition-colors w-fit group"
        >
          <div className="p-1.5 rounded-lg bg-surface-alt group-hover:bg-indigo-600/10 transition-colors">
            <ChevronLeft size={14} />
          </div>
          Kembali ke Dashboard
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 text-white">
              <FilePlus size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">Tambah Berita Baru</h1>
              <p className="text-sm text-secondary font-medium">Buat dan publikasikan artikel portal berita TIMVERSE.</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Mega Form */}
      <NewsForm />
    </div>
  );
}
