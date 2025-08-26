import admins from '../config/admin.json';

export type AdminUser = { email: string; password: string };

export function isAdmin(email: string, password: string): boolean {
  const list = (admins as AdminUser[]) || [];
  return list.some(a => a.email === email && a.password === password);
}
