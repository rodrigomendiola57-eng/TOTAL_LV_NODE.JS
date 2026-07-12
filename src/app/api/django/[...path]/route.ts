import { NextRequest, NextResponse } from "next/server";

import { DASHBOARD_TOKEN_COOKIE } from "@/lib/auth/constants";
import { isBlockedAuthProxyPath } from "@/lib/api/django-proxy-guards";
import { djangoForwardHeaders } from "@/lib/http/forward-client-ip";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

/** Django exige slash final; PUT/PATCH pierden el body si APPEND_SLASH redirige. */
function djangoApiPath(pathSegments: string[]): string {
  const path = pathSegments.filter(Boolean).join("/");
  return path.endsWith("/") ? path : `${path}/`;
}

async function proxyToDjango(request: NextRequest, pathSegments: string[]) {
  if (isBlockedAuthProxyPath(pathSegments)) {
    return NextResponse.json(
      {
        detail:
          "Usa /api/auth/login, /api/auth/logout o /api/auth/me. El proxy no expone autenticación.",
      },
      { status: 404 },
    );
  }

  const path = djangoApiPath(pathSegments);
  const upstream = `${DJANGO_ORIGIN}/api/${path}${request.nextUrl.search}`;
  const method = request.method.toUpperCase();

  const headers = djangoForwardHeaders(request);
  const accept = request.headers.get("accept");
  if (accept) headers.set("Accept", accept);

  const token = request.cookies.get(DASHBOARD_TOKEN_COOKIE)?.value;
  if (token) {
    headers.set("Authorization", `Token ${token}`);
  }

  const init: RequestInit = {
    method,
    headers,
    cache: "no-store",
  };

  if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);

    const buf = await request.arrayBuffer();
    if (buf.byteLength > 0) {
      init.body = buf;
    }
  }

  try {
    const response = await fetch(upstream, init);

    if (response.status === 204 || response.status === 205) {
      return new NextResponse(null, { status: response.status });
    }

    const body = await response.arrayBuffer();
    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) {
      responseHeaders.set("Content-Type", contentType);
    }

    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[django-proxy]", method, upstream, err);
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
