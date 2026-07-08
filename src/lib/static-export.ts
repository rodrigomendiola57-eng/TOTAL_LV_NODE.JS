/** True cuando el build apunta a GitHub Pages (export estático). */
export const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";

/** Opciones de fetch compatibles con `output: 'export'`. */
export function staticExportFetchInit(
  init: RequestInit = {},
): RequestInit {
  if (isGithubPagesBuild) {
    return init;
  }

  return { ...init, cache: "no-store" };
}
