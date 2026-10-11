"use client";

import { useSiteImage } from "@/lib/use-site-image";
import { isUploadSrc } from "@/components/SafeImage";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
      aria-hidden="true"
    >
      {/* lotus */}
      <path d="M12 3.6c1.4 1.9 2.3 3.8 2.3 5.7 0 1.7-.9 3.2-2.3 4.2-1.4-1-2.3-2.5-2.3-4.2 0-1.9.9-3.8 2.3-5.7Z" />
      <path d="M4.9 6.6c1.9.8 3.3 2.1 4.1 4 .6 1.5.4 3.1-.7 4.3-1.7-.2-3.3-1.1-4.1-2.8-.8-1.6-.7-3.6.7-5.5Z" />
      <path d="M19.1 6.6c-1.9.8-3.3 2.1-4.1 4-.6 1.5-.4 3.1.7 4.3 1.7-.2 3.3-1.1 4.1-2.8.8-1.6.7-3.6-.7-5.5Z" />
      <path d="M2.4 12.9c1.9-.1 3.7.5 5.1 1.6 1.2 1 1.9 2.3 2 3.9-1.9.3-3.9-.1-5.3-1.2-1.4-1-2.1-2.5-1.8-4.3Z" />
      <path d="M21.6 12.9c-1.9-.1-3.7.5-5.1 1.6-1.2 1-1.9 2.3-2 3.9 1.9.3 3.9-.1 5.3-1.2 1.4-1 2.1-2.5 1.8-4.3Z" />
      <path d="M6.5 19.5c1.6 1 3.5 1.5 5.5 1.5s3.9-.5 5.5-1.5" />
    </svg>
  );
}

export function LogoBlock({ light = false }: { light?: boolean }) {
  const logo = useSiteImage("logo", "/logo.svg");
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={cn(
          "grid size-10 place-items-center overflow-hidden rounded-full shadow-[0_8px_24px_-12px_rgba(232,168,184,0.9)] transition-all duration-300",
          light
            ? "bg-background/10 text-background"
            : "bg-gradient-to-br from-primary-soft via-primary to-primary-deep text-primary-foreground",
        )}
      >
        {isUploadSrc(logo) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="لوگوی ارکیده" className="size-full object-cover" />
        ) : (
          <LogoMark />
        )}
      </div>
      <div className="flex flex-col leading-tight">
        <span className={cn("text-[15px] font-black", light ? "text-background" : "text-ink")}>
          لباس زیر ارکیده
        </span>
        <span
          className={cn(
            "text-[10px] tracking-[0.3em]",
            light ? "text-background/60" : "text-muted-foreground",
          )}
        >
          ORKIDEH
        </span>
      </div>
    </div>
  );
}
