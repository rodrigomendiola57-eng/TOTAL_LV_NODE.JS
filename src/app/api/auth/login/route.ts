import { NextRequest, NextResponse } from "next/server";

import {
  DASHBOARD_SESSION_CHECK_MAX_AGE,
  DASHBOARD_SESSION_OK_COOKIE,
  DASHBOARD_TOKEN_COOKIE,
  DASHBOARD_TOKEN_MAX_AGE,
} from "@/lib/auth/constants";
import { djangoForwardHeaders } from "@/lib/http/forward-client-ip";

const DJANGO_ORIGIN =
  process.env.DJANGO_INTERNAL_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "JSON inválido." },
      { status: 400 },
    );
  }

  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!username || !password) {
    return NextResponse.json(
      { detail: "Usuario y contraseña son obligatorios." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(`${DJANGO_ORIGIN}/api/auth/login/`, {
      method: "POST",
      headers: djangoForwardHeaders(request, {
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { detail: data.detail || "No se pudo iniciar sesión." },
        { status: upstream.status },
      );
    }

    const token = data.token as string | undefined;
    if (!token) {
      return NextResponse.json(
        { detail: "Respuesta de autenticación incompleta." },
        { status: 502 },
      );
    }

    const response = NextResponse.json({
      user: data.user,
      detail: "Sesión iniciada.",
    });

    const cookieBase = {
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    };

    response.cookies.set(DASHBOARD_TOKEN_COOKIE, token, {
      ...cookieBase,
      maxAge: DASHBOARD_TOKEN_MAX_AGE,
    });
    response.cookies.set(DASHBOARD_SESSION_OK_COOKIE, "1", {
      ...cookieBase,
      maxAge: DASHBOARD_SESSION_CHECK_MAX_AGE,
    });

    return response;
  } catch (err) {
    console.error("[auth/login]", err);
    return NextResponse.json(
      { detail: "Backend no disponible." },
      { status: 502 },
    );
  }
}
