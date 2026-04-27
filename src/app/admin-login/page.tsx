"use client";

import Link from "next/link";
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useActionState } from "react";
import { login } from "@/app/auth/actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await login(formData);
  }, null);

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Background Decor - Using indigo/violet to match admin theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-indigo-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-violet-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="w-full max-w-[440px] bg-card/80 backdrop-blur-2xl shadow-2xl border border-indigo-500/20 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left flex flex-col items-center sm:items-start">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 mb-4 sm:mb-6">
             <ShieldCheck size={24} />
           </div>
           <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground mb-2">
             Portal Admin<span className="text-indigo-500">.</span>
           </h2>
           <p className="text-sm text-secondary font-medium leading-relaxed text-center sm:text-left">
             Akses khusus untuk staf dan pengelola TIMVERSE.
           </p>
        </div>

        {/* Error Message */}
        {state?.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {state.error}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Email Admin</label>
            <div className="relative group">
               <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 name="email"
                 type="email"
                 placeholder="admin@timverse.id"
                 required
                 disabled={isPending}
                 className="w-full bg-surface/50 border border-border/40 rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-muted/40 shadow-sm disabled:opacity-50"
               />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">Kata Sandi</label>
            <div className="relative group">
               <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 name="password"
                 type="password"
                 placeholder="Masukkan sandi admin"
                 required
                 disabled={isPending}
                 className="w-full bg-surface/50 border border-border/40 rounded-xl py-3 sm:py-3.5 pl-10 sm:pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all placeholder:text-muted/40 shadow-sm disabled:opacity-50"
               />
            </div>
            <div className="flex justify-end">
              <Link href="#" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline px-1">Lupa Sandi?</Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-between bg-indigo-600 text-white px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all group shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                Sedang Memproses...
                <Loader2 size={16} className="animate-spin" />
              </>
            ) : (
              <>
                Masuk ke Dashboard
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 sm:mt-8 text-center text-sm text-secondary font-medium">
          Bukan admin?{" "}
          <Link href="/login" className="text-foreground font-black hover:text-indigo-500 transition-colors uppercase tracking-tighter text-xs">
            Masuk sebagai User
          </Link>
        </p>
      </div>
    </div>
  );
}
