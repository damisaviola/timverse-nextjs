"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Loader2, X } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { ROUTES } from "@/lib/constants/routes";
import { searchNews, incrementSearchCount } from "@/app/search/actions";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Kategori", href: "/category" },
  { label: "Kontribusi", href: "/contribute" },
  { label: "Laporan", href: "/report" },
];

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Handle Search with Debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        setShowResults(true);
        try {
          const data = await searchNews(searchQuery);
          setSearchResults(data || []);
          
          // Otomatis tambah search count untuk hasil yang muncul
          if (data && data.length > 0) {
            await incrementSearchCount(data.map((r: any) => r.id));
          }
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("avatar_url, username, full_name")
          .eq("id", session.user.id)
          .single();
        
        setProfile({
          id: session.user.id,
          username: profileData?.username,
          avatar: profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData?.username || session.user.id}`
        });
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };
    
    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("avatar_url, username, full_name")
            .eq("id", session.user.id)
            .single();
          
          setProfile({
            id: session.user.id,
            username: profileData?.username,
            avatar: profileData?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData?.username || session.user.id}`
          });
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <header
      className="sticky top-0 z-[100] w-full border-b border-border/40 bg-navbar/80 backdrop-blur-xl"
      id="main-navbar"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-8">
          {/* Left Section (Logo & Nav Links) */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link href="/" className="flex-shrink-0 group flex items-center gap-2" id="navbar-logo">
              <h1 className="text-xl font-black tracking-tighter text-foreground">
                TIMVERSE<span className="text-accent">.</span>
              </h1>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors rounded-full"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions Section */}
          <div className="flex items-center gap-4">
            {/* Professional Search */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearchSubmit} className="relative group">
                {isSearching ? (
                  <Loader2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent animate-spin" />
                ) : (
                  <Search
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
                  />
                )}
                <input
                  type="text"
                  placeholder="Cari berita terbaru..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="w-48 xl:w-64 rounded-2xl bg-surface/50 border border-border/40 pl-11 pr-10 py-2.5 text-[11px] font-bold text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 focus:w-60 xl:focus:w-80 transition-all duration-500"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Quick Results Dropdown */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-3 right-0 w-[400px] bg-card border border-border/60 shadow-2xl rounded-[1.5rem] overflow-hidden z-[100]"
                  >
                    <div className="p-4 bg-surface-alt/50 border-b border-border/40">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted flex items-center justify-between">
                        Hasil Pencarian Kilat
                        <span className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full lowercase">
                          {searchResults.length} hasil
                        </span>
                      </h3>
                    </div>
                    
                    <div className="max-h-[350px] overflow-y-auto p-2">
                      {searchResults.length > 0 ? (
                        searchResults.map((article) => (
                          <Link
                            key={article.id}
                            href={`/article/${article.slug}`}
                            onClick={() => setShowResults(false)}
                            className="flex gap-4 p-3 rounded-xl hover:bg-surface-alt transition-all group"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                              {article.thumbnail_url ? (
                                <img src={article.thumbnail_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-accent/10" />
                              )}
                            </div>
                            <div className="flex flex-col justify-center gap-1">
                              <span className="text-[9px] font-black uppercase text-accent tracking-wider">{article.category}</span>
                              <h4 className="text-[11px] font-bold text-foreground line-clamp-2 leading-tight group-hover:text-accent transition-colors">{article.title}</h4>
                            </div>
                          </Link>
                        ))
                      ) : !isSearching && searchQuery.length >= 2 ? (
                        <div className="py-12 text-center">
                          <p className="text-[11px] font-bold text-muted">Tidak ada hasil ditemukan.</p>
                        </div>
                      ) : null}
                    </div>

                    {searchResults.length > 0 && (
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full p-3 bg-surface-alt/80 border-t border-border/40 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-accent transition-colors"
                      >
                        Lihat Semua Hasil
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-border/40 hidden md:block mx-2" />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {!isLoading && (
                profile ? (
                  <Link 
                    href="/profile"
                    className="relative group flex-shrink-0 ml-1"
                    id="user-profile-link"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-border/40 group-hover:border-accent/60 transition-all shadow-sm bg-surface flex items-center justify-center group-hover:scale-105 active:scale-95 duration-300">
                      <img 
                        src={profile.avatar} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </Link>
                ) : (
                  <Link 
                    href="/login"
                    className="p-2.5 rounded-xl bg-surface border border-border/40 text-secondary shadow-sm hover:border-accent/40 hover:text-accent transition-all active:scale-95 ml-1"
                    id="login-link"
                  >
                    <User size={18} />
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for results */}
      {showResults && (
        <div 
          className="fixed inset-0 z-[-1] bg-transparent"
          onClick={() => setShowResults(false)}
        />
      )}
    </header>
  );
}
