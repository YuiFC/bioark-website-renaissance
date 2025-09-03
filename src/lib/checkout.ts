export type CheckoutItem = {
  id?: string;
  name: string;
  price: number; // cents
  quantity: number;
  imageUrl?: string;
  variant?: string;
};

export type CheckoutAddress = {
  name?: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string; // ISO 2-letter, e.g., US, CA, CN
};

export async function createCheckoutSession(
  items: CheckoutItem[],
  options?: { successUrl?: string; cancelUrl?: string; currency?: string; shippingCents?: number; address?: CheckoutAddress }
) {
  // Default to Nginx path prefix for Stripe API; fall back to content API or empty
  const base = (import.meta.env as any).VITE_STRIPE_API_BASE || '/stripe-api';
  const url = `${base}/create-checkout-session`;
  const res = await fetch(url, {
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
