const INTERNAL_REDIRECT_ORIGIN = "https://chichitos.local";

export function sanitizeInternalRedirectPath(rawPath: string | null | undefined, fallback = "/admin") {
  const fallbackPath = fallback.startsWith("/") && !fallback.startsWith("//") ? fallback : "/";

  if (!rawPath) {
    return fallbackPath;
  }

  const candidate = rawPath.trim();

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    candidate.includes("\n") ||
    candidate.includes("\r")
  ) {
    return fallbackPath;
  }

  try {
    const parsed = new URL(candidate, INTERNAL_REDIRECT_ORIGIN);

    if (parsed.origin !== INTERNAL_REDIRECT_ORIGIN) {
      return fallbackPath;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallbackPath;
  }
}

export function buildAdminLoginPath(nextPath = "/admin") {
  return `/admin/login?next=${encodeURIComponent(sanitizeInternalRedirectPath(nextPath))}`;
}
