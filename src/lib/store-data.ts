import { coupons as seedCoupons } from "./seed";

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

export type Category = {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  description: string;
};
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

export type Feature = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

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
export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "canceled";
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

/* -------------------------- selection helpers --------------------------- */

export function selectProducts(
  products: Product[],
  source?: string,
  limit = 8,
): Product[] {
  let list = [...products];
  switch (source) {
    case "new":
      list = list
        .filter((p) => p.isNew)
        .sort((a, b) => b.id.localeCompare(a.id));
      break;
    case "bestseller":
      list = list.sort((a, b) => b.sold - a.sold);
      break;
    case "discounted":
      list = list
        .filter((p) => p.compareAt && p.compareAt > p.price)
        .sort(
          (a, b) =>
            (b.compareAt! - b.price) / b.compareAt! -
            (a.compareAt! - a.price) / a.compareAt!,
        );
      break;
    default:
      break;
  }
  return list.slice(0, limit);
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "در انتظار پرداخت",
  paid: "پرداخت شده",
  shipped: "ارسال شده",
  delivered: "تحویل شده",
  canceled: "لغو شده",
};

export const brandById = (brands: Brand[], id: string) =>
  brands.find((b) => b.id === id);
export const categoryById = (categories: Category[], id: string) =>
  categories.find((c) => c.id === id);
export const categoryBySlug = (categories: Category[], slug: string) =>
  categories.find((c) => c.slug === slug);

export async function validateCoupon(code: string): Promise<Coupon | null> {
  return (
    seedCoupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase(),
    ) ?? null
  );
}
