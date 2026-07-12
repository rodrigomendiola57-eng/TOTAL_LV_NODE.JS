/** Auth del panel solo por /api/auth/* de Next (cookie httpOnly). */
export function isBlockedAuthProxyPath(pathSegments: string[]): boolean {
  const root = (pathSegments[0] || "").toLowerCase();
  return root === "auth";
}
