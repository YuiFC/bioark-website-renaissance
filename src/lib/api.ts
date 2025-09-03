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
  const tryFetch = async (url: string) => {
    const r = await fetch(url, init);
    const d = await r.json().catch(() => ({} as any));
    return { r, d } as const;
  };
  try {
    const { r, d } = await tryFetch(base + path);
    if (r.ok) return d as T;
    const msg = (d && (d.error || d.message)) || `HTTP ${r.status}`;
    throw new Error(msg);
  } catch (e) {
    throw e;
  }
}
