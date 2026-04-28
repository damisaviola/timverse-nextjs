"use client";

import { motion } from "framer-motion";
import { User, Heart, MessageSquare, Settings, LogOut, Edit3, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { newsArticles } from "@/data/mockNews";
import NewsCard from "@/components/news/NewsCard";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { logout } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import LogoutModal from "@/components/auth/LogoutModal";

export default function UserHomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (data) {
          setProfile({
            ...data,
            email: session.user.email,
            avatar: data.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username || session.user.id}`,
            joined: new Date(data.updated_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
            })
          });
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  // Mock data for engagements (can be replaced with real data later)
  const likedNews = newsArticles.slice(0, 3);
  const commentedNews = [newsArticles[3], newsArticles[5]];
  const sharedNews = [newsArticles[1], newsArticles[7], newsArticles[9]];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 bg-card/50 p-6 sm:p-8 rounded-3xl border border-border">
            {/* Avatar Skeleton */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-surface animate-pulse" />
            
            {/* Info Skeleton */}
            <div className="flex-1 w-full space-y-4 text-center md:text-left mt-2">
              <div className="h-8 bg-surface rounded-xl w-3/4 mx-auto md:mx-0 animate-pulse" />
              <div className="h-4 bg-surface rounded-xl w-1/2 mx-auto md:mx-0 animate-pulse" />
              <div className="h-3 bg-surface rounded-xl w-1/3 mx-auto md:mx-0 animate-pulse" />
              
              {/* Stats Skeleton */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mt-6 pt-4 border-t border-border/40">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 sm:h-8 w-12 bg-surface rounded-xl mx-auto md:mx-0 animate-pulse" />
                    <div className="h-3 w-16 bg-surface rounded-xl animate-pulse" />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Skeleton */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="h-10 w-full md:w-32 bg-surface rounded-xl animate-pulse" />
              <div className="h-10 w-full md:w-32 bg-surface rounded-xl animate-pulse" />
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
          <div className="space-y-6">
            <div className="h-8 w-48 bg-surface rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-surface rounded-3xl animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!profile) return null; // Middleware handles redirection, but good to have fallback

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Profile Section */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-accent/5 rounded-full blur-[100px] -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 bg-card/50 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border shadow-sm"
        >
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-background shadow-xl bg-surface">
              <img 
                src={profile.avatar} 
                alt={profile.full_name || profile.username} 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-accent text-white rounded-full shadow-lg hover:scale-110 transition-transform">
              <Edit3 size={14} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 w-full text-center md:text-left space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Selamat datang, {profile.full_name || profile.username}!
            </h1>
            <p className="text-secondary text-sm font-medium">{profile.email}</p>
            <p className="text-muted text-xs">Bergabung sejak {profile.joined}</p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 mt-6 pt-4 border-t border-border/40">
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-black text-foreground">{likedNews.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center justify-center md:justify-start gap-1">
                  <Heart size={12} className="text-rose-500" /> Disukai
                </span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-black text-foreground">{commentedNews.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center justify-center md:justify-start gap-1">
                  <MessageSquare size={12} className="text-blue-500" /> Dikomentari
                </span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-black text-foreground">{sharedNews.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center justify-center md:justify-start gap-1">
                  <Share2 size={12} className="text-emerald-500" /> Dibagikan
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 text-foreground border border-border px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm">
              <Settings size={16} /> Pengaturan
            </button>
            <button 
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </motion.div>
      </section>

      {/* Logout Modal */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />

      {/* Content Sections */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Liked News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Heart className="text-rose-500" size={24} fill="currentColor" />
              Berita yang Disukai
            </h2>
            <Link href="#" className="text-xs font-bold text-accent hover:underline uppercase tracking-wider">
              Lihat Semua
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedNews.map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </motion.div>

        {/* Commented News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <MessageSquare className="text-blue-500" size={24} fill="currentColor" />
              Berita yang Dikomentari
            </h2>
            <Link href="#" className="text-xs font-bold text-accent hover:underline uppercase tracking-wider">
              Lihat Semua
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commentedNews.map((article, index) => (
              <div key={article.id} className="relative group">
                 <NewsCard article={article} index={index} variant="compact" />
                 {/* Mock Comment Bubble */}
                 <div className="absolute -bottom-4 right-4 bg-surface border border-border shadow-lg rounded-2xl rounded-tr-sm p-3 max-w-[80%] z-10 opacity-90 group-hover:opacity-100 transition-opacity">
                    <p className="text-[11px] text-secondary line-clamp-2 italic">
                      "Sangat setuju dengan artikel ini, informasinya sangat membantu!"
                    </p>
                 </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shared News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
              <Share2 className="text-emerald-500" size={24} />
              Berita yang Dibagikan
            </h2>
            <Link href="#" className="text-xs font-bold text-accent hover:underline uppercase tracking-wider">
              Lihat Semua
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedNews.map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} variant="compact" />
            ))}
          </div>
        </motion.div>

      </section>
    </div>
  );
}
