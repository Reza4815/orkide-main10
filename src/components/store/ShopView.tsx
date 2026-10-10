"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PackageSearch, SlidersHorizontal, X } from "lucide-react";
import {
  allProductsQuery,
  brandsQuery,
  categoriesQuery,
  type Brand,
  type Category,
  type Product,
} from "@/lib/store-data";
import { formatToman, toFa } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";

const PAGE_SIZE = 12;
const PRICE_MAX = 3_000_000;

const sortOptions = [
  { value: "bestseller", label: "پرفروش‌ترین" },
  { value: "new", label: "جدیدترین" },
  { value: "cheap", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "discount", label: "بیشترین تخفیف" },
];

function matchesQuery(p: Product, q: string, categories: Category[], brands: Brand[]) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const cat = categories.find((c) => c.id === p.categoryId)?.name ?? "";
  const brand = brands.find((b) => b.id === p.brandId);
  return (
    p.name.toLowerCase().includes(needle) ||
    p.description.toLowerCase().includes(needle) ||
    cat.includes(needle) ||
    (brand?.name.includes(needle) ?? false) ||
    (brand?.latinName.toLowerCase().includes(needle) ?? false)
  );
}

function FiltersBody({
  categories,
  brands,
  activeCats,
  activeBrands,
  price,
  onlyStock,
  toggleCat,
  toggleBrand,
  setPrice,
  setOnlyStock,
}: {
  categories: Category[];
  brands: Brand[];
  activeCats: string[];
  activeBrands: string[];
  price: [number, number];
  onlyStock: boolean;
  toggleCat: (id: string) => void;
  toggleBrand: (id: string) => void;
  setPrice: (v: [number, number]) => void;
  setOnlyStock: (v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-bold text-ink">دسته‌بندی</p>
        <div className="space-y-2.5">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${c.id}`}
                checked={activeCats.includes(c.slug)}
                onCheckedChange={() => toggleCat(c.slug)}
              />
              <Label htmlFor={`cat-${c.id}`} className="cursor-pointer text-sm font-normal text-muted-foreground">
                {c.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <p className="mb-3 text-sm font-bold text-ink">برند</p>
        <div className="space-y-2.5">
          {brands.map((b) => (
            <div key={b.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`brand-${b.id}`}
                checked={activeBrands.includes(b.id)}
                onCheckedChange={() => toggleBrand(b.id)}
              />
              <Label htmlFor={`brand-${b.id}`} className="cursor-pointer text-sm font-normal text-muted-foreground">
                {b.name}
                <span className="ms-1.5 text-[10px] tracking-widest text-muted-foreground/70" dir="ltr">
                  {b.latinName}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <p className="mb-3 text-sm font-bold text-ink">محدوده قیمت (تومان)</p>
        <Slider
          value={price}
          min={0}
          max={PRICE_MAX}
          step={50_000}
          onValueChange={(v) => setPrice([v[0] ?? 0, v[1] ?? PRICE_MAX] as [number, number])}
          className="py-2"
        />
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{formatToman(price[0])}</span>
          <span>{formatToman(price[1])}</span>
        </div>
      </div>
      <Separator />
      <div className="flex items-center gap-2.5">
        <Checkbox id="only-stock" checked={onlyStock} onCheckedChange={(v) => setOnlyStock(v === true)} />
        <Label htmlFor="only-stock" className="cursor-pointer text-sm font-normal text-muted-foreground">
          فقط کالاهای موجود
        </Label>
      </div>
    </div>
  );
}

export function ShopView({ lockedCategory }: { lockedCategory?: Category }) {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "bestseller";
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);
  const catsParam = params.get("cats") ?? "";
  const brandsParam = params.get("brand") ?? "";

  const { data: products = [], isLoading } = useQuery(allProductsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: brands = [] } = useQuery(brandsQuery);

  const [price, setPrice] = useState<[number, number]>([0, PRICE_MAX]);
  const [onlyStock, setOnlyStock] = useState(false);

  const activeCats = useMemo(
    () => (lockedCategory ? [lockedCategory.slug] : catsParam.split(",").filter(Boolean)),
    [catsParam, lockedCategory],
  );
  const activeBrands = useMemo(() => brandsParam.split(",").filter(Boolean), [brandsParam]);

  const updateParams = (patch: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.push(`/shop?${sp.toString()}`, { scroll: false });
  };

  const toggleInList = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const toggleCat = (slug: string) => {
    if (lockedCategory) return;
    updateParams({ cats: toggleInList(activeCats, slug).join(",") || null, page: null });
  };
  const toggleBrand = (id: string) => {
    updateParams({ brand: toggleInList(activeBrands, id).join(",") || null, page: null });
  };

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        matchesQuery(p, q, categories, brands) &&
        p.price >= price[0] &&
        p.price <= price[1] &&
        (!onlyStock || p.stock > 0) &&
        (activeCats.length === 0 ||
          activeCats.includes(categories.find((c) => c.id === p.categoryId)?.slug ?? "")) &&
        (activeBrands.length === 0 || activeBrands.includes(p.brandId)),
    );
    switch (sort) {
      case "new":
        list = [...list].sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false) || b.id.localeCompare(a.id));
        break;
      case "cheap":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "expensive":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "discount":
        list = [...list].sort(
          (a, b) =>
            ((b.compareAt ?? b.price) - b.price) / (b.compareAt ?? b.price) -
            ((a.compareAt ?? a.price) - a.price) / (a.compareAt ?? a.price),
        );
        break;
      default:
        list = [...list].sort((a, b) => b.sold - a.sold);
    }
    return list;
  }, [products, q, categories, brands, price, onlyStock, activeCats, activeBrands, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1,
  );

  return (
    <div className="container-shop animate-fade-in py-6 md:py-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-36 rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-ink">
              <SlidersHorizontal className="size-4 text-primary" />
              فیلترها
            </div>
            <FiltersBody
              categories={categories}
              brands={brands}
              activeCats={activeCats}
              activeBrands={activeBrands}
              price={price}
              onlyStock={onlyStock}
              toggleCat={toggleCat}
              toggleBrand={toggleBrand}
              setPrice={setPrice}
              setOnlyStock={setOnlyStock}
            />
          </div>
        </aside>

        <div>
          {/* toolbar */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal />
                    فیلترها
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-xs overflow-y-auto p-5">
                  <SheetHeader className="p-0 pb-4">
                    <SheetTitle>فیلترها</SheetTitle>
                  </SheetHeader>
                  <FiltersBody
                    categories={categories}
                    brands={brands}
                    activeCats={activeCats}
                    activeBrands={activeBrands}
                    price={price}
                    onlyStock={onlyStock}
                    toggleCat={toggleCat}
                    toggleBrand={toggleBrand}
                    setPrice={setPrice}
                    setOnlyStock={setOnlyStock}
                  />
                </SheetContent>
              </Sheet>
              <p className="text-xs text-muted-foreground md:text-sm">
                {isLoading ? "…" : `${toFa(filtered.length)} کالا`}
                {q && (
                  <>
                    {" "}
                    برای «{q}»
                    <button
                      type="button"
                      onClick={() => updateParams({ q: null, page: null })}
                      className="ms-1 inline-flex items-center gap-0.5 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      حذف
                      <X className="size-3" />
                    </button>
                  </>
                )}
              </p>
            </div>
            <Select value={sort} onValueChange={(v) => updateParams({ sort: v, page: null })}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {lockedCategory && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge variant="blush" className="px-3 py-1.5 text-xs">
                دسته: {lockedCategory.name}
              </Badge>
            </div>
          )}

          {/* grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-primary/40 bg-gradient-to-b from-blush/70 to-transparent py-16 text-center">
              <PackageSearch className="size-10 text-muted-foreground" />
              <p className="text-sm font-bold text-ink">کالایی با این مشخصات پیدا نشد</p>
              <p className="text-xs text-muted-foreground">فیلترها را تغییر دهید یا عبارت دیگری جست‌وجو کنید.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPrice([0, PRICE_MAX]);
                  setOnlyStock(false);
                  router.push("/shop");
                }}
              >
                حذف همه فیلترها
              </Button>
            </div>
          ) : (
            <div className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5", !lockedCategory && "xl:grid-cols-4", lockedCategory && "xl:grid-cols-3")}>
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    aria-disabled={safePage <= 1}
                    className={safePage <= 1 ? "pointer-events-none opacity-40" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (safePage > 1) updateParams({ page: String(safePage - 1) });
                    }}
                  />
                </PaginationItem>
                {pages.map((p, i) => (
                  <PaginationItem key={p}>
                    {i > 0 && pages[i - 1]! < p - 1 ? (
                      <span className="px-1 text-muted-foreground">…</span>
                    ) : null}
                    <PaginationLink
                      isActive={p === safePage}
                      onClick={(e) => {
                        e.preventDefault();
                        updateParams({ page: String(p) });
                      }}
                    >
                      {toFa(p)}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    aria-disabled={safePage >= totalPages}
                    className={safePage >= totalPages ? "pointer-events-none opacity-40" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      if (safePage < totalPages) updateParams({ page: String(safePage + 1) });
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
