"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  Tag, Send, Save, ImageIcon, ChevronRight, X, Plus, UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { categories } from "@/data/mockNews";
import { createNews } from "@/app/admin/news/actions";

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
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));
    if (file) {
      formData.append("thumbnail", file);
    }

    try {
      const result = await createNews(formData);
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
      } else {
        alert("Berita berhasil diterbitkan!");
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan teknis. Silakan coba lagi.");
      setIsPending(false);
    }
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
        .filepond--root {
          margin-bottom: 0 !important;
          font-family: inherit;
        }
        .filepond--panel-root {
          background-color: transparent;
          border: 1px dashed var(--border);
          border-radius: 0.75rem;
        }
        .filepond--drop-label {
          color: var(--color-muted);
          cursor: pointer;
        }
        .filepond--label-action {
          text-decoration-color: rgba(99, 102, 241, 0.5);
          color: #6366f1;
        }
        .filepond--item-panel {
          border-radius: 0.5rem;
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
          <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground">
                Judul Berita
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul berita..."
                className="w-full bg-transparent border border-border/60 rounded-lg px-4 py-3 text-lg font-medium text-foreground placeholder:text-muted focus:outline-none focus:border-indigo-500 transition-colors"
              />
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
          <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border/40 pb-4">
              Atribut Berita
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Kategori</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent border border-border/60 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Pilih kategori berita...</option>
                    {categories.slice(1).map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    <ChevronRight size={14} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Tag Berita</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Ketik & Tekan Enter..."
                    className="w-full bg-transparent border border-border/60 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500 transition-colors pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddTag()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted hover:bg-surface hover:text-foreground transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* Tag Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <AnimatePresence>
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface border border-border/40 text-[11px] font-medium text-foreground transition-colors"
                      >
                        {tag}
                        <button 
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted hover:text-red-500 transition-colors outline-none"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Gambar Utama (Thumbnail)</label>
                <div className="relative overflow-hidden rounded-lg border-2 border-dashed border-border/60 hover:border-indigo-500/50 transition-colors bg-surface/30 group">
                  {previewUrl ? (
                    <div className="relative w-full h-40">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button 
                          type="button" 
                          onClick={handleRemoveFile} 
                          className="bg-red-500/90 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <X size={14} />
                          Hapus Gambar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-40 cursor-pointer">
                      <UploadCloud className="w-8 h-8 text-muted-foreground mb-3 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Klik untuk mengunggah gambar
                      </span>
                      <span className="text-xs text-muted/80 mt-1.5">PNG, JPG, atau WEBP (Maks. 2MB)</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                        ref={fileInputRef}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Ringkasan (Excerpt)</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Gambarkan inti berita secara singkat..."
                  className="w-full h-24 bg-transparent border border-border/60 rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-card border border-border/40 rounded-xl p-6 shadow-sm space-y-3">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium mb-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Terbitkan Berita
                </>
              )}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveDraft}
              className="w-full flex items-center justify-center gap-2 bg-transparent border border-border/60 px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              Simpan Draft
            </button>
          </div>
        </div>
      </div>
    </motion.form>
  );
}
