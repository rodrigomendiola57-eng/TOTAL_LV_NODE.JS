import { NextRequest, NextResponse } from "next/server";

import { DASHBOARD_TOKEN_COOKIE } from "@/lib/auth/constants";

/**
 * Devuelve el token de autenticación Django almacenado en la cookie httpOnly.
 *
 * El cliente lo necesita para subir archivos grandes directamente al backend
 * Django (Render), evitando el proxy Next.js en Vercel que tiene un límite
 * de ~4.5 MB por request (FUNCTION_PAYLOAD_TOO_LARGE).
 *
 * Esta ruta NO recibe archivos — solo devuelve el token.
 * El archivo se envía directo desde el navegador a Django.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(DASHBOARD_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json(
      { detail: "No autenticado" },
      { status: 401 },
    );
  }

  return NextResponse.json({ token });
}
