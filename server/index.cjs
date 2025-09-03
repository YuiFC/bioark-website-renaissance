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
// Initialize Stripe client
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK || '';
let stripe = null;
if (STRIPE_SECRET_KEY) {
  try {
    stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
  } catch (e) {
    console.error('[Stripe] Invalid STRIPE_SECRET_KEY', e?.message || e);
  }
} else {
  console.warn('[Stripe] STRIPE_SECRET_KEY not set; Stripe checkout will be disabled');
}
const MODE = process.env.MODE || 'all'; // 'stripe' | 'content' | 'all'
// Increase JSON body limit to allow base64 image uploads
app.use(express.json({ limit: '20mb' }));

// Allow CORS broadly for development/demo (tighten for production)
// FRONTEND_URL can be provided in production to construct absolute redirect URLs if needed
const FRONTEND_URL = process.env.FRONTEND_URL || '';
app.use(cors({ origin: true, credentials: false }));

// Serve static frontend (for demo auth.html and assets)
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_BLOG_TS = path.join(ROOT_DIR, 'src', 'data', 'blog.ts');
if (fs.existsSync(PUBLIC_DIR)) {
  app.use(express.static(PUBLIC_DIR));
}

// === File-based user store ===
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const BLOG_FILE = path.join(DATA_DIR, 'blog.json');
const BLOG_MEDIA_FILE = path.join(DATA_DIR, 'blog-media.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const QUOTES_FILE = path.join(DATA_DIR, 'quotes.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const SMTP_FILE = path.join(DATA_DIR, 'smtp.json');
// Uploads directory under data (runtime-writable)
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '{}', 'utf-8');
  if (!fs.existsSync(BLOG_FILE)) fs.writeFileSync(BLOG_FILE, JSON.stringify({ version: 'v1', posts: [], hidden: [], overrides: {} }, null, 2), 'utf-8');
  if (!fs.existsSync(BLOG_MEDIA_FILE)) fs.writeFileSync(BLOG_MEDIA_FILE, JSON.stringify({ media: {} }, null, 2), 'utf-8');
  if (!fs.existsSync(SERVICES_FILE)) fs.writeFileSync(SERVICES_FILE, JSON.stringify({ overrides: {}, custom: [], media: {} }, null, 2), 'utf-8');
  if (!fs.existsSync(QUOTES_FILE)) fs.writeFileSync(QUOTES_FILE, '[]', 'utf-8');
  if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, JSON.stringify({ version: 1, products: [], overrides: {}, details: {}, hidden: [] }, null, 2), 'utf-8');
  if (!fs.existsSync(SMTP_FILE)) fs.writeFileSync(SMTP_FILE, JSON.stringify({ host:'', port:465, secure:true, user:'', pass:'', fromEmail:'', toEmails:'' }, null, 2), 'utf-8');
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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

// Blog store
function readBlog(){ try { return JSON.parse(fs.readFileSync(BLOG_FILE,'utf-8')); } catch { return { version:'v1', posts:[], hidden:[], overrides:{} }; }
}
function writeBlog(data){ fs.writeFileSync(BLOG_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

// Blog media store
function readBlogMedia(){ try { return JSON.parse(fs.readFileSync(BLOG_MEDIA_FILE,'utf-8')); } catch { return { media:{} }; } }
function writeBlogMedia(data){ fs.writeFileSync(BLOG_MEDIA_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

// Services store
function readServicesCfg(){ try { return JSON.parse(fs.readFileSync(SERVICES_FILE,'utf-8')); } catch { return { overrides:{}, custom:[], media:{} }; }
}
function writeServicesCfg(data){ fs.writeFileSync(SERVICES_FILE, JSON.stringify(data, null, 2), 'utf-8'); }

// Quotes store
function readQuotes(){ try { return JSON.parse(fs.readFileSync(QUOTES_FILE, 'utf-8')); } catch { return []; } }
function writeQuotes(list){ fs.writeFileSync(QUOTES_FILE, JSON.stringify(list, null, 2), 'utf-8'); }

// Products config store
function readProductsCfg(){
  try { return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8')); }
  catch { return { version: 1, products: [], overrides: {}, details: {}, hidden: [] }; }
}
function writeProductsCfg(cfg){ fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(cfg, null, 2), 'utf-8'); }

// SMTP config store
function readSmtpCfg(){ try { return JSON.parse(fs.readFileSync(SMTP_FILE,'utf-8')); } catch { return { host:'', port:465, secure:true, user:'', pass:'', fromEmail:'', toEmails:'' }; } }
function writeSmtpCfg(cfg){ fs.writeFileSync(SMTP_FILE, JSON.stringify(cfg, null, 2), 'utf-8'); }

function hashPassword(pw) {
  return crypto.createHash('sha256').update(String(pw)).digest('hex');
}
function newToken() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}

// ===== Content APIs (only when not in 'stripe' mode) =====
if (MODE !== 'stripe') {
  // Products config APIs
  app.get('/api/products-config', (_req,res)=>{
    return res.json(readProductsCfg());
  });
  app.put('/api/products-config', (req,res)=>{
    const { version, products, overrides, details, hidden } = req.body || {};
    const data = {
      version: typeof version === 'number' ? version : 1,
      products: Array.isArray(products) ? products : [],
      overrides: overrides && typeof overrides === 'object' ? overrides : {},
      details: details && typeof details === 'object' ? details : {},
      hidden: Array.isArray(hidden) ? hidden : [],
    };
    writeProductsCfg(data);
    return res.json({ ok: true });
  });

  // Blog APIs
  app.get('/api/blog', (_req,res)=>{
    return res.json(readBlog());
  });
  app.put('/api/blog', (req,res)=>{
    const { version, posts, hidden, overrides } = req.body || {};
    const data = {
      version: typeof version === 'string' ? version : 'v1',
      posts: Array.isArray(posts) ? posts : [],
      hidden: Array.isArray(hidden) ? hidden : [],
      overrides: overrides && typeof overrides === 'object' ? overrides : {}
    };
    writeBlog(data);
    return res.json({ ok: true });
  });

  // Blog media
  app.get('/api/blog-media', (_req,res)=>{
    return res.json(readBlogMedia());
  });
  app.put('/api/blog-media', (req,res)=>{
    const { media } = req.body || {};
    const data = { media: media && typeof media === 'object' ? media : {} };
    writeBlogMedia(data);
    return res.json({ ok: true });
  });

  // Services config APIs
  app.get('/api/services-config', (_req,res)=>{
    return res.json(readServicesCfg());
  });
  app.put('/api/services-config', (req,res)=>{
    const { overrides, custom, media } = req.body || {};
    const data = {
      overrides: overrides && typeof overrides === 'object' ? overrides : {},
      custom: Array.isArray(custom) ? custom : [],
      media: media && typeof media === 'object' ? media : {}
    };
    writeServicesCfg(data);
    return res.json({ ok: true });
  });

  // SMTP config APIs
  app.get('/api/smtp-config', (_req,res)=>{
    return res.json(readSmtpCfg());
  });
  app.put('/api/smtp-config', (req,res)=>{
    const { host, port, secure, user, pass, fromEmail, toEmails } = req.body || {};
    const cfg = {
      host: typeof host === 'string' ? host : '',
      port: Number.isFinite(Number(port)) ? Number(port) : 465,
      secure: !!secure,
      user: typeof user === 'string' ? user : '',
      pass: typeof pass === 'string' ? pass : '',
      fromEmail: typeof fromEmail === 'string' ? fromEmail : '',
      toEmails: typeof toEmails === 'string' ? toEmails : ''
    };
    writeSmtpCfg(cfg);
    return res.json({ ok: true });
  });
}
app.get('/api/blog', (_req,res)=>{
  return res.json(readBlog());
});
app.put('/api/blog', (req,res)=>{
  const { version, posts, hidden, overrides } = req.body || {};
  const data = {
    version: typeof version === 'string' ? version : 'v1',
    posts: Array.isArray(posts) ? posts : [],
    hidden: Array.isArray(hidden) ? hidden : [],
    overrides: overrides && typeof overrides === 'object' ? overrides : {}
  };
  writeBlog(data);
  return res.json({ ok: true });
});

// Write current posts into src/data/blog.ts (TypeScript source)
// body: { posts: BlogPost[] }
app.post('/api/blog-sync-source', (req,res)=>{
  try {
    const { posts } = req.body || {};
    if (!Array.isArray(posts)) return res.status(400).json({ error: 'posts must be an array' });
    // Build TypeScript file content
    const header = `export interface BlogPost {\n  id: number;\n  slug: string;\n  title: string;\n  excerpt: string;\n  content: string;\n  author: string;\n  date: string;\n  category?: string;\n  coverImage?: string;\n  readTime?: number;\n  views?: number;\n  tags?: string[];\n}\n\n`;
    const body = `export const mockBlogPosts: BlogPost[] = ${JSON.stringify(posts, null, 2)};\n`;
    const code = header + body;
    fs.writeFileSync(SRC_BLOG_TS, code, 'utf-8');
    return res.json({ ok: true });
  } catch (err) {
    console.error('Failed to sync blog.ts', err);
    return res.status(500).json({ error: 'Failed to write src/data/blog.ts' });
  }
});

// Blog media
app.get('/api/blog-media', (_req,res)=>{
  return res.json(readBlogMedia());
});
app.put('/api/blog-media', (req,res)=>{
  const { media } = req.body || {};
  const data = { media: media && typeof media === 'object' ? media : {} };
  writeBlogMedia(data);
  return res.json({ ok: true });
});

// ===== Services config APIs =====
app.get('/api/services-config', (_req,res)=>{
  return res.json(readServicesCfg());
});
app.put('/api/services-config', (req,res)=>{
  const { overrides, custom, media } = req.body || {};
  const data = {
    overrides: overrides && typeof overrides === 'object' ? overrides : {},
    custom: Array.isArray(custom) ? custom : [],
    media: media && typeof media === 'object' ? media : {}
  };
  writeServicesCfg(data);
  return res.json({ ok: true });
});

// SMTP config APIs
app.get('/api/smtp-config', (_req,res)=>{
  return res.json(readSmtpCfg());
});
app.put('/api/smtp-config', (req,res)=>{
  const { host, port, secure, user, pass, fromEmail, toEmails } = req.body || {};
  const cfg = {
    host: typeof host === 'string' ? host : '',
    port: Number.isFinite(Number(port)) ? Number(port) : 465,
    secure: !!secure,
    user: typeof user === 'string' ? user : '',
    pass: typeof pass === 'string' ? pass : '',
    fromEmail: typeof fromEmail === 'string' ? fromEmail : '',
    toEmails: typeof toEmails === 'string' ? toEmails : ''
  };
  writeSmtpCfg(cfg);
  return res.json({ ok: true });
});

// ===== Users admin APIs =====
// List users (without password hashes)
app.get('/api/users', (_req,res)=>{
  const users = readUsers().map(u => ({ email: u.email, name: u.name, role: u.role }));
  return res.json({ users });
});
// Upsert user fields; body: { email, name?, role?, password? }
app.post('/api/users/upsert', (req,res)=>{
  const { email, name, role, password } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  const users = readUsers();
  const i = users.findIndex(u => u.email.toLowerCase() === String(email).toLowerCase());
  if (i >= 0) {
    if (name != null) users[i].name = name;
    if (role != null) users[i].role = role;
    if (password) users[i].password = hashPassword(password);
  } else {
    users.push({ email, name: name || email, role: role || 'User', password: password ? hashPassword(password) : hashPassword('123456') });
  }
  writeUsers(users);
  return res.json({ ok: true });
});
// Delete user
app.delete('/api/users/:email', (req,res)=>{
  const email = decodeURIComponent(req.params.email||'');
  const users = readUsers().filter(u => u.email.toLowerCase() !== email.toLowerCase());
  writeUsers(users);
  return res.json({ ok: true });
});

// ===== Quotes APIs =====
app.get('/api/quotes', (_req,res)=>{
  return res.json({ quotes: readQuotes() });
});
app.post('/api/quotes', (req,res)=>{
  const input = req.body || {};
  const q = Object.assign({}, input, { id: `q_${Date.now()}`, createdAt: new Date().toISOString(), read: false });
  const list = readQuotes();
  writeQuotes([q, ...list]);
  return res.json({ quote: q });
});
app.put('/api/quotes/:id/read', (req,res)=>{
  const { id } = req.params;
  const { read } = req.body || {};
  const list = readQuotes().map(q => q.id === id ? Object.assign({}, q, { read: !!read }) : q);
  writeQuotes(list);
  return res.json({ ok: true });
});
app.delete('/api/quotes/:id', (req,res)=>{
  const { id } = req.params;
  const list = readQuotes().filter(q => q.id !== id);
  writeQuotes(list);
  return res.json({ ok: true });
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

// POST /create-checkout-session (only when not in 'content' mode)
// body: {
//   items: [{ name, price, quantity, imageUrl }],
//   successUrl?, cancelUrl?, currency?,
//   shippingCents?: number,
//   address?: { name?: string; email?: string; line1: string; line2?: string; city: string; state?: string; postal_code: string; country: string }
// }
if (MODE !== 'content') app.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured on server' });
    }
  const { items, successUrl, cancelUrl, currency, shippingCents, address } = req.body || {};
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
  // Derive a safe origin for absolute URLs without hardcoded localhost
  const xfHost = req.headers['x-forwarded-host'];
  const host = (typeof xfHost === 'string' && xfHost) ? xfHost : req.headers.host;
  const xfProto = req.headers['x-forwarded-proto'];
  const proto = (typeof xfProto === 'string' && xfProto) ? xfProto : req.protocol;
  const inferredOrigin = (host && proto) ? `${proto}://${host}` : '';
  const origin = toHttpUrlOrNull(rawOrigin)
    || toHttpUrlOrNull(FRONTEND_URL)
    || toHttpUrlOrNull(inferredOrigin)
    || '';
    // Build a cart summary metadata string (max 500 chars for safety)
    const summary = items
      .map((it) => `${it.name}${it.variant ? ` (${it.variant})` : ''} x${it.quantity}${typeof it.price === 'number' ? ` @$${(it.price/100).toFixed(2)}` : ''}`)
      .join('; ')
      .slice(0, 500);

  // Prepare shipping and tax
    const shipAmount = Number.isFinite(Number(shippingCents)) && Number(shippingCents) > 0 ? Math.round(Number(shippingCents)) : 4000; // default $40
    const cur = (currency || 'usd').toLowerCase();

    // If address provided, create a Customer to prefill details
    let customerId = null;
    let allowedCountries = null;
    try {
      if (address && typeof address === 'object' && address.country) {
        const addr = {
          line1: String(address.line1 || ''),
          line2: address.line2 ? String(address.line2) : undefined,
          city: String(address.city || ''),
          state: address.state ? String(address.state) : undefined,
          postal_code: String(address.postal_code || ''),
          country: String(address.country).toUpperCase(),
        };
        const created = await stripe.customers.create({
          name: address.name ? String(address.name) : undefined,
          email: address.email ? String(address.email) : undefined,
          address: addr,
          shipping: { name: address.name ? String(address.name) : undefined, address: addr }
        });
        customerId = created.id;
        allowedCountries = [addr.country];
      }
    } catch (e) {
      console.warn('Failed to create customer for provided address, will proceed without prefill', e?.message || e);
    }

    console.log('[Stripe] Creating session with', { count: items.length, summary });
  const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: toHttpUrlOrNull(successUrl) || `${origin.replace(/\/?$/, '')}/cart?success=1`,
      cancel_url: toHttpUrlOrNull(cancelUrl) || `${origin.replace(/\/?$/, '')}/cart?canceled=1`,
      billing_address_collection: 'auto',
      automatic_tax: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard Shipping',
      type: 'fixed_amount',
            fixed_amount: { amount: shipAmount, currency: cur },
          },
        },
      ],
    shipping_address_collection: { allowed_countries: allowedCountries || ['US'] },
      customer: customerId || undefined,
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
  console.log(`[${MODE.toUpperCase()}] server listening on port ${PORT}`);
});
