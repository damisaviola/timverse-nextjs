"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, X, LayoutDashboard, FileText, FilePlus, 
  BarChart3, AlertCircle, MessageSquare, FolderOpen, 
  Settings, ChevronRight, CornerDownLeft, HardDrive
} from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const ADMIN_MENU_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, category: "Utama" },
  { label: "Semua Artikel", href: "/admin", icon: FileText, category: "Konten" },
  { label: "Tambah Berita", href: "/admin/news/create", icon: FilePlus, category: "Konten" },
  { label: "Analitik & Performa", href: "/admin/reports", icon: BarChart3, category: "Sistem" },
  { label: "Daftar Pengaduan", href: "/admin/complaints", icon: AlertCircle, category: "Sistem" },
  { label: "Moderasi Komentar", href: "/admin/comments", icon: MessageSquare, category: "Sistem" },
  { label: "Kategori Berita", href: "/admin/categories", icon: FolderOpen, category: "Konten" },
  { label: "Manajemen Storage", href: "/admin/storage", icon: HardDrive, category: "Sistem" },
  { label: "Pengaturan Portal", href: "/admin#settings", icon: Settings, category: "Sistem" },
];

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update local state when URL changes
  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== searchQuery) {
      setSearchQuery(q || "");
    }
  }, [searchParams]);

  const filteredMenu = ADMIN_MENU_ITEMS.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setShowDropdown(true);
  };

  const executeSearch = (val: string, isMenuAction = false) => {
    // Create new params
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    
    // Update URL without refreshing
    router.push(`${pathname}?${params.toString()}`);
    if (!isMenuAction) setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeSearch(searchQuery);
    }
  };

  const navigateTo = (href: string) => {
    router.push(href);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-surface-alt dark:bg-background transition-colors duration-300">
        {/* Admin Top Bar (Filament Style) */}
        <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-card dark:bg-sidebar border-b border-border/60 shadow-sm">
          {/* Left: Mobile Spacer & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
            <nav className="hidden sm:flex items-center gap-2 text-xs font-medium text-muted">
              <span className="hover:text-foreground transition-colors cursor-pointer">Admin</span>
              <span className="text-border">/</span>
              <span className="text-foreground">Dashboard</span>
            </nav>
          </div>

          {/* Center: Global Search */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block relative" ref={searchRef}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari menu atau isi data..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-10 py-2 border border-border/60 rounded-xl bg-surface-alt dark:bg-background text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); executeSearch(""); }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-indigo-500 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Results Dropdown */}
            <AnimatePresence>
              {showDropdown && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                >
                  <div className="px-3 py-2 mb-1 border-b border-border/40">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted">Hasil Navigasi</p>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredMenu.length > 0 ? (
                      filteredMenu.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => navigateTo(item.href)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-alt group transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Icon size={16} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-foreground">{item.label}</p>
                                <p className="text-[10px] text-muted">{item.category}</p>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-border group-hover:text-indigo-500 transition-colors" />
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-xs font-medium text-muted">Menu tidak ditemukan.</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => executeSearch(searchQuery)}
                    className="w-full mt-2 flex items-center justify-between p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <div className="flex items-center gap-2">
                      <Search size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Cari Konten: &quot;{searchQuery}&quot;</span>
                    </div>
                    <CornerDownLeft size={14} className="opacity-50" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <button className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-alt transition-all group">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all">
                {user?.email?.substring(0, 2).toUpperCase() || "AD"}
              </div>
              <div className="hidden sm:block text-left mr-1">
                <p className="text-[11px] font-bold text-foreground leading-none">Admin TIMVERSE</p>
                <p className="text-[10px] text-muted mt-0.5 leading-none">{user?.email}</p>
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
