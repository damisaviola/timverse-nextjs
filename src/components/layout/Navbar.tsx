"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Kategori", href: "/category" },
  { label: "Kontribusi", href: "/contribute" },
  { label: "Laporan", href: "/report" },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-navbar/80 backdrop-blur-xl"
      id="main-navbar"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-8">
          {/* Left Section (Logo & Nav Links) */}
          <div className="flex items-center gap-8 lg:gap-12">
            {/* 1. Logo Section */}
            <Link href="/" className="flex-shrink-0 group flex items-center gap-2" id="navbar-logo">
              <h1 className="text-xl font-black tracking-tighter text-foreground">
                TIMVERSE<span className="text-accent">.</span>
              </h1>
            </Link>

            {/* 2. Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-secondary rounded-full"
                  aria-label={`Navigasi ke ${link.label}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 3. Right Actions Section */}
          <div className="flex items-center gap-4">
            {/* Search (Desktop Icon Style) */}
            <div className="hidden md:flex relative group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors"
              />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 xl:w-60 rounded-2xl bg-surface/50 border border-border/40 pl-11 pr-4 py-2.5 text-[11px] font-bold text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 focus:w-56 xl:focus:w-72 transition-all duration-500"
                id="desktop-search"
              />
            </div>

            <div className="h-6 w-px bg-border/40 hidden md:block mx-2" />

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              <Link 
                href="/login"
                className="p-3 rounded-2xl bg-surface border border-border/40 text-secondary shadow-sm"
                aria-label="Login Ke Akun"
              >
                <User size={20} />
              </Link>
            </div>


          </div>
        </div>
      </div>
    </header>
  );
}
