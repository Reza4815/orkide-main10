"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, Eye, ImagePlus, Package, ShoppingCart, TrendingUp, UploadCloud, Users } from "lucide-react";
import { toast } from "sonner";
import { allProductsQuery, ordersQuery } from "@/lib/queries.client";
import { orderStatusLabel, type OrderStatus } from "@/lib/store-data";
import { formatToman, toFa } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const weekly = [
  { day: "شنبه", sales: 2_400_000, orders: 6 },
  { day: "یکشنبه", sales: 3_150_000, orders: 8 },
  { day: "دوشنبه", sales: 1_980_000, orders: 5 },
  { day: "سه‌شنبه", sales: 4_320_000, orders: 11 },
  { day: "چهارشنبه", sales: 3_860_000, orders: 9 },
  { day: "پنجشنبه", sales: 5_410_000, orders: 14 },
  { day: "جمعه", sales: 4_780_000, orders: 12 },
];

const monthly = [
  { month: "مهر", revenue: 38 },
  { month: "آبان", revenue: 44 },
  { month: "آذر", revenue: 61 },
  { month: "دی", revenue: 57 },
  { month: "بهمن", revenue: 72 },
  { month: "اسفند", revenue: 88 },
];

const statusVariant: Record<OrderStatus, "secondary" | "default" | "outline" | "blush" | "destructive"> = {
  pending: "secondary",
  paid: "blush",
  shipped: "outline",
  delivered: "default",
  canceled: "destructive",
};

function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    const objectUrl = next ? URL.createObjectURL(next) : null;
    previewRef.current = objectUrl;
    setPreview(objectUrl);
    setFile(next);
    setUploadedUrl(null);
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error("ابتدا یک تصویر انتخاب کنید");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "آپلود ناموفق بود");
      setUploadedUrl(data.url);
      toast.success("تصویر با موفقیت آپلود شد", { description: data.url });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="gap-4 py-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <ImagePlus className="size-4 text-primary" />
          آپلود تصویر محلی
        </CardTitle>
        <CardDescription className="text-[11px] leading-relaxed">
          تصویر را انتخاب کنید، پیش‌نمایش را بررسی کنید و در پوشه public/uploads ذخیره کنید.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="relative grid h-40 w-40 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-border/80 bg-blush">
            {preview ? (
              <Image
                src={preview}
                alt="پیش‌نمایش تصویر"
                width={160}
                height={160}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex flex-col items-center gap-1.5 px-3 text-center text-[11px] text-muted-foreground">
                <ImagePlus className="size-6" />
                پیش‌نمایش تصویر
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <input
              id="upload-input"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              aria-label="انتخاب تصویر"
              className="block w-full cursor-pointer rounded-2xl border border-border/60 bg-background text-xs text-muted-foreground file:me-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-foreground"
            />

            {file && (
              <p className="text-[11px] text-muted-foreground">
                فایل انتخابی: <b className="text-ink">{file.name}</b> — {toFa(Math.round(file.size / 1024))} کیلوبایت
              </p>
            )}

            {uploadedUrl && (
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noreferrer"
                dir="ltr"
                className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span className="truncate">{uploadedUrl}</span>
              </a>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={uploading || !file}>
                <UploadCloud />
                {uploading ? "در حال آپلود…" : "آپلود تصویر"}
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById("upload-input")?.click()}>
                انتخاب مجدد
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: products = [] } = useQuery(allProductsQuery);
  const { data: orders = [] } = useQuery(ordersQuery);

  const totalRevenue = orders.filter((o) => o.status !== "canceled").reduce((s, o) => s + o.total, 0);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = topProducts[0]?.sold ?? 1;

  const stats = [
    { title: "درآمد این هفته", value: formatToman(weekly.reduce((s, d) => s + d.sales, 0)), unit: "تومان", delta: "٪۱۲ نسبت به هفته قبل", icon: TrendingUp },
    { title: "سفارش‌های این هفته", value: toFa(weekly.reduce((s, d) => s + d.orders, 0)), unit: "سفارش", delta: "٪۸ رشد", icon: ShoppingCart },
    { title: "محصولات فعال", value: toFa(products.length), unit: "کالا", delta: "۴ کالای جدید", icon: Package },
    { title: "بازدید امروز", value: toFa(1_842), unit: "بازدید", delta: "٪۲۳ رشد", icon: Eye },
  ];

  return (
    <div className="space-y-6">
      {/* local image upload */}
      <ImageUploadForm />

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} className="gap-3 py-5">
            <CardContent className="flex items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blush text-primary">
                <s.icon className="size-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] text-muted-foreground">{s.title}</span>
                <span className="text-lg font-black text-ink">
                  {s.value}
                  <span className="ms-1 text-[10px] font-medium text-muted-foreground">{s.unit}</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-600">{s.delta}</span>
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">فروش هفته جاری</CardTitle>
          </CardHeader>
          <CardContent dir="ltr">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={weekly} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => `${v / 1_000_000}M`}
                  width={40}
                />
                <Tooltip
                  formatter={(value) => [`${formatToman(Number(value))} تومان`, "فروش"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12, direction: "rtl" }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2.5} fill="url(#salesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">درآمد ماهانه (میلیون تومان)</CardTitle>
          </CardHeader>
          <CardContent dir="ltr">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthly} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" width={30} />
                <Tooltip
                  formatter={(value) => [`${toFa(Number(value))} میلیون تومان`, "درآمد"]}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12, direction: "rtl" }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* recent orders */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">آخرین سفارش‌ها</CardTitle>
            <a href="/admin/orders" className="text-[11px] text-primary hover:underline">
              مشاهده همه
            </a>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>کد</TableHead>
                  <TableHead>مشتری</TableHead>
                  <TableHead>مبلغ</TableHead>
                  <TableHead>وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell dir="ltr" className="text-xs font-semibold">
                      {o.code}
                    </TableCell>
                    <TableCell className="text-xs">{o.customer}</TableCell>
                    <TableCell className="text-xs">{formatToman(o.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[o.status]}>{orderStatusLabel[o.status]}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* top products */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">پرفروش‌ترین محصولات</CardTitle>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Users className="size-3.5" />
              بر اساس تعداد فروش
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-blush text-xs font-black text-primary">
                  {toFa(i + 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-xs font-bold text-ink">{p.name}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.round((p.sold / maxSold) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{toFa(p.sold.toLocaleString("en-US"))} فروش</span>
              </div>
            ))}
            <p className="border-t pt-3 text-[11px] text-muted-foreground">
              درآمد کل سفارش‌های ثبت‌شده: <b className="text-ink">{formatToman(totalRevenue)} تومان</b>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
