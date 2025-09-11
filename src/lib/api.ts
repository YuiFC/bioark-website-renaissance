export function getApiBase(): string {
  // Prefer Vite env, then global injected in auth-config.js
  const envBase = (import.meta as any).env?.VITE_API_BASE;
  // @ts-ignore
  const globalBase = typeof window !== 'undefined' ? (window as any).BIOARK_API_BASE : undefined;
  if (envBase) return String(envBase).replace(/\/$/, '');
  if (globalBase) return String(globalBase).replace(/\/$/, '');
  // Default: behind Nginx, content API is exposed under /content-api
  return '/content-api';
}

export async function fetchJson<T=any>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  // If caller already passes an absolute URL with expected nginx prefixes or http(s), use it directly
  const isAbsolute = /^https?:\/\//.test(path) || path.startsWith('/content-api') || path.startsWith('/stripe-api');
  // Build URL with smart '/api' insertion so that callers can use '/foo' instead of '/api/foo'
  let urlToFetch: string;
  if (isAbsolute) {
    urlToFetch = path;
  } else {
    const baseHasApiSuffix = /\/api\/?$/i.test(base);
    const shouldPrefixApi = !baseHasApiSuffix && !path.startsWith('/api') && !path.startsWith('/stripe-api') && !path.startsWith('/content-api');
    const normalizedPath = shouldPrefixApi ? (`/api${path.startsWith('/') ? '' : '/'}${path}`) : path;
    urlToFetch = `${base}${normalizedPath}`;
  }
  // Auto attach Authorization header if token present and caller did not override
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bioark_auth_token') : null;
    if (token) {
      const h = new Headers(init?.headers || {} as any);
      if (!h.has('Authorization')) h.set('Authorization', `Bearer ${token}`);
      init = { ...(init||{}), headers: h };
    }
  } catch {}
  const tryFetch = async (url: string) => {
    const r = await fetch(url, init);
    const d = await r.json().catch(() => ({} as any));
    return { r, d } as const;
  };
  try {
    const { r, d } = await tryFetch(urlToFetch);
    if (r.ok) return d as T;
    const msg = (d && (d.error || d.message)) || `HTTP ${r.status}`;
    throw new Error(msg);
  } catch (e) {
    throw e;
  }
}
