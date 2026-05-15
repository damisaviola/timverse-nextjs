"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, Send, ShieldCheck, Mail, 
  MessageSquare, FileText, CheckCircle2, 
  ChevronRight, ArrowLeft, UploadCloud, X, ImageIcon
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { submitReport } from "./actions";
import { createClient } from "@/lib/supabase/client";

export default function UserReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 100 * 1024; // 100 KB
  const MAX_DESCRIPTION = 500;

  useEffect(() => {
    setIsMounted(true);
    
    // Auto-fill email if logged in
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
    };
    
    checkUser();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) processFile(selectedFile);
  };

  const processFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File terlalu besar (Maks. 100 KB). Ukuran file Anda: ${(selectedFile.size / 1024).toFixed(1)} KB`);
      return;
    }

    setFile(selectedFile);
    if (selectedFile.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType || reportType === "Pilih jenis laporan...") {
      setError("Silakan pilih jenis laporan.");
      return;
    }

    if (!category || category === "Pilih kategori...") {
      setError("Silakan pilih kategori laporan.");
      return;
    }
    
    if (!description.trim()) {
      setError("Deskripsi masalah wajib diisi.");
      return;
    }
    
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("report_type", reportType);
    formData.append("category", category);
    formData.append("email", email);
    formData.append("description", description);
    if (file) {
      formData.append("attachment", file);
    }

    try {
      const result = await submitReport(formData);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Gagal mengirim laporan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan teknis. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border/60 rounded-[2.5rem] p-12 max-w-lg w-full text-center shadow-2xl shadow-emerald-500/5"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-8 ring-8 ring-emerald-500/5">
            <CheckCircle2 size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Laporan Terkirim!</h2>
          <p className="text-secondary mt-4 leading-relaxed font-medium">
            Terima kasih telah membantu kami menjadi lebih baik. Tim teknis dan redaksi kami akan segera meninjau laporan Anda.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            <Link 
              href="/"
              className="w-full py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all shadow-lg shadow-accent/20"
            >
              Kembali ke Beranda
            </Link>
            <button 
              onClick={() => {
                setSubmitted(false);
                setReportType("");
                setCategory("");
                setDescription("");
                setFile(null);
                setPreviewUrl(null);
              }}
              className="text-xs font-bold text-muted hover:text-foreground transition-colors uppercase tracking-widest"
            >
              Kirim Laporan Lain
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16" id="report-page">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        {/* Header Column */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <AlertCircle size={14} />
              Pusat Pengaduan
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-[1.1]">
              Ada Masalah dengan <span className="text-accent underline decoration-accent/20">TIMVERSE?</span>
            </h1>
            <p className="text-secondary mt-6 leading-relaxed font-medium">
              Laporkan bug, kesalahan penulisan, atau konten yang tidak sesuai. Kami menghargai setiap masukan Anda.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-surface-alt/40 border border-border/60 rounded-[1.5rem] space-y-4"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-accent/10 rounded-xl text-accent">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Kendalitas Data</h3>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">Semua laporan akan diproses secara anonim dan aman oleh tim kepatuhan kami.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Respon Cepat</h3>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">Kami berkomitmen merespon laporan kritis dalam waktu kurang dari 24 jam.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border/60 rounded-[2.5rem] p-8 sm:p-10 shadow-sm relative overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[11px] font-bold flex items-center gap-2 mb-2"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Jenis Laporan</label>
                  <div className="relative group">
                    <select 
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer group-hover:bg-surface-alt/40"
                    >
                      <option>Pilih jenis laporan...</option>
                      <option>Bug/Masalah Teknis</option>
                      <option>Typo/Kesalahan Penulisan</option>
                      <option>Konten Tidak Sesuai</option>
                      <option>Saran & Masukan</option>
                      <option>Lainnya</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Kategori</label>
                  <div className="relative group">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer group-hover:bg-surface-alt/40"
                    >
                      <option>Pilih kategori...</option>
                      <option>Mimika</option>
                      <option>Pemerintahan</option>
                      <option>Sosial</option>
                      <option>Teknologi</option>
                      <option>Bisnis</option>
                      <option>Olahraga</option>
                      <option>Hiburan</option>
                      <option>Sains</option>
                      <option>Politik</option>
                      <option>Lainnya</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Email (Optional)</label>
                  <div className="group">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com" 
                      className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all group-hover:bg-surface-alt/40"
                    />
                  </div>
                  <p className="text-[9px] text-muted/50 ml-2 italic">Isi jika Anda ingin kami hubungi kembali terkait laporan ini.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Deskripsi Masalah</label>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${description.length >= MAX_DESCRIPTION ? 'text-red-500' : 'text-muted'}`}>
                    {description.length}/{MAX_DESCRIPTION} Karakter
                  </span>
                </div>
                <div className="group relative">
                  <textarea 
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={MAX_DESCRIPTION}
                    placeholder="Ceritakan detail masalah atau masukan Anda..."
                    className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none group-hover:bg-surface-alt/40"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Lampiran Gambar (Optional - Maks. 100 KB)</label>
                <div 
                  className={`relative rounded-[1.5rem] border-2 border-dashed transition-all p-2 overflow-hidden ${
                    isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-border/40 bg-surface-alt/10 hover:border-accent/40'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="report-upload"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                  
                  {file ? (
                    <div className="p-4 flex flex-col items-center justify-center bg-accent/5">
                      <div className="relative w-32 aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-lg mb-4 group">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-surface-alt flex items-center justify-center text-muted">
                            <ImageIcon size={32} />
                          </div>
                        )}
                        <button 
                          type="button"
                          onClick={removeFile}
                          className="absolute inset-0 bg-red-500/80 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                        >
                          <X size={20} className="mb-1" />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Hapus</span>
                        </button>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-black text-foreground truncate max-w-[200px] mb-1 uppercase tracking-tight">{file.name}</p>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                          {(file.size / 1024).toFixed(1)} KB • SIAP DIKIRIM
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label 
                      htmlFor="report-upload"
                      className="flex flex-col items-center justify-center py-10 cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                        <UploadCloud size={24} />
                      </div>
                      <p className="text-xs font-bold text-foreground">
                        {isDragging ? 'Lepaskan Gambar' : 'Tarik & Lepas Gambar'}
                      </p>
                      <p className="text-[10px] text-muted mt-1 font-medium italic">Opsional (Maks. 1 Gambar, 100 KB)</p>
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-foreground text-card rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-accent hover:text-white transition-all shadow-xl shadow-black/5 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} strokeWidth={2.5} />
                      Kirim Laporan
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}
