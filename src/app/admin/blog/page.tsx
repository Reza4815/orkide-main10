"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { blogPostsQuery, type BlogPost } from "@/lib/store-data";
import { formatFaDate, toFa } from "@/lib/format";
import { SafeImage } from "@/components/SafeImage";
import { ImageUpload } from "@/components/ImageUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Draft = { title: string; excerpt: string; tags: string; cover: string | null };

export default function AdminBlogPage() {
  const { data: seed = [] } = useQuery(blogPostsQuery);
  const [rows, setRows] = useState<BlogPost[] | null>(null);
  const posts = rows ?? seed;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const [draft, setDraft] = useState<Draft>({ title: "", excerpt: "", tags: "", cover: null });

  const openNew = () => {
    setEditing(null);
    setDraft({ title: "", excerpt: "", tags: "", cover: null });
    setDialogOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setDraft({ title: p.title, excerpt: p.excerpt, tags: p.tags.join("، "), cover: p.cover });
    setDialogOpen(true);
  };

  const save = () => {
    if (!draft.title.trim()) {
      toast.error("عنوان مطلب الزامی است");
      return;
    }
    const tags = draft.tags.split(/[،,]/).map((t) => t.trim()).filter(Boolean);
    const next: BlogPost = editing
      ? { ...editing, title: draft.title.trim(), excerpt: draft.excerpt.trim(), tags, cover: draft.cover }
      : {
          id: `bp${Date.now()}`,
          slug: `post-${Date.now()}`,
          title: draft.title.trim(),
          excerpt: draft.excerpt.trim(),
          cover: draft.cover,
          date: new Date().toISOString(),
          author: "تحریریه ارکیده",
          tags,
          content: [draft.excerpt.trim() || draft.title.trim()],
          readMinutes: 3,
        };
    setRows((prev) => {
      const list = prev ?? seed;
      return editing ? list.map((p) => (p.id === editing.id ? next : p)) : [next, ...list];
    });
    setDialogOpen(false);
    toast.success(editing ? "مطلب ویرایش شد" : "مطلب جدید منتشر شد");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black text-ink">مطالب وبلاگ</h1>
          <p className="text-xs text-muted-foreground">{toFa(posts.length)} مطلب منتشر شده</p>
        </div>
        <Button onClick={openNew}>
          <Plus />
          مطلب جدید
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>مطلب</TableHead>
              <TableHead>نویسنده</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead>برچسب‌ها</TableHead>
              <TableHead className="text-end">اقدامات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <span className="flex items-center gap-3">
                    <span className="relative block size-11 shrink-0 overflow-hidden rounded-lg bg-blush">
                      <SafeImage src={p.cover} alt={p.title} fill sizes="44px" />
                    </span>
                    <span className="block max-w-64 line-clamp-2 whitespace-normal text-xs font-bold leading-5 text-ink">
                      {p.title}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="text-xs">{p.author}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatFaDate(p.date)}</TableCell>
                <TableCell>
                  <span className="flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <Badge key={t} variant="blush">
                        {t}
                      </Badge>
                    ))}
                  </span>
                </TableCell>
                <TableCell className="text-end">
                  <span className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="ویرایش" onClick={() => openEdit(p)}>
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="حذف"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleting(p)}
                    >
                      <Trash2 />
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "ویرایش مطلب" : "مطلب جدید"}</DialogTitle>
            <DialogDescription>عنوان، چکیده و برچسب‌های مطلب را وارد کنید.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <ImageUpload label="تصویر شاخص" value={draft.cover} onChange={(url) => setDraft((d) => ({ ...d, cover: url }))} />
            <div className="grid gap-1.5">
              <Label>عنوان</Label>
              <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>چکیده</Label>
              <Textarea rows={3} value={draft.excerpt} onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label>برچسب‌ها (با ویرگول جدا کنید)</Label>
              <Input value={draft.tags} onChange={(e) => setDraft((d) => ({ ...d, tags: e.target.value }))} placeholder="راهنمای خرید، نگهداری" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={save}>{editing ? "ذخیره" : "انتشار"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف مطلب</AlertDialogTitle>
            <AlertDialogDescription>آیا از حذف «{deleting?.title}» مطمئن هستید؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setRows((prev) => (prev ?? seed).filter((p) => p.id !== deleting?.id));
                toast.success("مطلب حذف شد");
                setDeleting(null);
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
