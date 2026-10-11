"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { allProductsQuery, brandsQuery, categoriesQuery } from "@/lib/queries.client";
import type { Product } from "@/lib/store-data";
import { formatToman, toFa } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/SafeImage";
import { ImageUpload } from "@/components/ImageUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Draft = {
  name: string;
  price: string;
  compareAt: string;
  categoryId: string;
  brandId: string;
  stock: string;
  description: string;
  images: string[];
};

const emptyDraft: Draft = {
  name: "",
  price: "",
  compareAt: "",
  categoryId: "",
  brandId: "",
  stock: "",
  description: "",
  images: [],
};

async function putProduct(body: Product) {
  const res = await fetch("/api/admin/products", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
}

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const { data: seed = [] } = useQuery(allProductsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: brands = [] } = useQuery(brandsQuery);

  const [rows, setRows] = useState<Product[] | null>(null);
  const products = rows ?? seed;
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const filtered = useMemo(
    () => products.filter((p) => p.name.includes(q.trim()) || p.id.includes(q.trim())),
    [products, q],
  );

  const openNew = () => {
    setEditing(null);
    setDraft({ ...emptyDraft, categoryId: categories[0]?.id ?? "", brandId: brands[0]?.id ?? "" });
    setDialogOpen(true);
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["all-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setDraft({
      name: p.name,
      price: String(p.price),
      compareAt: p.compareAt ? String(p.compareAt) : "",
      categoryId: p.categoryId,
      brandId: p.brandId,
      stock: String(p.stock),
      description: p.description,
      images: [...p.images],
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!draft.name.trim() || !draft.price) {
      toast.error("نام و قیمت محصول الزامی است");
      return;
    }
    const base: Product = editing ?? {
      id: `p${Date.now()}`,
      slug: `product-${Date.now()}`,
      name: "",
      brandId: draft.brandId,
      categoryId: draft.categoryId,
      price: 0,
      compareAt: null,
      colors: [],
      sizes: ["Free"],
      images: [],
      description: "",
      specs: [],
      rating: 5,
      numReviews: 0,
      sold: 0,
      stock: 0,
    };
    const next: Product = {
      ...base,
      name: draft.name.trim(),
      price: Number(draft.price),
      compareAt: draft.compareAt ? Number(draft.compareAt) : null,
      categoryId: draft.categoryId,
      brandId: draft.brandId,
      stock: Number(draft.stock || 0),
      description: draft.description.trim(),
      images: draft.images,
    };
    try {
      await putProduct(next);
      setRows((prev) => {
        const list = prev ?? seed;
        return editing ? list.map((p) => (p.id === editing.id ? next : p)) : [next, ...list];
      });
      setDialogOpen(false);
      invalidate();
      toast.success(editing ? "محصول ویرایش شد" : "محصول جدید اضافه شد");
    } catch {
      toast.error("خطا در ذخیره محصول");
    }
  };

  const remove = async () => {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(deleting.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("DELETE failed");
      setRows((prev) => (prev ?? seed).filter((p) => p.id !== deleting.id));
      invalidate();
      toast.success("محصول حذف شد");
    } catch {
      toast.error("خطا در حذف محصول");
    }
    setDeleting(null);
  };

  const toggleStock = async (p: Product, v: boolean) => {
    const next = { ...p, stock: v ? Math.max(p.stock, 10) : 0 };
    setRows((prev) => (prev ?? seed).map((x) => (x.id === p.id ? next : x)));
    try {
      await putProduct(next);
      invalidate();
    } catch {
      toast.error("خطا در بروزرسانی موجودی");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black text-ink">محصولات</h1>
          <p className="text-xs text-muted-foreground">{toFa(products.length)} کالا در فروشگاه</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute end-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جست‌وجوی محصول…" className="h-9 w-44 pe-9 md:w-56" />
          </div>
          <Button onClick={openNew}>
            <Plus />
            محصول جدید
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>محصول</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>قیمت (تومان)</TableHead>
              <TableHead>موجودی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-end">اقدامات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <span className="flex items-center gap-3">
                    <span className="relative block size-11 shrink-0 overflow-hidden rounded-lg bg-blush">
                      <SafeImage src={p.images[0]} alt={p.name} fill sizes="44px" />
                    </span>
                    <span className="whitespace-normal">
                      <span className="block max-w-52 line-clamp-1 text-xs font-bold text-ink">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground" dir="ltr">
                        {p.slug}
                      </span>
                    </span>
                  </span>
                </TableCell>
                <TableCell className="text-xs">{categories.find((c) => c.id === p.categoryId)?.name ?? "—"}</TableCell>
                <TableCell>
                  <span className="flex flex-col">
                    <span className="text-xs font-bold text-ink">{formatToman(p.price)}</span>
                    {p.compareAt && <span className="text-[10px] text-muted-foreground line-through">{formatToman(p.compareAt)}</span>}
                  </span>
                </TableCell>
                <TableCell className={cn("text-xs", p.stock < 10 && "font-bold text-destructive")}>{toFa(p.stock)}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <Switch
                      checked={p.stock > 0}
                      onCheckedChange={(v) => toggleStock(p, v)}
                    />
                    <Badge variant={p.stock > 0 ? "blush" : "secondary"}>{p.stock > 0 ? "فعال" : "ناموجود"}</Badge>
                  </span>
                </TableCell>
                <TableCell className="text-end">
                  <span className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="ویرایش" onClick={() => openEdit(p)}>
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="حذف"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleting(p)}
                    >
                      <Trash2 />
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* edit/create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش محصول" : "محصول جدید"}</DialogTitle>
            <DialogDescription>اطلاعات اصلی محصول را وارد کنید.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>تصاویر محصول</Label>
              <div className="space-y-3">
                {draft.images.map((img, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <ImageUpload
                        label={`تصویر ${i + 1}`}
                        value={img}
                        onChange={(url) =>
                          setDraft((d) => ({
                            ...d,
                            images: d.images.map((x, j) => (j === i ? (url ?? "") : x)).filter((x) => x),
                          }))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label="حذف تصویر"
                      className="mt-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDraft((d) => ({ ...d, images: d.images.filter((_, j) => j !== i) }))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDraft((d) => ({ ...d, images: [...d.images, ""] }))}
                >
                  <Plus />
                  افزودن تصویر
                </Button>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>نام محصول</Label>
              <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>قیمت (تومان)</Label>
                <Input dir="ltr" inputMode="numeric" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value.replace(/\D/g, "") }))} />
              </div>
              <div className="grid gap-1.5">
                <Label>قیمت قبل از تخفیف</Label>
                <Input dir="ltr" inputMode="numeric" value={draft.compareAt} onChange={(e) => setDraft((d) => ({ ...d, compareAt: e.target.value.replace(/\D/g, "") }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>دسته‌بندی</Label>
                <Select value={draft.categoryId} onValueChange={(v) => setDraft((d) => ({ ...d, categoryId: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>برند</Label>
                <Select value={draft.brandId} onValueChange={(v) => setDraft((d) => ({ ...d, brandId: v }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>موجودی انبار</Label>
              <Input dir="ltr" inputMode="numeric" value={draft.stock} onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value.replace(/\D/g, "") }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>توضیحات</Label>
              <Textarea rows={3} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={save}>{editing ? "ذخیره تغییرات" : "افزودن محصول"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف محصول</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف «{deleting?.name}» مطمئن هستید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف محصول
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
