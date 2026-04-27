"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail as MailIcon, Lock as LockIcon, ArrowRight as ArrowRightIcon, User as UserIcon, ShieldCheck as ShieldCheckIcon } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-accent/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-secondary/15 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-[440px] bg-card/60 backdrop-blur-2xl shadow-2xl border border-border/40 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
           <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground mb-2">
             Buat Akun<span className="text-accent">.</span>
           </h2>
           <p className="text-sm text-secondary font-medium leading-relaxed">
             Mulai perjalanan Anda bersama TIMVERSE.
           </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
            <div className="relative group">
               <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
               <input 
                 type="text"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 placeholder="Nama lengkap Anda"
                 className="w-full bg-surface/50 border border-border/40 rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-muted/40 shadow-sm"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Email</label>
            <div className="relative group">
               <MailIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
               <input 
                 type="email"
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 placeholder="name@email.com"
                 className="w-full bg-surface/50 border border-border/40 rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-muted/40 shadow-sm"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Kata Sandi</label>
            <div className="relative group">
               <LockIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
               <input 
                 type="password"
                 value={formData.password}
                 onChange={(e) => setFormData({...formData, password: e.target.value})}
                 placeholder="Minimal 8 karakter"
                 className="w-full bg-surface/50 border border-border/40 rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-muted/40 shadow-sm"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Konfirmasi Sandi</label>
            <div className="relative group">
               <ShieldCheckIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
               <input 
                 type="password"
                 value={formData.confirmPassword}
                 onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                 placeholder="Ulangi kata sandi"
                 className="w-full bg-surface/50 border border-border/40 rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all placeholder:text-muted/40 shadow-sm"
               />
            </div>
          </div>

          <button className="w-full flex items-center justify-between bg-foreground text-card px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-accent hover:text-white transition-all group">
            Daftar Sekarang
            <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 sm:my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card/60 backdrop-blur-sm px-3 text-[10px] font-black text-muted uppercase tracking-widest">atau</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 bg-surface border border-border/40 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:border-accent/40 transition-all">
             <svg viewBox="0 0 24 24" width="16" height="16">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg>
             Google
          </button>
          <button className="flex items-center justify-center gap-2 bg-surface border border-border/40 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:border-accent/40 transition-all">
             <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-foreground">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
             </svg>
             GitHub
          </button>
        </div>

        {/* Footer */}
        <p className="mt-6 sm:mt-8 text-center text-sm text-secondary font-medium">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-accent font-black hover:underline uppercase tracking-tighter text-xs">
            Masuk Sini
          </Link>
        </p>
      </div>
    </div>
  );
}
