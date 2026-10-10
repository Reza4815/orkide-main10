import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves catalog media. When Supabase is configured, the request is proxied to
 * the public `media` storage bucket; otherwise it falls back to the local
 * /assets directory bundled with the app.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const rel = path.map(encodeURIComponent).join("/");
  if (!rel || path.includes("..")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const target = supabaseUrl
    ? `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/media/${rel}`
    : new URL(`/assets/${rel}`, request.nextUrl.origin).toString();

  return NextResponse.redirect(target, { status: 302 });
}
