"use client";

import { useState, type FormEvent } from "react";
import { Clock, Headset, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { settingsQuery } from "@/lib/queries.client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const { data: settings } = useQuery(settingsQuery);
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    (e.target as HTMLFormElement).reset();
    toast.success("پیام شما ارسال شد", { description: "کارشناسان ما ظرف ۲۴ ساعت پاسخ می‌دهند." });
  };

  const cards = [
    { icon: MapPin, title: "آدرس فروشگاه", value: settings?.address ?? "تهران، خیابان ولیعصر" },
    { icon: Phone, title: "تلفن پشتیبانی", value: settings?.phone ?? "۰۲۱-۹۱۰۰۸۸۰۰", ltr: true },
    { icon: Mail, title: "ایمیل", value: settings?.email ?? "hello@orkideh.shop", ltr: true },
    { icon: Clock, title: "ساعات کاری", value: settings?.hours ?? "شنبه تا پنجشنبه ۹ تا ۲۰" },
  ];

  return (
    <div className="container-shop animate-fade-in py-8 md:py-12">
      <div className="mb-8 max-w-xl">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-blush px-3 py-1 text-[11px] font-semibold text-primary">
          <Headset className="size-3" />
          پاسخ‌گویی هر روز ۹ تا ۲۰
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">تماس با ارکیده</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          برای پیگیری سفارش، مشاوره سایز یا هر پرسش دیگری، از راه‌های زیر با ما در ارتباط باشید.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.title}
            className="flex items-start gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_rgba(232,168,184,0.5)]"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-soft via-primary to-primary-deep text-primary-foreground">
              <c.icon className="size-5" />
            </span>
            <span>
              <p className="text-xs text-muted-foreground">{c.title}</p>
              <p className="mt-1 text-sm font-bold leading-6 text-ink" dir={c.ltr ? "ltr" : undefined}>
                {c.value}
              </p>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40 md:p-7">
          <h2 className="font-bold text-ink">ارسال پیام</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="c-name">نام شما</Label>
              <Input id="c-name" required placeholder="نام و نام خانوادگی" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-phone">شماره تماس</Label>
              <Input id="c-phone" required dir="ltr" inputMode="numeric" placeholder="09123456789" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="c-subject">موضوع</Label>
            <Input id="c-subject" required placeholder="مثلاً پیگیری سفارش" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="c-msg">متن پیام</Label>
            <Textarea id="c-msg" required rows={5} placeholder="پیام خود را بنویسید…" />
          </div>
          <Button type="submit" size="lg" disabled={sending} className="w-full sm:w-auto">
            <Send />
            {sending ? "در حال ارسال…" : "ارسال پیام"}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-border/60 shadow-soft transition-colors hover:border-primary/40">
            <div className="flex h-56 flex-col items-center justify-center gap-2 bg-gradient-to-b from-primary-soft/60 via-blush to-background text-center md:h-64">
              <MapPin className="size-8 text-primary" />
              <p className="text-sm font-bold text-ink">فروشگاه حضوری ارکیده</p>
              <p className="max-w-xs px-4 text-xs leading-relaxed text-muted-foreground">
                {settings?.address}
              </p>
            </div>
          </div>
          <div id="terms" className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40 md:p-6">
            <h2 className="mb-3 font-bold text-ink">قوانین و مقررات</h2>
            <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
              <li>• به احترام بهداشت مشتریان، تعویض فقط برای اقلام استفاده‌نشده با لیبل سالم تا ۷ روز امکان‌پذیر است.</li>
              <li>• سفارش‌های ثبت‌شده تا ساعت ۱۴ همان روز پردازش می‌شوند.</li>
              <li>• بسته‌بندی تمام سفارش‌ها محرمانه و بدون ذکر محتوا انجام می‌شود.</li>
            </ul>
          </div>
          <div id="privacy" className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40 md:p-6">
            <h2 className="mb-3 font-bold text-ink">حریم خصوصی</h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              اطلاعات شما فقط برای پردازش سفارش استفاده می‌شود و هرگز در اختیار شخص ثالث قرار نمی‌گیرد. رسیدها و بسته‌ها بدون نام فروشگاه ارسال می‌شوند تا حریم خرید شما کاملاً محفوظ بماند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
