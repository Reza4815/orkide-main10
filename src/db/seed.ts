import "./env";
import { db, pool } from "./index";
import {
  banners,
  blogPosts,
  brands,
  categories,
  features,
  homepageSections,
  products,
  storeSettings,
} from "./schema";
import {
  banners as seedBanners,
  blogPosts as seedBlogPosts,
  brands as seedBrands,
  categories as seedCategories,
  features as seedFeatures,
  homeSections as seedHomeSections,
  products as seedProducts,
  settings as seedSettings,
} from "../lib/seed";

async function seed() {
  const existing = await db.select().from(banners).limit(1);
  if (existing.length > 0) {
    console.log("banners already present — skipping seed");
    return;
  }

  console.log("seeding database...");

  for (const c of seedCategories) {
    await db
      .insert(categories)
      .values(c)
      .onConflictDoUpdate({ target: categories.id, set: c });
  }
  for (const b of seedBrands) {
    await db
      .insert(brands)
      .values(b)
      .onConflictDoUpdate({ target: brands.id, set: b });
  }
  for (const p of seedProducts) {
    const row = { ...p, rating: Math.round(p.rating) };
    await db
      .insert(products)
      .values(row)
      .onConflictDoUpdate({ target: products.id, set: row });
  }
  for (const b of seedBanners) {
    await db
      .insert(banners)
      .values({ ...b, sort: seedBanners.indexOf(b) })
      .onConflictDoUpdate({
        target: banners.id,
        set: { ...b, sort: seedBanners.indexOf(b) },
      });
  }
  for (const f of seedFeatures) {
    await db
      .insert(features)
      .values(f)
      .onConflictDoUpdate({ target: features.id, set: f });
  }
  for (const p of seedBlogPosts) {
    await db
      .insert(blogPosts)
      .values(p)
      .onConflictDoUpdate({ target: blogPosts.id, set: p });
  }
  for (const s of seedHomeSections) {
    await db
      .insert(homepageSections)
      .values(s)
      .onConflictDoUpdate({ target: homepageSections.id, set: s });
  }
  await db
    .insert(storeSettings)
    .values({ id: 1, ...seedSettings })
    .onConflictDoUpdate({ target: storeSettings.id, set: { id: 1, ...seedSettings } });

  console.log("seed complete");
}

seed()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
