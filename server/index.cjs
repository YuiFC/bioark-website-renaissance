// Minimal Express server to create Stripe Checkout Sessions
// Uses CommonJS (.cjs) to avoid ESM issues due to root package.json type: module
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
app.use(express.json());

// Allow CORS for dev (restrict in production)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
const allowedExact = new Set([FRONTEND_URL]);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // non-browser or same-origin
    const devPattern = /^http:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
    if (allowedExact.has(origin) || devPattern.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('[Stripe] STRIPE_SECRET_KEY is not set. Set it in your .env file.');
}
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// POST /create-checkout-session
// body: { items: [{ name, price, quantity, imageUrl }], successUrl?, cancelUrl? }
app.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }
  const { items, successUrl, cancelUrl, currency } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Helpers: validate/sanitize URLs
    const isHttpUrl = (u) => typeof u === 'string' && /^https?:\/\//i.test(u);
    const toHttpUrlOrNull = (u) => {
      try { return isHttpUrl(u) ? new URL(u).href : null; } catch { return null; }
    };

    // Map cart items to Stripe line_items. Expect price is in cents on frontend already.
    const line_items = items
      .filter((it) => typeof it.price === 'number' && it.price > 0 && typeof it.quantity === 'number' && it.quantity > 0)
  .map((it, idx) => ({
        price_data: {
          currency: (currency || 'usd').toLowerCase(),
          product_data: {
            name: it.name,
            // Stripe要求绝对 http(s) 图片链接；前端若传相对或无效，直接忽略
            images: (()=>{ const u = toHttpUrlOrNull(it.imageUrl); return u ? [u] : undefined; })(),
          },
          unit_amount: Math.round(it.price), // already cents
        },
        quantity: Math.round(it.quantity),
        // Attach per-line metadata via product_data metadata is not available in Checkout line_items
      }));

    if (!line_items.length) {
      return res.status(400).json({ error: 'No payable items provided' });
    }

  const rawOrigin = req.headers.origin || FRONTEND_URL;
  const origin = toHttpUrlOrNull(rawOrigin) || 'http://localhost:8080';
    // Build a cart summary metadata string (max 500 chars for safety)
    const summary = items
      .map((it) => `${it.name}${it.variant ? ` (${it.variant})` : ''} x${it.quantity}${typeof it.price === 'number' ? ` @$${(it.price/100).toFixed(2)}` : ''}`)
      .join('; ')
      .slice(0, 500);

  console.log('[Stripe] Creating session with', { count: items.length, summary });
  const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: toHttpUrlOrNull(successUrl) || `${origin.replace(/\/?$/, '')}/cart?success=1`,
      cancel_url: toHttpUrlOrNull(cancelUrl) || `${origin.replace(/\/?$/, '')}/cart?canceled=1`,
      billing_address_collection: 'auto',
      metadata: {
        cart_summary: summary,
        cart_count: String(items.length),
      },
    });

    // Return URL for redirect
    return res.json({ url: session.url });
  } catch (err) {
    const msg = (err && err.message) ? err.message : String(err);
    console.error('Failed to create checkout session', msg);
    return res.status(500).json({ error: msg });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Stripe server listening on http://localhost:${PORT}`);
});
