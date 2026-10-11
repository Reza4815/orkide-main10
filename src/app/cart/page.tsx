"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, Minus, Plus, ShieldCheck, ShoppingBag, TicketPercent, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { validateCoupon } from "@/lib/store-data";
import { formatToman, toFa } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SafeImage } from "@/components/SafeImage";

const FREE_SHIPPING = 900_000;
const SHIPPING_COST = 60_000;

export default function CartPage() {
  const { items, subtotal, setQuantity, remove, count } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; percent: number } | null>(null);

  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= FREE_SHIPPING || afterDiscount === 0 ? 0 : SHIPPING_COST;
  const total = afterDiscount + shipping;

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    const found = await validateCoupon(couponInput);
    if (found) {
      setCoupon(found);
      toast.success(`کد تخفیف ٪${toFa(found.percent)} اعمال شد`);
    } else {
      toast.error("کد تخفیف معتبر نیست");
    }
    setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="container-shop flex flex-col items-center gap-4 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-primary-soft via-primary to-primary-deep text-primary-foreground shadow-[0_0_40px_-12px_rgba(232,168,184,0.9)]">
          <ShoppingBag className="size-9" />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">سبد خرید شما خالی است</h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          هنوز چیزی انتخاب نکرده‌اید؛ نگاهی به جدیدترین محصولات ارکیده بیندازید.
        </p>
        <Button asChild size="lg">
          <Link href="/shop">
            مشاهده فروشگاه
            <ChevronLeft />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-shop animate-fade-in py-6 md:py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
        سبد خرید
        <span className="ms-2 text-sm font-medium text-muted-foreground">({toFa(count)} کالا)</span>
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex gap-4 rounded-3xl border border-border/60 bg-card p-3 shadow-soft transition-colors hover:border-primary/40 md:p-4"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative block size-24 shrink-0 overflow-hidden rounded-xl bg-blush md:size-28"
              >
                <SafeImage src={item.image} alt={item.name} fill sizes="112px" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="text-sm font-bold leading-6 text-ink hover:text-primary">{item.name}</h3>
                  </Link>
                  <button
                    type="button"
                    aria-label="حذف"
                    onClick={() => remove(item.key)}
                    className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {[item.color && `رنگ: ${item.color}`, item.size && `سایز: ${item.size}`].filter(Boolean).join(" — ")}
                </p>
                <div className="mt-auto flex items-end justify-between pt-2">
                  <div className="flex items-center rounded-xl border">
                    <button
                      type="button"
                      aria-label="افزایش"
                      onClick={() => setQuantity(item.key, item.quantity + 1)}
                      className="grid size-8 place-items-center text-muted-foreground hover:text-primary"
                    >
                      <Plus className="size-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold text-ink">{toFa(item.quantity)}</span>
                    <button
                      type="button"
                      aria-label="کاهش"
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                      className="grid size-8 place-items-center text-muted-foreground hover:text-primary"
                    >
                      <Minus className="size-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-black text-ink">
                    {formatToman(item.price * item.quantity)}
                    <span className="ms-1 text-[10px] font-medium text-muted-foreground">تومان</span>
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 rounded-3xl border border-dashed border-primary/40 bg-gradient-to-b from-blush/70 to-transparent p-3 text-[11px] leading-relaxed text-muted-foreground">
            <Truck className="size-4 shrink-0 text-primary" />
            {shipping === 0
              ? "خرید شما شامل ارسال رایگان شد."
              : `با ${formatToman(FREE_SHIPPING - afterDiscount)} تومان خرید بیشتر، ارسال رایگان می‌شود.`}
          </div>
        </div>

        {/* summary */}
        <aside className="h-fit space-y-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40 lg:sticky lg:top-36">
          <h2 className="font-bold text-ink">خلاصه سفارش</h2>

          <div className="flex gap-2">
            <Input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="کد تخفیف"
              className="h-10 flex-1"
              dir="ltr"
            />
            <Button variant="secondary" onClick={() => void applyCoupon()}>
              <TicketPercent />
              اعمال
            </Button>
          </div>
          {coupon && (
            <p className="flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2 text-xs text-primary">
              <span>
                کد {coupon.code} — ٪{toFa(coupon.percent)} تخفیف
              </span>
              <button type="button" onClick={() => setCoupon(null)} className="font-bold hover:underline">
                حذف
              </button>
            </p>
          )}
          <p className="text-[10px] text-muted-foreground">کدهای آزمایشی: ORKIDEH10 و NEW15</p>

          <Separator />

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>جمع اقلام</dt>
              <dd>{formatToman(subtotal)} تومان</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>تخفیف</dt>
              <dd className={discount ? "text-primary" : undefined}>
                {discount ? `${formatToman(discount)}- تومان` : "—"}
              </dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>هزینه ارسال</dt>
              <dd>{shipping === 0 ? "رایگان" : `${formatToman(shipping)} تومان`}</dd>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <dt className="font-bold text-ink">مبلغ قابل پرداخت</dt>
              <dd className="text-lg font-black text-ink">
                {formatToman(total)}
                <span className="ms-1 text-xs font-medium text-muted-foreground">تومان</span>
              </dd>
            </div>
          </dl>

          <Button asChild size="lg" className="w-full">
            <Link href="/checkout">
              ادامه فرایند خرید
              <ChevronLeft />
            </Link>
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" />
            پرداخت امن از طریق درگاه رسمی بانکی
          </p>
        </aside>
      </div>
    </div>
  );
}
