import Link from "next/link";
import { Mail, MapPin, Phone, Send, ShieldCheck } from "lucide-react";
import { getCategories, getSettings } from "@/lib/store-queries";
import { LogoBlock } from "./Logo";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export async function Footer() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);

  return (
    <footer className="mt-24 bg-gradient-to-b from-ink to-ink/95 text-background">
      <div className="container-shop grid gap-10 py-12 md:grid-cols-4 md:py-16">
        <div className="space-y-4">
          <LogoBlock light />
          <p className="text-sm leading-relaxed text-background/70">{settings.footerText}</p>
          <div className="flex items-center gap-2">
            <a
              href={settings.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="اینستاگرام"
              className="grid size-10 place-items-center rounded-full bg-background/10 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={settings.telegram}
              target="_blank"
              rel="noreferrer"
              aria-label="تلگرام"
              className="grid size-10 place-items-center rounded-full bg-background/10 transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground active:scale-95"
            >
              <Send className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-bold">دسته‌بندی‌ها</h4>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="text-background/70 transition-colors hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold">لینک‌های مهم</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/shop" className="text-background/70 transition-colors hover:text-primary">فروشگاه</Link></li>
            <li><Link href="/blog" className="text-background/70 transition-colors hover:text-primary">وبلاگ</Link></li>
            <li><Link href="/contact" className="text-background/70 transition-colors hover:text-primary">تماس با ما</Link></li>
            <li><Link href="/contact#terms" className="text-background/70 transition-colors hover:text-primary">قوانین و مقررات</Link></li>
            <li><Link href="/contact#privacy" className="text-background/70 transition-colors hover:text-primary">حریم خصوصی</Link></li>
          </ul>
        </div>

        <div className="space-y-3.5">
          <h4 className="font-bold">تماس با ما</h4>
          <p className="flex items-start gap-2.5 text-sm text-background/70">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            {settings.address}
          </p>
          <p className="flex items-center gap-2.5 text-sm text-background/70" dir="ltr">
            <Phone className="size-4 shrink-0 text-primary" />
            {settings.phone}
          </p>
          <p className="flex items-center gap-2.5 text-sm text-background/70">
            <Mail className="size-4 shrink-0 text-primary" />
            {settings.email}
          </p>
          <div className="flex items-center gap-2.5 rounded-2xl border border-background/15 p-3">
            <ShieldCheck className="size-8 shrink-0 text-primary" />
            <p className="text-xs leading-5 text-background/80">
              پرداخت امن و دارای نماد اعتماد الکترونیکی
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <p className="container-shop py-5 text-center text-xs text-background/60">
          تمامی حقوق این فروشگاه برای لباس زیر ارکیده محفوظ است.
        </p>
      </div>
    </footer>
  );
}
