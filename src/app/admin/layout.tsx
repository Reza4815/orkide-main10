"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Boxes,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Package,
  PanelsTopLeft,
  Settings,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogoMark } from "@/components/store/Logo";

const nav = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/blog", label: "وبلاگ", icon: Newspaper },
  { href: "/admin/banners", label: "بنرها", icon: Images },
  { href: "/admin/catalog", label: "کاتالوگ", icon: Boxes },
  { href: "/admin/sections", label: "سکشن‌های صفحه اصلی", icon: PanelsTopLeft },
  { href: "/admin/settings", label: "تنظیمات", icon: Settings },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary/10 font-bold text-primary"
                : "text-muted-foreground hover:bg-blush hover:text-primary",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [demo] = useState(() => !isSupabaseConfigured());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (demo) return;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace("/auth?next=/admin");
    });
  }, [demo, router]);

  const logout = () => {
    if (!demo) void createClient().auth.signOut();
    toast.success("از پنل مدیریت خارج شدید");
    router.push("/");
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[260px_1fr]">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-e bg-card p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2.5 px-2 pt-2">
          <span className="grid size-10 place-items-center rounded-full bg-blush text-primary">
            <LogoMark className="size-6" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-black text-ink">پنل مدیریت</span>
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground" dir="ltr">
              ORKIDEH ADMIN
            </span>
          </span>
        </Link>
        <SidebarNav />
        <div className="mt-auto space-y-1 border-t pt-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-blush hover:text-primary"
          >
            <Home className="size-4" />
            بازگشت به فروشگاه
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            خروج از حساب
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/85 px-4 backdrop-blur-md md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="منوی مدیریت">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-4">
                <SheetHeader className="p-0 pb-4">
                  <SheetTitle>پنل مدیریت ارکیده</SheetTitle>
                </SheetHeader>
                <SidebarNav onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-sm font-bold text-ink md:text-base">مدیریت فروشگاه</h1>
            {demo && <Badge variant="blush">حالت نمایشی</Badge>}
          </div>
          <div className="flex items-center gap-2.5">
            <Avatar>
              <AvatarFallback>مد</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col leading-tight md:flex">
              <span className="text-xs font-bold text-ink">مدیر فروشگاه</span>
              <span className="text-[10px] text-muted-foreground">admin@orkideh.shop</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
