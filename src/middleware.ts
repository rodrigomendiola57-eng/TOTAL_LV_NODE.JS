import { NextRequest, NextResponse } from "next/server";

import {
  DASHBOARD_SESSION_CHECK_MAX_AGE,
  DASHBOARD_SESSION_OK_COOKIE,
  DASHBOARD_TOKEN_COOKIE,
} from "@/lib/auth/constants";
import { djangoForwardHeaders } from "@/lib/http/forward-client-ip";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

function clearAuthCookies(response: NextResponse) {
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

function withSessionOk(response: NextResponse) {
  response.cookies.set(DASHBOARD_SESSION_OK_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DASHBOARD_SESSION_CHECK_MAX_AGE,
  });
  return response;
}

async function tokenIsValid(
  token: string,
  request: NextRequest,
): Promise<boolean> {
  try {
    const upstream = await fetch(`${DJANGO_ORIGIN}/api/auth/me/`, {
      headers: djangoForwardHeaders(request, {
        Authorization: `Token ${token}`,
        Accept: "application/json",
      }),
      cache: "no-store",
    });
    return upstream.ok;
  } catch {
    // Si Django no responde, no echar al usuario: deja pasar con cookie
    // y que las APIs fallen con 502 (evita lockout por caídas cortas).
    return true;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(DASHBOARD_TOKEN_COOKIE)?.value;
  const sessionOk = request.cookies.get(DASHBOARD_SESSION_OK_COOKIE)?.value;
  const isDashboard = pathname.startsWith("/dashboard");
  const isLogin = pathname === "/login";

  if (isDashboard) {
    if (!token) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!sessionOk) {
      const valid = await tokenIsValid(token, request);
      if (!valid) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("next", pathname);
        const response = NextResponse.redirect(loginUrl);
        clearAuthCookies(response);
        return response;
      }
      return withSessionOk(NextResponse.next());
    }

    return NextResponse.next();
  }

  if (isLogin && token) {
    if (sessionOk) {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = "/dashboard";
      dashUrl.search = "";
      return NextResponse.redirect(dashUrl);
    }

    const valid = await tokenIsValid(token, request);
    if (valid) {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = "/dashboard";
      dashUrl.search = "";
      return withSessionOk(NextResponse.redirect(dashUrl));
    }

    const response = NextResponse.next();
    clearAuthCookies(response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
