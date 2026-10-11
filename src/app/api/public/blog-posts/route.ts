import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/store-queries";

export async function GET() {
  return NextResponse.json(await getBlogPosts());
}
