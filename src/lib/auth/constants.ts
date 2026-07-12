/** Cookie httpOnly del token Django para el panel admin. */
export const DASHBOARD_TOKEN_COOKIE = "tl_dashboard_token";

/** Cookie corta: sesión ya validada contra Django (/auth/me). */
export const DASHBOARD_SESSION_OK_COOKIE = "tl_dashboard_ok";

export const DASHBOARD_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/** Evita llamar a Django en cada navegación del panel. */
export const DASHBOARD_SESSION_CHECK_MAX_AGE = 60 * 5; // 5 minutos
