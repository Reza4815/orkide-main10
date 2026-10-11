import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/store-queries";
import { ProductView } from "@/components/store/ProductView";

// ✅ مهم‌ترین تغییر: این صفحه رو dynamic کن
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "محصول" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <ProductView product={product} />;
}
