import { NextResponse, type NextRequest } from "next/server";
import { list } from "@vercel/blob";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (!path || path.length === 0 || path.includes("..")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filename = path.join("/");

  try {
    let { blobs } = await list({ prefix: filename });

    if (blobs.length === 0) {
      ({ blobs } = await list({ prefix: `uploads/${filename}` }));
    }

    if (blobs.length === 0) {
      const all = await list();
      blobs = all.blobs.filter(
        (b) => b.pathname === filename || b.pathname.endsWith(`/${filename}`),
      );
    }

    const blob =
      blobs.find((b) => b.pathname === filename) ??
      blobs.find((b) => b.pathname.endsWith(filename)) ??
      blobs[0];

    if (!blob) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.redirect(blob.url, { status: 302 });
  } catch (err) {
    console.error("[media] blob lookup failed:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
