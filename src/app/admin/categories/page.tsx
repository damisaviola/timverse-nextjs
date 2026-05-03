"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, Search, ArrowUpRight, BarChart3,
  FileText, Eye, RefreshCw, AlertTriangle, Loader2,
  ChevronRight, TrendingUp, Filter, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { fetchCategoryStats } from "./actions";
import AdminLoadingState from "@/components/admin/AdminLoadingState";

interface CategoryStat {
  name: string;
  count: number;
  views: number;
  last_updated: string | null;
  color: string;
}

export default function CategoriesPage() {
  const [stats, setStats] = useState<CategoryStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchCategoryStats();
      if (result.error) {
        setError(result.error);
      } else {
        setStats(result.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat statistik kategori.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const filteredStats = useMemo(() => {
    return stats.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stats, searchTerm]);

  const totals = useMemo(() => {
    return stats.reduce((acc, curr) => ({
      articles: acc.articles + curr.count,
      views: acc.views + curr.views
    }), { articles: 0, views: 0 });
  }, [stats]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading && stats.length === 0) {
    return <AdminLoadingState type="cards" count={8} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20 text-white">
            <FolderOpen size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Pantau Kategori</h1>
            <p className="text-sm text-secondary font-medium">Monitoring performa dan distribusi konten per kategori.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={loadStats}
            disabled={isLoading}
            className="p-2 text-muted hover:text-indigo-600 hover:bg-indigo-600/10 rounded-xl transition-all disabled:opacity-30"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
              <FolderOpen size={18} />
            </div>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Kategori</p>
          <h3 className="text-2xl font-black text-foreground mt-1">{stats.length}</h3>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <FileText size={18} />
            </div>
            <div className="text-[10px] font-bold text-emerald-500">+4 baru</div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Artikel</p>
          <h3 className="text-2xl font-black text-foreground mt-1">{formatNumber(totals.articles)}</h3>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
              <Eye size={18} />
            </div>
            <ArrowUpRight size={14} className="text-blue-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Total Tayangan</p>
          <h3 className="text-2xl font-black text-foreground mt-1">{formatNumber(totals.views)}</h3>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <BarChart3 size={18} />
            </div>
            <Filter size={14} className="text-amber-500" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">Avg. Views/Artikel</p>
          <h3 className="text-2xl font-black text-foreground mt-1">
            {totals.articles > 0 ? formatNumber(Math.round(totals.views / totals.articles)) : 0}
          </h3>
        </div>
      </div>

      {/* Main Grid */}
      {error && (
        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-500" />
          <p className="text-sm font-medium text-red-500">{error}</p>
          <button onClick={loadStats} className="ml-auto text-xs font-bold text-red-500 hover:underline">Coba Lagi</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredStats.map((cat, index) => (
            <motion.div
              layout
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="group relative bg-card border border-border/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${cat.color}`}>
                  {cat.name}
                </div>
                <Link
                  href={`/admin?q=${cat.name}`}
                  className="p-2 text-muted hover:text-indigo-600 hover:bg-indigo-600/10 rounded-xl transition-all"
                  title="Lihat Artikel"
                >
                  <ExternalLink size={16} />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Artikel</p>
                    <h4 className="text-xl font-black text-foreground">{cat.count}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Views</p>
                    <h4 className="text-xl font-black text-indigo-600">{formatNumber(cat.views)}</h4>
                  </div>
                </div>

                {/* Refined Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-tight">Distribusi</span>
                    <span className="text-[9px] font-black text-indigo-600">
                      {totals.articles > 0 ? Math.round((cat.count / totals.articles) * 100) : 0}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${totals.articles > 0 ? (cat.count / totals.articles) * 100 : 0}%` }}
                      className="h-full bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-tight">Terakhir Update</span>
                    <span className="text-[11px] font-semibold text-secondary">{formatDate(cat.last_updated)}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-surface-alt flex items-center justify-center text-muted group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredStats.length === 0 && !isLoading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-surface-alt flex items-center justify-center text-muted">
              <Search size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Kategori tidak ditemukan</p>
              <p className="text-xs text-muted">Coba kata kunci lain atau buat kategori baru.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
