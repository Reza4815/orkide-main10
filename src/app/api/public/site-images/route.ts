import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { siteImages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const key = new URL(req.url).searchParams.get("key");
  if (key) {
    const [row] = await db
      .select()
      .from(siteImages)
      .where(eq(siteImages.key, key));
    return NextResponse.json(row ?? null);
  }
  const rows = await db.select().from(siteImages);
  return NextResponse.json(rows);
}
