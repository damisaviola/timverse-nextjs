"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, AlertTriangle } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { useState } from "react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    await logout();
    // Redirect ditangani oleh server action
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[440px] bg-card border-t sm:border border-border/40 shadow-2xl rounded-t-[2.5rem] sm:rounded-[2rem] overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 hidden sm:block" />
            
            {/* Handle for mobile */}
            <div className="w-12 h-1.5 bg-border/40 rounded-full mx-auto mt-4 mb-2 sm:hidden" />

            <div className="p-6 sm:p-8 pt-2 sm:pt-8 relative z-10 text-center sm:text-left">
              {/* Close Button - hidden on mobile to encourage gesture or cancel button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-muted hover:text-foreground transition-colors hidden sm:block"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-5 sm:mb-6 mx-auto sm:mx-0">
                <LogOut size={28} className="sm:w-8 sm:h-8" />
              </div>

              {/* Text */}
              <div className="space-y-2 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Konfirmasi Keluar<span className="text-rose-500">.</span>
                </h3>
                <p className="text-xs sm:text-sm text-secondary font-medium leading-relaxed max-w-[90%] mx-auto sm:mx-0">
                  Apakah Anda yakin ingin keluar dari sesi Anda saat ini? Anda perlu masuk kembali untuk mengakses fitur akun.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="w-full bg-rose-500 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-black uppercase tracking-widest hover:bg-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? "Sedang Keluar..." : "Ya, Keluar Sekarang"}
                </button>
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="w-full bg-surface border border-border/40 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-black uppercase tracking-widest hover:bg-border/20 active:scale-[0.98] transition-all text-secondary"
                >
                  Batalkan
                </button>
              </div>
            </div>
            
            {/* Warning Footer */}
            <div className="bg-surface/50 border-t border-border/40 p-3 sm:p-4 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              <AlertTriangle size={12} className="text-amber-500 w-3 h-3 sm:w-4 sm:h-4" />
              Sesi Anda akan segera berakhir
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
