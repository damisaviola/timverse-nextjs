"use client";

import { motion } from "framer-motion";
import { 
  BarChart3, TrendingUp, Users, Clock, ArrowUpRight, 
  ArrowDownRight, FileText, Download, Filter, Calendar,
  ChevronRight, ExternalLink
} from "lucide-react";
import Link from "next/link";

const mainStats = [
  { label: "Total Pembaca", value: "148,250", change: "+12.5%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-600/10" },
  { label: "Waktu Baca Rata-rata", value: "4m 32s", change: "+8.2%", trend: "up", icon: Clock, color: "text-emerald-600", bg: "bg-emerald-600/10" },
  { label: "Bounce Rate", value: "24.5%", change: "-2.4%", trend: "down", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-600/10" },
  { label: "Artikel Baru", value: "32", change: "+5", trend: "up", icon: FileText, color: "text-orange-600", bg: "bg-orange-600/10" },
];

const topArticles = [
  { title: "Revolusi AI Generatif 2026", views: "45.2k", readTime: "8m", growth: "+12%" },
  { title: "Startup Indonesia Cetak Unicorn", views: "38.5k", readTime: "5m", growth: "+8%" },
  { title: "Timnas Indonesia Semifinal", views: "32.1k", readTime: "4m", growth: "+15%" },
  { title: "Konser Metaverse Pecah Rekor", views: "28.4k", readTime: "6m", growth: "+5%" },
  { title: "Teleskop James Webb Temukan Planet", views: "24.8k", readTime: "7m", growth: "+9%" },
];

export default function ReportsPage() {
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
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Traffic Chart (Large) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-foreground tracking-tight">Tren Kunjungan Harian</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Visitors</span>
              </div>
            </div>
          </div>
          
          {/* Mock Area Chart (Stylized SVG) */}
          <div className="relative h-[300px] w-full mt-auto">
            <svg viewBox="0 0 1000 300" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 1, 2, 3].map(i => (
                <line key={i} x1="0" y1={i * 100} x2="1000" y2={i * 100} stroke="currentColor" strokeWidth="0.5" className="text-border/40" strokeDasharray="5,5" />
              ))}
              
              {/* Area */}
              <path 
                d="M0,300 L0,220 C100,200 200,250 300,180 C400,110 500,150 600,80 C700,10 800,100 900,120 L1000,100 L1000,300 Z" 
                fill="url(#chartGradient)" 
                className="opacity-20"
              />
              {/* Line */}
              <path 
                d="M0,220 C100,200 200,250 300,180 C400,110 500,150 600,80 C700,10 800,100 900,120 L1000,100" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="4" 
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              
              {/* Secondary Line (Visitors) */}
              <path 
                d="M0,250 C150,230 300,280 450,200 C600,120 750,180 900,150 L1000,130" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="2" 
                strokeLinecap="round"
                strokeDasharray="8,8"
              />

              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Days Mock */}
            <div className="flex justify-between mt-4">
              {['1 Apr', '8 Apr', '15 Apr', '22 Apr', '29 Apr'].map(d => (
                <span key={d} className="text-[10px] font-bold text-muted uppercase tracking-widest">{d}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown (Small) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm"
        >
          <h3 className="text-lg font-black text-foreground tracking-tight mb-8">Distribusi Kategori</h3>
          <div className="relative aspect-square flex items-center justify-center">
            {/* Mock Ring Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" className="text-surface-alt" />
              <circle cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="12" fill="none" strokeDasharray="180 251.2" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="12" fill="none" strokeDasharray="40 251.2" strokeDashoffset="-185" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="12" fill="none" strokeDasharray="31.2 251.2" strokeDashoffset="-225" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted leading-none">Top Rank</p>
              <p className="text-2xl font-black text-foreground mt-1 tracking-tight">Teknologi</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-3">
            {[
              { name: "Teknologi", percent: "70%", color: "bg-indigo-500" },
              { name: "Bisnis", percent: "15%", color: "bg-emerald-500" },
              { name: "Lainnya", percent: "15%", color: "bg-amber-500" },
            ].map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span className="text-xs font-bold text-secondary">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-foreground">{cat.percent}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Table: Top Performing Articles */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card border border-border/60 rounded-[2rem] overflow-hidden shadow-sm"
      >
        <div className="px-8 py-6 border-b border-border/40 flex items-center justify-between">
          <h3 className="text-lg font-black text-foreground tracking-tight">Artikel Terpopuler (Bulan Ini)</h3>
          <button className="text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1.5 group">
            Lihat Analitik Lengkap
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-alt/50 border-b border-border/40">
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Konten Artikel</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-center">Banyak Views</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-center">Rata-rata Baca</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-right">Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {topArticles.map((art, i) => (
                <tr key={art.title} className="group hover:bg-surface-alt/30 transition-colors cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <p className="text-sm font-bold text-foreground group-hover:text-indigo-600 transition-colors">{art.title}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-secondary tabular-nums">{art.views}</td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-secondary tabular-nums">{art.readTime}</td>
                  <td className="px-8 py-5 text-right">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-black tracking-widest">
                      <TrendingUp size={12} />
                      {art.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
