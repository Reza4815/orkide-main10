"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { settingsQuery } from "@/lib/store-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettingsPage() {
  const { data: settings } = useQuery(settingsQuery);
  const [form, setForm] = useState({
    storeName: "",
    phone: "",
    email: "",
    address: "",
    hours: "",
    footerText: "",
    freeShippingThreshold: "",
    shippingCost: "",
  });

  useEffect(() => {
    if (!settings) return;
    setForm({
      storeName: settings.storeName,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      hours: settings.hours,
      footerText: settings.footerText,
      freeShippingThreshold: String(settings.freeShippingThreshold),
      shippingCost: String(settings.shippingCost),
    });
  }, [settings]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("تنظیمات فروشگاه ذخیره شد");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-black text-ink">تنظیمات فروشگاه</h1>
        <p className="text-xs text-muted-foreground">اطلاعات پایه و قوانین ارسال</p>
      </div>

      <form onSubmit={submit} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">اطلاعات عمومی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1.5">
              <Label>نام فروشگاه</Label>
              <Input value={form.storeName} onChange={set("storeName")} />
            </div>
            <div className="grid gap-1.5">
              <Label>تلفن پشتیبانی</Label>
              <Input dir="ltr" value={form.phone} onChange={set("phone")} />
            </div>
            <div className="grid gap-1.5">
              <Label>ایمیل</Label>
              <Input dir="ltr" type="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="grid gap-1.5">
              <Label>ساعات کاری</Label>
              <Input value={form.hours} onChange={set("hours")} />
            </div>
            <div className="grid gap-1.5">
              <Label>آدرس فروشگاه</Label>
              <Textarea rows={2} value={form.address} onChange={set("address")} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">ارسال و هزینه‌ها</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1.5">
                <Label>حداقل خرید برای ارسال رایگان (تومان)</Label>
                <Input dir="ltr" inputMode="numeric" value={form.freeShippingThreshold} onChange={set("freeShippingThreshold")} />
              </div>
              <div className="grid gap-1.5">
                <Label>هزینه ارسال عادی (تومان)</Label>
                <Input dir="ltr" inputMode="numeric" value={form.shippingCost} onChange={set("shippingCost")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">متن فوتر</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea rows={4} value={form.footerText} onChange={set("footerText")} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Separator className="mb-4" />
          <Button type="submit" size="lg">
            <Save />
            ذخیره تنظیمات
          </Button>
        </div>
      </form>
    </div>
  );
}
