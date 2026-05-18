import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import NewsCard from "@/components/news/NewsCard";
import { Search, Info } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  const supabase = await createClient();

  if (!query) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted">
          <Search size={24} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Silakan masukkan kata kunci pencarian</h2>
        <p className="text-secondary mt-2">Gunakan kotak pencarian di atas untuk mulai mencari berita.</p>
      </div>
    );
  }

  const { data: results, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%,category.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  // Catat pencarian jika ada hasil
  if (results && results.length > 0) {
    const { incrementSearchCount } = await import("./actions");
    await incrementSearchCount(results.map(r => r.id));
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center">
        <p className="text-red-500 font-bold">Terjadi kesalahan saat memuat hasil pencarian.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border/60">
        <div>
          <h2 className="text-2xl font-black text-foreground">Hasil Pencarian untuk &quot;{query}&quot;</h2>
          <p className="text-sm text-secondary mt-1">Ditemukan {results?.length || 0} berita yang relevan.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-[10px] font-black uppercase tracking-widest text-muted">
          <Info size={14} />
          Menampilkan hasil terbaru
        </div>
      </div>

      {results && results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {results.map((news: any, index: number) => (
            <NewsCard
              key={news.id}
              index={index}
              article={{
                ...news,
                author: news.author || "Admin",
                authorAvatar: news.author_avatar || "AD",
                date: news.date || news.created_at,
                readTime: news.read_time || "5 menit",
                imageGradient: news.image_gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              } as any}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface/30 border border-dashed border-border rounded-[2.5rem]">
          <div className="w-20 h-20 bg-background border border-border rounded-3xl flex items-center justify-center mx-auto mb-6 text-muted/30">
            <Search size={32} />
          </div>
          <h2 className="text-2xl font-black text-foreground">Maaf, berita tidak ditemukan</h2>
          <p className="text-secondary mt-3 max-w-md mx-auto leading-relaxed">
            Kami tidak menemukan hasil untuk &quot;{query}&quot;. Coba gunakan kata kunci yang lebih umum atau periksa ejaan Anda.
          </p>
        </div>
      )}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = "" } = await searchParams;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Mencari Berita...</p>
          </div>
        }>
          <SearchResults query={query} />
        </Suspense>
      </main>
    </div>
  );
}
