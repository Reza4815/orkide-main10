import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/store-queries";
import { ShopView } from "@/components/store/ShopView";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/SafeImage";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "دسته‌بندی" };
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div>
      {category.image ? (
        <section className="relative h-[220px] w-full animate-fade-in overflow-hidden md:h-[300px]">
          <SafeImage src={category.image} alt={category.name} fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="text-[11px] font-semibold text-white/80">دسته‌بندی محصولات</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm md:text-4xl">{category.name}</h1>
            {category.description && (
              <p className="line-clamp-1 max-w-xl text-xs leading-relaxed text-white/85 md:text-sm">{category.description}</p>
            )}
          </div>
        </section>
      ) : (
        <section className="container-shop mt-4 animate-fade-in md:mt-6">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-primary-soft/50 via-blush to-background p-8 shadow-soft md:p-12">
            <span className="text-[11px] font-semibold text-primary">دسته‌بندی محصولات</span>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{category.name}</h1>
            {category.description && (
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground md:text-sm">{category.description}</p>
            )}
          </div>
        </section>
      )}
      <Suspense
        fallback={
          <div className="container-shop py-8">
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        }
      >
        <ShopView lockedCategory={category} />
      </Suspense>
    </div>
  );
}
