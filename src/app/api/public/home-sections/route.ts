import { NextResponse } from "next/server";
import { getHomeSections } from "@/lib/store-queries";

export async function GET() {
  return NextResponse.json(await getHomeSections());
}
