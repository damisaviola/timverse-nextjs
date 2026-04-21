"use client";

import { motion } from "framer-motion";
import { 
  AlertCircle, Send, ShieldCheck, Mail, 
  MessageSquare, FileText, CheckCircle2, 
  ChevronRight, ArrowLeft 
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// FilePond Imports
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";

// Register FilePond Plugins
if (typeof window !== "undefined") {
  registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType, FilePondPluginFileValidateSize);
}

export default function UserReportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
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
              onClick={() => setSubmitted(false)}
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
      <style jsx global>{`
        /* Modern FilePond Customization */
        .filepond--root {
          margin-bottom: 0 !important;
          font-family: inherit;
        }
        .filepond--panel-root {
          background-color: var(--bg-tertiary);
          border: 2px dashed var(--border);
          opacity: 0.4;
          border-radius: 1.5rem;
        }
        .filepond--drop-label {
          color: var(--color-muted);
          cursor: pointer;
        }
        .filepond--label-action {
          text-decoration-color: rgba(99, 102, 241, 0.5);
          color: #6366f1;
          font-weight: 800;
        }
        .filepond--item-panel {
          border-radius: 1rem;
          background-color: #6366f1 !important;
          box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.4);
        }
        .filepond--file-action-button {
          background-color: rgba(0, 0, 0, 0.5);
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }
        .filepond--file-action-button:hover {
          background-color: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
        }
        .filepond--image-preview {
          background: var(--bg-tertiary);
        }
        .filepond--credits {
          display: none;
        }
      `}</style>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Jenis Laporan</label>
                  <div className="relative group">
                    <select className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer group-hover:bg-surface-alt/40">
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Email (Optional)</label>
                  <div className="group">
                    <input 
                      type="email" 
                      placeholder="nama@email.com" 
                      className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all group-hover:bg-surface-alt/40"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Deskripsi Masalah</label>
                <div className="group">
                  <textarea 
                    rows={5}
                    placeholder="Ceritakan detail masalah atau masukan Anda..."
                    className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none group-hover:bg-surface-alt/40"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60 ml-1">Lampiran Gambar (Optional)</label>
                <div className="relative group overflow-hidden rounded-[1.5rem]">
                  {!isMounted ? (
                    <div className="h-[120px] w-full bg-surface-alt/20 animate-pulse rounded-[1.5rem] flex items-center justify-center border border-dashed border-border/40">
                       <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Menyiapkan Upload...</span>
                    </div>
                  ) : (
                    <FilePond
                      files={files}
                      onupdatefiles={setFiles}
                      allowMultiple={true}
                      maxFiles={3}
                      name="files"
                      labelIdle='Tarik & Lepas gambar atau <span class="filepond--label-action">Pilih File</span>'
                      acceptedFileTypes={["image/*"]}
                      labelFileTypeNotAllowed="Hanya file gambar yang diizinkan"
                      maxFileSize="500KB"
                      labelMaxFileSizeExceeded="File terlalu besar"
                      labelMaxFileSize="Ukuran maksimum adalah {filesize}"
                      server={{
                        process: (fieldName, file, metadata, load, error, progress, abort) => {
                          let p = 0;
                          const interval = setInterval(() => {
                            p += 5;
                            progress(true, p, 100);
                            if (p >= 100) {
                              clearInterval(interval);
                              load(file);
                            }
                          }, 100);
                          return { abort: () => { clearInterval(interval); abort(); } };
                        }
                      }}
                      imagePreviewHeight={170}
                      stylePanelLayout="compact"
                      styleLoadIndicatorPosition="center bottom"
                      styleProgressIndicatorPosition="right bottom"
                      styleButtonRemoveItemPosition="left bottom"
                      styleButtonProcessItemPosition="right bottom"
                    />
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
