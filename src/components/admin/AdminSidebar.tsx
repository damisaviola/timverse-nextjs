"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  LifeBuoy,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/app/auth/actions";

interface SidebarLink {
  label: string;
  href: string;
  icon: any;
  badge?: string;
}

interface SidebarGroup {
  label: string | null;
  links: SidebarLink[];
}

const groups: SidebarGroup[] = [
  {
    label: null,
    links: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Sumber Daya",
    links: [
      { label: "Semua Artikel", href: "/admin#articles", icon: FileText, badge: "128" },
      { label: "Tambah Berita", href: "/admin/news/create", icon: FilePlus },
      { label: "Kategori", href: "/admin#categories", icon: FolderOpen },
    ],
  },
  {
    label: "Sistem",
    links: [
      { label: "Analitik", href: "/admin/reports", icon: BarChart3 },
      { label: "Pengaduan", href: "/admin/complaints", icon: AlertCircle, badge: "3" },
      { label: "Pengaturan", href: "/admin#settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use useEffect to handle hydration safely
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    // If not mounted yet (server pre-render or first client-side pass), 
    // only check the base pathname to avoid hydration mismatch.
    if (!mounted) {
      return pathname === href;
    }

    // After mounting, we can safely access browser-only properties like location.hash
    const hash = window.location.hash;
    if (!hash && href === "/admin") return true;
    return href.endsWith(hash) && hash !== "";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card dark:bg-sidebar overflow-hidden">
      {/* Logo Area */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-border/60">
        <Link href="/" className="flex items-center gap-2">
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-foreground">
              TIMVERSE<span className="text-indigo-600 dark:text-indigo-400">.</span>
            </span>
          )}
          {collapsed && (
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">T.</span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-surface-alt transition-colors text-muted hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft
            size={16}
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-7 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {groups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && group.label && (
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted/60 mb-2">
                {group.label}
              </h3>
            )}
            <div className="space-y-1">
              {group.links.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      active
                        ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400"
                        : "text-secondary hover:bg-surface-alt hover:text-foreground"
                    }`}
                    title={collapsed ? link.label : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <Icon 
                        size={20} 
                        strokeWidth={active ? 2.5 : 1.8}
                        className={`transition-colors duration-200 ${
                          active ? "text-indigo-600 dark:text-indigo-400" : "text-muted group-hover:text-foreground"
                        }`} 
                      />
                      {!collapsed && <span>{link.label}</span>}
                    </div>
                    {!collapsed && link.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${
                        active 
                          ? "bg-indigo-600 text-white" 
                          : "bg-surface-alt text-secondary border border-border"
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 border-t border-border/60 pt-4 space-y-1">
        <Link
          href="/contribute"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-secondary hover:bg-surface-alt hover:text-foreground transition-all"
        >
          <LifeBuoy size={20} strokeWidth={1.8} className="text-muted" />
          {!collapsed && <span>Bantuan</span>}
        </Link>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-secondary hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut size={20} strokeWidth={1.8} className="text-muted group-hover:text-red-500" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-[45] p-2 bg-card rounded-xl border border-border shadow-sm text-foreground active:scale-95 transition-all"
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-[80] w-[280px] border-r border-border"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside
        className={`hidden lg:block flex-shrink-0 bg-card border-r border-border/60 transition-[width] duration-300 ease-in-out will-change-[width] ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-card border border-border/60 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-2">
                <LogOut size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Keluar dari Dashboard?</h3>
                <p className="text-sm text-secondary mt-1">Anda harus masuk kembali untuk mengakses portal admin.</p>
              </div>
              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-foreground bg-surface hover:bg-surface-alt transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                      await logout();
                    } catch (error) {
                      setIsLoggingOut(false);
                      console.error("Logout failed:", error);
                    }
                  }}
                  disabled={isLoggingOut}
                  className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Ya, Keluar"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
