"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  FileText, Eye, MessageSquare, TrendingUp, MoreHorizontal, 
  PenSquare, Trash2, ExternalLink, ChevronRight, Search, 
  ArrowUpDown, ChevronUp, ChevronDown, Filter, X, Loader2,
  AlertTriangle, RefreshCw
} from "lucide-react";
import { fetchNews, deleteNews } from "@/app/admin/news/actions";

// Type for news from Supabase
interface SupabaseNews {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  thumbnail_url: string | null;
  author: string;
  author_avatar: string | null;
  tags: string[];
  featured: boolean;
  views: number;
  created_at: string;
}

type SortKey = "title" | "category" | "created_at" | "views";

export default function AdminDashboardPage() {
  const [news, setNews] = useState<SupabaseNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "created_at",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const itemsPerPage = 5;

  // Fetch news from Supabase
  const loadNews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchNews();
      if (result.error) {
        setError(result.error);
      }
      setNews(result.data || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data berita.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Handle delete
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteNews(id);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        setNews(prev => prev.filter(n => n.id !== id));
      }
    } catch (err: any) {
      alert("Gagal menghapus berita: " + err.message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  // Sorting Logic
  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort Data
  const filteredAndSortedData = useMemo(() => {
    let result = [...news];

    // Search
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [news, searchTerm, sortConfig]);

  // Pagination Logic
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 on search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Dynamic stats
  const totalViews = news.reduce((sum, n) => sum + (n.views || 0), 0);
  const formatNumber = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const stats = [
    { label: "Total Artikel", value: news.length.toString(), icon: FileText, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-600/10", trend: `${news.length} berita aktif` },
    { label: "Total Views", value: formatNumber(totalViews), icon: Eye, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-600/10", trend: "Total semua berita" },
    { label: "Kategori", value: [...new Set(news.map(n => n.category))].length.toString(), icon: Filter, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-600/10", trend: "Kategori aktif" },
    { label: "Featured", value: news.filter(n => n.featured).length.toString(), icon: TrendingUp, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-600/10", trend: "Berita unggulan" },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-10" id="admin-dashboard">
      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">
                    {isLoading ? (
                      <span className="inline-block w-12 h-8 bg-surface-alt animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-1.5">
                <TrendingUp size={12} className="text-muted" />
                <span className="text-[11px] font-medium text-muted">
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* News Table */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-foreground underline decoration-indigo-500/30 underline-offset-8">Kelola Berita</h2>
              <button
                onClick={loadNews}
                disabled={isLoading}
                className="p-1.5 text-muted hover:text-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-all disabled:opacity-30"
                title="Refresh"
              >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative group w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Cari berita atau kategori..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-10 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
            {/* Error State */}
            {error && (
              <div className="px-6 py-4 bg-red-500/5 border-b border-red-500/10 flex items-center gap-3">
                <AlertTriangle size={16} className="text-red-500 shrink-0" />
                <p className="text-xs font-medium text-red-500">{error}</p>
                <button 
                  onClick={loadNews}
                  className="ml-auto text-xs font-bold text-red-500 hover:underline"
                >
                  Coba lagi
                </button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-surface-alt dark:bg-sidebar/50 border-b border-border/60">
                    <th 
                      onClick={() => handleSort("title")}
                      className="w-[45%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        Judul
                        {sortConfig.key === "title" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("category")}
                      className="w-[18%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        Kategori
                        {sortConfig.key === "category" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("views")}
                      className="w-[12%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors text-center"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Views
                        {sortConfig.key === "views" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("created_at")}
                      className="w-[13%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        Tanggal
                        {sortConfig.key === "created_at" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </div>
                    </th>
                    <th className="w-[12%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={`skeleton-${i}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-surface-alt animate-pulse shrink-0" />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-4 w-3/4 bg-surface-alt animate-pulse rounded-md" />
                              <div className="h-3 w-1/2 bg-surface-alt/50 animate-pulse rounded-md" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4"><div className="h-6 w-20 bg-surface-alt animate-pulse rounded-lg" /></td>
                        <td className="px-4 py-4"><div className="h-5 w-10 bg-surface-alt animate-pulse rounded-md mx-auto" /></td>
                        <td className="px-4 py-4"><div className="h-4 w-16 bg-surface-alt animate-pulse rounded-md" /></td>
                        <td className="px-4 py-4"><div className="h-7 w-16 bg-surface-alt animate-pulse rounded-lg mx-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((article) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={article.id} 
                        className="hover:bg-surface-alt/50 transition-colors group"
                      >
                        {/* Judul + Thumbnail */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            {article.thumbnail_url ? (
                              <img 
                                src={article.thumbnail_url} 
                                alt="" 
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-border/40 shadow-sm" 
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 shrink-0 flex items-center justify-center border border-border/40">
                                <FileText size={16} className="text-indigo-500/60" />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                                {article.title}
                              </span>
                              <span className="text-[11px] text-muted mt-0.5 truncate">
                                /{article.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-alt border border-border/60 text-[11px] font-bold text-secondary">
                            {article.category}
                          </span>
                        </td>

                        {/* Views */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-bold text-foreground tabular-nums">{formatNumber(article.views)}</span>
                            <span className="text-[10px] text-muted">views</span>
                          </div>
                        </td>

                        {/* Tanggal */}
                        <td className="px-4 py-4">
                          <span className="text-xs font-medium text-secondary">
                            {formatDate(article.created_at)}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {deleteConfirmId === article.id ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleDelete(article.id)}
                                  disabled={deletingId === article.id}
                                  className="w-8 h-8 flex items-center justify-center text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                  title="Konfirmasi Hapus"
                                >
                                  {deletingId === article.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Trash2 size={14} />
                                  )}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="w-8 h-8 flex items-center justify-center text-muted bg-surface-alt rounded-lg hover:bg-surface transition-colors"
                                  title="Batal"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <Link 
                                  href={`/article/${article.slug}`}
                                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-all"
                                  title="Lihat Artikel"
                                  target="_blank"
                                >
                                  <ExternalLink size={14} />
                                </Link>
                                <button 
                                  onClick={() => setDeleteConfirmId(article.id)}
                                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all" 
                                  title="Hapus Artikel"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          {searchTerm ? (
                            <>
                              <div className="w-14 h-14 rounded-2xl bg-surface-alt/50 flex items-center justify-center">
                                <Search size={24} className="text-muted" />
                              </div>
                              <p className="text-sm font-bold text-secondary">Tidak ada hasil ditemukan</p>
                              <p className="text-xs text-muted">Coba kata kunci yang berbeda</p>
                            </>
                          ) : (
                            <>
                              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                                <FileText size={24} className="text-indigo-500" />
                              </div>
                              <p className="text-sm font-bold text-secondary">Belum ada berita</p>
                              <Link 
                                href="/admin/news/create"
                                className="text-xs font-bold text-indigo-600 hover:underline mt-1"
                              >
                                Tulis berita pertama →
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {!isLoading && totalItems > 0 && (
              <div className="bg-surface-alt/50 dark:bg-sidebar/30 px-5 py-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted font-medium">
                  {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} berita
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-muted tabular-nums">Hal. {currentPage}/{totalPages || 1}</span>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-1.5 bg-card border border-border text-[11px] font-bold rounded-lg hover:bg-surface-alt transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3.5 py-1.5 bg-indigo-600 text-white border border-indigo-600 text-[11px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600/10 rounded-lg">
              <ExternalLink size={16} className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-foreground">Aksi Cepat</h2>
          </div>
          
          <div className="bg-card rounded-2xl border border-border/60 p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">Buat Berita Baru</h3>
              <p className="text-xs text-secondary mt-1">Publikasikan artikel terbaru Anda sekarang di halaman khusus.</p>
            </div>
            
            <Link 
              href="/admin/news/create"
              className="group flex items-center justify-between w-full bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
                  <PenSquare size={20} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-widest">Tulis Artikel</p>
                  <p className="text-[10px] opacity-70">Buka Editor Pro</p>
                </div>
              </div>
              <ChevronRight size={20} className="opacity-50 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="bg-indigo-600 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-sm font-bold">Butuh Bantuan?</h3>
              <p className="text-xs text-indigo-100 mt-1 opacity-90">Pelajari cara mengoptimalkan berita Anda agar menjangkau lebih banyak audiens.</p>
              <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-xl text-[11px] font-bold hover:bg-indigo-50 transition-colors shadow-sm">
                Buka Dokumentasi
              </button>
            </div>
            <FileText size={80} className="absolute -bottom-4 -right-4 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
