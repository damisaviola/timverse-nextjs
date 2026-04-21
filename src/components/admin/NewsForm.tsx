"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  Tag, Send, Save, ImageIcon, ChevronRight, X, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/mockNews";

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

// Dynamically import TinyMCE with SSR disabled
const TinyEditor = dynamic(() => import("./TinyEditor"), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-surface-alt/20 animate-pulse rounded-2xl flex items-center justify-center border border-border/40">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-xs font-bold text-muted uppercase tracking-widest">Memuat Editor Pro...</span>
      </div>
    </div>
  )
});

export default function NewsForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Publishing:", { title, category, tags, excerpt, content, thumbnail: files[0]?.file });
    alert("Berita berhasil dipublish! Data lengkap telah dicatat di konsol.");
  };

  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter' && e.key !== ',') return;
    if (e) e.preventDefault();

    const trimmedTag = tagInput.trim().replace(/,$/, "");
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveDraft = () => {
    alert("Draft tersimpan! (Demo)");
  };


  return (
    <motion.form
      onSubmit={handlePublish}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto"
      id="news-form"
    >
      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }

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
        }
        .filepond--file-action-button {
          background-color: rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }
        .filepond--credits {
          display: none;
        }
      `}</style>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Title Card */}
          <div className="bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.01] transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/40">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Judul Berita Utama
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Berisikan judul berita yang kuat dan menarik perhatian..."
                  className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-8 py-7 text-3xl md:text-4xl font-black text-foreground placeholder:text-muted/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all tracking-tight"
                />
              </div>
            </div>
          </div>

          {/* Editor Area (No Card) */}
          <div className="w-full">
            <TinyEditor 
              value={content}
              onChange={setContent}
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8 sticky top-24">
          {/* Metadata Card */}
          <div className="bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.01] space-y-7">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
              <Tag size={16} className="text-indigo-500" />
              Atribut Berita
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60">Kategori</label>
                <div className="relative group">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer group-hover:bg-surface-alt/40"
                  >
                    <option value="">Pilih kategori berita...</option>
                    {categories.slice(1).map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    <ChevronRight size={14} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60">Tag Berita</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Ketik & Tekan Enter..."
                    className="w-full bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-4 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all pr-14 group-hover:bg-surface-alt/40"
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddTag()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* Tag Badges */}
                <div className="flex flex-wrap gap-2 min-h-[12px] pt-1">
                  <AnimatePresence>
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-alt/60 border border-border/40 text-[10px] font-bold text-foreground group/tag hover:border-indigo-500/30 transition-colors"
                      >
                        <span className="opacity-40 text-indigo-500">#</span>
                        {tag}
                        <button 
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-0.5 text-muted hover:text-red-500 transition-colors outline-none"
                        >
                          <X size={10} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {tags.length === 0 && (
                    <span className="text-[10px] text-muted/30 italic font-bold uppercase tracking-tighter py-1">Belum ada tag...</span>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60">Gambar Utama (Thumbnail)</label>
                <div className="relative group overflow-hidden rounded-[1.5rem]">
                  <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    maxFiles={1}
                    name="files"
                    labelIdle='Tarik & Lepas gambar atau <span class="filepond--label-action">Pilih File</span>'
                    acceptedFileTypes={["image/*"]}
                    labelFileTypeNotAllowed="Hanya file gambar yang diizinkan"
                    maxFileSize="500KB"
                    labelMaxFileSizeExceeded="File terlalu besar"
                    labelMaxFileSize="Ukuran maksimum adalah {filesize}"
                    server={{
                      process: (fieldName, file, metadata, load, error, progress, abort) => {
                        // Simulated Upload Progress Animation (2 seconds)
                        let p = 0;
                        const interval = setInterval(() => {
                          p += 5;
                          progress(true, p, 100);
                          if (p >= 100) {
                            clearInterval(interval);
                            load(file);
                          }
                        }, 100);
                        return {
                          abort: () => {
                            clearInterval(interval);
                            abort();
                          }
                        };
                      }
                    }}
                    imagePreviewHeight={170}
                    stylePanelLayout="compact"
                    styleLoadIndicatorPosition="center bottom"
                    styleProgressIndicatorPosition="right bottom"
                    styleButtonRemoveItemPosition="left bottom"
                    styleButtonProcessItemPosition="right bottom"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted/60">Ringkasan SEO (Excerpt)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Gambarkan inti berita secara singkat untuk menarik pembaca..."
                  className="w-full h-36 bg-surface-alt/20 border border-border/40 rounded-[1.5rem] px-6 py-5 text-xs font-medium text-foreground placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none leading-relaxed group-hover:bg-surface-alt/40"
                />
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-card border border-border/60 rounded-[2rem] p-8 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.01] space-y-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 hover:-translate-y-1 active:translate-y-0"
            >
              <Send size={16} />
              Terbitkan Sekarang
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full flex items-center justify-center gap-3 bg-surface-alt/40 border border-border/60 px-6 py-4 rounded-2xl text-[11px] font-bold text-secondary hover:bg-surface-alt hover:text-foreground transition-all active:scale-95"
            >
              <Save size={16} />
              Simpan Sebagai Draft
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 opacity-40">
              <span className="w-1 h-1 rounded-full bg-muted" />
              <p className="text-[9px] text-muted font-bold uppercase tracking-tighter">Terakhir disimpan: Menghitung detik...</p>
            </div>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
