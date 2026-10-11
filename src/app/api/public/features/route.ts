import { NextResponse } from "next/server";
import { getFeatures } from "@/lib/store-queries";

export async function GET() {
  return NextResponse.json(await getFeatures());
}
