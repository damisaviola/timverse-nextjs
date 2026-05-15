"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardDrive, File as FileIcon, Image as ImageIcon,
  Database, RefreshCw, AlertTriangle, ShieldCheck,
  Layers, FolderOpen, ArrowUpRight, Info, Table as TableIcon,
  Activity, Zap, Box, LayoutGrid
} from "lucide-react";
import { getStorageBuckets, BucketStats, StorageReport } from "./actions";

export default function StorageDashboardPage() {
  const [report, setReport] = useState<StorageReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getStorageBuckets();
      if (res.error) {
        setError(res.error);
      } else if (res.data) {
        setReport(res.data);
      }
    } catch (err: any) {
      setError(err.message || "Gagal sinkronisasi infrastruktur.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatBytes = (bytes: number) => {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const totalStorageSize = report?.buckets.reduce((sum, b) => sum + b.totalSize, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-10 py-6 md:py-10 animate-in fade-in duration-700">
      
      {/* Dynamic Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Zap size={12} className="fill-current" />
            <span className="text-[10px] font-black uppercase tracking-wider">Infrastructure Live</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
            System <span className="text-indigo-600">Health</span>
          </h1>
          <p className="text-xs md:text-sm text-secondary font-medium">Monitoring performa database dan kapasitas media secara real-time.</p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          {isLoading ? "Syncing..." : "Refresh Status"}
        </button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600">
          <AlertTriangle size={18} />
          <p className="text-xs font-bold">{error}</p>
        </motion.div>
      )}

      {/* Main Pulse Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <PulseCard 
          label="Database Size" 
          value={report?.database.totalSize || "..."} 
          icon={Database} 
          color="indigo" 
          loading={isLoading}
        />
        <PulseCard 
          label="Media Usage" 
          value={formatBytes(totalStorageSize)} 
          icon={HardDrive} 
          color="emerald" 
          loading={isLoading}
        />
        <PulseCard 
          label="Total Objects" 
          value={report?.buckets.reduce((s, b) => s + b.fileCount, 0).toLocaleString() || "..."} 
          icon={Box} 
          color="amber" 
          loading={isLoading}
        />
        <PulseCard 
          label="System Status" 
          value="Healthy" 
          icon={ShieldCheck} 
          color="sky" 
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
        
        {/* Left: Storage Analysis */}
        <div className="lg:col-span-7 space-y-8">
          <SectionHeader title="Storage Analysis" subtitle="Media buckets and file distribution" icon={LayoutGrid} />
          
          {/* File Types Breakdown - Clean Chips */}
          <div className="flex flex-wrap gap-2 md:gap-4">
            <BreakdownChip label="Images" size={formatBytes(report?.breakdown.images.size || 0)} icon={ImageIcon} color="bg-indigo-500" loading={isLoading} />
            <BreakdownChip label="Docs" size={formatBytes(report?.breakdown.documents.size || 0)} icon={FileIcon} color="bg-emerald-500" loading={isLoading} />
            <BreakdownChip label="Misc" size={formatBytes(report?.breakdown.others.size || 0)} icon={Box} color="bg-amber-500" loading={isLoading} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {report?.buckets.map((bucket, idx) => (
                <motion.div
                  key={bucket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-card dark:bg-sidebar/50 border border-border/60 rounded-[2rem] p-5 md:p-8 hover:border-indigo-500/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                        <FolderOpen size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-foreground tracking-tight">{bucket.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${bucket.public ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                            {bucket.public ? 'Public' : 'Private'}
                          </span>
                          <span className="text-[10px] text-muted font-bold tracking-tight">{bucket.fileCount} Objects</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-1 border-t md:border-t-0 pt-4 md:pt-0 border-border/40">
                      <p className="text-xl md:text-2xl font-black text-foreground tabular-nums tracking-tighter">{formatBytes(bucket.totalSize)}</p>
                      <a href={`https://supabase.com/dashboard/project/_/storage/buckets/${bucket.name}`} target="_blank" className="text-[10px] font-black text-indigo-600 uppercase flex items-center gap-1 hover:underline">
                        Console <ArrowUpRight size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Tiny File Preview */}
                  <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {bucket.files.slice(0, 4).map((file, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-surface-alt/40 border border-transparent hover:border-border/60 transition-all">
                        <div className="w-7 h-7 rounded-lg bg-card flex items-center justify-center text-muted shrink-0">
                          {file.metadata?.mimetype?.includes("image") ? <ImageIcon size={12} className="text-indigo-400" /> : <FileIcon size={12} />}
                        </div>
                        <span className="text-[11px] font-bold text-foreground truncate flex-1">{file.name}</span>
                        <span className="text-[10px] font-bold text-muted tabular-nums">{formatBytes(file.metadata?.size || 0)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Database Performance */}
        <div className="lg:col-span-5 space-y-8">
          <SectionHeader title="Database Tables" subtitle="Row count and table sizes" icon={TableIcon} />
          
          <div className="bg-card dark:bg-sidebar/50 border border-border/60 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-surface-alt rounded-2xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-1">
                  {report?.database.tables.map((table, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-surface-alt transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center text-secondary group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                          <TableIcon size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-foreground tracking-tight">{table.name}</span>
                          <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">{table.rows.toLocaleString()} Rows</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-foreground tabular-nums tracking-tighter">{table.size}</span>
                        <div className="w-16 h-1 bg-surface-alt rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500/50" 
                            style={{ width: `${Math.min(100, (table.sizeBytes / 1048576) * 5)}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-surface-alt/30 border-t border-border/40 text-center">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-relaxed">
                Direct Sync via <span className="text-indigo-600 italic">pg_stat_user_tables</span>
              </p>
            </div>
          </div>

          {/* Quick Health Tip */}
          <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
            <Activity className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 space-y-2">
              <h4 className="text-sm font-black uppercase tracking-widest">Optimasi Tips</h4>
              <p className="text-xs font-medium text-white/80 leading-relaxed">Pastikan untuk melakukan pembersihan bucket <code className="bg-white/10 px-1 rounded">news-thumbnails</code> secara berkala jika banyak berita dihapus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon: Icon }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-card border border-border/60 flex items-center justify-center text-indigo-600 shadow-sm">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-sm font-black text-foreground uppercase tracking-wider leading-none">{title}</h2>
        <p className="text-[11px] text-secondary font-medium mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function PulseCard({ label, value, icon: Icon, color, loading }: any) {
  const colors: any = {
    indigo: "text-indigo-600 bg-indigo-500/5 border-indigo-500/20 shadow-indigo-500/5",
    emerald: "text-emerald-600 bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5",
    amber: "text-amber-600 bg-amber-500/5 border-amber-500/20 shadow-amber-500/5",
    sky: "text-sky-600 bg-sky-500/5 border-sky-500/20 shadow-sky-500/5",
  };

  return (
    <div className={`p-4 md:p-6 rounded-[2rem] border ${colors[color]} bg-card flex flex-col justify-between h-32 md:h-40 transition-all hover:scale-[1.02] duration-300 shadow-xl`}>
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl bg-white dark:bg-sidebar border border-border/40 ${color === 'indigo' ? 'text-indigo-600' : color === 'emerald' ? 'text-emerald-600' : color === 'amber' ? 'text-amber-600' : 'text-sky-600'}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className="w-2 h-2 rounded-full bg-current animate-pulse opacity-50" />
      </div>
      <div>
        <p className="text-[10px] md:text-[11px] font-black text-muted uppercase tracking-widest leading-none mb-1.5 md:mb-2">{label}</p>
        <p className="text-lg md:text-3xl font-black text-foreground tabular-nums tracking-tighter leading-none">{loading ? "..." : value}</p>
      </div>
    </div>
  );
}

function BreakdownChip({ label, size, icon: Icon, color, loading }: any) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2 bg-card border border-border/60 rounded-2xl shadow-sm hover:border-indigo-500/30 transition-all group">
      <div className={`w-6 h-6 rounded-lg ${color} flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
        <Icon size={12} />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] font-black text-muted uppercase tracking-tight leading-none mb-0.5">{label}</span>
        <span className="text-xs font-black text-foreground tabular-nums leading-none">{loading ? "..." : size}</span>
      </div>
    </div>
  );
}
