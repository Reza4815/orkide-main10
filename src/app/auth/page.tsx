"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Lock, LogIn, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoBlock } from "@/components/store/Logo";

function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(false);

  const handle = (mode: "login" | "signup") => async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!email || password.length < 6) {
      toast.error("ایمیل معتبر و گذرواژه حداقل ۶ کاراکتر وارد کنید");
      return;
    }
    setLoading(true);
    try {
      if (configured) {
        const supabase = createClient();
        const { error } =
          mode === "login"
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success(mode === "login" ? "خوش آمدید؛ با موفقیت وارد شدید" : "ثبت‌نام شما انجام شد");
        router.push(next);
        router.refresh();
      } else {
        await new Promise((r) => setTimeout(r, 700));
        toast.success("ورود آزمایشی انجام شد", { description: "در حالت نمایشی، حساب واقعی ساخته نمی‌شود." });
        router.push(next);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطایی رخ داد؛ دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-shop flex min-h-[70dvh] flex-col items-center justify-center animate-fade-in py-10">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-6 shadow-lift transition-colors hover:border-primary/40 md:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <LogoBlock />
          <p className="text-xs text-muted-foreground">به خانواده ارکیده خوش آمدید</p>
        </div>

        {!configured && (
          <Alert className="mb-4">
            <AlertTitle className="text-xs">حالت نمایشی</AlertTitle>
            <AlertDescription className="text-[11px] leading-5">
              اتصال Supabase پیکربندی نشده است؛ فرم‌ها به‌صورت آزمایشی کار می‌کنند.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1">
              <LogIn />
              ورود
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              <UserPlus />
              ثبت‌نام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="pt-5">
            <form onSubmit={handle("login")} className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="login-email">ایمیل</Label>
                <div className="relative">
                  <Mail className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="login-email" name="email" type="email" required dir="ltr" placeholder="you@email.com" className="pe-10" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-pass">گذرواژه</Label>
                  <button type="button" className="text-[11px] text-primary hover:underline">
                    فراموشی گذرواژه
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="login-pass" name="password" type="password" required dir="ltr" placeholder="••••••••" className="pe-10" />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                ورود به حساب
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="pt-5">
            <form onSubmit={handle("signup")} className="space-y-4">
              <div className="grid gap-1.5">
                <Label htmlFor="signup-name">نام و نام خانوادگی</Label>
                <Input id="signup-name" name="name" required placeholder="مثلاً سارا احمدی" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="signup-email">ایمیل</Label>
                <div className="relative">
                  <Mail className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="signup-email" name="email" type="email" required dir="ltr" placeholder="you@email.com" className="pe-10" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="signup-pass">گذرواژه</Label>
                <div className="relative">
                  <Lock className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="signup-pass" name="password" type="password" required minLength={6} dir="ltr" placeholder="حداقل ۶ کاراکتر" className="pe-10" />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                ساخت حساب کاربری
              </Button>
              <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
                ثبت‌نام به معنای پذیرش قوانین فروشگاه و حریم خصوصی است.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
