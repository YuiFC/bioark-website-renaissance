import { fetchJson } from './api';

function authHeaders(extra?: Record<string,string>): Record<string,string> {
  const h: Record<string,string> = { ...(extra||{}) };
  try {
    const t = localStorage.getItem('bioark_auth_token');
    if (t) h['Authorization'] = `Bearer ${t}`;
  } catch {}
  return h;
}

export interface UserRec {
  email: string;
  name?: string;
  role?: 'User'|'Admin';
  address?: string;
}

export async function listUsers(): Promise<UserRec[]> {
  const j = await fetchJson<{ users: UserRec[] }>('/users', { headers: authHeaders() });
  return j.users || [];
}

export async function upsertUser(rec: UserRec & { password?: string }): Promise<void> {
  await fetchJson('/users/upsert', { method:'POST', headers: authHeaders({ 'Content-Type':'application/json' }), body: JSON.stringify(rec) });
}

export async function deleteUser(email: string): Promise<void> {
  await fetchJson(`/users/${encodeURIComponent(email)}`, { method:'DELETE', headers: authHeaders() });
}
