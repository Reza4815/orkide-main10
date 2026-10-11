import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(siteImages);
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { key, ...rest } = body;
  const existing = await db
    .select()
    .from(siteImages)
    .where(eq(siteImages.key, key));
  if (existing.length) {
    await db
      .update(siteImages)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(siteImages.key, key));
  } else {
    await db.insert(siteImages).values({ key, ...rest });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  await db.delete(siteImages).where(eq(siteImages.key, key));
  return NextResponse.json({ ok: true });
}
