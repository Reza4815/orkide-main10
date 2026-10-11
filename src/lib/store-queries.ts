import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  banners as bannersTable,
  blogPosts as blogPostsTable,
  brands as brandsTable,
  categories as categoriesTable,
  features as featuresTable,
  homepageSections as homepageSectionsTable,
  products as productsTable,
  storeSettings as storeSettingsTable,
} from "@/db/schema";
import {
  banners as seedBanners,
  blogPosts as seedBlogPosts,
  brands as seedBrands,
  categories as seedCategories,
  coupons as seedCoupons,
  features as seedFeatures,
  homeSections as seedHomeSections,
  menuItems as seedMenuItems,
  orders as seedOrders,
  products as seedProducts,
  settings as seedSettings,
} from "./seed";
import type {
  Banner,
  BlogPost,
  Brand,
  Category,
  Coupon,
  Feature,
  HomeSection,
  MenuItem,
  Order,
  Product,
  ProductColor,
  ProductSpec,
  StoreSettings,
} from "./store-data";

/* ---------- fetch helpers: Postgres first, seed fallback ---------- */

async function safeSelect<T>(
  fn: () => Promise<T[]>,
  fallback: T[],
): Promise<T[]> {
  try {
    const rows = await fn();
    if (!rows || rows.length === 0) return fallback;
    return rows;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[store-queries] falling back to seed:",
        (err as Error).message,
      );
    }
    return fallback;
  }
}

/* ------------------------------- Products ------------------------------- */

export async function getProducts(): Promise<Product[]> {
  const rows = await safeSelect(
    () => db.select().from(productsTable),
    seedProducts as unknown as Product[],
  );

  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    brandId: p.brandId,
    categoryId: p.categoryId,
    price: p.price,
    compareAt: p.compareAt ?? null,
    colors: (p.colors as ProductColor[]) ?? [],
    sizes: p.sizes ?? [],
    images: p.images ?? [],
    description: p.description,
    specs: (p.specs as ProductSpec[]) ?? [],
    isNew: p.isNew,
    rating: p.rating,
    numReviews: p.numReviews,
    sold: p.sold,
    stock: p.stock,
  }));
}

export const getAllProducts = getProducts;

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

/* ----------------------------- Categories ------------------------------- */

export const getCategories = (): Promise<Category[]> =>
  safeSelect(() => db.select().from(categoriesTable), seedCategories);

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

/* ------------------------------- Brands --------------------------------- */

export const getBrands = (): Promise<Brand[]> =>
  safeSelect(() => db.select().from(brandsTable), seedBrands);

/* ------------------------------ Banners --------------------------------- */

export const getBanners = (): Promise<Banner[]> =>
  safeSelect(async () => {
    const rows = await db
      .select()
      .from(bannersTable)
      .orderBy(bannersTable.sort);
    return rows
      .filter((b) => b.active !== false)
      .map((b) => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        image: b.image ?? null,
        ctaLabel: b.ctaLabel,
        ctaHref: b.ctaHref,
        badge: b.badge,
      }));
  }, seedBanners);

/* ------------------------------ Features -------------------------------- */

export const getFeatures = (): Promise<Feature[]> =>
  safeSelect(() => db.select().from(featuresTable), seedFeatures);

/* ---------------------------- Home sections ----------------------------- */

export const getHomeSections = (): Promise<HomeSection[]> =>
  safeSelect(async () => {
    const rows = await db
      .select()
      .from(homepageSectionsTable)
      .orderBy(homepageSectionsTable.id);
    return rows.map((r) => ({
      id: r.id,
      type: r.type as HomeSection["type"],
      title: r.title ?? undefined,
      subtitle: r.subtitle ?? undefined,
      config: r.config ?? undefined,
      active: r.active,
    }));
  }, seedHomeSections);

/* ------------------------------ Blog posts ------------------------------ */

export const getBlogPosts = (): Promise<BlogPost[]> =>
  safeSelect(() => db.select().from(blogPostsTable), seedBlogPosts);

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const all = await getBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

/* -------------------------------- Settings ------------------------------ */

export async function getSettings(): Promise<StoreSettings> {
  try {
    const [row] = await db
      .select()
      .from(storeSettingsTable)
      .where(sql`id = 1`)
      .limit(1);

    if (!row) return seedSettings;

    return {
      storeName: row.storeName,
      tagline: row.tagline,
      phone: row.phone,
      email: row.email,
      address: row.address,
      hours: row.hours,
      footerText: row.footerText,
      freeShippingThreshold: row.freeShippingThreshold,
      shippingCost: row.shippingCost,
      instagram: row.instagram,
      telegram: row.telegram,
    };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[store-queries] settings fallback:", (err as Error).message);
    }
    return seedSettings;
  }
}

/* --------------------------- Fallback-only data ------------------------- */

export const getMenu = async (): Promise<MenuItem[]> => seedMenuItems;
export const getOrders = async (): Promise<Order[]> => seedOrders;
export const getCoupons = async (): Promise<Coupon[]> => seedCoupons;
