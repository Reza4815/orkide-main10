"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { ordersQuery, orderStatusLabel, type Order, type OrderStatus } from "@/lib/store-data";
import { formatFaDate, formatToman, toFa } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statuses: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "canceled"];
const tabs: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار" },
  { value: "paid", label: "پرداخت شده" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "canceled", label: "لغو شده" },
];

export default function AdminOrdersPage() {
  const { data: seed = [] } = useQuery(ordersQuery);
  const [rows, setRows] = useState<Order[] | null>(null);
  const orders = rows ?? seed;
  const [tab, setTab] = useState<OrderStatus | "all">("all");
  const [viewing, setViewing] = useState<Order | null>(null);

  const filtered = useMemo(() => (tab === "all" ? orders : orders.filter((o) => o.status === tab)), [orders, tab]);
  const counts = useMemo(() => {
    const map = new Map<OrderStatus | "all", number>([["all", orders.length]]);
    statuses.forEach((s) => map.set(s, orders.filter((o) => o.status === s).length));
    return map;
  }, [orders]);

  const setStatus = (id: string, status: OrderStatus) => {
    setRows((prev) => (prev ?? seed).map((o) => (o.id === id ? { ...o, status } : o)));
    toast.success(`وضعیت سفارش به «${orderStatusLabel[status]}» تغییر کرد`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black text-ink">سفارش‌ها</h1>
        <p className="text-xs text-muted-foreground">مدیریت و پیگیری سفارش‌های مشتریان</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-all",
              tab === t.value ? "border-primary bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:border-primary/50 hover:text-ink",
            )}
          >
            {t.label}
            <span className="ms-1 opacity-70">({toFa(counts.get(t.value) ?? 0)})</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>کد سفارش</TableHead>
              <TableHead>مشتری</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead>اقلام</TableHead>
              <TableHead>مبلغ (تومان)</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-end">جزئیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell dir="ltr" className="text-xs font-bold text-ink">
                  {o.code}
                </TableCell>
                <TableCell>
                  <span className="flex flex-col">
                    <span className="text-xs font-semibold">{o.customer}</span>
                    <span className="text-[10px] text-muted-foreground">{o.phone}</span>
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatFaDate(o.date)}</TableCell>
                <TableCell className="text-xs">{toFa(o.items.reduce((s, i) => s + i.qty, 0))}</TableCell>
                <TableCell className="text-xs font-bold text-ink">{formatToman(o.total)}</TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => setStatus(o.id, v as OrderStatus)}>
                    <SelectTrigger size="sm" className="h-8 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {orderStatusLabel[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-end">
                  <Button variant="ghost" size="icon-sm" aria-label="مشاهده" onClick={() => setViewing(o)}>
                    <Eye />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  سفارشی در این وضعیت وجود ندارد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle dir="ltr">{viewing?.code}</DialogTitle>
            <DialogDescription>
              {viewing ? `${viewing.customer} — ${formatFaDate(viewing.date)}` : ""}
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2.5">
            {viewing?.items.map((i) => (
              <li key={i.name} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {i.name} <span className="text-[10px]">×{toFa(i.qty)}</span>
                </span>
                <span className="font-semibold text-ink">{formatToman(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-ink">جمع سفارش</span>
            <span className="font-black text-ink">{formatToman(viewing?.total ?? 0)} تومان</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
