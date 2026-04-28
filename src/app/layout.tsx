import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import LayoutShell from "@/components/layout/LayoutShell";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIMVERSE. — Portal Berita Modern",
  description:
    "Portal berita modern Indonesia yang menyajikan informasi terkini, terpercaya, dan mendalam dari berbagai kategori.",
  keywords: ["berita", "portal", "indonesia", "timverse", "news"],
  authors: [{ name: "TIMVERSE" }],
  openGraph: {
    title: "TIMVERSE. — Portal Berita Modern",
    description: "Portal berita modern Indonesia.",
    type: "website",
    locale: "id_ID",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TIMVERSE.",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={outfit.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className={`${outfit.className} min-h-full flex flex-col antialiased`}>
        <ThemeProvider>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
