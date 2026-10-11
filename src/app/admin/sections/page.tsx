"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { homeSectionsQuery } from "@/lib/queries.client";
import type { HomeSection } from "@/lib/store-data";
import { toFa } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const typeLabel: Record<HomeSection["type"], string> = {
  products: "محصولات",
  promo: "کارت‌های تبلیغاتی",
  features: "ویژگی‌ها",
  brands: "برندها",
  newsletter: "خبرنامه",
  blog: "وبلاگ",
};

export default function AdminSectionsPage() {
  const { data: seed = [] } = useQuery(homeSectionsQuery);
  const [rows, setRows] = useState<HomeSection[] | null>(null);
  const sections = rows ?? seed;

  const move = (index: number, dir: -1 | 1) => {
    setRows((prev) => {
      const list = [...(prev ?? seed)];
      const target = index + dir;
      if (target < 0 || target >= list.length) return list;
      const [item] = list.splice(index, 1);
      list.splice(target, 0, item!);
      return list;
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black text-ink">سکشن‌های صفحه اصلی</h1>
        <p className="text-xs text-muted-foreground">ترتیب و نمایش بخش‌های صفحه اول فروشگاه را مدیریت کنید</p>
      </div>

      <div className="space-y-2">
        {sections.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-card p-3.5 shadow-soft transition-opacity",
              !s.active && "opacity-55",
            )}
          >
            <GripVertical className="size-4 shrink-0 text-muted-foreground/50" />
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 text-sm font-bold text-ink">
                {s.title ?? typeLabel[s.type]}
                <Badge variant="secondary">{typeLabel[s.type]}</Badge>
              </span>
              <span className="text-[10px] text-muted-foreground">
                {s.config?.source ? `منبع: ${s.config.source}` : "—"}
                {s.config?.limit ? ` — حداکثر ${toFa(s.config.limit)} کالا` : ""}
                {s.config?.layout ? ` — چیدمان: ${s.config.layout === "slider" ? "اسلایدر" : "شبکه"}` : ""}
              </span>
            </div>
            <div className="ms-auto flex items-center gap-1.5">
              <span className="flex flex-col">
                <button
                  type="button"
                  aria-label="بالا"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-blush hover:text-primary disabled:opacity-30"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="پایین"
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, 1)}
                  className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-blush hover:text-primary disabled:opacity-30"
                >
                  <ArrowDown className="size-3.5" />
                </button>
              </span>
              <Switch
                checked={s.active}
                onCheckedChange={(v) => {
                  setRows((prev) => (prev ?? seed).map((x) => (x.id === s.id ? { ...x, active: v } : x)));
                  toast.success(v ? "سکشن فعال شد" : "سکشن مخفی شد");
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
