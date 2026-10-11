import { NextResponse } from "next/server";
import { getSettings } from "@/lib/store-queries";

export async function GET() {
  return NextResponse.json(await getSettings());
}
