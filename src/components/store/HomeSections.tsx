"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Headset,
  Mail,
  Newspaper,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import type {
  Banner,
  BlogPost,
  Brand,
  Category,
  Feature,
  Product,
} from "@/lib/store-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatFaDate, toFa } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { SafeImage } from "@/components/SafeImage";

/* ---------------------------------- Hero ---------------------------------- */

const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";

export function Hero({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % count), 6000);
    return () => clearTimeout(t);
  }, [count, active, paused]);

  if (count === 0) return null;
  const b = banners[active];
  const go = (dir: number) => setActive((a) => (a + dir + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="بنرهای ارکیده"
      className="container-shop animate-fade-in pt-3 md:pt-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface-dark ring-1 ring-black/5",
          // ارتفاع responsive
          "h-[360px]",
          "sm:h-[420px]",
          "md:h-[460px]",
          "lg:h-[540px]",
          "xl:h-[600px]",
          // گردی گوشه متقارن
          "rounded-3xl",
          "md:rounded-[2rem]",
          "lg:rounded-[2.5rem]",
        )}
      >
        {/* slides */}
        {banners.map((slide, i) => (
          <div
            key={slide.id}
            aria-hidden={i !== active}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-out",
              i === active ? "scale-100 opacity-100" : "scale-105 opacity-0",
            )}
          >
            <SafeImage
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn("object-cover", i === active && "animate-kenburns")}
            />
          </div>
        ))}

        {/* readability overlay - فقط پایین، ملایم */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
        />

        {/* film grain */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_URL }}
        />

        {/* slide counter */}
        {count > 1 && (
          <div
            aria-hidden="true"
            dir="ltr"
            className="absolute top-4 end-4 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-white/80 backdrop-blur-md md:top-6 md:end-6 md:text-[11px]"
          >
            <span className="tabular-nums text-white">{toFa(active + 1)}</span>
            <span className="text-white/40">/</span>
            <span className="tabular-nums">{toFa(count)}</span>
          </div>
        )}

        {/* content block */}
        <div
          key={b.id}
          className={cn(
            "absolute inset-0 z-10 flex flex-col items-start text-start",
            "justify-end gap-3 p-6 pb-14",
            "sm:gap-3.5 sm:p-8 sm:pb-16",
            "md:justify-center md:gap-4 md:p-10 md:pb-10",
            "lg:gap-5 lg:p-14",
          )}
        >
          {b.badge && (
            <span className="animate-fade-up inline-flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-md md:px-3.5 md:text-[11px]">
              <Sparkles className="size-3 text-primary-soft" />
              {b.badge}
            </span>
          )}

          <h1
            className={cn(
              "animate-fade-up max-w-xl font-black leading-[1.4] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]",
              "text-[1.35rem]",
              "sm:text-2xl",
              "md:text-3xl md:leading-[1.3]",
              "lg:text-4xl",
              "xl:text-[2.5rem]",
            )}
            style={{ animationDelay: "80ms" }}
          >
            {b.title}
          </h1>

          <span
            aria-hidden="true"
            className="animate-fade-up h-[3px] w-12 rounded-full bg-gradient-to-l from-primary via-primary-soft to-transparent md:w-16"
            style={{ animationDelay: "140ms" }}
          />

          <p
            className={cn(
              "animate-fade-up max-w-lg leading-relaxed text-white/85",
              "line-clamp-2 text-xs",
              "sm:text-[13px]",
              "md:line-clamp-3 md:text-sm",
            )}
            style={{ animationDelay: "180ms" }}
          >
            {b.subtitle}
          </p>

          <div
            className="animate-fade-up pt-1.5 md:pt-2"
            style={{ animationDelay: "260ms" }}
          >
            <Button
              asChild
              size="lg"
              className="h-11 rounded-full bg-background px-6 text-xs font-bold text-ink shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white hover:text-ink hover:shadow-xl md:h-12 md:px-8 md:text-sm"
            >
              <Link href={b.ctaHref}>
                {b.ctaLabel}
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* progress segments */}
        {count > 1 && (
          <div
            dir="ltr"
            className="absolute bottom-4 start-5 z-20 flex items-center gap-1.5 md:bottom-7 md:start-7 md:gap-2"
          >
            {banners.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`اسلاید ${toFa(i + 1)}`}
                onClick={() => setActive(i)}
                className="h-[3px] w-8 overflow-hidden rounded-full bg-white/25 transition-all hover:bg-white/50 md:w-12"
              >
                {i === active && (
                  <span
                    className="block h-full w-full origin-left rounded-full bg-white animate-hero-progress"
                    style={{
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* navigation arrows - فقط دسکتاپ */}
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="اسلاید قبلی"
              onClick={() => go(-1)}
              className="absolute top-1/2 end-3 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/25 md:grid md:size-11 lg:end-5"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              type="button"
              aria-label="اسلاید بعدی"
              onClick={() => go(1)}
              className="absolute top-1/2 start-3 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/25 md:grid md:size-11 lg:start-5"
            >
              <ChevronLeft className="size-5" />
            </button>
          </>
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
              <SafeImage
                src={c.image}
                alt={c.name}
                fill
                sizes="96px"
                className="transition-transform duration-700 group-hover:scale-110"
              />
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
          {subtitle && (
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground md:text-sm">
              {subtitle}
            </p>
          )}
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
              <span className="text-sm font-bold text-ink md:text-base">
                {c.name}
              </span>
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

const featureIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
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
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {f.description}
              </p>
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
              <span
                className="text-sm font-black tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary md:text-base"
                dir="ltr"
              >
                {b.latinName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {b.name}
              </span>
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
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
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
        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({ email: email.trim() });
        if (error && error.code !== "23505") throw error;
      } else {
        await new Promise((r) => setTimeout(r, 500));
      }
      toast.success("عضویت شما با موفقیت ثبت شد", {
        description: "از تخفیف‌ها و جدیدترین‌ها زودتر باخبر می‌شوید.",
      });
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
          <h2 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            عضویت در خبرنامه ارکیده
          </h2>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground md:text-sm">
            از جدیدترین محصولات، کالکشن‌های فصلی و تخفیف‌های ویژه زودتر از همه
            باخبر شوید.
          </p>
          <form
            onSubmit={submit}
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
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
