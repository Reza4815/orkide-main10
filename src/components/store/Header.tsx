"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { categoriesQuery, menuQuery } from "@/lib/queries.client";
import { useCart } from "@/lib/cart";
import { toFa } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoBlock } from "./Logo";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { count } = useCart();
  const [q, setQ] = useState("");
  const { data: menu } = useQuery(menuQuery);
  const { data: categories } = useQuery(categoriesQuery);
  const topCategories = (categories ?? []).slice(0, 5);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  };

  const linkCls = (href: string) =>
    cn(
      "py-1 text-sm text-muted-foreground transition-colors hover:text-primary",
      (href === "/" ? pathname === "/" : pathname.startsWith(href)) && "text-primary font-semibold",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/70 dark:bg-surface-dark/70 backdrop-blur-md">
      {/* top strip */}
      <div className="hidden bg-blush md:block">
        <p className="container-shop py-1.5 text-center text-[11px] text-blush-foreground/80">
          ارسال رایگان برای خریدهای بالای ۹۰۰ هزار تومان — پشتیبانی هر روز ۹ تا ۲۰
        </p>
      </div>

      {/* main row */}
      <div className="container-shop grid h-16 grid-cols-[auto_1fr_auto] items-center gap-3 md:h-20 md:gap-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="منو">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-xs p-0">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="sr-only">منوی فروشگاه</SheetTitle>
                <SheetClose asChild>
                  <Link href="/" aria-label="صفحه اصلی">
                    <LogoBlock />
                  </Link>
                </SheetClose>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                <Link href="/" className={linkCls("/") + " rounded-xl px-3 py-2.5"}>
                  صفحه اصلی
                </Link>
                {(menu ?? []).map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className={linkCls(item.href) + " rounded-xl px-3 py-2.5"}>
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link href="/auth" className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground">
                    ورود / ثبت‌نام
                  </Link>
                </SheetClose>
              </nav>
              <div className="border-t p-4">
                <p className="mb-2 px-3 text-xs font-bold text-ink">دسته‌بندی‌ها</p>
                <div className="flex flex-col gap-1">
                  {(categories ?? []).map((c) => (
                    <SheetClose asChild key={c.id}>
                      <Link
                        href={`/category/${c.slug}`}
                        className="rounded-xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-blush hover:text-primary"
                      >
                        {c.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" aria-label="لباس زیر ارکیده" className="shrink-0">
            <LogoBlock />
          </Link>
        </div>

        {/* search */}
        <form onSubmit={submit} className="relative mx-auto w-full max-w-xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جست‌وجوی محصول، برند یا کد کالا"
            className="h-11 w-full rounded-2xl border border-transparent bg-secondary/70 pe-11 ps-4 text-sm shadow-soft outline-none transition-all placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-[3px] focus:ring-ring/40"
          />
          <button
            type="submit"
            aria-label="جست‌وجو"
            className="absolute end-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-blush hover:text-primary"
          >
            <Search className="size-4" />
          </button>
        </form>

        {/* actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/auth"
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary md:flex"
          >
            <User className="size-4" />
            ورود / ثبت‌نام
          </Link>
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_0_30px_-8px_rgba(232,168,184,0.6)] active:scale-95"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -start-1.5 grid h-5 min-w-5 place-items-center animate-pulse rounded-full bg-ink px-1 text-[10px] font-bold text-background shadow-[0_0_12px_-2px_rgba(232,168,184,0.9)]">
                {toFa(count)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* nav row */}
      <nav className="hidden border-t md:block">
        <div className="container-shop flex h-12 items-center gap-6">
          {(menu ?? []).map((item) => (
            <Link key={item.href} href={item.href} className={linkCls(item.href)}>
              {item.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          {topCategories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className={linkCls(`/category/${c.slug}`)}>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
