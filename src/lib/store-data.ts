import { queryOptions } from "@tanstack/react-query";
import { createClient as createAnonClient } from "@supabase/supabase-js";
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

export type ProductSpec = { label: string; value: string };
export type ProductColor = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  categoryId: string;
  price: number;
  compareAt?: number | null;
  colors: ProductColor[];
  sizes: string[];
  images: string[];
  description: string;
  specs: ProductSpec[];
  isNew?: boolean;
  rating: number;
  numReviews: number;
  sold: number;
  stock: number;
};

export type Category = { id: string; slug: string; name: string; image: string | null; description: string };
export type Brand = { id: string; name: string; latinName: string };

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string | null;
  ctaLabel: string;
  ctaHref: string;
  badge: string;
};

export type Feature = { id: string; icon: string; title: string; description: string };

export type HomeSection = {
  id: string;
  type: "products" | "promo" | "features" | "brands" | "newsletter" | "blog";
  title?: string;
  subtitle?: string;
  config?: { source?: string; limit?: number; layout?: string };
  active: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string | null;
  date: string;
  author: string;
  tags: string[];
  content: string[];
  readMinutes: number;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  footerText: string;
  freeShippingThreshold: number;
  shippingCost: number;
  instagram: string;
  telegram: string;
};

export type MenuItem = { label: string; href: string };
export type Coupon = { code: string; percent: number };

export type OrderItem = { name: string; qty: number; price: number };
export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "canceled";
export type Order = {
  id: string;
  code: string;
  customer: string;
  phone: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
};

/* ---------- fetch helpers: Supabase first, local catalog fallback ---------- */

const configured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function catalogClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

async function fromTable<T>(table: string, fallback: T[]): Promise<T[]> {
  if (!configured()) return fallback;
  try {
    const { data, error } = await catalogClient().from(table).select("*");
    if (error || !data || data.length === 0) return fallback;
    return data as unknown as T[];
  } catch {
    return fallback;
  }
}

export const getProducts = (): Promise<Product[]> => fromTable("products", seedProducts);
export const getAllProducts = getProducts;

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export const getCategories = (): Promise<Category[]> => fromTable("categories", seedCategories);
export const getBrands = (): Promise<Brand[]> => fromTable("brands", seedBrands);
export const getBanners = (): Promise<Banner[]> => fromTable("banners", seedBanners);
export const getFeatures = (): Promise<Feature[]> => fromTable("features", seedFeatures);
export const getHomeSections = (): Promise<HomeSection[]> => fromTable("homepage_sections", seedHomeSections);
export const getBlogPosts = (): Promise<BlogPost[]> => fromTable("blog_posts", seedBlogPosts);

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const all = await getBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getSettings(): Promise<StoreSettings> {
  if (!configured()) return seedSettings;
  try {
    const { data, error } = await catalogClient().from("store_settings").select("*").limit(1).maybeSingle();
    if (error || !data) return seedSettings;
    return data as unknown as StoreSettings;
  } catch {
    return seedSettings;
  }
}

export const getMenu = (): Promise<MenuItem[]> => fromTable("menu_items", seedMenuItems);
export const getOrders = (): Promise<Order[]> => fromTable("orders", seedOrders);
export const getCoupons = (): Promise<Coupon[]> => fromTable("coupons", seedCoupons);

export async function validateCoupon(code: string): Promise<Coupon | null> {
  const all = await getCoupons();
  return all.find((c) => c.code.toLowerCase() === code.trim().toLowerCase()) ?? null;
}

/* ---------- selection helpers ---------- */

export function selectProducts(products: Product[], source?: string, limit = 8): Product[] {
  let list = [...products];
  switch (source) {
    case "new":
      list = list.filter((p) => p.isNew).sort((a, b) => b.id.localeCompare(a.id));
      break;
    case "bestseller":
      list = list.sort((a, b) => b.sold - a.sold);
      break;
    case "discounted":
      list = list
        .filter((p) => p.compareAt && p.compareAt > p.price)
        .sort((a, b) => (b.compareAt! - b.price) / b.compareAt! - (a.compareAt! - a.price) / a.compareAt!);
      break;
    default:
      break;
  }
  return list.slice(0, limit);
}

/* ---------- react-query options ---------- */

export const productsQuery = queryOptions({ queryKey: ["products"], queryFn: () => getProducts() });
export const allProductsQuery = queryOptions({ queryKey: ["all-products"], queryFn: () => getAllProducts() });
export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct(slug) });
export const categoriesQuery = queryOptions({ queryKey: ["categories"], queryFn: () => getCategories() });
export const brandsQuery = queryOptions({ queryKey: ["brands"], queryFn: () => getBrands() });
export const bannersQuery = queryOptions({ queryKey: ["banners"], queryFn: () => getBanners() });
export const featuresQuery = queryOptions({ queryKey: ["features"], queryFn: () => getFeatures() });
export const homeSectionsQuery = queryOptions({ queryKey: ["home-sections"], queryFn: () => getHomeSections() });
export const blogPostsQuery = queryOptions({ queryKey: ["blog-posts"], queryFn: () => getBlogPosts() });
export const blogPostQuery = (slug: string) =>
  queryOptions({ queryKey: ["blog-post", slug], queryFn: () => getBlogPost(slug) });
export const settingsQuery = queryOptions({ queryKey: ["settings"], queryFn: () => getSettings() });
export const menuQuery = queryOptions({ queryKey: ["menu"], queryFn: () => getMenu() });
export const ordersQuery = queryOptions({ queryKey: ["orders"], queryFn: () => getOrders() });

/* ---------- derived lookups ---------- */

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  canceled: "لغو شده",
};

export const brandById = (brands: Brand[], id: string) => brands.find((b) => b.id === id);
export const categoryById = (categories: Category[], id: string) => categories.find((c) => c.id === id);
export const categoryBySlug = (categories: Category[], slug: string) => categories.find((c) => c.slug === slug);

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}
