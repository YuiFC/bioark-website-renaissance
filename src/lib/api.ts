export function getApiBase(): string {
  // Prefer Vite env, then global injected in auth-config.js, else localhost
  const envBase = (import.meta as any).env?.VITE_API_BASE;
  // @ts-ignore
  const globalBase = typeof window !== 'undefined' ? (window as any).BIOARK_API_BASE : undefined;
  return (envBase || globalBase || 'http://localhost:4242').replace(/\/$/, '');
}

export async function fetchJson<T=any>(path: string, init?: RequestInit): Promise<T> {
  const base = getApiBase();
  const res = await fetch(base + path, init);
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data as T;
}
