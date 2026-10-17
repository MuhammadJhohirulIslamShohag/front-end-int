const ALLOWED_SCHEMES = new Set(["http:", "https:", "mailto:"]);

/**
 * Returns a safe absolute URL, or null if the scheme is not allowlisted
 * (e.g. javascript:, data:, vbscript:) or the URL is malformed.
 * Called at render time, not only at submission time — defense in depth.
 */
export function sanitizeUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl, window.location.origin);
    return ALLOWED_SCHEMES.has(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}