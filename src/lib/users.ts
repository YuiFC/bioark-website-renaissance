import { fetchJson } from './api';

export interface UserRec {
  email: string;
  name?: string;
  role?: 'User'|'Admin';
  address?: string;
}

export async function listUsers(): Promise<UserRec[]> {
  const j = await fetchJson<{ users: UserRec[] }>('/api/users');
  return j.users || [];
}

export async function upsertUser(rec: UserRec & { password?: string }): Promise<void> {
  await fetchJson('/api/users/upsert', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(rec) });
}

export async function deleteUser(email: string): Promise<void> {
  await fetchJson(`/api/users/${encodeURIComponent(email)}`, { method:'DELETE' });
}
