import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PenSquare } from "lucide-react";
import NewsForm from "@/components/admin/NewsForm";

interface EditNewsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !news) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col gap-4">
        <Link 
          href={news.status === 'draft' ? "/admin/news/drafts" : "/admin"} 
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-indigo-600 transition-colors w-fit group"
        >
          <div className="p-1.5 rounded-lg bg-surface-alt group-hover:bg-indigo-600/10 transition-colors">
            <ChevronLeft size={14} />
          </div>
          Kembali ke Daftar
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20 text-white">
              <PenSquare size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">Edit Berita</h1>
              <p className="text-sm text-secondary font-medium">Perbarui konten berita atau edit draft Anda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Mega Form */}
      <NewsForm initialData={news} />
    </div>
  );
}
