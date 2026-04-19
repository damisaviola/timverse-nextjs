"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, Search, Filter, MoreHorizontal, 
  CheckCircle2, Clock, Trash2, Eye, 
  ChevronRight, ExternalLink, Mail, User
} from "lucide-react";
import { useState, useMemo } from "react";

const initialComplaints = [
  { id: "REP-001", type: "Bug Teknis", user: "Andi (Guest)", date: "2026-04-18", status: "New", content: "Tombol publish di newsform tidak sengaja hilang saat saya geser-geser." },
  { id: "REP-002", type: "Typo", user: "Budi", date: "2026-04-17", status: "Read", content: "Ada typo di artikel 'Revolusi AI', kata 'teknologi' tertulis 'teknoologi'." },
  { id: "REP-003", type: "Konten", user: "Siti", date: "2026-04-16", status: "Resolved", content: "Gambar di kategori Olahraga terlalu besar dan menutupi teks." },
  { id: "REP-004", type: "Saran", user: "Raka (Guest)", date: "2026-04-15", status: "New", content: "Bagusnya ada fitur komentar yang bisa pakai gif." },
];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => 
      c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.user.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, complaints]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-red-500/10 text-red-500 ring-red-500/20";
      case "Read": return "bg-orange-500/10 text-orange-500 ring-orange-500/20";
      case "Resolved": return "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20";
      default: return "bg-muted/10 text-muted";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Pengaduan User</h1>
          <p className="text-secondary text-sm mt-1">Kelola laporan bug, komplain konten, dan masukan dari pembaca.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group w-64">
             <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-indigo-500 transition-colors" />
             <input
                type="text"
                placeholder="Cari pengaduan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-card border border-border/60 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
             />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-alt/50 border-b border-border/40">
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted">ID & Jenis</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Pengirim</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted">Pesan</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-center">Status</th>
                <th className="px-8 py-4 text-[11px] font-black uppercase tracking-widest text-muted text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <AnimatePresence mode="popLayout">
                {filteredComplaints.map((item) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.id} 
                    className="group hover:bg-surface-alt/30 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-foreground">{item.id}</span>
                        <span className="text-[10px] font-bold text-muted uppercase mt-0.5">{item.type}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-alt flex items-center justify-center text-muted group-hover:bg-indigo-600/10 group-hover:text-indigo-600 transition-colors">
                          <User size={14} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-foreground">{item.user}</span>
                          <span className="text-[10px] text-muted">{item.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-xs text-secondary leading-relaxed line-clamp-2 max-w-xs">{item.content}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 text-muted hover:text-indigo-600 hover:bg-indigo-600/10 rounded-xl transition-all">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <AlertCircle size={48} />
                      <p className="text-sm font-black uppercase tracking-widest">Tidak ada pengaduan ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
