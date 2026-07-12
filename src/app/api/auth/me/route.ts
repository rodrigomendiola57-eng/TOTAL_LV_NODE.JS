import { NextRequest, NextResponse } from "next/server";

import {
  DASHBOARD_SESSION_OK_COOKIE,
  DASHBOARD_TOKEN_COOKIE,
} from "@/lib/auth/constants";
import { djangoForwardHeaders } from "@/lib/http/forward-client-ip";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(DASHBOARD_TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ detail: "No autenticado." }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${DJANGO_ORIGIN}/api/auth/me/`, {
      headers: djangoForwardHeaders(request, {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      }),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const response = NextResponse.json(
        { detail: data.detail || "Sesión inválida." },
        { status: upstream.status },
      );
      if (upstream.status === 401) {
        const clear = {
          httpOnly: true,
          sameSite: "lax" as const,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 0,
        };
        response.cookies.set(DASHBOARD_TOKEN_COOKIE, "", clear);
        response.cookies.set(DASHBOARD_SESSION_OK_COOKIE, "", clear);
      }
      return response;
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[auth/me]", err);
    return NextResponse.json(
      { detail: "Backend no disponible." },
      { status: 502 },
    );
  }
}
