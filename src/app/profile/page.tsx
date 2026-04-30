"use client";

import { motion } from "framer-motion";
import { User, Heart, Bookmark, MessageSquare, Settings, LogOut, Edit3, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { newsArticles } from "@/data/mockNews";
import NewsCard from "@/components/news/NewsCard";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { userLogout } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import LogoutModal from "@/components/auth/LogoutModal";

export default function UserHomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [likedArticles, setLikedArticles] = useState<any[]>([]);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [commentedArticles, setCommentedArticles] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // 1. Fetch Profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          
          if (profileData) {
            setProfile({
              ...profileData,
              email: session.user.email,
              avatar: profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.username || session.user.id}`,
              joined: new Date(profileData.updated_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
              })
            });
          }

          // 2. Fetch Liked Articles
          const { data: likedData } = await supabase
            .from("likes")
            .select("news(*)")
            .eq("user_id", session.user.id);
          
          if (likedData) {
            setLikedArticles(likedData.map((item: any) => item.news).filter(Boolean));
          }

          // 3. Fetch Saved Articles
          const { data: savedData } = await supabase
            .from("saved_news")
            .select("news(*)")
            .eq("user_id", session.user.id);
          
          if (savedData) {
            setSavedArticles(savedData.map((item: any) => item.news).filter(Boolean));
          }

          // 4. Fetch Commented Articles with Comment Content
          const { data: commentData } = await supabase
            .from("comments")
            .select("content, news(*)")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });
          
          if (commentData) {
            // Kita gunakan Map untuk memastikan satu berita hanya muncul sekali (komentar terbaru)
            const uniqueArticles = new Map();
            commentData.forEach((item: any) => {
              if (item.news && !uniqueArticles.has(item.news.id)) {
                uniqueArticles.set(item.news.id, {
                  ...item.news,
                  userComment: item.content
                });
              }
            });
            setCommentedArticles(Array.from(uniqueArticles.values()));
          }

          // 5. Fetch Comment Count
          const { count } = await supabase
            .from("comments")
            .select("*", { count: 'exact', head: true })
            .eq("user_id", session.user.id);
          
          setCommentCount(count || 0);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [supabase]);

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
                <span className="block text-xl sm:text-2xl font-black text-foreground">{likedArticles.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center justify-center md:justify-start gap-1">
                  <Heart size={12} className="text-rose-500" /> Disukai
                </span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-black text-foreground">{savedArticles.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center justify-center md:justify-start gap-1">
                  <Bookmark size={12} className="text-blue-500" /> Disimpan
                </span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl sm:text-2xl font-black text-foreground">{commentCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center justify-center md:justify-start gap-1">
                  <MessageSquare size={12} className="text-emerald-500" /> Komentar
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
        {likedArticles.length > 0 && (
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
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedArticles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Saved News */}
        {savedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Bookmark className="text-blue-500" size={24} fill="currentColor" />
                Berita yang Disimpan
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedArticles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} variant="compact" />
              ))}
            </div>
          </motion.div>
        )}

        {/* Commented News */}
        {commentedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <MessageSquare className="text-emerald-500" size={24} fill="currentColor" />
                Berita yang Dikomentari
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {commentedArticles.map((article, index) => (
                <div key={article.id} className="relative group mb-4">
                   <NewsCard article={article} index={index} variant="compact" />
                   {/* Real Comment Bubble */}
                   <div className="absolute -bottom-5 right-2 left-2 sm:left-auto sm:right-4 bg-surface/90 backdrop-blur-md border border-border shadow-xl rounded-2xl p-3 z-10 opacity-90 group-hover:opacity-100 transition-all group-hover:-translate-y-1">
                      <p className="text-[11px] text-secondary line-clamp-2 italic font-medium leading-relaxed">
                        "{article.userComment}"
                      </p>
                      <div className="absolute -top-2 right-6 w-4 h-4 bg-surface border-l border-t border-border rotate-45 -z-10" />
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {likedArticles.length === 0 && savedArticles.length === 0 && commentedArticles.length === 0 && (
          <div className="text-center py-20 bg-card/30 rounded-3xl border border-dashed border-border">
            <p className="text-secondary font-medium">Belum ada aktivitas berita.</p>
            <Link href="/" className="text-accent hover:underline text-sm font-bold mt-2 inline-block">
              Jelajahi Berita Sekarang
            </Link>
          </div>
        )}

      </section>
    </div>
  );
}
