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
import ProfileEditModal from "@/components/profile/ProfileEditModal";

export default function UserHomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [likedArticles, setLikedArticles] = useState<any[]>([]);
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [commentedArticles, setCommentedArticles] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"liked" | "saved" | "commented">("liked");
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
      <div className="min-h-screen bg-background pb-20 animate-pulse">
        {/* Header Profile Skeleton with Cover Banner */}
        <section className="relative w-full max-w-7xl mx-auto">
          {/* Cover Banner Skeleton */}
          <div className="h-40 sm:h-56 md:h-64 w-full bg-surface rounded-b-[2rem] sm:rounded-b-[3rem]" />

          {/* Profile Info Container Skeleton */}
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto -mt-16 sm:-mt-24 relative z-10 mb-8">
            <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-border/50 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                {/* Avatar Skeleton */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-card bg-surface-alt shrink-0 -mt-12 sm:-mt-16" />

                {/* User Info Skeleton */}
                <div className="flex-1 w-full text-center sm:text-left space-y-3 mt-4 sm:mt-0">
                  <div className="h-8 bg-surface-alt rounded-xl w-3/4 mx-auto sm:mx-0" />
                  <div className="h-4 bg-surface-alt rounded-lg w-1/2 mx-auto sm:mx-0" />
                  <div className="h-3 bg-surface-alt rounded-lg w-1/3 mx-auto sm:mx-0" />
                </div>

                {/* Actions Skeleton */}
                <div className="flex w-full sm:w-auto gap-2 mt-4 sm:mt-0">
                  <div className="flex-1 sm:w-28 h-10 bg-surface-alt rounded-xl" />
                  <div className="w-12 h-10 bg-surface-alt rounded-xl" />
                </div>
              </div>

              {/* Stats Row Skeleton */}
              <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-12 mt-8 pt-6 border-t border-border/40">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col items-center sm:items-start space-y-2">
                    <div className="h-8 w-10 sm:w-12 bg-surface-alt rounded-xl" />
                    <div className="h-3 w-14 sm:w-16 bg-surface-alt rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation Skeleton */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-8">
          <div className="h-[52px] bg-surface/50 rounded-2xl border border-border/40" />
        </section>

        {/* Content Skeleton */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-surface-alt rounded-3xl" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!profile) return null; // Middleware handles redirection, but good to have fallback

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Profile Section with Cover Banner */}
      <section className="relative w-full max-w-7xl mx-auto">
        {/* Cover Banner */}
        <div className="h-40 sm:h-56 md:h-64 w-full relative rounded-b-[2rem] sm:rounded-b-[3rem] overflow-hidden">
          {/* Default Gradient Cover */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-primary/30 to-blue-500/20" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>

        {/* Profile Info Container */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto -mt-16 sm:-mt-24 relative z-10 mb-8">
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-border/50 shadow-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-card shadow-lg bg-surface shrink-0 -mt-12 sm:-mt-16">
                <img 
                  src={profile.avatar} 
                  alt={profile.full_name || profile.username} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-secondary text-sm font-medium mt-1">{profile.email}</p>
                <p className="text-muted text-xs mt-1">Bergabung sejak {profile.joined}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-surface hover:bg-surface/80 text-foreground border border-border px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <Settings size={16} /> <span className="sm:hidden">Edit</span><span className="hidden sm:inline">Edit Profil</span>
                </button>
                <button 
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="flex-none flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                  aria-label="Keluar"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-around sm:justify-start gap-4 sm:gap-12 mt-8 pt-6 border-t border-border/40">
              <div className="text-center sm:text-left flex flex-col items-center sm:items-start cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('liked')}>
                <span className="text-2xl font-black text-foreground">{likedArticles.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center gap-1 mt-1">
                  <Heart size={12} className="text-rose-500" /> Disukai
                </span>
              </div>
              <div className="text-center sm:text-left flex flex-col items-center sm:items-start cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('saved')}>
                <span className="text-2xl font-black text-foreground">{savedArticles.length}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center gap-1 mt-1">
                  <Bookmark size={12} className="text-blue-500" /> Disimpan
                </span>
              </div>
              <div className="text-center sm:text-left flex flex-col items-center sm:items-start cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('commented')}>
                <span className="text-2xl font-black text-foreground">{commentCount}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted font-bold flex items-center gap-1 mt-1">
                  <MessageSquare size={12} className="text-emerald-500" /> Komentar
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
      />

      {/* Edit Profile Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onUpdate={(newProfile) => setProfile(newProfile)}
      />

      {/* Tab Navigation */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-8">
        <div className="flex items-center p-1.5 bg-surface/50 rounded-2xl border border-border/40 shadow-sm overflow-hidden">
          <button
            onClick={() => setActiveTab("liked")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === "liked" 
                ? "bg-card text-rose-500 shadow-md ring-1 ring-border/50" 
                : "text-secondary hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Heart size={16} fill={activeTab === "liked" ? "currentColor" : "none"} /> 
              <span className="hidden sm:inline">Berita Disukai</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === "saved" 
                ? "bg-card text-blue-500 shadow-md ring-1 ring-border/50" 
                : "text-secondary hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Bookmark size={16} fill={activeTab === "saved" ? "currentColor" : "none"} /> 
              <span className="hidden sm:inline">Disimpan</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab("commented")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === "commented" 
                ? "bg-card text-emerald-500 shadow-md ring-1 ring-border/50" 
                : "text-secondary hover:text-foreground hover:bg-surface/80"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <MessageSquare size={16} fill={activeTab === "commented" ? "currentColor" : "none"} /> 
              <span className="hidden sm:inline">Komentar</span>
            </span>
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[40vh]">
        
        {/* Liked Tab */}
        {activeTab === "liked" && (
          <motion.div
            key="tab-liked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {likedArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {likedArticles.map((article, index) => (
                  <NewsCard key={article.id} article={article} index={index} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-surface/30 rounded-3xl border border-dashed border-border/60">
                <Heart size={32} className="text-muted mx-auto mb-4 opacity-50" />
                <p className="text-secondary font-medium text-sm">Belum ada berita yang disukai.</p>
                <Link href="/" className="text-accent hover:underline text-xs font-bold mt-2 inline-block">Jelajahi Berita Sekarang</Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Saved Tab */}
        {activeTab === "saved" && (
          <motion.div
            key="tab-saved"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {savedArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {savedArticles.map((article, index) => (
                  <NewsCard key={article.id} article={article} index={index} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-surface/30 rounded-3xl border border-dashed border-border/60">
                <Bookmark size={32} className="text-muted mx-auto mb-4 opacity-50" />
                <p className="text-secondary font-medium text-sm">Belum ada berita yang disimpan.</p>
                <Link href="/" className="text-accent hover:underline text-xs font-bold mt-2 inline-block">Simpan Artikel Favorit</Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Commented Tab */}
        {activeTab === "commented" && (
          <motion.div
            key="tab-commented"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {commentedArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                {commentedArticles.map((article, index) => (
                  <div key={article.id} className="relative group">
                     <NewsCard article={article} index={index} variant="compact" />
                     {/* Comment Bubble */}
                     <div className="absolute -bottom-6 right-4 left-4 sm:right-6 sm:left-6 bg-surface/95 backdrop-blur-md border border-border shadow-lg rounded-2xl p-3 z-10 opacity-100 transition-transform hover:-translate-y-1 group-hover:border-accent/40">
                        <p className="text-[11px] text-secondary line-clamp-2 italic font-medium leading-relaxed">
                          "{article.userComment}"
                        </p>
                        <div className="absolute -top-2 left-6 w-4 h-4 bg-surface/95 border-l border-t border-border rotate-45 -z-10 group-hover:border-accent/40" />
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-surface/30 rounded-3xl border border-dashed border-border/60">
                <MessageSquare size={32} className="text-muted mx-auto mb-4 opacity-50" />
                <p className="text-secondary font-medium text-sm">Belum ada komentar.</p>
                <Link href="/" className="text-accent hover:underline text-xs font-bold mt-2 inline-block">Mulai Berdiskusi</Link>
              </div>
            )}
          </motion.div>
        )}

      </section>
    </div>
  );
}
