"use client";

import { motion } from "framer-motion";
import { 
  AlertCircle, Send, ShieldCheck, Mail, 
  MessageSquare, FileText, CheckCircle2, 
  ChevronRight, ArrowLeft 
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function UserReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border/60 rounded-[2.5rem] p-12 max-w-lg w-full text-center shadow-2xl shadow-emerald-500/5"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-8 ring-8 ring-emerald-500/5">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Laporan Terkirim!</h2>
          <p className="text-secondary mt-4 leading-relaxed font-medium">
            Terima kasih telah membantu kami menjadi lebih baik. Tim teknis dan redaksi kami akan segera meninjau laporan Anda.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            <Link 
              href="/"
              className="w-full py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all shadow-lg shadow-accent/20"
            >
              Kembali ke Beranda
            </Link>
            <button 
              onClick={() => setSubmitted(false)}
              className="text-xs font-bold text-muted hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Kirim Laporan Lain
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16" id="report-page">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Header Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <AlertCircle size={14} />
              Pusat Pengaduan
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-[1.1]">
              Ada Masalah dengan <span className="text-accent underline decoration-accent/20">TIMVERSE?</span>
            </h1>
            <p className="text-secondary mt-6 leading-relaxed font-medium">
              Laporkan bug, kesalahan penulisan, atau konten yang tidak sesuai. Kami menghargai setiap masukan Anda.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-surface-alt/40 border border-border/60 rounded-[1.5rem] space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Kendalitas Data</h3>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">Semua laporan akan diproses secara anonim dan aman oleh tim kepatuhan kami.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Respon Cepat</h3>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">Kami berkomitmen merespon laporan kritis dalam waktu kurang dari 24 jam.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border/60 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Jenis Laporan</label>
                  <select className="w-full bg-surface-alt/40 border border-border/60 rounded-xl px-5 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer">
                    <option>Pilih jenis laporan...</option>
                    <option>Bug/Masalah Teknis</option>
                    <option>Typo/Kesalahan Penulisan</option>
                    <option>Konten Tidak Sesuai</option>
                    <option>Saran & Masukan</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Email (Optional)</label>
                  <input 
                    type="email" 
                    placeholder="nama@email.com" 
                    className="w-full bg-surface-alt/40 border border-border/60 rounded-xl px-5 py-3.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Deskripsi Masalah</label>
                <textarea 
                  rows={5}
                  placeholder="Ceritakan detail masalah atau masukan Anda..."
                  className="w-full bg-surface-alt/40 border border-border/60 rounded-2xl px-5 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Lampiran Gambar (Optional)</label>
                <div className="border-2 border-dashed border-border/60 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-accent/40 transition-colors cursor-pointer group">
                  <FileText className="text-muted group-hover:text-accent transition-colors mb-2" size={24} />
                  <p className="text-[10px] font-bold text-muted group-hover:text-foreground transition-colors uppercase tracking-widest text-center">Tarik gambar atau klik untuk upload bukti</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-foreground text-card rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/5 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} strokeWidth={2.5} />
                      Kirim Laporan
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
