import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { banners } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(banners);
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body;
  const existing = await db.select().from(banners).where(eq(banners.id, id));
  if (existing.length) {
    await db
      .update(banners)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(banners.id, id));
  } else {
    await db.insert(banners).values({ id, ...rest });
  }
  return NextResponse.json({ ok: true });
}
