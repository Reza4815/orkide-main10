"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  ChevronLeft,
  Heart,
  Minus,
  Package,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import {
  allProductsQuery,
  brandsQuery,
  categoriesQuery,
} from "@/lib/queries.client";
import {
  brandById,
  categoryById,
  type Product,
} from "@/lib/store-data";
import { discountPercent, formatFaDate, formatToman, toFa } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { SafeImage } from "@/components/SafeImage";

const sampleReviews = [
  { author: "سارا م.", rating: 5, date: "2025-12-20", text: "کیفیت پارچه واقعاً عالیه، نرم و لطیف. سایزبندی دقیقه، حتماً از جدول سایز استفاده کنید." },
  { author: "مینا ر.", rating: 5, date: "2025-12-02", text: "بسته‌بندی خیلی شیک و محتاطانه بود. ارسال هم سریع‌تر از چیزی که فکر می‌کردم رسید." },
  { author: "نگار ک.", rating: 4, date: "2025-11-18", text: "رنگش دقیقاً مثل عکسه. فقط کاش رنگ‌بندی بیشتری داشت. در کل راضی‌ام و دوباره خرید می‌کنم." },
];

function stars(rating: number, size = "size-4") {
  return (
    <span className="flex items-center gap-0.5" dir="ltr">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(size, i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")}
        />
      ))}
    </span>
  );
}

export function ProductView({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [imageIdx, setImageIdx] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const { data: brands = [] } = useQuery(brandsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: allProducts = [], isLoading: relatedLoading } = useQuery(allProductsQuery);

  const brand = brandById(brands, product.brandId);
  const category = categoryById(categories, product.categoryId);
  const discount = discountPercent(product.price, product.compareAt);
  const outOfStock = product.stock <= 0;

  const related = useMemo(
    () => allProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4),
    [allProducts, product],
  );

  const addToCart = (goCart: boolean) => {
    if (outOfStock) return;
    add(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.images[0] ?? null,
        price: product.price,
        color,
        size,
      },
      qty,
    );
    if (goCart) {
      router.push("/cart");
    } else {
      toast.success("به سبد خرید اضافه شد", { description: `${product.name}` });
    }
  };

  return (
    <div className="container-shop animate-fade-in py-6 md:py-8">
      {/* breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <ChevronLeft className="size-3" />
        <Link href="/shop" className="hover:text-primary">فروشگاه</Link>
        {category && (
          <>
            <ChevronLeft className="size-3" />
            <Link href={`/category/${category.slug}`} className="hover:text-primary">{category.name}</Link>
          </>
        )}
        <ChevronLeft className="size-3" />
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-blush shadow-soft transition-colors hover:border-primary/40">
            {product.images.length === 0 && (
              <SafeImage src={null} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" />
            )}
            {product.images.map((img, i) => (
              <SafeImage
                key={img + i}
                src={img}
                alt={product.name}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={cn(
                  "transition-all duration-500",
                  i === imageIdx ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              />
            ))}
            <div className="absolute start-3 top-3 flex flex-col gap-1.5">
              {discount && (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground transition-shadow hover:animate-pulse hover:shadow-[0_0_18px_-4px_rgba(232,168,184,0.9)]">
                  ٪{toFa(discount)} تخفیف
                </span>
              )}
              {product.isNew && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground transition-shadow hover:animate-pulse hover:shadow-[0_0_18px_-4px_rgba(232,168,184,0.7)]">
                  جدید
                </span>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img + i}
                  type="button"
                  onClick={() => setImageIdx(i)}
                  aria-label={`تصویر ${toFa(i + 1)}`}
                  className={cn(
                    "relative aspect-square w-20 overflow-hidden rounded-xl border-2 bg-blush transition-all",
                    i === imageIdx ? "border-primary shadow-soft" : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <SafeImage src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              {brand && (
                <Link href={`/shop?brand=${brand.id}`} className="text-xs font-semibold text-primary">
                  {brand.name}
                  <span className="ms-1.5 tracking-widest" dir="ltr">{brand.latinName}</span>
                </Link>
              )}
              <h1 className="mt-1 text-xl font-extrabold leading-8 tracking-tight text-ink md:text-3xl md:leading-tight">{product.name}</h1>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <Button
                variant="outline"
                size="icon"
                aria-label="علاقه‌مندی"
                onClick={() => setWishlisted((v) => !v)}
                className={cn(wishlisted && "border-primary text-primary")}
              >
                <Heart className={cn(wishlisted && "fill-primary text-primary")} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="اشتراک‌گذاری"
                onClick={() => {
                  void navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
                  toast.success("لینک محصول کپی شد");
                }}
              >
                <Share2 />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              {stars(product.rating)}
              <b className="text-ink">{toFa(product.rating)}</b>({toFa(product.numReviews)} دیدگاه)
            </span>
            <span className="h-3 w-px bg-border" />
            <span>{toFa(product.sold.toLocaleString("en-US"))} فروش</span>
            <span className="h-3 w-px bg-border" />
            <span className={cn("flex items-center gap-1", outOfStock ? "text-destructive" : "text-emerald-600")}>
              <Package className="size-3.5" />
              {outOfStock ? "ناموجود" : product.stock < 10 ? `تنها ${toFa(product.stock)} عدد مانده` : "موجود در انبار"}
            </span>
          </div>

          <Separator />

          <div className="flex items-end gap-2.5">
            <span className="text-2xl font-black text-ink md:text-3xl">{formatToman(product.price)}</span>
            <span className="mb-1 text-sm text-muted-foreground">تومان</span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="mb-1 text-sm text-muted-foreground line-through">
                {formatToman(product.compareAt)}
              </span>
            )}
          </div>

          {/* colors */}
          {product.colors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-ink">
                رنگ: <span className="font-normal text-muted-foreground">{color}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border pe-3 ps-1.5 py-1.5 text-[11px] transition-all",
                      color === c.name ? "border-primary bg-blush text-ink shadow-soft" : "text-muted-foreground hover:border-primary/50",
                    )}
                  >
                    <span className="size-4 rounded-full border shadow-soft" style={{ backgroundColor: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* sizes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-ink">سایز</p>
              <Link href="/blog/bra-size-guide" className="text-[11px] text-primary hover:underline">
                راهنمای سایز
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={cn(
                    "min-w-11 rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
                    size === s ? "border-primary bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:border-primary/50 hover:text-ink",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* quantity + actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-xl border">
              <button
                type="button"
                aria-label="افزایش"
                onClick={() => setQty((v) => Math.min(v + 1, Math.max(product.stock, 1)))}
                className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
                disabled={outOfStock}
              >
                <Plus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-ink">{toFa(qty)}</span>
              <button
                type="button"
                aria-label="کاهش"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="grid size-10 place-items-center text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
                disabled={outOfStock || qty <= 1}
              >
                <Minus className="size-4" />
              </button>
            </div>
            <Button size="lg" className="flex-1" disabled={outOfStock} onClick={() => addToCart(false)}>
              <ShoppingBag />
              {outOfStock ? "ناموجود" : "افزودن به سبد خرید"}
            </Button>
            <Button size="lg" variant="secondary" disabled={outOfStock} onClick={() => addToCart(true)}>
              خرید سریع
            </Button>
          </div>

          {/* trust row */}
          <div className="grid grid-cols-3 gap-2 rounded-3xl border border-border/60 bg-gradient-to-br from-primary-soft/50 via-blush to-background p-3">
            {[
              { icon: Truck, label: "ارسال ۱ تا ۳ روزه" },
              { icon: RotateCcw, label: "۷ روز ضمانت تعویض" },
              { icon: ShieldCheck, label: "ضمانت اصالت کالا" },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1 text-center">
                <f.icon className="size-4 text-primary" />
                <span className="text-[10px] text-muted-foreground">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabs */}
      <Tabs defaultValue="desc" className="mt-10">
        <TabsList>
          <TabsTrigger value="desc">توضیحات</TabsTrigger>
          <TabsTrigger value="specs">مشخصات</TabsTrigger>
          <TabsTrigger value="reviews">نظرات ({toFa(sampleReviews.length)})</TabsTrigger>
        </TabsList>
        <TabsContent value="desc" className="rounded-3xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 md:p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          <ul className="mt-4 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
            {[
              "بافت نرم و تنفس‌پذیر مناسب استفاده روزمره",
              "دوخت تخت بدون آزار پوست در تماس طولانی",
              "رنگ ثابت در برابر شست‌وشوی مکرر",
              "قابل تعویض تا ۷ روز در صورت عدم استفاده",
            ].map((li) => (
              <li key={li} className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-primary" />
                {li}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="specs" className="rounded-3xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 md:p-6">
          <div className="grid gap-x-8 md:grid-cols-2">
            {product.specs.map((s) => (
              <div key={s.label} className="flex items-center justify-between border-b py-3 text-sm last:border-b-0">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="font-semibold text-ink">{s.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="rounded-3xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 md:p-6">
          <div className="space-y-5">
            {sampleReviews.map((r) => (
              <div key={r.author} className="flex gap-3">
                <Avatar>
                  <AvatarFallback>{r.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-ink">{r.author}</span>
                    {stars(r.rating, "size-3")}
                    <span className="text-[10px] text-muted-foreground">{formatFaDate(r.date)}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.text}</p>
                </div>
              </div>
            ))}
            <Separator />
            <div className="flex flex-col items-center gap-2 py-2 text-center">
              <p className="text-sm font-bold text-ink">دیدگاه شما چیست؟</p>
              <p className="text-xs text-muted-foreground">برای ثبت دیدگاه ابتدا وارد حساب کاربری شوید.</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/auth">ورود / ثبت‌نام</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* related */}
      <section className="mt-24 animate-fade-in">
        <h2 className="section-title mb-5">محصولات مرتبط</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {relatedLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
