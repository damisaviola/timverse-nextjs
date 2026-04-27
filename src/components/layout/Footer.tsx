import Link from "next/link";
import { Heart, Newspaper, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Kategori", href: "/category" },
  { label: "Kontribusi", href: "/contribute" },
  { label: "Laporan", href: "/report" },
];

const categories = ["Teknologi", "Bisnis", "Olahraga", "Hiburan", "Sains", "Gaya Hidup"];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background" id="site-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <Newspaper size={16} className="text-accent" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                TIMVERSE<span className="text-accent">.</span>
              </h2>
            </Link>
            <p className="mt-3 text-xs sm:text-sm text-secondary max-w-sm leading-relaxed">
              Portal berita modern Indonesia yang menyajikan informasi terkini,
              terpercaya, dan mendalam dari berbagai kategori.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-semibold text-muted uppercase tracking-wider mb-3 sm:mb-4">Navigasi</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs sm:text-sm text-secondary hover:text-accent transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-muted/50" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[10px] sm:text-xs font-semibold text-muted uppercase tracking-wider mb-3 sm:mb-4">Kategori</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href="/category"
                    className="text-xs sm:text-sm text-secondary hover:text-accent transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ChevronRight size={12} className="text-muted/50" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-[10px] sm:text-xs text-muted">
            © {new Date().getFullYear()} TIMVERSE. All rights reserved.
          </p>
          <p className="text-[10px] sm:text-xs text-muted flex items-center gap-1">
            Made with <Heart size={10} className="text-accent fill-accent" /> in Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
