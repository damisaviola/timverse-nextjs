"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare, Trash2, ExternalLink, Search,
  ArrowUpDown, ChevronUp, ChevronDown, X, Loader2,
  AlertTriangle, RefreshCw, User, Calendar
} from "lucide-react";
import { fetchComments, deleteComment } from "./actions";
import AdminLoadingState from "@/components/admin/AdminLoadingState";

interface AdminComment {
  id: string;
  created_at: string;
  content: string;
  profiles: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  news: {
    title: string;
    slug: string;
  };
}

type SortKey = "username" | "news_title" | "created_at";

export default function AdminCommentsPage() {
  const searchParams = useSearchParams();
  const [comments, setComments] = useState<AdminComment[]>([]);
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
  const itemsPerPage = 6; // Matching dashboard feel

  // Sync with URL search params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchTerm(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchComments();
      if (result.error) {
        setError(result.error);
      } else {
        setComments((result.data as any) || []);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat data komentar.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteComment(id);
      if (result.error) {
        alert("Error: " + result.error);
      } else {
        setComments(prev => prev.filter(c => c.id !== id));
      }
    } catch (err: any) {
      alert("Gagal menghapus komentar: " + err.message);
    } finally {
      setDeletingId(null);
      setDeleteConfirmId(null);
    }
  };

  const handleSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...comments];

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.content.toLowerCase().includes(query) ||
          (c.profiles?.username?.toLowerCase() || "").includes(query) ||
          (c.profiles?.full_name?.toLowerCase() || "").includes(query) ||
          c.news.title.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      let aValue: any, bValue: any;

      if (sortConfig.key === "username") {
        aValue = (a.profiles?.username || a.profiles?.full_name || "").toLowerCase();
        bValue = (b.profiles?.username || b.profiles?.full_name || "").toLowerCase();
      } else if (sortConfig.key === "news_title") {
        aValue = a.news.title.toLowerCase();
        bValue = b.news.title.toLowerCase();
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [comments, searchTerm, sortConfig]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading && comments.length === 0) {
    return <AdminLoadingState type="table" count={8} />;
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground underline decoration-indigo-500/30 underline-offset-8">Moderasi Komentar</h2>
          <button
            onClick={loadComments}
            disabled={isLoading}
            className="p-1.5 text-muted hover:text-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-all disabled:opacity-30"
            title="Refresh"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Cari komentar, user, atau artikel..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-10 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
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
        {error && (
          <div className="px-6 py-4 bg-red-500/5 border-b border-red-500/10 flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
            <p className="text-xs font-medium text-red-500">{error}</p>
            <button onClick={loadComments} className="ml-auto text-xs font-bold text-red-500 hover:underline">Coba lagi</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-surface-alt dark:bg-sidebar/50 border-b border-border/60">
                <th
                  onClick={() => handleSort("username")}
                  className="w-[22%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Pengguna
                    {sortConfig.key === "username" ? (
                      sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    ) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </th>
                <th className="w-[40%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted">Konten Komentar</th>
                <th
                  onClick={() => handleSort("news_title")}
                  className="w-[20%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Artikel
                    {sortConfig.key === "news_title" ? (
                      sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    ) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("created_at")}
                  className="w-[10%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    Waktu
                    {sortConfig.key === "created_at" ? (
                      sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    ) : <ArrowUpDown size={12} className="opacity-30" />}
                  </div>
                </th>
                <th className="w-[8%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-alt animate-pulse shrink-0" />
                        <div className="h-4 w-20 bg-surface-alt animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="h-4 w-full bg-surface-alt animate-pulse rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-24 bg-surface-alt animate-pulse rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-surface-alt animate-pulse rounded" /></td>
                    <td className="px-4 py-4"><div className="h-7 w-8 bg-surface-alt animate-pulse rounded mx-auto" /></td>
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((comment) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={comment.id}
                    className="hover:bg-surface-alt/50 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {comment.profiles?.avatar_url ? (
                          <img src={comment.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover border border-border/40 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20 shrink-0">
                            <User size={14} />
                          </div>
                        )}
                        <span className="text-sm font-semibold text-foreground truncate">
                          {comment.profiles?.username || comment.profiles?.full_name || "Anonim"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                        {comment.content}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-foreground line-clamp-1 group-hover:text-indigo-600 transition-colors">{comment.news.title}</span>
                        <Link href={`/article/${comment.news.slug}`} target="_blank" className="text-[10px] text-muted hover:text-indigo-600 flex items-center gap-1 mt-1">
                          <ExternalLink size={10} /> Detail
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[11px] font-medium text-secondary whitespace-nowrap">
                        {formatDate(comment.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setDeleteConfirmId(comment.id)}
                          className="w-8 h-8 flex items-center justify-center text-muted hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Hapus Komentar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-muted text-sm font-medium">
                    Belum ada komentar untuk ditampilkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalItems > 0 && (
          <div className="bg-surface-alt/50 dark:bg-sidebar/30 px-5 py-3 border-t border-border/60 flex items-center justify-between">
            <span className="text-[11px] text-muted font-medium">
              {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} komentar
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold text-muted tabular-nums">Hal. {currentPage}/{totalPages || 1}</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 bg-card border border-border text-[11px] font-bold rounded-lg hover:bg-surface-alt transition-all disabled:opacity-30"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3.5 py-1.5 bg-indigo-600 text-white border border-indigo-600 text-[11px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pop-up Validation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-2">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Hapus Komentar?</h3>
                <p className="text-sm text-secondary mt-1 leading-relaxed">Tindakan ini tidak dapat dibatalkan. Komentar akan dihapus secara permanen dari artikel terkait.</p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-foreground bg-surface hover:bg-surface-alt transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                  disabled={!!deletingId}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Ya, Hapus"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
