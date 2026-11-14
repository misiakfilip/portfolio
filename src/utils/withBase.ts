/**
 * Prefixes a site-root path (e.g. "/projects/a.png") with Astro's `base`
 * (e.g. "/portfolio"). Works whether BASE_URL ends with a slash or not.
 * Absolute URLs (https:, mailto:, data:, //host) and bare anchors are returned unchanged.
 */
export function withBase(path = ''): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}/${clean}` : `${base}/`;
}
