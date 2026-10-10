"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { bannersQuery, type Banner } from "@/lib/store-data";
import { toFa } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function AdminBannersPage() {
  const { data: seed = [] } = useQuery(bannersQuery);
  const [rows, setRows] = useState<Banner[] | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const banners = rows ?? seed;
  const [editing, setEditing] = useState<Banner | null>(null);
  const [draft, setDraft] = useState({ title: "", subtitle: "", ctaLabel: "", ctaHref: "", badge: "" });

  const isOn = (b: Banner) => enabled[b.id] ?? true;

  const openEdit = (b: Banner) => {
    setEditing(b);
    setDraft({ title: b.title, subtitle: b.subtitle, ctaLabel: b.ctaLabel, ctaHref: b.ctaHref, badge: b.badge });
  };

  const save = () => {
    if (!editing) return;
    setRows((prev) => (prev ?? seed).map((b) => (b.id === editing.id ? { ...b, ...draft } : b)));
    setEditing(null);
    toast.success("بنر به‌روزرسانی شد");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black text-ink">بنرهای صفحه اصلی</h1>
        <p className="text-xs text-muted-foreground">{toFa(banners.length)} اسلاید در هیرو فروشگاه</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {banners.map((b, i) => (
          <div key={b.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <div className="relative h-40 bg-blush">
              <Image src={b.image} alt={b.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
              <span className="absolute start-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-bold text-primary backdrop-blur">
                اسلاید {toFa(i + 1)}
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <p className="line-clamp-1 text-sm font-bold text-ink">{b.title}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-muted-foreground">{b.subtitle}</p>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch
                    checked={isOn(b)}
                    onCheckedChange={(v) => {
                      setEnabled((e) => ({ ...e, [b.id]: v }));
                      toast.success(v ? "بنر فعال شد" : "بنر غیرفعال شد");
                    }}
                  />
                  {isOn(b) ? "فعال" : "غیرفعال"}
                </label>
                <Button variant="outline" size="sm" onClick={() => openEdit(b)}>
                  <Pencil />
                  ویرایش
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش بنر</DialogTitle>
            <DialogDescription>متن‌ها و مقصد دکمه بنر را تغییر دهید.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>عنوان</Label>
              <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>زیرعنوان</Label>
              <Textarea rows={3} value={draft.subtitle} onChange={(e) => setDraft((d) => ({ ...d, subtitle: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>برچسب</Label>
              <Input value={draft.badge} onChange={(e) => setDraft((d) => ({ ...d, badge: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>متن دکمه</Label>
                <Input value={draft.ctaLabel} onChange={(e) => setDraft((d) => ({ ...d, ctaLabel: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label>لینک دکمه</Label>
                <Input dir="ltr" value={draft.ctaHref} onChange={(e) => setDraft((d) => ({ ...d, ctaHref: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              انصراف
            </Button>
            <Button onClick={save}>ذخیره تغییرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
