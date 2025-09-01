// Minimal Express server to create Stripe Checkout Sessions
// Uses CommonJS (.cjs) to avoid ESM issues due to root package.json type: module
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Stripe = require('stripe');

const app = express();
app.use(express.json());

// Allow CORS broadly for development/demo (tighten for production)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
app.use(cors({ origin: true, credentials: false }));

// Serve static frontend (so you can open http://localhost:4242/auth.html)
const PUBLIC_DIR = path.resolve(__dirname, '../public');
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
}

// === File-based user store ===
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '{}', 'utf-8');
}
ensureDataFiles();

function readUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); } catch { return []; }
}
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}
function readSessions() {
  try { return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8')); } catch { return {}; }
}
function writeSessions(sessions) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
}

function hashPassword(pw) {
  return crypto.createHash('sha256').update(String(pw)).digest('hex');
}
function newToken() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}

// Seed default admin if missing
(function seedAdmin() {
  const users = readUsers();
  const hasAdmin = users.some(u => u.role === 'Admin');
  if (!hasAdmin) {
    users.push({ email: 'admin@bioark.com', name: 'BioArk Admin', password: hashPassword('Admin123!'), role: 'Admin' });
    writeUsers(users);
  }
})();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('[Stripe] STRIPE_SECRET_KEY is not set. Set it in your .env file.');
}
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Simple API ping
app.get('/api/ping', (_req, res) => {
  res.json({ ok: true, time: Date.now() });
});

// Auth: signup
// body: { name, email, password }
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = readUsers();
  const exists = users.some(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  users.push({ name, email, password: hashPassword(password), role: 'User' });
  writeUsers(users);
  // Auto create session
  const token = newToken();
  const sessions = readSessions();
  sessions[token] = { email, role: 'User', name };
  writeSessions(sessions);
  return res.json({ token, user: { name, email, role: 'User' } });
});

// Auth: signin
// body: { email, password }
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user || user.password !== hashPassword(password)) return res.status(401).json({ error: 'Invalid email or password' });
  const token = newToken();
  const sessions = readSessions();
  sessions[token] = { email: user.email, role: user.role, name: user.name };
  writeSessions(sessions);
  return res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

// Auth: me
app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  const sessions = readSessions();
  const session = sessions[token];
  if (!session) return res.status(401).json({ error: 'Invalid token' });
  return res.json({ user: session });
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
