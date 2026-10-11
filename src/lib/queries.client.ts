import { queryOptions } from "@tanstack/react-query";
import { coupons as seedCoupons, menuItems as seedMenuItems, orders as seedOrders } from "./seed";
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
  StoreSettings,
} from "./store-data";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

/* ------------------------------- Products ------------------------------- */

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => fetchJson<Product[]>("/api/public/products"),
});
export const allProductsQuery = queryOptions({
  queryKey: ["all-products"],
  queryFn: () => fetchJson<Product[]>("/api/public/products"),
});
export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => fetchJson<Product | null>(`/api/public/products/${encodeURIComponent(slug)}`),
  });

/* ----------------------------- Categories ------------------------------- */

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => fetchJson<Category[]>("/api/public/categories"),
});

/* ------------------------------- Brands --------------------------------- */

export const brandsQuery = queryOptions({
  queryKey: ["brands"],
  queryFn: () => fetchJson<Brand[]>("/api/public/brands"),
});

/* ------------------------------ Banners --------------------------------- */

export const bannersQuery = queryOptions({
  queryKey: ["banners"],
  queryFn: () => fetchJson<Banner[]>("/api/public/banners"),
});

/* ------------------------------ Features -------------------------------- */

export const featuresQuery = queryOptions({
  queryKey: ["features"],
  queryFn: () => fetchJson<Feature[]>("/api/public/features"),
});

/* ---------------------------- Home sections ----------------------------- */

export const homeSectionsQuery = queryOptions({
  queryKey: ["home-sections"],
  queryFn: () => fetchJson<HomeSection[]>("/api/public/home-sections"),
});

/* ------------------------------ Blog posts ------------------------------ */

export const blogPostsQuery = queryOptions({
  queryKey: ["blog-posts"],
  queryFn: () => fetchJson<BlogPost[]>("/api/public/blog-posts"),
});
export const blogPostQuery = (slug: string) =>
  queryOptions({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchJson<BlogPost | null>(`/api/public/blog-posts/${encodeURIComponent(slug)}`),
  });

/* -------------------------------- Settings ------------------------------ */

export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: () => fetchJson<StoreSettings>("/api/public/settings"),
});

/* --------------------------- Fallback-only data ------------------------- */

export const menuQuery = queryOptions({
  queryKey: ["menu"],
  queryFn: async (): Promise<MenuItem[]> => seedMenuItems,
});
export const ordersQuery = queryOptions({
  queryKey: ["orders"],
  queryFn: async (): Promise<Order[]> => seedOrders,
});
export const validateCouponQuery = (code: string) =>
  queryOptions({
    queryKey: ["coupon", code],
    queryFn: async (): Promise<Coupon | null> =>
      seedCoupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase()) ?? null,
  });
