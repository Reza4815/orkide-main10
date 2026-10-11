"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { brandsQuery, categoriesQuery } from "@/lib/queries.client";
import type { Brand, Category } from "@/lib/store-data";
import { toFa } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { SafeImage } from "@/components/SafeImage";

type CatDraft = { id: string; name: string; slug: string; description: string; image: string | null };

const emptyCat: CatDraft = { id: "", name: "", slug: "", description: "", image: null };

async function putJson(url: string, body: unknown, method = "PUT") {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`request failed: ${res.status}`);
}

export default function AdminCatalogPage() {
  const qc = useQueryClient();
  const { data: cats = [] } = useQuery(categoriesQuery);
  const { data: brs = [] } = useQuery(brandsQuery);

  const [catDraft, setCatDraft] = useState<CatDraft | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandLatin, setBrandLatin] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["brands"] });
  };

  const openNewCat = () => setCatDraft({ ...emptyCat, id: `c${Date.now()}` });
  const openEditCat = (c: Category) =>
    setCatDraft({ id: c.id, name: c.name, slug: c.slug, description: c.description, image: c.image });

  const saveCat = async () => {
    if (!catDraft?.name.trim()) return toast.error("نام دسته‌بندی الزامی است");
    setBusy(true);
    try {
      await putJson("/api/admin/categories", {
        id: catDraft.id,
        name: catDraft.name.trim(),
        slug: catDraft.slug.trim() || catDraft.name.trim().replace(/\s+/g, "-"),
        description: catDraft.description,
        image: catDraft.image,
      });
      toast.success("دسته‌بندی ذخیره شد");
      setCatDraft(null);
      invalidate();
    } catch {
      toast.error("خطا در ذخیره دسته‌بندی");
    } finally {
      setBusy(false);
    }
  };

  const deleteCat = async (id: string) => {
    setBusy(true);
    try {
      await putJson(`/api/admin/categories?id=${encodeURIComponent(id)}`, null, "DELETE");
      toast.success("دسته‌بندی حذف شد");
      invalidate();
    } catch {
      toast.error("خطا در حذف دسته‌بندی");
    } finally {
      setBusy(false);
    }
  };

  const saveBrand = async () => {
    if (!brandName.trim()) return toast.error("نام برند الزامی است");
    setBusy(true);
    try {
      await putJson("/api/admin/brands", {
        id: `b${Date.now()}`,
        name: brandName.trim(),
        latinName: brandLatin.trim().toUpperCase() || "BRAND",
      });
      toast.success("برند ذخیره شد");
      setBrandName("");
      setBrandLatin("");
      setBrandOpen(false);
      invalidate();
    } catch {
      toast.error("خطا در ذخیره برند");
    } finally {
      setBusy(false);
    }
  };

  const deleteBrand = async (id: string) => {
    setBusy(true);
    try {
      await putJson(`/api/admin/brands?id=${encodeURIComponent(id)}`, null, "DELETE");
      toast.success("برند حذف شد");
      invalidate();
    } catch {
      toast.error("خطا در حذف برند");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black text-ink">کاتالوگ</h1>
        <p className="text-xs text-muted-foreground">مدیریت دسته‌بندی‌ها و برندهای فروشگاه</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">دسته‌بندی‌ها ({toFa(cats.length)})</CardTitle>
            <Button size="sm" variant="outline" onClick={openNewCat} disabled={busy}>
              <Plus />
              جدید
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {cats.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border p-2.5">
                <span className="relative block size-10 shrink-0 overflow-hidden rounded-lg bg-blush">
                  <SafeImage src={c.image} alt={c.name} fill sizes="40px" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-ink">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground" dir="ltr">
                    {c.slug}
                  </span>
                </span>
                <Button variant="ghost" size="icon-sm" aria-label="ویرایش" onClick={() => openEditCat(c)} disabled={busy}>
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="حذف"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteCat(c.id)}
                  disabled={busy}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">برندها ({toFa(brs.length)})</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setBrandOpen(true)} disabled={busy}>
              <Plus />
              جدید
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {brs.map((b) => (
              <div key={b.id} className="flex items-center gap-3 rounded-xl border p-2.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blush text-[10px] font-black tracking-wider text-primary" dir="ltr">
                  {b.latinName.slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-ink">{b.name}</span>
                  <span className="text-[10px] text-muted-foreground" dir="ltr">
                    {b.latinName}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="حذف"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => deleteBrand(b.id)}
                  disabled={busy}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* category dialog */}
      <Dialog open={!!catDraft} onOpenChange={(o) => !o && setCatDraft(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{cats.some((c) => c.id === catDraft?.id) ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}</DialogTitle>
            <DialogDescription>نام، اسلاگ و تصویر دسته‌بندی را وارد کنید.</DialogDescription>
          </DialogHeader>
          {catDraft && (
            <div className="grid gap-4">
              <div className="grid gap-1.5">
                <Label>نام</Label>
                <Input value={catDraft.name} onChange={(e) => setCatDraft((d) => d && { ...d, name: e.target.value })} />
              </div>
              <div className="grid gap-1.5">
                <Label>اسلاگ</Label>
                <Input dir="ltr" value={catDraft.slug} onChange={(e) => setCatDraft((d) => d && { ...d, slug: e.target.value })} placeholder="auto" />
              </div>
              <div className="grid gap-1.5">
                <Label>توضیحات</Label>
                <Textarea rows={2} value={catDraft.description} onChange={(e) => setCatDraft((d) => d && { ...d, description: e.target.value })} />
              </div>
              <ImageUpload label="تصویر دسته‌بندی" value={catDraft.image} onChange={(url) => setCatDraft((d) => d && { ...d, image: url })} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDraft(null)}>
              انصراف
            </Button>
            <Button onClick={saveCat} disabled={busy}>
              ذخیره
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* brand dialog */}
      <Dialog open={brandOpen} onOpenChange={setBrandOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>برند جدید</DialogTitle>
            <DialogDescription>نام فارسی و نام لاتین برند را وارد کنید.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>نام فارسی</Label>
              <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>نام لاتین</Label>
              <Input dir="ltr" value={brandLatin} onChange={(e) => setBrandLatin(e.target.value)} placeholder="ORKIDEH" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBrandOpen(false)}>
              انصراف
            </Button>
            <Button onClick={saveBrand} disabled={busy}>
              افزودن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
