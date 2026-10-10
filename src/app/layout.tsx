import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";

const vazir = localFont({
  src: [
    { path: "../../public/fonts/Vazirmatn-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Vazirmatn-Bold.woff2", weight: "500 900", style: "normal" },
  ],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "لباس زیر ارکیده | فروشگاه اینترنتی لباس زیر زنانه",
    template: "%s | لباس زیر ارکیده",
  },
  description:
    "در فروشگاه اینترنتی ارکیده، مجموعه‌ای از شیک‌ترین سوتین‌ها، ست‌های لباس زیر، لباس خواب و روپوش را با ضمانت اصالت و ارسال سریع خریداری کنید.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="font-sans antialiased min-h-dvh flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
