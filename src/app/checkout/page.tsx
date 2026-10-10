"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Banknote, CheckCircle2, CreditCard, Loader2, MapPin, ShoppingBag, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { formatToman, toFa } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const FREE_SHIPPING = 900_000;
const SHIPPING_COST = 60_000;

const checkoutSchema = z.object({
  fullName: z.string().min(3, "نام و نام خانوادگی را کامل وارد کنید"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
  province: z.string().min(2, "استان را وارد کنید"),
  city: z.string().min(2, "شهر را وارد کنید"),
  address: z.string().min(10, "آدرس کامل را بنویسید"),
  postalCode: z.string().regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),
  note: z.string().optional(),
  payment: z.enum(["online", "card", "cod"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  { value: "online", label: "پرداخت اینترنتی", desc: "درگاه امن بانکی", icon: CreditCard },
  { value: "card", label: "کارت به کارت", desc: "واریز و ارسال فیش", icon: Banknote },
  { value: "cod", label: "پرداخت در محل", desc: "فقط تهران", icon: Wallet },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, count } = useCart();
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      province: "",
      city: "",
      address: "",
      postalCode: "",
      note: "",
      payment: "online",
    },
  });

  const onSubmit = async (values: CheckoutValues) => {
    if (items.length === 0) {
      toast.error("سبد خرید خالی است");
      return;
    }
    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.from("orders").insert({
          customer: values.fullName,
          phone: values.phone,
          address: `${values.province}، ${values.city}، ${values.address}`,
          postal_code: values.postalCode,
          payment: values.payment,
          note: values.note ?? "",
          total,
          status: "pending",
        });
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setOrderCode(`ORK-${Math.floor(10000 + Math.random() * 89999)}`);
      clear();
    } catch {
      toast.error("ثبت سفارش با خطا مواجه شد؛ دوباره تلاش کنید");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderCode) {
    return (
      <div className="container-shop flex flex-col items-center gap-4 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-10" />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink md:text-3xl">سفارش شما با موفقیت ثبت شد</h1>
        <p className="text-sm text-muted-foreground">
          کد پیگیری سفارش:{" "}
          <b className="text-ink" dir="ltr">
            {orderCode}
          </b>
        </p>
        <p className="max-w-md text-xs leading-6 text-muted-foreground">
          جزئیات سفارش و لینک پرداخت برای شما پیامک می‌شود. در صورت هر پرسشی، پشتیبانی ارکیده هر روز از ۹ تا ۲۰ در کنار شماست.
        </p>
        <div className="flex gap-2">
          <Button asChild size="lg">
            <Link href="/shop">ادامه خرید</Link>
          </Button>
          <Button asChild size="lg" variant="outline" onClick={undefined}>
            <Link href="/">بازگشت به خانه</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-shop flex flex-col items-center gap-4 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-blush text-primary">
          <ShoppingBag className="size-9" />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">سبد خرید شما خالی است</h1>
        <Button asChild size="lg" onClick={undefined}>
          <Link href="/shop">رفتن به فروشگاه</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-shop animate-fade-in py-6 md:py-8">
      <h1 className="mb-6 text-2xl font-extrabold tracking-tight text-ink md:text-3xl">تکمیل خرید</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* address */}
            <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-ink">
                <MapPin className="size-4 text-primary" />
                اطلاعات گیرنده و آدرس
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام و نام خانوادگی</FormLabel>
                      <FormControl>
                        <Input placeholder="مثلاً سارا احمدی" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>شماره موبایل</FormLabel>
                      <FormControl>
                        <Input dir="ltr" inputMode="numeric" placeholder="09123456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>استان</FormLabel>
                      <FormControl>
                        <Input placeholder="تهران" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>شهر</FormLabel>
                      <FormControl>
                        <Input placeholder="تهران" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>آدرس کامل</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="خیابان، کوچه، پلاک، واحد" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>کد پستی</FormLabel>
                      <FormControl>
                        <Input dir="ltr" inputMode="numeric" placeholder="1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>توضیحات سفارش (اختیاری)</FormLabel>
                      <FormControl>
                        <Input placeholder="مثلاً با تماس هماهنگ شود" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* payment */}
            <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-ink">
                <CreditCard className="size-4 text-primary" />
                روش پرداخت
              </h2>
              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-2.5 md:grid-cols-3">
                        {paymentMethods.map((m) => (
                          <Label
                            key={m.value}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
                              field.value === m.value
                                ? "border-primary bg-blush shadow-soft"
                                : "hover:-translate-y-0.5 hover:border-primary/40",
                            )}
                          >
                            <RadioGroupItem value={m.value} />
                            <span className="flex flex-col">
                              <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
                                <m.icon className="size-4 text-primary" />
                                {m.label}
                              </span>
                              <span className="mt-0.5 text-[10px] text-muted-foreground">{m.desc}</span>
                            </span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
          </div>

          {/* summary */}
          <aside className="h-fit space-y-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition-colors hover:border-primary/40 lg:sticky lg:top-36">
            <h2 className="font-bold text-ink">سفارش شما ({toFa(count)} کالا)</h2>
            <ul className="max-h-56 space-y-3 overflow-y-auto pe-1">
              {items.map((item) => (
                <li key={item.key} className="flex items-center gap-3">
                  <span className="relative block size-12 shrink-0 overflow-hidden rounded-lg bg-blush">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                    <span className="absolute bottom-0.5 start-0.5 grid size-4 place-items-center rounded-full bg-ink/80 text-[9px] font-bold text-background">
                      {toFa(item.quantity)}
                    </span>
                  </span>
                  <span className="flex-1 text-xs leading-5 text-muted-foreground line-clamp-1">{item.name}</span>
                  <span className="text-xs font-bold text-ink">{formatToman(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator />
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>جمع اقلام</dt>
                <dd>{formatToman(subtotal)} تومان</dd>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <dt>هزینه ارسال</dt>
                <dd>{shipping === 0 ? "رایگان" : `${formatToman(shipping)} تومان`}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="font-bold text-ink">قابل پرداخت</dt>
                <dd className="text-lg font-black text-ink">
                  {formatToman(total)}
                  <span className="ms-1 text-xs font-medium text-muted-foreground">تومان</span>
                </dd>
              </div>
            </dl>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              {submitting ? "در حال ثبت سفارش…" : "ثبت سفارش و پرداخت"}
            </Button>
          </aside>
        </form>
      </Form>
    </div>
  );
}
