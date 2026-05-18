"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Users, Search, X, Loader2, AlertTriangle, RefreshCw, ChevronUp, ChevronDown, ArrowUpDown, Shield, User, Clock, CalendarDays, ChevronLeft,
  Mail, Phone, Eye, MessageSquare, Heart, Info, ClipboardCheck, Clipboard, Activity
} from "lucide-react";
import { fetchMonitorUsers, fetchUserStats, fetchUserLikes, fetchUserComments } from "./actions";

interface MonitorUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: "admin" | "user";
  created_at: string;
  last_sign_in_at: string | null;
  phone_number: string | null;
}

interface UserStats {
  commentsCount: number;
  likesCount: number;
  reportsCount: number;
}

type SortKey = "full_name" | "email" | "role" | "created_at" | "last_sign_in_at";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<MonitorUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "created_at",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal & Stats State
  const [selectedUser, setSelectedUser] = useState<MonitorUser | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expanded Tab Details
  const [activeTab, setActiveTab] = useState<"none" | "comments" | "likes">("none");
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [likesList, setLikesList] = useState<any[]>([]);
  const [isLoadingTabDetails, setIsLoadingTabDetails] = useState(false);
  const [tabError, setTabError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchMonitorUsers();
      if (result.error) {
        setError(result.error);
      }
      setUsers((result.data as MonitorUser[]) || []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data pengguna.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Load stats when user is selected
  useEffect(() => {
    if (!selectedUser) {
      setUserStats(null);
      setActiveTab("none");
      setCommentsList([]);
      setLikesList([]);
      return;
    }

    const loadStats = async () => {
      setIsLoadingStats(true);
      try {
        const stats = await fetchUserStats(selectedUser.id);
        setUserStats(stats);
      } catch (err) {
        console.error("Gagal memuat statistik user:", err);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [selectedUser]);

  const handleTabClick = async (tab: "comments" | "likes") => {
    if (activeTab === tab) {
      setActiveTab("none");
      return;
    }

    setActiveTab(tab);
    setIsLoadingTabDetails(true);
    setTabError(null);

    try {
      if (tab === "comments") {
        const res = await fetchUserComments(selectedUser!.id);
        if (res.error) throw new Error(res.error);
        setCommentsList(res.data || []);
      } else {
        const res = await fetchUserLikes(selectedUser!.id);
        if (res.error) throw new Error(res.error);
        setLikesList(res.data || []);
      }
    } catch (err: any) {
      setTabError(err.message || "Gagal memuat rincian aktivitas.");
    } finally {
      setIsLoadingTabDetails(false);
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
    let result = [...users];

    // Search
    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.full_name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.phone_number && u.phone_number.includes(query))
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
  }, [users, searchTerm, sortConfig]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "Belum pernah login";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const copyToClipboard = (text: string, type: "id" | "email") => {
    navigator.clipboard.writeText(text);
    setCopiedId(type);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 bg-surface hover:bg-surface-alt rounded-xl border border-border shadow-sm transition-colors text-muted hover:text-foreground shrink-0 active:scale-95">
            <ChevronLeft size={18} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2 tracking-tight">
              <Users size={22} className="text-blue-500 shrink-0" />
              Monitoring Pengguna
            </h1>
            <p className="text-[11px] sm:text-sm text-secondary mt-1">
              Pantau seluruh anggota dan administrator platform TIMVERSE.
            </p>
          </div>
        </div>

        <button
          onClick={loadUsers}
          disabled={isLoading}
          className="w-full sm:w-auto justify-center px-4 py-2.5 bg-surface text-foreground hover:bg-surface-alt border border-border rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 text-xs font-bold shadow-sm active:scale-95"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin text-blue-500" : "text-muted"} />
          <span>Segarkan Data</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Toolbar: Search and Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border/60 shadow-sm">
          <div className="text-xs sm:text-sm font-semibold text-secondary flex items-center gap-2 order-2 md:order-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            {isLoading ? "Memuat data..." : `${totalItems} Pengguna terdaftar`}
          </div>

          <div className="relative group w-full md:w-80 order-1 md:order-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-blue-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Cari nama, email, atau telepon..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-surface border border-border/60 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-muted/60 shadow-inner"
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
          </div>
        )}

        {isLoading ? (
          /* Loading State */
          <div className="space-y-4">
            <div className="hidden md:block bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-surface-alt/50 border-b border-border/60">
                    <th className="w-[30%] px-5 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Pengguna</th>
                    <th className="w-[15%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Peran</th>
                    <th className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Tanggal Daftar</th>
                    <th className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Aktivitas Terakhir</th>
                    <th className="w-[15%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <tr key={`skeleton-${i}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-alt animate-pulse shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 bg-surface-alt animate-pulse rounded-md" />
                            <div className="h-3 w-1/2 bg-surface-alt/60 animate-pulse rounded-md" />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4"><div className="h-6 w-20 bg-surface-alt animate-pulse rounded-lg" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-24 bg-surface-alt animate-pulse rounded-md" /></td>
                      <td className="px-4 py-4"><div className="h-4 w-32 bg-surface-alt animate-pulse rounded-md" /></td>
                      <td className="px-4 py-4"><div className="h-8 w-16 bg-surface-alt animate-pulse rounded-lg mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Skeleton */}
            <div className="md:hidden space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`mskel-${i}`} className="bg-card rounded-2xl p-4 border border-border/60 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-alt animate-pulse shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-3/4 bg-surface-alt animate-pulse rounded-md" />
                    <div className="h-3 w-1/2 bg-surface-alt animate-pulse rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : paginatedData.length > 0 ? (
          <>
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-surface-alt/40 border-b border-border/60">
                    <th
                      onClick={() => handleSort("full_name")}
                      className="w-[30%] px-5 py-4 text-[11px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-blue-500 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        Pengguna
                        {sortConfig.key === "full_name" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-blue-500" />
                        ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("role")}
                      className="w-[15%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-blue-500 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        Peran
                        {sortConfig.key === "role" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-blue-500" />
                        ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("created_at")}
                      className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-blue-500 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        Bergabung
                        {sortConfig.key === "created_at" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-blue-500" />
                        ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("last_sign_in_at")}
                      className="w-[20%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted cursor-pointer hover:text-blue-500 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        Aktivitas Terakhir
                        {sortConfig.key === "last_sign_in_at" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={14} className="text-blue-500" /> : <ChevronDown size={14} className="text-blue-500" />
                        ) : <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50 transition-opacity" />}
                      </div>
                    </th>
                    <th className="w-[15%] px-4 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-center">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <AnimatePresence mode="popLayout">
                    {paginatedData.map((user) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className="hover:bg-surface/50 transition-colors group cursor-pointer"
                      >
                        {/* Pengguna */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full border border-border/40 object-cover shrink-0" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {getInitials(user.full_name)}
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-foreground truncate group-hover:text-blue-600 transition-colors">
                                {user.full_name}
                              </span>
                              <span className="text-[11px] font-medium text-muted mt-0.5 truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Peran */}
                        <td className="px-4 py-4">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                              <Shield size={12} />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-alt border border-border/60 text-[10px] font-bold text-secondary uppercase tracking-wider">
                              <User size={12} />
                              User
                            </span>
                          )}
                        </td>

                        {/* Bergabung */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                            <CalendarDays size={14} className="text-muted" />
                            {formatDate(user.created_at)}
                          </div>
                        </td>

                        {/* Aktivitas */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
                            <Clock size={14} className="text-muted" />
                            {formatDateTime(user.last_sign_in_at)}
                          </div>
                        </td>

                        {/* Aksi Detail */}
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="h-8 px-3 rounded-lg text-xs font-bold text-blue-600 bg-blue-500/10 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                            >
                              <Eye size={12} />
                              <span>Lihat Detail</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden space-y-3">
              <AnimatePresence mode="popLayout">
                {paginatedData.map((user) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="bg-card rounded-2xl border border-border/60 p-4 shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-12 h-12 rounded-full border border-border/40 object-cover shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {getInitials(user.full_name)}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-bold text-foreground leading-snug truncate">
                            {user.full_name}
                          </h3>
                          {user.role === 'admin' && (
                            <Shield size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted truncate mt-0.5">{user.email}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/40">
                          <div>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Bergabung</p>
                            <p className="text-[10px] text-secondary font-medium">{formatDate(user.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">Login Terakhir</p>
                            <p className="text-[10px] text-secondary font-medium">{formatDateTime(user.last_sign_in_at)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* SHARED PAGINATION */}
            <div className="bg-card rounded-2xl border border-border/60 px-5 py-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-muted font-bold text-center sm:text-left">
                Menampilkan {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} pengguna
              </span>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[11px] font-black text-muted tracking-widest uppercase">Hal. {currentPage} / {totalPages || 1}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-surface border border-border text-[11px] font-bold rounded-xl hover:bg-surface-alt hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 text-secondary"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-4 py-2 bg-blue-600 text-white border border-blue-600 text-[11px] font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border/80 rounded-3xl shadow-sm px-4">
            <div className="w-16 h-16 bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500 rounded-[20px] shadow-inner">
              <Users size={28} />
            </div>
            <h2 className="text-lg font-black text-foreground mb-1">Tidak Ada Pengguna</h2>
            <p className="text-xs text-secondary max-w-sm mx-auto text-center font-medium">
              Tidak ada data pengguna yang cocok dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>

      {/* USER DETAIL MODAL POP UP (MOBILE NATIVE DRAWER / DESKTOP CENTRED) */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedUser(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full sm:max-w-lg bg-card border-t sm:border border-border/80 rounded-t-[32px] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col z-10 max-h-[85vh] sm:max-h-none"
            >
              {/* Native Drag Indicator Pill for Mobile */}
              <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full sm:hidden z-20" />

              {/* Header Visual Banner */}
              <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative flex items-end justify-between px-6 pb-4 shrink-0">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 p-2 bg-black/25 text-white/90 hover:bg-black/40 hover:text-white rounded-full transition-colors outline-none"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Overlapping Profile Photo */}
              <div className="px-6 relative -top-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 shrink-0">
                <div className="flex items-end gap-4">
                  {selectedUser.avatar_url ? (
                    <img
                      src={selectedUser.avatar_url}
                      alt=""
                      className="w-20 h-20 rounded-[24px] border-4 border-card object-cover bg-surface-alt shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-[24px] border-4 border-card bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                      {getInitials(selectedUser.full_name)}
                    </div>
                  )}
                  <div className="pb-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-foreground tracking-tight leading-none">
                        {selectedUser.full_name}
                      </h2>
                      {selectedUser.role === "admin" && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase text-indigo-500">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-1 leading-none">Anggota TIMVERSE</p>
                  </div>
                </div>
              </div>

              {/* Scrollable details area */}
              <div className="px-6 pb-6 space-y-5 -mt-6 overflow-y-auto scrollbar-thin max-h-[45vh] sm:max-h-[55vh]">
                {/* ID block */}
                <div className="bg-surface p-3.5 rounded-2xl border border-border/40 flex items-center justify-between gap-4 group">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-0.5">User ID</p>
                    <p className="text-[10px] sm:text-xs font-semibold text-secondary truncate tracking-wider font-mono">
                      {selectedUser.id}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedUser.id, "id")}
                    className="p-2 bg-card hover:bg-surface-alt text-muted hover:text-foreground rounded-lg transition-all border border-border shrink-0"
                    title="Salin ID"
                  >
                    {copiedId === "id" ? <ClipboardCheck size={14} className="text-emerald-500" /> : <Clipboard size={14} />}
                  </button>
                </div>

                {/* Profile Details Grid */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border/40 pb-2 flex items-center gap-1.5">
                    <Info size={14} className="text-blue-500" />
                    Informasi Kontak
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center text-muted shrink-0">
                        <Mail size={14} />
                      </div>
                      <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Alamat Email</p>
                          <p className="text-xs font-bold text-foreground truncate">{selectedUser.email}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(selectedUser.email, "email")}
                          className="p-1 text-muted hover:text-foreground rounded transition-colors"
                        >
                          {copiedId === "email" ? <ClipboardCheck size={12} className="text-emerald-500" /> : <Clipboard size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-surface-alt flex items-center justify-center text-muted shrink-0">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Nomor Telepon</p>
                        <p className="text-xs font-bold text-foreground">
                          {selectedUser.phone_number || "Tidak dicantumkan"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Activity Timeline */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border/40 pb-2 flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-500" />
                    Riwayat Akses
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-3.5 bg-surface rounded-2xl border border-border/40 flex items-start gap-3">
                      <div className="p-2 bg-card rounded-lg text-muted shrink-0">
                        <CalendarDays size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Registrasi</p>
                        <p className="text-xs font-bold text-foreground">{formatDate(selectedUser.created_at)}</p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-surface rounded-2xl border border-border/40 flex items-start gap-3">
                      <div className="p-2 bg-card rounded-lg text-muted shrink-0">
                        <Activity size={14} />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Login Terakhir</p>
                        <p className="text-xs font-bold text-foreground truncate max-w-[150px]">
                          {selectedUser.last_sign_in_at ? formatDate(selectedUser.last_sign_in_at) : "Belum login"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Statistics / Activity Metrics */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-muted border-b border-border/40 pb-2 flex items-center gap-1.5">
                    <Activity size={14} className="text-blue-500" />
                    Statistik Kontribusi (Klik untuk Rincian)
                  </h3>

                  {isLoadingStats ? (
                    <div className="py-6 flex flex-col items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                      <span className="text-xs font-bold text-muted uppercase tracking-widest">Memuat Kontribusi...</span>
                    </div>
                  ) : userStats ? (
                    <div className="grid grid-cols-3 gap-3">
                      {/* Comments Tab Button */}
                      <button
                        onClick={() => handleTabClick("comments")}
                        className={`border p-3 rounded-2xl text-center space-y-1 transition-all active:scale-[0.98] outline-none ${
                          activeTab === "comments"
                            ? "bg-blue-500/10 border-blue-500/40 ring-1 ring-blue-500/20"
                            : "bg-surface border-border/40 hover:bg-blue-500/5 hover:border-blue-500/25"
                        }`}
                      >
                        <MessageSquare size={16} className={`mx-auto ${activeTab === "comments" ? "text-blue-600" : "text-blue-500"}`} />
                        <p className="text-lg font-black text-foreground leading-none">{userStats.commentsCount}</p>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Komentar</p>
                      </button>

                      {/* Likes Tab Button */}
                      <button
                        onClick={() => handleTabClick("likes")}
                        className={`border p-3 rounded-2xl text-center space-y-1 transition-all active:scale-[0.98] outline-none ${
                          activeTab === "likes"
                            ? "bg-pink-500/10 border-pink-500/40 ring-1 ring-pink-500/20"
                            : "bg-surface border-border/40 hover:bg-pink-500/5 hover:border-pink-500/25"
                        }`}
                      >
                        <Heart size={16} className={`mx-auto ${activeTab === "likes" ? "text-pink-600" : "text-pink-500"}`} />
                        <p className="text-lg font-black text-foreground leading-none">{userStats.likesCount}</p>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Likes</p>
                      </button>

                      {/* Passive Reports Box */}
                      <div className="bg-surface border border-border/40 p-3 rounded-2xl text-center space-y-1 opacity-80">
                        <AlertTriangle size={16} className="text-amber-500 mx-auto" />
                        <p className="text-lg font-black text-foreground leading-none">{userStats.reportsCount}</p>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest">Aduan</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-xs text-muted">
                      Gagal mengambil statistik pengguna.
                    </div>
                  )}

                  {/* Render Expanded List Details */}
                  <AnimatePresence mode="wait">
                    {activeTab !== "none" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-surface border border-border/50 rounded-2xl p-4 overflow-hidden mt-3"
                      >
                        {isLoadingTabDetails ? (
                          <div className="py-8 flex flex-col items-center justify-center gap-2">
                            <Loader2 size={18} className="animate-spin text-blue-500" />
                            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Memuat Rincian...</span>
                          </div>
                        ) : tabError ? (
                          <div className="text-xs text-red-500 text-center py-4">{tabError}</div>
                        ) : activeTab === "comments" ? (
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-500">Rincian Komentar ({commentsList.length})</h4>
                            {commentsList.length > 0 ? (
                              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                                {commentsList.map((c) => (
                                  <div key={c.id} className="p-3 bg-card border border-border/40 rounded-xl space-y-1.5 shadow-sm text-left">
                                    <p className="text-xs font-semibold text-foreground line-clamp-3">"{c.content}"</p>
                                    <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-1.5 mt-1.5 text-[9px] font-bold">
                                      {c.news ? (
                                        <Link
                                          href={`/article/${c.news.slug}`}
                                          target="_blank"
                                          className="text-blue-600 hover:underline truncate max-w-[180px]"
                                        >
                                          Pada: {c.news.title}
                                        </Link>
                                      ) : (
                                        <span className="text-muted">Artikel telah dihapus</span>
                                      )}
                                      <span className="text-muted shrink-0">{formatDateTime(c.created_at)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted text-center py-4">Belum menulis komentar apapun.</p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-black uppercase tracking-wider text-pink-500">Berita yang Disukai ({likesList.length})</h4>
                            {likesList.length > 0 ? (
                              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                {likesList.map((l) => (
                                  <div key={l.id} className="p-2.5 bg-card border border-border/40 rounded-xl flex items-center justify-between gap-3 shadow-sm text-left">
                                    {l.news ? (
                                      <Link
                                        href={`/article/${l.news.slug}`}
                                        target="_blank"
                                        className="text-xs font-bold text-foreground hover:text-blue-600 transition-colors truncate max-w-[220px]"
                                      >
                                        {l.news.title}
                                      </Link>
                                    ) : (
                                      <span className="text-xs text-muted">Artikel telah dihapus</span>
                                    )}
                                    <span className="text-[9px] font-bold text-muted shrink-0">{formatDate(l.created_at)}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted text-center py-4">Belum menyukai berita apapun.</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Close Footer Action */}
              <div className="px-6 py-4 bg-surface-alt/40 border-t border-border/60 flex items-center justify-end pb-safe shrink-0">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-95 w-full sm:w-auto"
                >
                  Tutup Rincian
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
