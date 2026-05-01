import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getArticleBySlug, getRelatedArticles } from "@/data/mockNews";
import { formatDate } from "@/lib/utils";
import CommentSection from "@/components/news/CommentSection";
import RelatedNews from "@/components/news/RelatedNews";
import InteractionButtons from "@/components/news/InteractionButtons";
import ReadingToolbar from "@/components/news/ReadingToolbar";
import { createClient } from "@/lib/supabase/server";
import { incrementViews } from "@/app/article/actions";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch data langsung di Server (Cepat & SEO Friendly)
  const { data: dbArticle } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .single();

  let article = null;

  if (dbArticle) {
    article = {
      ...dbArticle,
      id: dbArticle.id,
      title: dbArticle.title,
      excerpt: dbArticle.excerpt,
      content: dbArticle.content,
      category: dbArticle.category,
      author: dbArticle.author || "Admin",
      authorAvatar: dbArticle.author_avatar || "AD",
      date: dbArticle.date || dbArticle.created_at,
      readTime: dbArticle.read_time || "5 menit",
      imageGradient: dbArticle.image_gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      thumbnail_url: dbArticle.thumbnail_url,
      tags: dbArticle.tags || []
    };

    // Increment Views
    incrementViews(article.id);
  } else {
    // Fallback ke mock jika data di DB tidak ada
    article = getArticleBySlug(slug);
  }

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, article.category);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-8" id="article-page">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors mb-6"
        id="back-to-home"
      >
        <ArrowLeft size={16} />
        Kembali ke Beranda
      </Link>

      {/* Article Header */}
      <header>
        {/* Category */}
        <span className="inline-block bg-badge-bg text-badge-text text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="mt-4 text-lg text-secondary leading-relaxed">
          {article.excerpt}
        </p>

        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pb-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
              {article.authorAvatar}
            </div>
            <span className="text-sm font-medium text-foreground">{article.author}</span>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-secondary">
            <Calendar size={14} />
            {formatDate(article.date)}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-secondary">
            <Clock size={14} />
            {article.readTime}
          </span>
          <div className="flex-1" />
          <InteractionButtons articleId={article.id} />
        </div>
      </header>

      {/* Featured Image */}
      <div className="mt-8">
        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden bg-surface-alt shadow-lg flex items-center justify-center">
          {article.thumbnail_url ? (
            <img 
              src={article.thumbnail_url} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted font-black text-xl uppercase tracking-widest opacity-20">No Article Image</div>
          )}
        </div>
      </div>

      {/* Article Body with Reading Controls */}
      <ReadingToolbar content={article.content} />

      {/* Tags */}
      {(() => {
        const tags: string[] = article.tags && article.tags.length > 0
          ? article.tags
          : [article.category];
        return (
          <div className="flex flex-wrap items-center gap-2.5 mt-10">
            {tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/category?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center justify-center text-xs font-bold bg-surface/80 backdrop-blur-sm text-secondary px-4 py-2 rounded-full border border-border/60 hover:border-accent hover:text-accent transition-all duration-300"
              >
                #{tag}
              </Link>
            ))}
          </div>
        );
      })()}

      {/* Related News */}
      <RelatedNews articles={relatedArticles} />

      {/* Comments Area */}
      <CommentSection articleId={article.id} />
    </article>
  );
}
