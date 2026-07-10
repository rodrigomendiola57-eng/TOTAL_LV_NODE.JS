import { NextRequest, NextResponse } from "next/server";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

/** Django exige slash final; PUT/PATCH pierden el body si APPEND_SLASH redirige. */
function djangoApiPath(pathSegments: string[]): string {
  const path = pathSegments.filter(Boolean).join("/");
  return path.endsWith("/") ? path : `${path}/`;
}

async function proxyToDjango(request: NextRequest, pathSegments: string[]) {
  const path = djangoApiPath(pathSegments);
  const upstream = `${DJANGO_ORIGIN}/api/${path}${request.nextUrl.search}`;

  const headers = new Headers();
  const accept = request.headers.get("accept");
  if (accept) headers.set("Accept", accept);

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(upstream, init);
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { detail: "Backend no disponible" },
      { status: 502 },
    );
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToDjango(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToDjango(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToDjango(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToDjango(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyToDjango(request, path);
}
