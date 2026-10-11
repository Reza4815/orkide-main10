import {
  getBanners,
  getBlogPosts,
  getBrands,
  getCategories,
  getFeatures,
  getHomeSections,
  getProducts,
} from "@/lib/store-queries";
import { selectProducts } from "@/lib/store-data";
import {
  BlogSection,
  BrandsSection,
  CategoryStrip,
  FeaturesSection,
  Hero,
  NewsletterSection,
  ProductSection,
  PromoCards,
} from "@/components/store/HomeSections";

export const revalidate = 60;

export default async function HomePage() {
  const [banners, categories, homeSections, features, brands, blogPosts, products] = await Promise.all([
    getBanners(),
    getCategories(),
    getHomeSections(),
    getFeatures(),
    getBrands(),
    getBlogPosts(),
    getProducts(),
  ]);

  const sections = homeSections.filter((s) => s.active);

  return (
    <div className="pb-4">
      <Hero banners={banners} />
      <CategoryStrip categories={categories} />

      {sections.map((section, idx) => {
        switch (section.type) {
          case "products": {
            const items = selectProducts(products, section.config?.source, section.config?.limit ?? 8);
            return (
              <ProductSection
                key={section.id}
                title={section.title}
                subtitle={section.subtitle}
                products={items}
                layout={section.config?.layout ?? "grid"}
                href={section.config?.source === "new" ? "/shop?sort=new" : "/shop"}
                priority={idx === 0}
              />
            );
          }
          case "promo":
            return <PromoCards key={section.id} categories={categories} />;
          case "features":
            return <FeaturesSection key={section.id} features={features} />;
          case "brands":
            return <BrandsSection key={section.id} brands={brands} />;
          case "blog":
            return <BlogSection key={section.id} posts={blogPosts} />;
          case "newsletter":
            return <NewsletterSection key={section.id} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
