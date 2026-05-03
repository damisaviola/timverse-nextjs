"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2, Save, User, Phone, AtSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/app/profile/actions";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onUpdate: (newProfile: any) => void;
}

export default function ProfileEditModal({ isOpen, onClose, profile, onUpdate }: ProfileEditModalProps) {
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Avatar upload disabled by user request
    return;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("username", username);
    formData.append("phone_number", phoneNumber);
    formData.append("avatar_url", avatarUrl);

    const result = await updateProfile(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else {
      onUpdate({
        ...profile,
        full_name: fullName,
        username: username,
        phone_number: phoneNumber,
        avatar_url: avatarUrl,
        avatar: avatarUrl || profile.avatar // Fallback to dicebear if empty
      });
      setIsSubmitting(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Content / Bottom Sheet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 100 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
          }}
          exit={{ opacity: 0, scale: 0.95, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full sm:max-w-lg bg-card border-x border-t sm:border border-border shadow-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden self-end sm:self-center"
        >
          {/* Mobile Handle */}
          <div className="w-12 h-1.5 bg-border/60 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface/50">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">Edit Profil</h2>
              <p className="text-[10px] sm:text-xs text-secondary mt-0.5">Perbarui informasi diri Anda.</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-full transition-colors text-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Avatar Edit */}
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-background shadow-xl bg-surface relative">
                  <img 
                    src={avatarUrl || profile.avatar} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Foto profil bersifat permanen</p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Nama Lengkap</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full bg-surface border border-border/60 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Username</label>
                <div className="relative group opacity-60 grayscale-[0.5]">
                  <AtSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={username}
                    disabled
                    className="w-full bg-surface border border-border/60 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-muted cursor-not-allowed"
                  />
                </div>
                <p className="text-[9px] text-muted ml-1 italic">* Username tidak dapat diubah setelah pendaftaran.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Nomor Telepon</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0812xxxx"
                    className="w-full bg-surface border border-border/60 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-2xl border border-border text-xs font-black uppercase tracking-widest text-secondary hover:bg-surface transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex-[1.5] flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-accent-dark transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
