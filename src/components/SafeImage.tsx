"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Only images uploaded from the /admin panel (stored in public/uploads) may be
 * requested over the network. Everything else renders a clean placeholder so
 * no 404 requests are ever fired for missing/default images.
 */
export function isUploadSrc(src?: string | null): src is string {
  if (typeof src !== "string" || src.length === 0) return false;
  if (src.startsWith("/uploads/")) return src.length > "/uploads/".length;
  return /^https?:\/\//.test(src);
}

export function SafeImage({
  src,
  alt,
  fill,
  sizes,
  priority,
  className,
}: {
  src?: string | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!isUploadSrc(src)) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "bg-blush dark:bg-muted",
          fill ? "absolute inset-0 h-full w-full" : "h-full w-full",
          className,
        )}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
