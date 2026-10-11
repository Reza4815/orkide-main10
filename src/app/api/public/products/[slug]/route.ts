import { NextResponse } from "next/server";
import { getProduct } from "@/lib/store-queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.json(await getProduct(slug));
}
