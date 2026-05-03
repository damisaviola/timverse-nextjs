"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, TrendingUp, Users, Clock, ArrowUpRight, 
  ArrowDownRight, FileText, Download, Filter, Calendar,
  ChevronRight, ExternalLink, Loader2, MessageSquare, Heart,
  Search, X, ChevronUp, ChevronDown, ArrowUpDown, UploadCloud,
  ImageIcon
} from "lucide-react";
import Link from "next/link";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import { getAnalyticsData, getPaginatedArticles } from "./actions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // File Upload States
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // DataTable States (Server-side)
  const [tableArticles, setTableArticles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("views");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isTableLoading, setIsTableLoading] = useState(false);
  
  const itemsPerPage = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) processFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Initial Data Fetch (Charts & Stats)
  useEffect(() => {
    setMounted(true);
    const fetchStats = async () => {
      const result = await getAnalyticsData();
      if (result.data) setData(result.data);
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  // Server-side Table Fetch (Search, Sort, Paginate)
  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(async () => {
      setIsTableLoading(true);
      const result = await getPaginatedArticles({
        search: searchQuery,
        sortBy,
        sortOrder,
        page: currentPage,
        pageSize: itemsPerPage
      });
      setTableArticles(result.data);
      setTotalCount(result.total);
      setIsTableLoading(false);
    }, 400); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, sortOrder, currentPage, mounted]);

  // Sync with URL search params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) {
      setSearchQuery(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header Laporan
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("TIMVERSE", 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55); // Gray 800
    doc.text("Laporan Analitik Performa Berita", 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Gray 500
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 38);
    doc.text(`Total Data: ${totalCount} artikel`, 14, 44);

    // Garis Pemisah
    doc.setDrawColor(229, 231, 235);
    doc.line(14, 48, 196, 48);
    
    // Tabel Data
    autoTable(doc, {
      startY: 55,
      head: [['No', 'Judul Artikel', 'Views', 'Rata-rata Baca']],
      body: tableArticles.map((art, i) => [
        (currentPage - 1) * itemsPerPage + i + 1,
        art.title,
        art.views,
        art.readTime
      ]),
      headStyles: { 
        fillColor: [79, 70, 229], 
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: { 
        fontSize: 9,
        textColor: [55, 65, 81]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        2: { halign: 'center', cellWidth: 30 },
        3: { halign: 'center', cellWidth: 30 }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    });
    
    // Save PDF
    doc.save(`TIMVERSE-Analytics-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (isLoading || !mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="text-indigo-600 animate-spin" />
        <p className="text-sm font-bold text-muted uppercase tracking-widest">Memuat Analitik...</p>
      </div>
    );
  }

  const mainStats = [
    { label: "Total Tayangan", value: data?.totalViews || "0", change: "+12%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-600/10" },
    { label: "Total Pencarian", value: data?.totalSearches || "0", change: "+24%", trend: "up", icon: Search, color: "text-indigo-600", bg: "bg-indigo-600/10" },
    { label: "Total Suka", value: data?.totalLikes || "0", change: "+8%", trend: "up", icon: Heart, color: "text-rose-600", bg: "bg-rose-600/10" },
    { label: "Total Komentar", value: data?.totalComments || "0", change: "+15%", trend: "up", icon: MessageSquare, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  ];

  const chartColors = {
    primary: "#6366f1",
    secondary: "#10b981",
    accent: "#f59e0b",
    danger: "#f43f5e",
    purple: "#8b5cf6"
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Laporan & Analitik</h1>
          <p className="text-secondary text-sm mt-1">Pantau performa konten dan pertumbuhan audiens Anda secara real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border/60 rounded-xl text-xs font-bold text-foreground hover:bg-surface-alt transition-all">
            <Calendar size={14} />
            30 Hari Terakhir
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Download size={14} />
            Ekspor Data
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border/60 rounded-[1.5rem] p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-emerald-500' : 'text-purple-500'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-5">
              <p className="text-[11px] font-bold text-muted uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-foreground mt-1 tabular-nums tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Interactive Area Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border border-border/60 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm h-[350px] md:h-[450px] flex flex-col"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-black text-foreground tracking-tight">Tren Performa Berita</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-alt rounded-lg self-start">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-bold text-muted uppercase tracking-widest text-indigo-600">Live Analytics</span>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0 min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <AreaChart data={data?.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} 
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip 
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.95)", 
                    backdropFilter: "blur(8px)",
                    borderRadius: "12px", 
                    border: "1px solid #e2e8f0", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "11px",
                    fontWeight: "bold",
                    padding: "8px 12px"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  name="Tayangan"
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="searches" 
                  name="Pencarian"
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorSearches)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* New Comments Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="bg-card border border-border/60 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm h-[350px] md:h-[450px] flex flex-col"
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-black text-foreground tracking-tight">Interaksi Komentar</h3>
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
              <MessageSquare size={16} />
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0 min-w-0">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={data?.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: "#94a3b8" }} 
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip 
                  cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                  contentStyle={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.95)", 
                    backdropFilter: "blur(8px)",
                    borderRadius: "12px", 
                    border: "1px solid #e2e8f0", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "11px",
                    fontWeight: "bold",
                    padding: "8px 12px"
                  }}
                />
                <Bar 
                  dataKey="comments" 
                  name="Komentar" 
                  fill="#8b5cf6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Interactive Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-border/60 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 shadow-sm flex flex-col h-[350px] md:h-[450px]"
        >
          <h3 className="text-base md:text-lg font-black text-foreground tracking-tight mb-6 md:mb-8">Distribusi Kategori</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={8}
                  dataKey="count"
                  isAnimationActive={true}
                >
                  {data?.categories?.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={Object.values(chartColors)[index % Object.values(chartColors).length]} 
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: "10px", border: "none", fontSize: "11px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2.5">
            {data?.categories?.slice(0, 4).map((cat: any, i: number) => {
              const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
              return (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[i % colors.length]}`} />
                    <span className="text-[11px] font-bold text-secondary truncate">{cat.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-foreground">{cat.percent}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Table: Top Performing Articles */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground underline decoration-indigo-500/30 underline-offset-8">Performa Artikel</h2>
            {isTableLoading && <Loader2 size={14} className="text-indigo-600 animate-spin" />}
            <button 
              onClick={exportToPDF}
              className="ml-2 p-1.5 text-indigo-600 hover:bg-indigo-600/10 rounded-lg transition-all flex items-center gap-1.5"
              title="Download PDF"
            >
              <Download size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">PDF</span>
            </button>
          </div>
          
          {/* Search Bar - Dashboard Style */}
          <div className="relative group w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-10 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto relative min-h-[350px]">
            {/* Table Loading Overlay */}
            <AnimatePresence>
              {isTableLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 bg-card/40 backdrop-blur-[1px] flex items-center justify-center"
                >
                  <Loader2 size={24} className="text-indigo-600 animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            <table className="w-full text-left border-collapse table-fixed min-w-[700px] md:min-w-full">
              <thead>
                <tr className="bg-surface-alt dark:bg-sidebar/50 border-b border-border/60">
                  <th 
                    onClick={() => toggleSort("title")}
                    className="w-[40%] px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted cursor-pointer hover:text-indigo-500 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      Konten
                      {sortBy === "title" ? (
                        sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : <ArrowUpDown size={12} className="opacity-30" />}
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort("views")}
                    className="w-[15%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted text-center cursor-pointer hover:text-indigo-500 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Views
                      {sortBy === "views" ? (
                        sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : <ArrowUpDown size={12} className="opacity-30" />}
                    </div>
                  </th>
                  <th 
                    onClick={() => toggleSort("search_count")}
                    className="w-[15%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted text-center cursor-pointer hover:text-indigo-500 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      Dicari
                      {sortBy === "search_count" ? (
                        sortOrder === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      ) : <ArrowUpDown size={12} className="opacity-30" />}
                    </div>
                  </th>
                  <th className="w-[15%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted text-center hidden sm:table-cell">Baca</th>
                  <th className="w-[15%] px-4 py-3.5 text-[11px] font-bold uppercase tracking-widest text-muted text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {tableArticles.length > 0 ? (
                  tableArticles.map((art: any, i: number) => (
                    <tr key={art.id || i} className="hover:bg-surface-alt/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 text-xs font-bold shrink-0">
                            {(currentPage - 1) * itemsPerPage + i + 1}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-600 transition-colors">
                              {art.title}
                            </span>
                            <span className="text-[10px] text-muted mt-0.5 uppercase tracking-wider font-bold">ANALYZED CONTENT</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-foreground tabular-nums">{art.views}</span>
                          <span className="text-[10px] text-muted">views</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-bold text-indigo-600 tabular-nums">{art.searchCount}</span>
                          <span className="text-[10px] text-muted">searches</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell">
                        <span className="text-xs font-medium text-secondary">{art.readTime}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-widest">
                          <TrendingUp size={12} />
                          PERFORMING
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-surface-alt/50 flex items-center justify-center">
                          <Search size={24} className="text-muted" />
                        </div>
                        <p className="text-sm font-bold text-secondary">Tidak ada hasil ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer - Dashboard Style */}
          {totalPages > 0 && (
            <div className="bg-surface-alt/50 dark:bg-sidebar/30 px-5 py-3 border-t border-border/60 flex items-center justify-between">
              <span className="text-[11px] text-muted font-medium">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalCount)} dari {totalCount} artikel
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-muted tabular-nums">Hal. {currentPage}/{totalPages || 1}</span>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || isTableLoading}
                    className="px-3.5 py-1.5 bg-card border border-border text-[11px] font-bold rounded-lg hover:bg-surface-alt transition-all disabled:opacity-30"
                  >
                    ← Prev
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || isTableLoading || totalPages === 0}
                    className="px-3.5 py-1.5 bg-indigo-600 text-white border border-indigo-600 text-[11px] font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
