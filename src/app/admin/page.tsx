"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  FileText, Eye, MessageSquare, TrendingUp, MoreHorizontal, 
  PenSquare, Trash2, ExternalLink, ChevronRight, Search, 
  ArrowUpDown, ChevronUp, ChevronDown, Filter, X 
} from "lucide-react";
import NewsForm from "@/components/admin/NewsForm";
import { newsArticles, NewsArticle } from "@/data/mockNews";

const stats = [
  { label: "Total Artikel", value: "128", icon: FileText, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-600/10", trend: "+4% vs bulan lalu" },
  { label: "Views (30 Hari)", value: "45.2K", icon: Eye, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-600/10", trend: "+12% vs bulan lalu" },
  { label: "Komentar Baru", value: "892", icon: MessageSquare, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-600/10", trend: "-2% vs bulan lalu" },
  { label: "Pertumbuhan", value: "+12%", icon: TrendingUp, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-600/10", trend: "Naik secara konsisten" },
];

export default function AdminDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof NewsArticle; direction: "asc" | "desc" }>({
    key: "date",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sorting Logic
  const handleSort = (key: keyof NewsArticle) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort Data
  const filteredAndSortedData = useMemo(() => {
    let result = [...newsArticles];

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

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, sortConfig]);

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
                  <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-1.5">
                <TrendingUp size={12} className={stat.trend.includes("+") ? "text-emerald-500" : "text-muted"} />
                <span className={`text-[11px] font-medium ${stat.trend.includes("+") ? "text-emerald-600 dark:text-emerald-400" : "text-muted"}`}>
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* News Table (Filament Style) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-foreground underline decoration-indigo-500/30 underline-offset-8">Kelola Berita</h2>
            
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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-alt dark:bg-sidebar/50 border-b border-border/60">
                    <th 
                      onClick={() => handleSort("title")}
                      className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Judul Berita
                        {sortConfig.key === "title" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("category")}
                      className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Kategori
                        {sortConfig.key === "category" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort("date")}
                      className="px-4 py-4 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortConfig.key === "date" ? (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : <ArrowUpDown size={12} className="opacity-30" />}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-muted text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((article) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        key={article.id} 
                        className="hover:bg-surface-alt/50 transition-colors group"
                      >
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                {article.title}
                              </span>
                              <span className="text-[10px] text-muted mt-0.5">{article.date} · {article.readTime}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-alt border border-border/60 text-[11px] font-bold text-secondary">
                              {article.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Published
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button className="p-1.5 text-muted hover:text-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-all" title="Edit">
                                <PenSquare size={16} />
                              </button>
                              <button className="p-1.5 text-muted hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-all" title="Hapus">
                                <Trash2 size={16} />
                              </button>
                              <button className="p-1.5 text-muted hover:text-foreground hover:bg-surface-alt rounded-lg transition-all" title="Lainnya">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-30">
                          <Search size={40} />
                          <p className="text-sm font-bold uppercase tracking-widest">Tidak ada hasil ditemukan</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-surface-alt dark:bg-sidebar/50 px-6 py-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted font-bold uppercase tracking-widest">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} berita
              </span>
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-bold text-muted">Page {currentPage} of {totalPages || 1}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-1.5 bg-card border border-border text-[11px] font-bold rounded-xl hover:bg-surface-alt transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-4 py-1.5 bg-indigo-600 text-white border border-indigo-600 text-[11px] font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
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
