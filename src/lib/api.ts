export function getApiBase(): string {
  // Prefer Vite env, then global injected in auth-config.js
  const envBase = (import.meta as any).env?.VITE_API_BASE;
  // @ts-ignore
  const globalBase = typeof window !== 'undefined' ? (window as any).BIOARK_API_BASE : undefined;
  if (envBase) return String(envBase).replace(/\/$/, '');
  if (globalBase) return String(globalBase).replace(/\/$/, '');
  // Fallbacks: localhost in dev, same-origin in prod
  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '';
    if (/^(localhost|127\.0\.0\.1)$/i.test(host)) {
      return 'http://localhost:4242';
    }
    // Same-origin (empty base) lets fetch use relative /api/... on the current origin
    return '';
  }
  return '';
}

export async function fetchJson<T=any>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  const tryFetch = async (url: string) => {
    const r = await fetch(url, init);
    const d = await r.json().catch(() => ({} as any));
    return { r, d } as const;
  };
  try {
    const { r, d } = await tryFetch(base + path);
    if (r.ok) return d as T;
    // Fallback: if running on localhost and API not available, try localhost:4242 for local dev only
    if (typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) && path.startsWith('/api/')) {
      const { r: r2, d: d2 } = await tryFetch('http://localhost:4242' + path);
      if (r2.ok) return d2 as T;
      const msg2 = (d2 && (d2.error || d2.message)) || `HTTP ${r2.status}`;
      throw new Error(msg2);
    }
    const msg = (d && (d.error || d.message)) || `HTTP ${r.status}`;
    throw new Error(msg);
  } catch (e) {
    // Network error fallback when on localhost dev only
    if (typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) && path.startsWith('/api/')) {
      const { r: r3, d: d3 } = await tryFetch('http://localhost:4242' + path);
      if (r3.ok) return d3 as T;
      const msg3 = (d3 && (d3.error || d3.message)) || `HTTP ${r3.status}`;
      throw new Error(msg3);
    }
    throw e;
  }
}
