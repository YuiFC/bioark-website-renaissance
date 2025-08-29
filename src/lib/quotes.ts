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

const KEY = 'bioark_quotes_v1';

export function getQuotes(): Quote[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list: Quote[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function setQuotes(list: Quote[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addQuote(input: Omit<Quote, 'id'|'createdAt'|'read'>): Quote {
  const q: Quote = {
    ...input,
    id: `q_${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const list = getQuotes();
  setQuotes([q, ...list]);
  return q;
}

export function markQuoteRead(id: string, read = true) {
  const list = getQuotes();
  const next = list.map(q => q.id === id ? { ...q, read } : q);
  setQuotes(next);
}

export function deleteQuote(id: string) {
  const list = getQuotes();
  const next = list.filter(q => q.id !== id);
  setQuotes(next);
}

export function markAllQuotesRead() {
  const list = getQuotes();
  const next = list.map(q => ({ ...q, read: true }));
  setQuotes(next);
}

export function getUnreadQuotesCount(): number {
  return getQuotes().filter(q => !q.read).length;
}
