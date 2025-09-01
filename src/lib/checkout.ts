export type CheckoutItem = {
  id?: string;
  name: string;
  price: number; // cents
  quantity: number;
  imageUrl?: string;
  variant?: string;
};

export async function createCheckoutSession(items: CheckoutItem[], options?: { successUrl?: string; cancelUrl?: string; currency?: string }) {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4242';
  const res = await fetch(`${base}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, ...options }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Failed to create session: ${msg}`);
  }
  return (await res.json()) as { url: string };
}
