import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopView } from "@/components/store/ShopView";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "مشاهده و خرید تمام محصولات لباس زیر ارکیده با فیلتر برند، دسته‌بندی و قیمت.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-shop grid gap-8 py-8 lg:grid-cols-[260px_1fr]">
          <Skeleton className="hidden h-96 rounded-2xl lg:block" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        </div>
      }
    >
      <ShopView />
    </Suspense>
  );
}
