import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(brands);
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body;
  const existing = await db.select().from(brands).where(eq(brands.id, id));
  if (existing.length) {
    await db.update(brands).set(rest).where(eq(brands.id, id));
  } else {
    await db.insert(brands).values({ id, ...rest });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(brands).where(eq(brands.id, id));
  return NextResponse.json({ ok: true });
}
