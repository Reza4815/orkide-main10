import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, Clock, User } from "lucide-react";
import { getBlogPost, getBlogPosts } from "@/lib/store-queries";
import { formatFaDate, toFa } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SafeImage } from "@/components/SafeImage";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "وبلاگ" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getBlogPost(slug), getBlogPosts()]);
  if (!post) notFound();
  const related = all.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <article className="container-shop animate-fade-in py-8 md:py-12">
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <ChevronLeft className="size-3" />
        <Link href="/blog" className="hover:text-primary">وبلاگ</Link>
        <ChevronLeft className="size-3" />
        <span className="line-clamp-1 text-ink">{post.title}</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full bg-blush px-2.5 py-1 text-[10px] text-primary">
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-xl font-extrabold leading-9 tracking-tight text-ink md:text-3xl md:leading-[1.6]">{post.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="size-3.5 text-primary" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-primary" />
            {formatFaDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" />
            {toFa(post.readMinutes)} دقیقه مطالعه
          </span>
        </div>

        <div className="relative mt-6 h-60 overflow-hidden rounded-3xl border border-border/60 bg-blush shadow-soft md:h-80">
          <SafeImage src={post.cover} alt={post.title} fill priority sizes="(max-width: 768px) 100vw, 768px" />
        </div>

        <div className="mt-8 space-y-5">
          {post.content.map((para, i) => (
            <p key={i} className="text-sm leading-8 text-foreground/85 md:text-[15px] md:leading-9">
              {para}
            </p>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-gradient-to-br from-primary-soft/50 via-blush to-background p-4">
          <Avatar className="size-11">
            <AvatarFallback>او</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-ink">{post.author}</p>
            <p className="text-xs text-muted-foreground">تیم تولید محتوای فروشگاه ارکیده</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-3xl">
          <h2 className="section-title mb-5">مطالب مرتبط</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group flex gap-4 rounded-3xl border border-border/60 bg-card p-3 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(232,168,184,0.5)]"
              >
                <span className="relative block h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-blush">
                  <SafeImage src={p.cover} alt={p.title} fill sizes="112px" className="transition-transform duration-700 group-hover:scale-110" />
                </span>
                <span className="flex flex-col justify-center gap-1">
                  <span className="line-clamp-2 text-sm font-bold leading-6 text-ink group-hover:text-primary">{p.title}</span>
                  <span className="text-[10px] text-muted-foreground">{formatFaDate(p.date)}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
