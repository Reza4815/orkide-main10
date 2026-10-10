"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { brandsQuery, categoriesQuery, type Brand, type Category } from "@/lib/store-data";
import { toFa } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminCatalogPage() {
  const { data: seedCategories = [] } = useQuery(categoriesQuery);
  const { data: seedBrands = [] } = useQuery(brandsQuery);

  const [categories, setCategories] = useState<Category[] | null>(null);
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const cats = categories ?? seedCategories;
  const brs = brands ?? seedBrands;

  const [mode, setMode] = useState<"category" | "brand" | null>(null);
  const [name, setName] = useState("");
  const [latin, setLatin] = useState("");

  const add = () => {
    if (!name.trim()) {
      toast.error("نام را وارد کنید");
      return;
    }
    if (mode === "category") {
      const item: Category = {
        id: `c${Date.now()}`,
        slug: name.trim().replace(/\s+/g, "-"),
        name: name.trim(),
        image: "/assets/p-set.jpg",
        description: "",
      };
      setCategories((prev) => [...(prev ?? seedCategories), item]);
      toast.success("دسته‌بندی جدید اضافه شد");
    } else if (mode === "brand") {
      const item: Brand = { id: `b${Date.now()}`, name: name.trim(), latinName: latin.trim().toUpperCase() || "BRAND" };
      setBrands((prev) => [...(prev ?? seedBrands), item]);
      toast.success("برند جدید اضافه شد");
    }
    setName("");
    setLatin("");
    setMode(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black text-ink">کاتالوگ</h1>
        <p className="text-xs text-muted-foreground">مدیریت دسته‌بندی‌ها و برندهای فروشگاه</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* categories */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">دسته‌بندی‌ها ({toFa(cats.length)})</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setMode("category")}>
              <Plus />
              جدید
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {cats.map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border p-2.5">
                <span className="relative block size-10 shrink-0 overflow-hidden rounded-lg bg-blush">
                  <Image src={c.image} alt={c.name} fill sizes="40px" className="object-cover" />
                </span>
                <span className="flex-1 text-xs font-bold text-ink">{c.name}</span>
                <span className="text-[10px] text-muted-foreground" dir="ltr">
                  {c.slug}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="حذف"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    setCategories((prev) => (prev ?? seedCategories).filter((x) => x.id !== c.id));
                    toast.success("دسته‌بندی حذف شد");
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* brands */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-sm">برندها ({toFa(brs.length)})</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setMode("brand")}>
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
                <span className="flex-1 text-xs font-bold text-ink">{b.name}</span>
                <span className="text-[10px] text-muted-foreground" dir="ltr">
                  {b.latinName}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="حذف"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    setBrands((prev) => (prev ?? seedBrands).filter((x) => x.id !== b.id));
                    toast.success("برند حذف شد");
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!mode} onOpenChange={(o) => !o && setMode(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{mode === "category" ? "دسته‌بندی جدید" : "برند جدید"}</DialogTitle>
            <DialogDescription>نام فارسی {mode === "brand" ? "و نام لاتین " : ""}را وارد کنید.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>نام فارسی</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {mode === "brand" && (
              <div className="grid gap-1.5">
                <Label>نام لاتین</Label>
                <Input dir="ltr" value={latin} onChange={(e) => setLatin(e.target.value)} placeholder="ORKIDEH" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMode(null)}>
              انصراف
            </Button>
            <Button onClick={add}>افزودن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
