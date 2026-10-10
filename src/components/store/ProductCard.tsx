"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/store-data";
import { discountPercent, formatToman, toFa } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const discount = discountPercent(product.price, product.compareAt);
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (outOfStock) return;
    add({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price,
      color: product.colors[0]?.name,
      size: product.sizes[0],
    });
    toast.success("به سبد خرید اضافه شد", { description: product.name });
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(232,168,184,0.5)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-blush">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={priority}
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-110",
              product.images[1] && "group-hover:opacity-0",
            )}
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
            />
          )}
        </Link>

        <div className="absolute start-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {discount && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground transition-shadow hover:animate-pulse hover:shadow-[0_0_16px_-4px_rgba(232,168,184,0.9)]">
              ٪{toFa(discount)} تخفیف
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-secondary-foreground transition-shadow hover:animate-pulse hover:shadow-[0_0_16px_-4px_rgba(232,168,184,0.7)]">
              جدید
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label="افزودن به علاقه‌مندی‌ها"
          onClick={() => setWishlisted((v) => !v)}
          className={cn(
            "absolute end-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-background/85 shadow-soft backdrop-blur transition-all duration-300 hover:scale-110",
            wishlisted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <Heart className={cn("size-4 transition-colors", wishlisted ? "fill-primary text-primary" : "text-ink")} />
        </button>

        {outOfStock && (
          <div className="absolute inset-x-0 bottom-0 bg-background/75 py-1.5 text-center text-xs font-bold text-muted-foreground backdrop-blur">
            ناموجود
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 md:p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-[13px] font-semibold leading-5 text-ink transition-colors hover:text-primary md:text-sm">
            {product.name}
          </h3>
        </Link>

        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3.5 rounded-full border bg-blush shadow-soft"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{toFa(product.colors.length - 4)}</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-[11px] text-muted-foreground line-through">
                {formatToman(product.compareAt)}
              </span>
            )}
            <span className="text-sm font-black text-ink md:text-base">
              {formatToman(product.price)}
              <span className="ms-1 text-[10px] font-medium text-muted-foreground">تومان</span>
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label="افزودن به سبد"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground transition-all hover:-translate-y-0.5 hover:scale-105 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_-6px_rgba(232,168,184,0.8)] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="space-y-3 p-3 md:p-4">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="size-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
