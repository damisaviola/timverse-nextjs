"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Trash2,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  X,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Send,
  Archive,
  ArrowLeft,
  PenSquare
} from "lucide-react";
import { fetchNews, deleteNews, publishNews } from "@/app/admin/news/actions";

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
  status: "draft" | "published";
}

type SortKey = "title" | "category" | "created_at";

export default function AdminDraftsPage() {
  const searchParams = useSearchParams();
  const [drafts, setDrafts] = useState<SupabaseNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "created_at",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const itemsPerPage = 8;

  // Fetch only drafts from Supabase
  const loadDrafts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchNews({ onlyDrafts: true });
      if (result.error) {
        setError(result.error);
      }
      setDrafts((result.data as SupabaseNews[]) || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data draft berita.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  // Handle delete
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteNews(id);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        setDrafts(prev => prev.filter(n => n.id !== id));
      }
    } catch (err: any) {
      alert("Gagal menghapus berita: " + err.message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  // Handle publish
  const handlePublish = async (id: string) => {
    setPublishingId(id);
    try {
      const result = await publishNews(id);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        // Remove from drafts list since it's now published
        setDrafts(prev => prev.filter(n => n.id !== id));
      }
    } catch (err: any) {
      alert("Gagal menerbitkan berita: " + err.message);
    } finally {
      setPublishingId(null);
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
    let result = [...drafts];

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
  }, [drafts, searchTerm, sortConfig]);

  // Pagination Logic
  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="admin-drafts">
      {/* Header Mobile & Desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-surface hover:bg-surface-alt rounded-xl border border-border shadow-sm transition-colors text-muted hover:text-foreground shrink-0 active:scale-95">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2 tracking-tight">
              <Archive size={22} className="text-amber-500 shrink-0" />
              Draft Berita
            </h1>
            <p className="text-[11px] sm:text-sm text-secondary mt-1">
              Kelola tulisan yang belum dipublikasikan.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
          <button
            onClick={loadDrafts}
            disabled={isLoading}
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-surface text-foreground hover:bg-surface-alt border border-border rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 text-xs font-bold shadow-sm active:scale-95"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-indigo-500" : "text-muted"} />
            <span>Refresh</span>
          </button>
          
          <Link
            href="/admin/news/create"
            className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
          >
            <FileText size={14} />
            <span>Tulis Baru</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Toolbar: Search and Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/60 shadow-sm">
          <div className="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2 order-2 md:order-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            {isLoading ? "Memuat data draft..." : `${totalItems} Draft ditemukan`}
          </div>

          <div className="relative group w-full md:w-80 order-1 md:order-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Cari draft berita..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-surface border border-border/60 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-muted/60 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1 bg-surface-alt rounded-md transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="px-6 py-4 bg-red-500/5 rounded-2xl border border-red-500/20 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 shrink-0" />
            <p className="text-sm font-medium text-red-600 flex-1">{error}</p>
            <button
              onClick={loadDrafts}
              className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 hover:underline px-3 py-1 bg-red-500/10 rounded-lg transition-colors"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Content List Switcher */}
        {isLoading ? (
          /* Loading State */
          <div className="space-y-4">
            <div className="hidden md:block bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-surface-alt/50 border-b border-border/60">
                    <th className="w-[45%] px-5 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Judul</th>
                    <th className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Kategori</th>
                    <th className="w-[15%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Tanggal</th>
                    <th className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <tr key={`skeleton-desktop-${i}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-alt animate-pulse shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-surface-alt animate-pulse rounded-md" />
                            <div className="h-3 w-1/2 bg-surface-alt/60 animate-pulse rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><div className="h-6 w-24 bg-surface-alt animate-pulse rounded-lg" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-20 bg-surface-alt animate-pulse rounded-md" /></td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <div className="h-9 w-24 bg-surface-alt animate-pulse rounded-xl" />
                          <div className="h-9 w-9 bg-surface-alt animate-pulse rounded-xl" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Loading Card */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={`skeleton-mobile-${i}`} className="bg-card rounded-2xl border border-border/60 p-5 space-y-5">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-surface-alt animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-4 w-16 bg-surface-alt animate-pulse rounded-md" />
                      <div className="h-4 w-full bg-surface-alt animate-pulse rounded-md" />
                      <div className="h-4 w-2/3 bg-surface-alt animate-pulse rounded-md" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-10 flex-1 bg-surface-alt animate-pulse rounded-xl" />
                    <div className="h-10 w-12 bg-surface-alt animate-pulse rounded-xl shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : paginatedData.length > 0 ? (
          <>
            {/* DESKTOP TABLE VIEW (Visible md and up) */}
            <div className="hidden md:block bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-surface-alt/40 border-b border-border/60">
                    <th
                      onClick={() => handleSort("title")}
                      className="w-[45%] px-5 py-4 text-[11px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        Judul Berita
                        {sortConfig.key === "title" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-indigo-500" /> : <ChevronDown size={14} className="text-indigo-500" />
                        ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("category")}
                      className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        Kategori
                        {sortConfig.key === "category" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-indigo-500" /> : <ChevronDown size={14} className="text-indigo-500" />
                        ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("created_at")}
                      className="w-[15%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        Tanggal Dibuat
                        {sortConfig.key === "created_at" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-indigo-500" /> : <ChevronDown size={14} className="text-indigo-500" />
                        ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                      </div>
                    </th>
                    <th className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <AnimatePresence mode="popLayout">
                    {paginatedData.map((article) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        key={article.id}
                        className="hover:bg-surface/50 transition-colors group"
                      >
                        {/* Judul + Thumbnail */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            {article.thumbnail_url ? (
                              <div className="w-12 h-12 rounded-xl shrink-0 border border-border/40 shadow-sm overflow-hidden bg-surface-alt">
                                <img
                                  src={article.thumbnail_url}
                                  alt=""
                                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 shrink-0 flex items-center justify-center border border-border/40">
                                <FileText size={18} className="text-indigo-500/50" />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                                {article.title}
                              </span>
                              <span className="text-[11px] font-medium text-muted mt-1 truncate">
                                /{article.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-surface border border-border text-[11px] font-bold text-secondary uppercase tracking-wider">
                            {article.category}
                          </span>
                        </td>

                        {/* Tanggal */}
                        <td className="px-4 py-4">
                          <span className="text-xs font-semibold text-secondary">
                            {formatDate(article.created_at)}
                          </span>
                        </td>

                        {/* Aksi */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {deleteConfirmId === article.id ? (
                              <div className="flex items-center gap-2 w-full max-w-[200px]">
                                <button
                                  onClick={() => handleDelete(article.id)}
                                  disabled={deletingId === article.id}
                                  className="flex-1 h-9 flex items-center justify-center text-[11px] font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm shadow-red-600/20"
                                  title="Konfirmasi Hapus"
                                >
                                  {deletingId === article.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    "Ya, Hapus"
                                  )}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="h-9 px-3 flex items-center justify-center text-muted bg-surface-alt rounded-xl hover:bg-surface hover:text-foreground transition-colors border border-border"
                                  title="Batal"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handlePublish(article.id)}
                                  disabled={publishingId === article.id}
                                  className="h-9 px-4 flex items-center justify-center gap-2 text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white rounded-xl text-[11px] font-bold transition-all disabled:opacity-50 border border-emerald-500/20 hover:border-transparent shadow-sm"
                                  title="Terbitkan Draft Ini"
                                >
                                  {publishingId === article.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <>
                                      <Send size={14} />
                                      Terbitkan
                                    </>
                                  )}
                                </button>
                                <Link
                                  href={`/admin/news/edit/${article.id}`}
                                  className="h-9 w-9 flex items-center justify-center text-indigo-600 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-indigo-500/10 hover:border-transparent"
                                  title="Edit Draft"
                                >
                                  <PenSquare size={14} />
                                </Link>
                                <button
                                  onClick={() => setDeleteConfirmId(article.id)}
                                  className="h-9 w-9 flex items-center justify-center text-red-500 bg-red-500/10 hover:bg-red-600 hover:text-white rounded-xl transition-all border border-red-500/10 hover:border-transparent"
                                  title="Hapus Draft"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW (Visible below md) */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((article) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={article.id}
                    className="bg-card rounded-2xl border border-border/60 p-5 shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all group flex flex-col h-full"
                  >
                    <div className="flex gap-4 mb-4">
                      {article.thumbnail_url ? (
                        <div className="w-16 h-16 rounded-2xl shrink-0 border border-border/40 overflow-hidden bg-surface-alt">
                          <img
                            src={article.thumbnail_url}
                            alt=""
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 shrink-0 flex items-center justify-center border border-border/40">
                          <FileText size={20} className="text-indigo-500/50" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="mb-1.5 flex items-center gap-2">
                           <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-alt border border-border/60 text-[9px] font-black uppercase tracking-widest text-secondary">
                             {article.category}
                           </span>
                        </div>
                        <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-[10px] font-medium text-muted mt-1.5 flex items-center gap-1">
                          {formatDate(article.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/40">
                      {deleteConfirmId === article.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => handleDelete(article.id)}
                            disabled={deletingId === article.id}
                            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 shadow-sm shadow-red-600/20"
                          >
                            {deletingId === article.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <>
                                <Trash2 size={14} />
                                Ya, Hapus
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="flex-1 py-2.5 flex items-center justify-center text-xs font-bold text-muted bg-surface border border-border rounded-xl hover:bg-surface-alt hover:text-foreground transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => handlePublish(article.id)}
                            disabled={publishingId === article.id}
                            className="flex-1 py-2.5 bg-emerald-500/10 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 border border-emerald-500/20 hover:border-transparent shadow-sm"
                          >
                            {publishingId === article.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <>
                                <Send size={14} />
                                Terbitkan Draft
                              </>
                            )}
                          </button>
                          <Link
                            href={`/admin/news/edit/${article.id}`}
                            className="w-10 h-10 flex items-center justify-center text-indigo-600 bg-indigo-500/10 hover:bg-indigo-600 hover:text-white rounded-xl transition-all shrink-0 border border-indigo-500/10 hover:border-transparent"
                            title="Edit Draft"
                          >
                            <PenSquare size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmId(article.id)}
                            className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-500/10 hover:bg-red-600 hover:text-white rounded-xl transition-all shrink-0 border border-red-500/10 hover:border-transparent"
                            title="Hapus Draft"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SHARED PAGINATION FOOTER */}
            {!isLoading && totalItems > 0 && (
              <div className="bg-card rounded-2xl border border-border/60 px-5 py-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                <span className="text-[11px] text-muted font-bold text-center sm:text-left">
                  Menampilkan {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} dari total {totalItems} draft
                </span>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[11px] font-black text-muted tracking-widest uppercase">Hal. {currentPage} / {totalPages || 1}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-surface border border-border text-[11px] font-bold rounded-xl hover:bg-surface-alt hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 text-secondary"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-4 py-2 bg-indigo-600 text-white border border-indigo-600 text-[11px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-card border border-dashed border-border/80 rounded-3xl shadow-sm px-4">
            <div className="w-20 h-20 bg-amber-500/10 flex items-center justify-center mb-6 text-amber-500 rounded-[24px] shadow-inner">
              <Archive size={32} />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground mb-2">Keranjang Draft Kosong</h2>
            <p className="text-xs sm:text-sm text-secondary max-w-md mx-auto leading-relaxed text-center font-medium">
              Saat ini tidak ada berita yang disimpan sebagai draft. Silakan buat tulisan baru untuk menyimpannya di sini.
            </p>
            <Link
              href="/admin/news/create"
              className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
            >
              <FileText size={16} />
              Mulai Menulis Berita
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
