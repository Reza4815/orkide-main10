"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SafeImage, isUploadSrc } from "@/components/SafeImage";

/**
 * Reusable admin image field: pick a file → POST /api/upload → store the
 * returned `/uploads/...` URL in the DB via onChange. Shows a live preview.
 */
export function ImageUpload({
  value,
  onChange,
  label = "تصویر",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویری انتخاب کنید");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "آپلود ناموفق بود");
      onChange(data.url);
      toast.success("تصویر با موفقیت آپلود شد", { description: data.url });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border/80 bg-blush/40 p-3">
        <span className="relative block size-20 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-blush">
          <SafeImage src={value} alt={label} fill sizes="80px" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p dir="ltr" className="truncate text-[11px] text-muted-foreground">
            {isUploadSrc(value) ? value : "بدون تصویر"}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onFile}
              aria-label={label}
              className="hidden"
            />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()}>
              <ImagePlus />
              {uploading ? "در حال آپلود…" : isUploadSrc(value) ? "تغییر تصویر" : "انتخاب تصویر"}
            </Button>
            {isUploadSrc(value) && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onChange(null)}
              >
                <Trash2 />
                حذف
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
