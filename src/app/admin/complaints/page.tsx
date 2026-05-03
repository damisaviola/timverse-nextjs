"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FileText, Eye, MessageSquare, TrendingUp, MoreHorizontal,
  PenSquare, Trash2, ExternalLink, ChevronRight, Search,
  ArrowUpDown, ChevronUp, ChevronDown, Filter, X, Loader2,
  AlertTriangle, RefreshCw, CheckCircle2, Clock, AlertCircle,
  FileImage, Mail, User, Check, ArrowRight, ArrowLeft
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
import * as XLSX from "xlsx";
import { formatDate } from "@/lib/utils";
import { updateReportStatus, deleteReport, cleanupOldReports } from "./actions";
import { FileDown, Download } from "lucide-react";

type SortKey = "report_type" | "status" | "created_at";

export default function AdminComplaintsPage() {
  const searchParams = useSearchParams();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "created_at",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Sync with URL search params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchTerm(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const itemsPerPage = 6;
  const supabase = createClient();

  const handleExportExcel = () => {
    if (reports.length === 0) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    const exportData = reports.map(r => ({
      "Nama Pelapor": r.profiles?.full_name || r.profiles?.username || "Anonim",
      "Email": r.email || "-",
      "Tipe Pengaduan": r.report_type,
      "Deskripsi": r.description,
      "Status": r.status === 'pending' ? 'Baru (New)' : r.status === 'processing' ? 'Dibaca (Read)' : 'Selesai (Resolved)',
      "Tanggal": new Date(r.created_at).toLocaleString('id-ID'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pengaduan");

    // Set column widths
    const wscols = [
      { wch: 25 }, // Nama
      { wch: 30 }, // Email
      { wch: 20 }, // Tipe
      { wch: 50 }, // Deskripsi
      { wch: 15 }, // Status
      { wch: 20 }, // Tanggal
    ];
    worksheet['!cols'] = wscols;

    const fileName = `Laporan_Pengaduan_TIMVERSE_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const loadReports = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("reports")
        .select(`
          *,
          profiles:user_id (
            full_name,
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setReports(data || []);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Gagal memuat data pengaduan.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleStatusChange = async (reportId: string, newStatus: any) => {
    setIsActionLoading(true);
    const result = await updateReportStatus(reportId, newStatus);
    if (result.success) {
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
      if (selectedReport?.id === reportId) {
        setSelectedReport({ ...selectedReport, status: newStatus });
      }
    }
    setIsActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      setIsActionLoading(true);
      const result = await deleteReport(id);
      if (result.success) {
        setReports(prev => prev.filter(r => r.id !== id));
        setSelectedReport(null);
      }
      setIsActionLoading(false);
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
    let result = [...reports];

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.description.toLowerCase().includes(query) ||
          r.report_type.toLowerCase().includes(query) ||
          (r.email && r.email.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [reports, searchTerm, sortConfig]);

  const totalItems = filteredAndSortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const stats = [
    { label: "Total Laporan", value: reports.length.toString(), icon: FileText, color: "text-accent bg-accent/10", trend: "Semua pengaduan" },
    { label: "Baru", value: reports.filter(r => r.status === 'pending').length.toString(), icon: AlertCircle, color: "text-amber-500 bg-amber-500/10", trend: "Butuh tindak lanjut" },
    { label: "Diproses", value: reports.filter(r => r.status === 'processing').length.toString(), icon: Clock, color: "text-blue-500 bg-blue-500/10", trend: "Sedang dikerjakan" },
    { label: "Selesai", value: reports.filter(r => r.status === 'resolved').length.toString(), icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", trend: "Laporan tuntas" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500">New</span>;
      case "processing":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-500">Read</span>;
      case "resolved":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-500">Resolved</span>;
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  if (isLoading) {
    return <AdminLoadingState type="table" count={10} />;
  }

  return (
    <div className="space-y-10" id="admin-complaints">
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
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 flex items-center gap-1.5">
                <TrendingUp size={12} className="text-muted" />
                <span className="text-[11px] font-medium text-muted">{stat.trend}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                title="Ekspor ke Excel"
              >
                <FileDown size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={async () => {
                  const result = await cleanupOldReports();
                  if (result.success) {
                    alert(`Berhasil membersihkan ${result.count} laporan lama.`);
                    loadReports();
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                title="Bersihkan laporan resolved > 30 hari"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Cleanup</span>
              </button>

              <button
                onClick={() => loadReports(true)}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-surface border border-border/40 text-muted hover:text-accent hover:bg-accent/10 transition-all disabled:opacity-30"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="relative group w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" size={16} />
              <input
                type="text"
                placeholder="Cari pengaduan, email..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-10 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-surface-alt dark:bg-sidebar/50 border-b border-border/60">
                    <th className="w-[45%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted">Laporan</th>
                    <th
                      onClick={() => handleSort("report_type")}
                      className="w-[20%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-accent transition-colors text-center"
                    >
                      Tipe
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="w-[15%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-accent transition-colors text-center"
                    >
                      Status
                    </th>
                    <th className="w-[20%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={`skeleton-${i}`}><td colSpan={4} className="p-8 h-12 bg-surface-alt animate-pulse" /></tr>
                    ))
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((report) => (
                      <motion.tr
                        layout
                        key={report.id}
                        className="hover:bg-surface-alt/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedReport(report)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl border border-border/40 bg-surface shrink-0 flex items-center justify-center">
                              {report.profiles?.avatar_url ? (
                                <img src={report.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : <User size={18} className="text-muted/40" />}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-foreground truncate group-hover:text-accent">
                                {report.profiles?.full_name || report.email || "Anonim"}
                              </span>
                              <p className="text-[11px] text-muted line-clamp-1 font-medium italic">
                                "{report.description}"
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded-lg bg-surface-alt border border-border/60 text-[10px] font-black uppercase tracking-widest text-secondary">
                            {report.report_type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                            className="w-9 h-9 inline-flex items-center justify-center rounded-xl bg-surface border border-border/40 text-muted hover:text-accent transition-all"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : null}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-5 animate-pulse space-y-3">
                    <div className="flex gap-3"><div className="w-10 h-10 rounded-lg bg-surface-alt" /><div className="h-4 w-32 bg-surface-alt rounded mt-1" /></div>
                    <div className="h-12 w-full bg-surface-alt rounded-xl" />
                  </div>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 active:bg-surface-alt/50 transition-colors"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl border border-border/40 bg-surface flex items-center justify-center">
                          {report.profiles?.avatar_url ? (
                            <img src={report.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : <User size={18} className="text-muted/40" />}
                        </div>
                        <div>
                          <h5 className="text-[11px] font-black text-foreground uppercase tracking-tight">
                            {report.profiles?.full_name || report.email || "Anonim"}
                          </h5>
                          <p className="text-[10px] text-muted font-bold">{formatDate(report.created_at)}</p>
                        </div>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>

                    <div className="bg-surface-alt/40 border border-border/40 rounded-2xl p-4 mb-4">
                      <span className="text-[9px] font-black text-accent uppercase tracking-widest block mb-2">{report.report_type}</span>
                      <p className="text-xs text-secondary font-medium line-clamp-3 leading-relaxed">
                        {report.description}
                      </p>
                    </div>

                    <button className="w-full py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                      <Eye size={14} /> Lihat Detail Laporan
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs font-bold text-muted">Tidak ada pengaduan.</div>
              )}
            </div>

            {/* Pagination Footer */}
            {!isLoading && totalItems > 0 && (
              <div className="bg-surface-alt/50 dark:bg-sidebar/30 px-5 py-3 border-t border-border/60 flex items-center justify-between">
                <span className="text-[11px] text-muted font-medium text-center w-full sm:w-auto mb-2 sm:mb-0">
                  {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} dari {totalItems} laporan
                </span>
                <div className="flex gap-2 w-full sm:w-auto justify-center">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-3.5 py-1.5 bg-card border border-border text-[11px] font-bold rounded-lg disabled:opacity-30">Prev</button>
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-3.5 py-1.5 bg-accent text-white rounded-lg disabled:opacity-30">Next</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent/10 rounded-lg"><TrendingUp size={16} className="text-accent" /></div>
            <h2 className="text-lg font-bold text-foreground">Ringkasan</h2>
          </div>
          <div className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm space-y-4">
            <div className="p-4 rounded-xl bg-surface-alt/50 border border-border/40">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted">Butuh Tindak Lanjut</p>
              <h4 className="text-xl font-black mt-1">{reports.filter(r => r.status !== 'resolved').length}</h4>
            </div>
            <Link href="/admin" className="w-full py-3 flex items-center justify-center gap-2 bg-foreground text-background rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all">
              <ArrowLeft size={14} /> Kembali ke Admin
            </Link>
          </div>
        </div>
      </div>

      {/* COMPLAINT MODAL */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedReport(null)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-card border border-border/60 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden" >
              <div className="flex flex-col h-full max-h-[90vh]">
                <div className="p-6 md:p-8 border-b border-border/40 flex items-center justify-between bg-surface-alt/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl border border-border/40 bg-surface flex items-center justify-center shrink-0">
                      {selectedReport.profiles?.avatar_url ? (<img src={selectedReport.profiles.avatar_url} alt="" className="w-full h-full object-cover" />) : <User size={24} className="text-muted/40" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-xl font-black tracking-tight truncate">{selectedReport.profiles?.full_name || selectedReport.profiles?.username || "Pengguna Anonim"}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] md:text-[10px] font-bold text-muted bg-surface-alt px-2 py-0.5 rounded-full truncate max-w-[120px]">{selectedReport.email || "No Email"}</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-muted border border-border/60 px-2 py-0.5 rounded-full">{formatDate(selectedReport.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedReport(null)} className="p-2 rounded-xl hover:bg-surface-alt transition-colors shrink-0"> <X size={20} /> </button>
                </div>
                <div className="p-6 md:p-8 overflow-y-auto space-y-6 md:space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"> <div className="w-1 h-4 bg-accent rounded-full" /> <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Isi Pengaduan</h4> </div>
                    <p className="text-sm text-foreground font-medium leading-relaxed bg-surface/30 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border/40"> {selectedReport.description} </p>
                  </div>
                  {selectedReport.attachment_url && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2"> <FileImage size={14} className="text-accent" /> <h4 className="text-[10px] font-black uppercase tracking-widest text-muted">Lampiran Bukti</h4> </div>
                      <div className="relative aspect-video rounded-[1.5rem] overflow-hidden border border-border/40 group">
                        <img src={selectedReport.attachment_url} alt="Lampiran" className="w-full h-full object-cover" />
                        <a href={selectedReport.attachment_url} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-2" > <ExternalLink size={16} /> Buka Gambar </a>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-surface-alt/30 border border-border/40"> <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Tipe</p> <p className="text-xs font-bold text-foreground">{selectedReport.report_type}</p> </div>
                    <div className="p-4 rounded-2xl bg-surface-alt/30 border border-border/40"> <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Status</p> {getStatusBadge(selectedReport.status)} </div>
                  </div>
                </div>
                <div className="p-6 md:p-8 border-t border-border/40 bg-surface-alt/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button onClick={() => handleDelete(selectedReport.id)} disabled={isActionLoading} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all disabled:opacity-50" > <Trash2 size={16} /> Hapus </button>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {selectedReport.status !== 'processing' && selectedReport.status !== 'resolved' && (
                      <button onClick={() => handleStatusChange(selectedReport.id, 'processing')} disabled={isActionLoading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50" > {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />} Proses </button>
                    )}
                    {selectedReport.status !== 'resolved' && (
                      <button onClick={() => handleStatusChange(selectedReport.id, 'resolved')} disabled={isActionLoading} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50" > {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Selesai </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
