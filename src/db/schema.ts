import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const banners = pgTable("banners", {
  id: varchar("id", { length: 50 }).primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  image: text("image"),
  ctaLabel: varchar("cta_label", { length: 100 }).notNull().default(""),
  ctaHref: varchar("cta_href", { length: 200 }).notNull().default(""),
  badge: varchar("badge", { length: 100 }).notNull().default(""),
  sort: integer("sort").notNull().default(0),
  active: boolean("active").notNull().default(true),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const storeSettings = pgTable("store_settings", {
  id: integer("id").primaryKey().default(1),
  storeName: text("store_name").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  address: text("address").notNull().default(""),
  hours: text("hours").notNull().default(""),
  footerText: text("footer_text").notNull().default(""),
  freeShippingThreshold: integer("free_shipping_threshold")
    .notNull()
    .default(0),
  shippingCost: integer("shipping_cost").notNull().default(0),
  instagram: text("instagram").notNull().default(""),
  telegram: text("telegram").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteImages = pgTable("site_images", {
  key: varchar("key", { length: 100 }).primaryKey(),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  section: varchar("section", { length: 50 }).notNull().default("general"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const homepageSections = pgTable("homepage_sections", {
  id: varchar("id", { length: 50 }).primaryKey(),
  type: varchar("type", { length: 30 }).notNull(),
  title: text("title"),
  subtitle: text("subtitle"),
  config: jsonb("config").$type<{
    source?: string;
    limit?: number;
    layout?: string;
  }>(),
  active: boolean("active").notNull().default(true),
});

export const products = pgTable("products", {
  id: varchar("id", { length: 50 }).primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: text("name").notNull(),
  brandId: varchar("brand_id", { length: 50 }).notNull(),
  categoryId: varchar("category_id", { length: 50 }).notNull(),
  price: integer("price").notNull().default(0),
  compareAt: integer("compare_at"),
  colors: jsonb("colors")
    .$type<{ name: string; hex: string }[]>()
    .notNull()
    .default([]),
  sizes: text("sizes").array().notNull().default([]),
  images: text("images").array().notNull().default([]),
  description: text("description").notNull().default(""),
  specs: jsonb("specs")
    .$type<{ label: string; value: string }[]>()
    .notNull()
    .default([]),
  isNew: boolean("is_new").notNull().default(false),
  rating: integer("rating").notNull().default(0),
  numReviews: integer("num_reviews").notNull().default(0),
  sold: integer("sold").notNull().default(0),
  stock: integer("stock").notNull().default(0),
});

export const categories = pgTable("categories", {
  id: varchar("id", { length: 50 }).primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  description: text("description").notNull().default(""),
});

export const brands = pgTable("brands", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  latinName: varchar("latin_name", { length: 120 }).notNull().default(""),
});

export const features = pgTable("features", {
  id: varchar("id", { length: 50 }).primaryKey(),
  icon: varchar("icon", { length: 50 }).notNull().default("sparkles"),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id", { length: 50 }).primaryKey(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  cover: text("cover"),
  date: varchar("date", { length: 20 }).notNull().default(""),
  author: text("author").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  content: text("content").array().notNull().default([]),
  readMinutes: integer("read_minutes").notNull().default(5),
});
