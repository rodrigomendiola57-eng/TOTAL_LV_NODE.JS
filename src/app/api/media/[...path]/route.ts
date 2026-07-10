import { NextRequest, NextResponse } from "next/server";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const mediaPath = path.join("/");
  const upstream = `${DJANGO_ORIGIN}/media/${mediaPath}`;

  try {
    const response = await fetch(upstream, { cache: "no-store" });
    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
