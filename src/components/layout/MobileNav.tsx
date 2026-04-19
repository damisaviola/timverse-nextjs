"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutGrid, Search, Settings, X, TrendingUp, Clock, PenSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { newsArticles } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";

const tabs = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Kategori", href: "/category", icon: LayoutGrid },
  { label: "Laporan", href: "/report", icon: AlertCircle },
  { label: "Kontribusi", href: "/contribute", icon: PenSquare },
  { label: "Cari", href: "#search", icon: Search },
];

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (href: string) => {
    if (href === "#search") return isSearchOpen;
    if (href === "/") return pathname === "/" && !isSearchOpen;
    return pathname.startsWith(href) && !isSearchOpen;
  };

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Lock body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
  }, []);

  // Filter articles based on search query
  const filteredArticles = searchQuery.trim().length > 1
    ? newsArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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

  return (
    <>
      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden flex flex-col bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="mobile-search-overlay"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3 border-b border-border">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Cari berita, topik, kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-surface border border-border pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                  id="mobile-search-input"
                />
              </div>
              <button
                onClick={closeSearch}
                className="p-2.5 rounded-xl bg-surface border border-border text-secondary hover:text-foreground transition-colors"
                aria-label="Tutup pencarian"
                id="close-search-btn"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Results / Suggestions */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
              {searchQuery.trim().length < 2 ? (
                /* Suggestions when no search */
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp size={14} className="text-accent" />
                    <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                      Trending
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Teknologi", "AI Generatif", "Startup", "Timnas", "Sains", "Esports"].map(
                      (tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="px-3.5 py-2 bg-surface border border-border rounded-full text-xs font-medium text-secondary hover:text-foreground hover:border-accent/30 transition-all"
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>

                  {/* Recent articles preview */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-accent" />
                      <span className="text-xs font-semibold text-secondary uppercase tracking-wider">
                        Terbaru
                      </span>
                    </div>
                    {newsArticles.slice(0, 4).map((article) => (
                      <button
                        key={article.id}
                        onClick={() => handleArticleClick(article.slug)}
                        className="w-full flex gap-3 py-3 border-b border-border-light text-left hover:bg-surface/50 transition-colors"
                      >
                        <div
                          className="flex-shrink-0 w-14 h-14 rounded-xl"
                          style={{ background: article.imageGradient }}
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                            {article.category}
                          </span>
                          <p className="text-sm font-medium text-foreground line-clamp-2 mt-0.5 leading-snug">
                            {article.title}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredArticles.length > 0 ? (
                /* Search Results */
                <div>
                  <p className="text-xs text-secondary mb-3">
                    {filteredArticles.length} hasil ditemukan
                  </p>
                  {filteredArticles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => handleArticleClick(article.slug)}
                      className="w-full flex gap-3 py-3 border-b border-border-light text-left hover:bg-surface/50 transition-colors"
                    >
                      <div
                        className="flex-shrink-0 w-16 h-16 rounded-xl"
                        style={{ background: article.imageGradient }}
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                          {article.category}
                        </span>
                        <p className="text-sm font-medium text-foreground line-clamp-2 mt-0.5 leading-snug">
                          {article.title}
                        </p>
                        <span className="text-[11px] text-muted mt-1">
                          {formatDate(article.date)} · {article.readTime}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* No results */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-4">
                    <Search size={24} className="text-muted" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Tidak ada hasil</p>
                  <p className="text-xs text-secondary mt-1">
                    Coba kata kunci lain atau periksa ejaan
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Tab Bar */}
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
                onClick={(e) => handleTabClick(tab.href, e)}
                className="relative flex flex-col items-center justify-center flex-1 py-1.5 group"
                id={`mobile-tab-${tab.label.toLowerCase()}`}
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
                    className={`transition-colors duration-200 ${
                      active
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
                  className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                    active
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
