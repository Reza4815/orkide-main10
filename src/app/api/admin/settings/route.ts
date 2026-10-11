import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const [row] = await db
    .select()
    .from(storeSettings)
    .where(eq(storeSettings.id, 1));
  return NextResponse.json(row ?? null);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const existing = await db
    .select()
    .from(storeSettings)
    .where(eq(storeSettings.id, 1));
  if (existing.length) {
    await db
      .update(storeSettings)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(storeSettings.id, 1));
  } else {
    await db.insert(storeSettings).values({ id: 1, ...body });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await db.delete(storeSettings).where(eq(storeSettings.id, 1));
  return NextResponse.json({ ok: true });
}
