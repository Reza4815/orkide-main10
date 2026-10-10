import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/store-data";
import { ShopView } from "@/components/store/ShopView";
import { Skeleton } from "@/components/ui/skeleton";

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
      <section className="container-shop mt-4 animate-fade-in md:mt-6">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary-soft/50 via-blush to-background shadow-soft">
          <div className="relative z-10 flex max-w-xl flex-col gap-2 p-8 md:p-12">
            <span className="text-[11px] font-semibold text-primary">دسته‌بندی محصولات</span>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">{category.name}</h1>
            <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">{category.description}</p>
          </div>
          <div className="absolute inset-y-0 end-0 hidden w-2/5 md:block">
            <Image src={category.image} alt={category.name} fill sizes="40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-blush via-blush/30 to-transparent" />
          </div>
        </div>
      </section>
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
