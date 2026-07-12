import { NextRequest, NextResponse } from "next/server";

import {
  DASHBOARD_SESSION_OK_COOKIE,
  DASHBOARD_TOKEN_COOKIE,
} from "@/lib/auth/constants";
import { djangoForwardHeaders } from "@/lib/http/forward-client-ip";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(DASHBOARD_TOKEN_COOKIE)?.value;

  if (token) {
    try {
      await fetch(`${DJANGO_ORIGIN}/api/auth/logout/`, {
        method: "POST",
        headers: djangoForwardHeaders(request, {
          Authorization: `Token ${token}`,
          Accept: "application/json",
        }),
        cache: "no-store",
      });
    } catch (err) {
      console.error("[auth/logout]", err);
    }
  }

  const response = NextResponse.json({ detail: "Sesión cerrada." });
  const clear = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
  response.cookies.set(DASHBOARD_TOKEN_COOKIE, "", clear);
  response.cookies.set(DASHBOARD_SESSION_OK_COOKIE, "", clear);
  return response;
}
