import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(products);
  return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...rest } = body;
  const existing = await db.select().from(products).where(eq(products.id, id));
  if (existing.length) {
    await db.update(products).set(rest).where(eq(products.id, id));
  } else {
    await db.insert(products).values({ id, ...rest });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(products).where(eq(products.id, id));
  return NextResponse.json({ ok: true });
}
