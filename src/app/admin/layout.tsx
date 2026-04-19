"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Cari sumber daya..."
                className="block w-full pl-10 pr-3 py-2 border border-border/60 rounded-xl bg-surface-alt dark:bg-background text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions & User */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="h-6 w-px bg-border hidden sm:block" />
            <button className="flex items-center gap-2.5 p-1 rounded-full hover:bg-surface-alt transition-all group">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all">
                AD
              </div>
              <div className="hidden sm:block text-left mr-1">
                <p className="text-[11px] font-bold text-foreground leading-none">Admin TIMVERSE</p>
                <p className="text-[10px] text-muted mt-0.5 leading-none">admin@timverse.id</p>
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
