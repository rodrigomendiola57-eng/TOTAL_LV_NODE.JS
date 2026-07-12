import { cookies } from "next/headers";

import { DASHBOARD_TOKEN_COOKIE } from "@/lib/auth/constants";

/** Headers Authorization para fetches SSR del dashboard (cookie httpOnly). */
export async function getDashboardAuthHeaders(): Promise<HeadersInit> {
  const token = (await cookies()).get(DASHBOARD_TOKEN_COOKIE)?.value;
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
  };
}
