import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft, Newspaper } from "lucide-react";
import { getBlogPosts } from "@/lib/store-queries";
import { formatFaDate, toFa } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";

export const metadata: Metadata = {
  title: "وبلاگ",
  description: "راهنمای خرید، نکات نگهداری و ترندهای لباس زیر در وبلاگ ارکیده.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container-shop animate-fade-in py-8 md:py-12">
      <div className="mb-8 flex items-center gap-2.5">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary-soft via-primary to-primary-deep text-primary-foreground">
          <Newspaper className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">وبلاگ ارکیده</h1>
          <p className="text-xs leading-relaxed text-muted-foreground">راهنماها و نکته‌هایی برای انتخاب بهتر</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(232,168,184,0.5)]"
          >
            <div className="relative h-48 overflow-hidden bg-blush md:h-52">
              <SafeImage
                src={post.cover}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute bottom-3 start-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] text-muted-foreground backdrop-blur">
                {formatFaDate(post.date)}
              </span>
            </div>
            <div className="p-4 md:p-5">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full bg-blush px-2 py-0.5 text-[10px] text-primary">
                    {t}
                  </span>
                ))}
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                  {toFa(post.readMinutes)} دقیقه مطالعه
                </span>
              </div>
              <h2 className="line-clamp-2 text-sm font-bold leading-6 text-ink transition-colors group-hover:text-primary md:text-base md:leading-7">
                {post.title}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                ادامه مطلب
                <ChevronLeft className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
