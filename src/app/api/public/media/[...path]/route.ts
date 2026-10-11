import { NextResponse, type NextRequest } from "next/server";

/**
 * Serves catalog media. When Supabase is configured, the request is proxied to
 * the public `media` storage bucket. Otherwise it returns a 404: local assets
 * no longer exist, all images must be uploaded via /admin into public/uploads.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const rel = path.map(encodeURIComponent).join("/");
  if (!rel || path.includes("..")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const target = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/media/${rel}`;

  return NextResponse.redirect(target, { status: 302 });
}
