import { NextResponse } from "next/server";
import { getBrands } from "@/lib/store-queries";

export async function GET() {
  return NextResponse.json(await getBrands());
}
