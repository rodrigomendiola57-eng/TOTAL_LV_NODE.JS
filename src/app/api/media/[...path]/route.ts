import { NextRequest, NextResponse } from "next/server";

import { djangoForwardHeaders } from "@/lib/http/forward-client-ip";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

/** Evita path traversal y URLs absolutas en /api/media/[...path]. */
function safeMediaPath(segments: string[]): string | null {
  if (!segments.length) return null;

  const parts: string[] = [];
  for (const raw of segments) {
    let part: string;
    try {
      part = decodeURIComponent(raw);
    } catch {
      return null;
    }
    if (!part || part === "." || part === "..") return null;
    if (part.includes("\0") || part.includes("/") || part.includes("\\")) {
      return null;
    }
    parts.push(part);
  }

  const joined = parts.join("/");
  if (!joined || joined.startsWith("/") || joined.includes("://")) return null;
  if (joined.toLowerCase().endsWith(".svg") || joined.toLowerCase().endsWith(".svgz")) {
    return null;
  }
  return joined;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const mediaPath = safeMediaPath(path);
  if (!mediaPath) {
    return new NextResponse(null, { status: 400 });
  }

  const upstream = `${DJANGO_ORIGIN}/media/${mediaPath
    .split("/")
    .map((p) => encodeURIComponent(p))
    .join("/")}`;

  try {
    const response = await fetch(upstream, {
      headers: djangoForwardHeaders(request),
      cache: "no-store",
    });
    if (!response.ok) {
      return new NextResponse(null, { status: response.status });
    }

    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";
    if (
      contentType.toLowerCase().includes("svg") ||
      contentType.toLowerCase().includes("text/html")
    ) {
      return new NextResponse(null, { status: 415 });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
