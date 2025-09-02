export type Quote = {
  id: string;
  createdAt: string; // ISO string
  read: boolean;
  // Contact
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  // Organization
  company: string;
  department?: string;
  // Project
  serviceType: string;
  timeline?: string;
  budget?: string;
  projectDescription: string;
  additionalInfo?: string;
  // User registration snapshot (if available)
  submittedByEmail?: string;
  submittedByAddress?: string;
};

const API_BASE = (import.meta as any).env?.VITE_API_BASE || (typeof window !== 'undefined' && (window as any).BIOARK_API_BASE) || 'http://localhost:4242';

export async function getQuotes(): Promise<Quote[]> {
  const r = await fetch(API_BASE + '/api/quotes');
  const j = await r.json();
  return Array.isArray(j.quotes) ? j.quotes : [];
}

export async function addQuote(input: Omit<Quote, 'id'|'createdAt'|'read'>): Promise<Quote> {
  const r = await fetch(API_BASE + '/api/quotes', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(input) });
  const j = await r.json();
  return j.quote as Quote;
}

export async function markQuoteRead(id: string, read = true): Promise<void> {
  await fetch(API_BASE + `/api/quotes/${encodeURIComponent(id)}/read`, { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ read }) });
}

export async function deleteQuote(id: string): Promise<void> {
  await fetch(API_BASE + `/api/quotes/${encodeURIComponent(id)}`, { method:'DELETE' });
}

export async function markAllQuotesRead(): Promise<void> {
  const list = await getQuotes();
  await Promise.all(list.filter(q=>!q.read).map(q => markQuoteRead(q.id, true)));
}

export async function getUnreadQuotesCount(): Promise<number> {
  const list = await getQuotes();
  return list.filter(q => !q.read).length;
}
