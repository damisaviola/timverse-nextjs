"use client";

import { motion } from "framer-motion";
import { PenSquare, Info, ShieldCheck, Zap, Mail, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12" id="contribute-page">
      {/* Page Header */}
      <div className="max-w-3xl mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-4"
        >
          <PenSquare size={14} />
          Kontribusi Penulis
        </motion.div>
        
        <motion.h1 
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Bagikan Suara Anda Bersama <span className="text-accent underline decoration-accent/20">TIMVERSE.</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg text-secondary leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Jadilah bagian dari komunitas jurnalis warga kami. Tulis berita, artikel mendalam, atau opini yang menginspirasi pembaca di seluruh Indonesia.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Guidelines */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-surface rounded-2xl border border-border p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
              <Info size={18} className="text-accent" />
              Panduan Menulis
            </h2>
            <ul className="space-y-4">
              {[
                { title: "Verifikasi Data", desc: "Pastikan semua informasi yang Anda tulis telah terverifikasi dan bukan hoaks." },
                { title: "Gaya Bahasa", desc: "Gunakan bahasa Indonesia yang baik, benar, dan mudah dipahami sesuai PUEBI." },
                { title: "Originalitas", desc: "Berita harus karya asli dan bukan hasil duplikasi dari media lain." },
                { title: "Visual Menarik", desc: "Sertakan gambar berkualitas tinggi yang relevan dengan isi berita." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="text-xs text-secondary mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Benefits */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-accent/10 rounded-2xl p-6 border border-accent/20"
          >
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <Zap size={18} />
              Mengapa Menulis?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-accent mt-1" />
                <p className="text-sm text-secondary leading-snug">Nama Anda akan tercatat sebagai kontributor resmi dan meningkatkan portofolio kepenulisan.</p>
              </div>
              <div className="flex items-start gap-3">
                <Zap size={16} className="text-accent mt-1" />
                <p className="text-sm text-secondary leading-snug">Berita Anda akan dibaca oleh ribuan audiens aktif TIMVERSE di seluruh platform.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Email CTA */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-[2.5rem] border border-border/60 p-8 sm:p-12 shadow-sm flex flex-col items-center text-center space-y-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center text-accent ring-8 ring-accent/5">
              <Mail size={40} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-foreground tracking-tight">Kirim Melalui Email</h2>
              <p className="text-secondary leading-relaxed max-w-md mx-auto font-medium">
                Sistem pendaftaran dialihkan melalui email untuk proses kurasi yang lebih personal dan mendalam oleh tim redaksi kami.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-5 bg-surface-alt/40 border border-border/60 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block">Format Subjek</span>
                <p className="text-xs font-bold text-foreground leading-relaxed">
                  Kontribusi: [Judul Berita] [Kategori]
                </p>
              </div>
              <div className="p-5 bg-surface-alt/40 border border-border/60 rounded-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block">Lampiran</span>
                <p className="text-xs font-bold text-foreground leading-relaxed">
                  Naskah (Dokumen) & Foto Berita Original
                </p>
              </div>
            </div>

            <div className="w-full pt-6 border-t border-border/40">
              <a 
                href="mailto:redaksi@timverse.id?subject=Kontribusi Berita: [Isi Judul Di Sini]&body=Halo Tim Redaksi TIMVERSE,%0D%0A%0D%0ASaya ingin mengirimkan kontribusi berita saya.%0D%0A%0D%0AJudul: %0D%0AKategori: %0D%0AIsi Berita: %0D%0A[Silakan lampirkan foto dan file pendukung lainnya]%0D%0A%0D%0ATerima kasih."
                className="group flex items-center justify-center gap-4 w-full bg-accent text-white py-6 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent-dark transition-all shadow-xl shadow-accent/20 hover:-translate-y-1 active:translate-y-0"
              >
                <Mail size={18} strokeWidth={3} />
                Buka Email Sekarang
              </a>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-6 opacity-60">
                Respon maksimal dalam 2x24 jam hari kerja.
              </p>
            </div>

            {/* Support Info */}
            <div className="flex items-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-muted font-bold tracking-tight">KONTRIBUSI@TIMVERSE.ID</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
