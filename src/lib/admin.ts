import { fetchJson } from './api';

function getAuthToken(): string | null {
  try { return localStorage.getItem('bioark_auth_token'); } catch { return null; }
}

export async function restartContentApi(): Promise<{ ok: boolean; log?: string; error?: string }>{
  const token = getAuthToken();
  const headers: Record<string,string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetchJson('/admin/restart', { method:'POST', headers });
}
