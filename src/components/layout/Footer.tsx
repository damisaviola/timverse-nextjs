import Link from "next/link";
import { Heart, Newspaper, ChevronRight } from "lucide-react";

const categories = ["Teknologi", "Bisnis", "Olahraga", "Hiburan", "Sains", "Gaya Hidup"];

export default function Footer() {
  return (
    <>
      {/* ===== Desktop Footer ===== */}
      <footer className="hidden md:block border-t border-border bg-background" id="site-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-block">
                <h2 className="text-xl font-bold text-foreground">
                  TIMVERSE<span className="text-accent">.</span>
                </h2>
              </Link>
              <p className="mt-3 text-sm text-secondary max-w-md leading-relaxed">
                Portal berita modern Indonesia yang menyajikan informasi terkini, 
                terpercaya, dan mendalam dari berbagai kategori.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Navigasi</h3>
              <ul className="space-y-2.5">
                {["Beranda", "Kategori", "Kontribusi", "Tentang"].map((item) => (
                  <li key={item}>
                    <Link
                      href={item === "Beranda" ? "/" : item === "Kategori" ? "/category" : item === "Kontribusi" ? "/contribute" : "/"}
                      className="text-sm text-secondary hover:text-accent transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Kategori</h3>
              <ul className="space-y-2.5">
                {["Teknologi", "Bisnis", "Olahraga", "Hiburan"].map((cat) => (
                  <li key={cat}>
                    <Link
                      href="/category"
                      className="text-sm text-secondary hover:text-accent transition-colors duration-200"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} TIMVERSE. All rights reserved.
            </p>
            <p className="text-xs text-muted flex items-center gap-1">
              Made with <Heart size={12} className="text-accent fill-accent" /> in Indonesia
            </p>
          </div>
        </div>
      </footer>

      {/* ===== Mobile Footer ===== */}
      <footer
        className="block md:hidden border-t border-border bg-surface/50"
        id="mobile-footer"
      >
        {/* Brand Section */}
        <div className="px-5 pt-8 pb-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
              <Newspaper size={18} className="text-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground leading-none">
                TIMVERSE<span className="text-accent">.</span>
              </h2>
              <p className="text-[10px] text-muted mt-0.5 uppercase tracking-wider font-medium">
                Berita Terkini
              </p>
            </div>
          </div>
          <p className="text-xs text-secondary leading-relaxed max-w-xs">
            Portal berita modern Indonesia — informasi terkini, terpercaya, dan mendalam.
          </p>
        </div>

        {/* Quick Links */}
        <div className="px-5 pb-4">
          <div className="border-t border-border pt-4">
            <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2.5">
              Jelajahi
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: "Beranda", href: "/" },
                { label: "Kategori", href: "/category" },
                { label: "Kontribusi", href: "/contribute" },
                { label: "Admin", href: "/admin" },
                { label: "Tentang", href: "/" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-background hover:bg-card-hover border border-transparent hover:border-border transition-all duration-200 group"
                >
                  <span className="text-xs font-medium text-secondary group-hover:text-foreground transition-colors">
                    {link.label}
                  </span>
                  <ChevronRight
                    size={12}
                    className="text-muted group-hover:text-accent transition-colors"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Category Tags */}
        <div className="px-5 pb-4">
          <div className="border-t border-border pt-4">
            <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2.5">
              Kategori Populer
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href="/category"
                  className="px-3 py-1.5 rounded-full bg-background border border-border text-[11px] font-medium text-secondary hover:text-accent hover:border-accent/40 transition-all duration-200"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mx-5 border-t border-border py-4 mb-1">
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[11px] text-muted flex items-center gap-1">
              Made with <Heart size={10} className="text-accent fill-accent" /> in Indonesia
            </p>
            <p className="text-[10px] text-muted/70">
              © {new Date().getFullYear()} TIMVERSE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
