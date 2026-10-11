import { NextResponse } from "next/server";
import { getBanners } from "@/lib/store-queries";

export async function GET() {
  return NextResponse.json(await getBanners());
}
