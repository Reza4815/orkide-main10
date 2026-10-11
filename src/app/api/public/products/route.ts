import { NextResponse } from "next/server";
import { getProducts } from "@/lib/store-queries";

export async function GET() {
  return NextResponse.json(await getProducts());
}
