"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  Headset,
  Mail,
  Newspaper,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type { Banner, BlogPost, Brand, Category, Feature, Product } from "@/lib/store-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatFaDate, toFa } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { SafeImage } from "@/components/SafeImage";

/* ---------------------------------- Hero ---------------------------------- */

export function Hero({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0);
  const count = banners.length;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  if (count === 0) return null;

  return (
    <section className="container-shop mt-4 animate-fade-in md:mt-6">
      <div className="relative h-[440px] overflow-hidden rounded-3xl border border-border/60 bg-blush shadow-lift md:h-[480px]">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === active ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <div className="grid h-full md:grid-cols-2">
              <div className="relative z-10 flex flex-col items-start justify-center gap-4 p-8 md:gap-5 md:p-14">
                <span className="animate-fade-up inline-flex w-fit items-center gap-1.5 rounded-full bg-background/70 px-3 py-1 text-[11px] font-semibold text-primary backdrop-blur">
                  <Sparkles className="size-3" />
                  {b.badge}
                </span>
                <h1 className="animate-fade-up text-2xl font-black leading-[1.35] tracking-tight text-ink md:text-[2.6rem] md:leading-[1.3]" style={{ animationDelay: "80ms" }}>
                  {b.title}
                </h1>
                <p className="animate-fade-up max-w-md text-xs leading-relaxed text-muted-foreground md:text-sm" style={{ animationDelay: "160ms" }}>
                  {b.subtitle}
                </p>
                <div className="animate-fade-up flex items-center gap-2" style={{ animationDelay: "240ms" }}>
                  <Button asChild size="lg">
                    <Link href={b.ctaHref}>
                      {b.ctaLabel}
                      <ChevronLeft />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="text-muted-foreground">
                    <Link href="/shop?sort=discount">تخفیف‌های ویژه</Link>
                  </Button>
                </div>
              </div>
              <div className="absolute inset-0 md:relative md:inset-auto">
                <SafeImage
                  src={b.image}
                  alt={b.title}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="opacity-25 md:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-blush via-blush/40 to-transparent md:bg-none" />
              </div>
            </div>
          </div>
        ))}

        {/* soft gradient wash over the whole slide */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary-soft/40 via-transparent to-primary/10"
        />

        {count > 1 && (
          <div className="absolute bottom-5 start-8 z-20 flex items-center gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={`اسلاید ${toFa(i + 1)}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active
                    ? "w-6 bg-primary shadow-[0_0_14px_2px_rgba(232,168,184,0.85)] ring-4 ring-primary/25"
                    : "w-1.5 bg-ink/20 hover:bg-ink/40",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------ Category strip ----------------------------- */

export function CategoryStrip({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="container-shop animate-fade-in py-8 md:py-12">
      <h2 className="section-title mb-5">
        <Sparkles className="size-5 text-primary" />
        دسته‌بندی‌ها
      </h2>
      <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-8 md:gap-4 md:overflow-visible md:pb-0">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="group flex shrink-0 flex-col items-center gap-2.5"
          >
            <span className="relative block size-20 overflow-hidden rounded-full border border-border/60 bg-blush shadow-soft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary group-hover:shadow-[0_10px_30px_-10px_rgba(232,168,184,0.9)] md:size-24">
              <SafeImage src={c.image} alt={c.name} fill sizes="96px" className="transition-transform duration-700 group-hover:scale-110" />
            </span>
            <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary md:text-sm">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Product section ---------------------------- */

export function ProductSection({
  title,
  subtitle,
  products,
  layout = "grid",
  href = "/shop",
  loading = false,
  priority = false,
}: {
  title?: string;
  subtitle?: string;
  products: Product[];
  layout?: string;
  href?: string;
  loading?: boolean;
  priority?: boolean;
}) {
  if (loading) {
    return (
      <section className="container-shop py-6 md:py-8">
        <div className="mb-5 h-7 w-40 animate-pulse rounded-lg bg-accent" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }
  if (products.length === 0) return null;

  return (
    <section className="container-shop animate-fade-in py-6 md:py-8">
      <div className="mb-4 flex items-end justify-between gap-3 md:mb-6">
        <div className="flex flex-col gap-0.5">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground md:text-sm">{subtitle}</p>}
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary active:scale-95"
        >
          مشاهده همه
          <ChevronLeft className="size-3.5" />
        </Link>
      </div>

      {layout === "slider" ? (
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar md:-mx-8 md:px-8">
          {products.map((p, i) => (
            <div key={p.id} className="w-[46%] shrink-0 snap-start md:w-[23%]">
              <ProductCard product={p} priority={priority && i < 2} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={priority && i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}

/* -------------------------------- Promo cards ------------------------------ */

export function PromoCards({ categories }: { categories: Category[] }) {
  const list = categories.slice(0, 4);
  if (list.length === 0) return null;
  return (
    <section className="container-shop animate-fade-in py-6 md:py-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
        {list.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="group flex items-center justify-between gap-3 rounded-3xl border border-border/60 bg-gradient-to-br from-primary-soft/50 via-blush to-background p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(232,168,184,0.5)] md:p-4"
          >
            <span className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground">انواع</span>
              <span className="text-sm font-bold text-ink md:text-base">{c.name}</span>
              <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold text-primary">
                مشاهده
                <ChevronLeft className="size-3" />
              </span>
            </span>
            <span className="relative block h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-card shadow-soft md:h-24 md:w-20">
              <SafeImage
                src={c.image}
                alt={c.name}
                fill
                sizes="80px"
                className="transition-transform duration-500 group-hover:scale-110"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- Features -------------------------------- */

const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: Truck,
  shield: ShieldCheck,
  badge: BadgeCheck,
  headset: Headset,
  rotate: RotateCcw,
  sparkles: Sparkles,
};

export function FeaturesSection({ features }: { features: Feature[] }) {
  if (features.length === 0) return null;
  return (
    <section className="container-shop animate-fade-in py-6 md:py-8">
      <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border/60 bg-gradient-to-br from-primary-soft/60 via-blush to-background p-4 shadow-soft sm:grid-cols-3 md:p-6 lg:grid-cols-6">
        {features.map((f) => {
          const Icon = featureIcons[f.icon] ?? Sparkles;
          return (
            <div
              key={f.id}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-background/70 p-3 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-background hover:shadow-[0_8px_32px_-12px_rgba(232,168,184,0.6)]"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary-soft via-primary to-primary-deep text-primary-foreground shadow-soft">
                <Icon className="size-5" />
              </span>
              <p className="text-xs font-bold text-ink md:text-sm">{f.title}</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------- Brands --------------------------------- */

export function BrandsSection({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;
  return (
    <section className="container-shop animate-fade-in py-6 md:py-8">
      <h2 className="section-title mb-5">
        <BadgeCheck className="size-5 text-primary" />
        برندهای محبوب
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:pb-0">
        {brands.map((b) => (
          <Link
            key={b.id}
            href={`/shop?brand=${b.id}`}
            className="group grid h-20 w-32 shrink-0 place-items-center rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(232,168,184,0.5)] md:h-24 md:w-auto"
          >
            <span className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-black tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary md:text-base" dir="ltr">
                {b.latinName}
              </span>
              <span className="text-[10px] text-muted-foreground">{b.name}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------- Blog ---------------------------------- */

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  const list = posts.slice(0, 3);
  if (list.length === 0) return null;
  return (
    <section className="container-shop animate-fade-in py-6 md:py-8">
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <h2 className="section-title">
          <Newspaper className="size-5 text-primary" />
          از وبلاگ ارکیده
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary active:scale-95"
        >
          مشاهده همه
          <ChevronLeft className="size-3.5" />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {list.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(232,168,184,0.5)]"
          >
            <div className="relative h-44 overflow-hidden bg-blush">
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
            <div className="p-4">
              <h3 className="line-clamp-2 text-sm font-bold leading-6 text-ink transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                ادامه مطلب
                <ChevronLeft className="size-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- Newsletter ------------------------------- */

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      toast.error("لطفاً یک ایمیل معتبر وارد کنید");
      return;
    }
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
        if (error && error.code !== "23505") throw error;
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      toast.success("عضویت شما با موفقیت ثبت شد", { description: "از تخفیف‌ها و جدیدترین‌ها زودتر باخبر می‌شوید." });
      setEmail("");
    } catch {
      toast.error("ثبت عضویت با خطا مواجه شد؛ دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container-shop animate-fade-in py-6 md:py-8">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary-soft/70 via-blush to-background p-6 text-center shadow-soft md:p-10">
        {/* decorative radial blobs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -start-20 size-64 rounded-full bg-primary/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -end-16 size-72 rounded-full bg-primary-soft/60 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-background text-primary shadow-soft">
            <Mail className="size-5" />
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">عضویت در خبرنامه ارکیده</h2>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground md:text-sm">
            از جدیدترین محصولات، کالکشن‌های فصلی و تخفیف‌های ویژه زودتر از همه باخبر شوید.
          </p>
          <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-11 flex-1 rounded-2xl bg-background/90 text-start backdrop-blur"
              aria-label="ایمیل"
            />
            <Button type="submit" size="lg" className="h-11" disabled={loading}>
              {loading ? "در حال ثبت…" : "عضویت"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
