"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutGrid, Search, Settings, X, TrendingUp, Clock, PenSquare, AlertCircle, Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { vibrateDevice } from "@/lib/vibrate";
import { searchNews } from "@/app/search/actions";

const tabs = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Laporan", href: "/report", icon: AlertCircle },
  { label: "Kategori", href: "/category", icon: LayoutGrid },
  { label: "Kontribusi", href: "/contribute", icon: Settings },
  { label: "Cari", href: "#search", icon: Search },
];

const TRENDING_TAGS = ["Teknologi", "Startup", "Timnas", "Investasi", "AI"];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) => {
    if (href === "#search") return isSearchOpen;
    if (href === "/") return pathname === "/" && !isSearchOpen;
    return pathname.startsWith(href) && !isSearchOpen;
  };

  // Debounced search — calls server action
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const result = await searchNews(searchQuery);
        setSearchResults(result || []);
      } catch (err) {
        console.error("Mobile search error:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchQuery]);

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSearchOpen]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  }, []);

  const handleTabClick = (href: string, e: React.MouseEvent) => {
    if (href === "#search") {
      e.preventDefault();
      setIsSearchOpen((prev) => !prev);
    } else {
      closeSearch();
    }
  };

  const handleArticleClick = (slug: string) => {
    closeSearch();
    router.push(`/article/${slug}`);
  };

  const handleSeeAllResults = () => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSeeAllResults();
  };

  return (
    <>
      {/* ─── Search Overlay ─── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 z-[110] md:hidden flex flex-col bg-background"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* ── Search Header ── */}
            <div className="flex items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3 border-b border-border bg-navbar/80 backdrop-blur-xl">
              <form onSubmit={handleFormSubmit} className="relative flex-1">
                {isSearching ? (
                  <Loader2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent animate-spin" />
                ) : (
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Cari berita terbaru..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-surface border border-border pl-10 pr-10 py-2.5 text-sm font-bold text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>
              <button
                onClick={closeSearch}
                className="p-2.5 rounded-full bg-surface border border-border text-secondary"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Results Area ── */}
            <div className="flex-1 overflow-y-auto px-4 pt-5 pb-28">
              {searchQuery.length < 2 ? (
                /* ── Suggestions (before search) ── */
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Trending Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Trending</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {TRENDING_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-4 py-2 bg-surface border border-border rounded-xl text-xs font-bold text-secondary active:scale-95 transition-transform"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Jelajahi</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: "Semua Kategori", href: "/category" },
                      { label: "Blog Terbaru", href: "/blog" },
                    ].map((link) => (
                      <button
                        key={link.href}
                        onClick={() => { closeSearch(); router.push(link.href); }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl text-left active:bg-surface transition-colors"
                      >
                        <span className="text-sm font-bold text-foreground">{link.label}</span>
                        <ChevronRight size={16} className="text-muted" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ── Real-time Results ── */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                      Hasil Pencarian
                    </p>
                    {!isSearching && hasSearched && (
                      <p className="text-[9px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        {searchResults.length} ditemukan
                      </p>
                    )}
                  </div>

                  {/* Loading State */}
                  {isSearching && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                      <Loader2 size={28} className="text-accent animate-spin" />
                      <p className="text-xs font-bold text-muted">Mencari...</p>
                    </div>
                  )}

                  {/* Results List */}
                  {!isSearching && searchResults.length > 0 && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {searchResults.map((article, index) => (
                        <motion.button
                          key={article.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleArticleClick(article.slug)}
                          className="w-full flex gap-4 p-3 rounded-2xl bg-surface/50 border border-border/40 text-left active:bg-surface transition-colors"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-background flex-shrink-0">
                            {article.thumbnail_url ? (
                              <img src={article.thumbnail_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                                <Search size={16} className="text-accent/30" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black text-accent uppercase tracking-wider">
                                {article.category}
                              </span>
                              {article.read_time && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <span className="text-[9px] font-bold text-muted">
                                    {article.read_time}
                                  </span>
                                </>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-tight">
                              {article.title}
                            </h4>
                          </div>
                        </motion.button>
                      ))}

                      {/* See All Button */}
                      <button
                        onClick={handleSeeAllResults}
                        className="w-full mt-4 p-4 bg-accent text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-accent/20 active:scale-95 transition-transform"
                      >
                        Lihat Semua Hasil
                        <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}

                  {/* Empty State */}
                  {!isSearching && hasSearched && searchResults.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mb-4">
                        <AlertCircle size={24} className="text-muted/40" />
                      </div>
                      <p className="text-sm font-bold text-foreground">Berita tidak ditemukan</p>
                      <p className="text-xs text-secondary mt-1 max-w-[240px]">
                        Coba kata kunci lain atau gunakan kata yang lebih umum.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom Tab Bar ─── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-navbar/95 backdrop-blur-xl backdrop-saturate-150"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        id="mobile-bottom-nav"
      >
        <div className="flex items-stretch justify-around h-[58px] px-1">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            const isSearch = tab.href === "#search";

            return (
              <Link
                key={tab.label}
                href={isSearch ? "#" : tab.href}
                onClick={(e) => {
                  vibrateDevice(5);
                  handleTabClick(tab.href, e);
                }}
                className="relative flex flex-col items-center justify-center flex-1 py-1.5 group"
                id={`mobile-tab-${tab.label.toLowerCase()}`}
                aria-label={`Navigasi ke ${tab.label}`}
                aria-current={active ? "page" : undefined}
              >
                {/* Active Pill Indicator */}
                {active && (
                  <motion.div
                    layoutId="mobile-tab-pill"
                    className="absolute top-1 inset-x-3 h-[3px] bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                {/* Icon Container */}
                <motion.div
                  animate={active ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative"
                >
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.5 : 1.8}
                    className={`transition-colors duration-200 ${active
                        ? "text-accent"
                        : "text-muted group-active:text-foreground"
                      }`}
                  />
                  {/* Search active glow */}
                  {isSearch && isSearchOpen && (
                    <motion.div
                      className="absolute -inset-1.5 bg-accent/15 rounded-full -z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 ${active
                      ? "text-accent"
                      : "text-muted group-active:text-foreground"
                    }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
