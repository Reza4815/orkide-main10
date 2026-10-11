"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";

const KEYS: { key: string; label: string }[] = [
  { key: "logo", label: "لوگوی سایت" },
  { key: "favicon", label: "فاوآیکون" },
  { key: "about-banner", label: "بنر صفحه درباره ما" },
  { key: "contact-banner", label: "بنر صفحه تماس" },
  { key: "empty-cart", label: "تصویر سبد خالی" },
  { key: "404-image", label: "تصویر صفحه ۴۰۴" },
];

type SiteImageRow = { key: string; url: string; alt?: string; section?: string };

export default function AdminSiteImagesPage() {
  const [rows, setRows] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/site-images")
      .then((r) => r.json())
      .then((data: SiteImageRow[]) => {
        const map: Record<string, string> = {};
        for (const row of data) map[row.key] = row.url;
        setRows(map);
        setLoading(false);
      })
      .catch(() => {
        toast.error("خطا در بارگذاری تصاویر");
        setLoading(false);
      });
  }, []);

  const save = async (key: string, url: string | null) => {
    setBusy(key);
    setRows((prev) => {
      const next = { ...prev };
      if (url) next[key] = url;
      else delete next[key];
      return next;
    });
    try {
      if (url) {
        const res = await fetch("/api/admin/site-images", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, url, alt: key, section: "general" }),
        });
        if (!res.ok) throw new Error("save failed");
      } else {
        const res = await fetch(`/api/admin/site-images?key=${encodeURIComponent(key)}`, { method: "DELETE" });
        if (!res.ok) throw new Error("delete failed");
      }
      toast.success("تصویر ذخیره شد");
    } catch {
      toast.error("خطا در ذخیره تصویر");
      // rollback
      fetch("/api/admin/site-images")
        .then((r) => r.json())
        .then((data: SiteImageRow[]) => {
          const map: Record<string, string> = {};
          for (const row of data) map[row.key] = row.url;
          setRows(map);
        })
        .catch(() => {});
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return <p className="text-xs text-muted-foreground">در حال بارگذاری…</p>;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black text-ink">تصاویر سایت</h1>
        <p className="text-xs text-muted-foreground">مدیریت تصاویر ثابت بخش‌های مختلف فروشگاه</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KEYS.map(({ key, label }) => (
          <Card key={key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{label}</CardTitle>
              <p className="text-[10px] text-muted-foreground" dir="ltr">
                {key}
              </p>
            </CardHeader>
            <CardContent>
              <ImageUpload
                label={label}
                value={rows[key] ?? null}
                onChange={(url) => save(key, url)}
              />
              {busy === key && <p className="mt-2 text-[10px] text-muted-foreground">در حال ذخیره…</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
