// Minimal Express server to create Stripe Checkout Sessions
// Uses CommonJS (.cjs) to avoid ESM issues due to root package.json type: module
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Stripe = require('stripe');
let nodemailer = null;
try { nodemailer = require('nodemailer'); } catch { nodemailer = null; }
const { spawn } = require('child_process');

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
const METRICS_FILE = path.join(DATA_DIR, 'metrics.json');
// Uploads directory under data (runtime-writable)
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
// Images DB (admin-managed assets)
const IMAGES_DB_FILE = path.join(DATA_DIR, 'images.json');

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '{}', 'utf-8');
  if (!fs.existsSync(BLOG_FILE)) fs.writeFileSync(BLOG_FILE, JSON.stringify({ version: 'v1', posts: [], hidden: [], overrides: {} }, null, 2), 'utf-8');
  if (!fs.existsSync(BLOG_MEDIA_FILE)) fs.writeFileSync(BLOG_MEDIA_FILE, JSON.stringify({ media: {} }, null, 2), 'utf-8');
  if (!fs.existsSync(SERVICES_FILE)) fs.writeFileSync(SERVICES_FILE, JSON.stringify({ overrides: {}, custom: [], media: {} }, null, 2), 'utf-8');
  if (!fs.existsSync(QUOTES_FILE)) fs.writeFileSync(QUOTES_FILE, '[]', 'utf-8');
  if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, JSON.stringify({ version: 1, products: [], overrides: {}, details: {}, hidden: [] }, null, 2), 'utf-8');
  if (!fs.existsSync(SMTP_FILE)) fs.writeFileSync(SMTP_FILE, JSON.stringify({ host:'', port:465, secure:true, user:'', pass:'', fromEmail:'', toEmails:'', subjectTemplate:'New Quote from {{firstName}} {{lastName}} — {{serviceType}}', bodyTemplate:'<h2>New Quote Notification</h2>\n<p><strong>Name:</strong> {{firstName}} {{lastName}}</p>\n<p><strong>Email:</strong> {{email}}</p>\n<p><strong>Company:</strong> {{company}}</p>\n<p><strong>Service:</strong> {{serviceType}}</p>\n<p><strong>Timeline:</strong> {{timeline}}</p>\n<p><strong>Budget:</strong> {{budget}}</p>\n<p><strong>Submitted At:</strong> {{createdAt}}</p>\n<hr/>\n<p><strong>Project Description:</strong></p>\n<p style="white-space:pre-wrap">{{projectDescription}}</p>\n{{#if additionalInfo}}<hr/><p><strong>Additional Info:</strong></p><pre style="white-space:pre-wrap">{{additionalInfo}}</pre>{{/if}}' }, null, 2), 'utf-8');
  if (!fs.existsSync(METRICS_FILE)) fs.writeFileSync(METRICS_FILE, JSON.stringify({ pageViews: 0 }, null, 2), 'utf-8');
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(IMAGES_DB_FILE)) fs.writeFileSync(IMAGES_DB_FILE, JSON.stringify({ images: [] }, null, 2), 'utf-8');
}
ensureDataFiles();

// Serve uploaded files under /uploads/*
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/content-api/uploads', express.static(UPLOADS_DIR));

// ===== Media helpers (save to public/images/<folder>) =====
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
function ensureImagesSubdir(folder){
  if (!folder || typeof folder !== 'string') return null;
  const safe = String(folder).toLowerCase().replace(/[^a-z0-9_-]/g,'');
  if (!safe) return null;
  const dir = path.join(IMAGES_DIR, safe);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return { safe, dir };
}
function sanitizeFilename(name){
  const base = String(name||'').trim().replace(/[^a-zA-Z0-9_.-]/g,'_');
  return base || (`img_${Date.now()}.png`);
}
function inferExtFromMime(mime){
  const m = String(mime||'').toLowerCase();
  if (m.includes('png')) return '.png';
  if (m.includes('jpeg') || m.includes('jpg')) return '.jpg';
  if (m.includes('gif')) return '.gif';
  if (m.includes('webp')) return '.webp';
  if (m.includes('svg')) return '.svg';
  return '';
}
function getFilenameFromUrl(u){
  try { const p = new URL(u).pathname; return path.basename(p||''); } catch { return ''; }
}

// ===== Image Assets DB helpers =====
function readImagesDb(){ try { return JSON.parse(fs.readFileSync(IMAGES_DB_FILE, 'utf-8')); } catch { return { images: [] }; } }
function writeImagesDb(db){ fs.writeFileSync(IMAGES_DB_FILE, JSON.stringify(db, null, 2), 'utf-8'); }
function nextImageId(db){ try { const arr = Array.isArray(db.images)?db.images:[]; return (arr.reduce((m,x)=>Math.max(m, Number(x.id)||0),0) + 1); } catch { return Date.now(); } }
function safeExtByMime(mime){
  const m = String(mime||'').toLowerCase();
  if (m.includes('png')) return '.png';
  if (m.includes('jpeg') || m.includes('jpg')) return '.jpg';
  if (m.includes('gif')) return '.gif';
  if (m.includes('webp')) return '.webp';
  if (m.includes('svg')) return '.svg';
  return '.bin';
}

// In-memory signed upload tokens
const uploadTokens = new Map(); // token -> { storageKey, fullPath, expiresAt }
function newUploadTokenFor(storageKey){
  const token = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  const fullPath = path.join(UPLOADS_DIR, storageKey.replace(/^uploads\//,''));
  // Ensure folder exists
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  const expiresAt = Date.now() + 5*60*1000; // 5 minutes
  uploadTokens.set(token, { storageKey, fullPath, expiresAt });
  return token;
}
function cleanupTokens(){
  const now = Date.now();
  for (const [k,v] of uploadTokens.entries()) if (!v || v.expiresAt < now) uploadTokens.delete(k);
}
setInterval(cleanupTokens, 60*1000).unref?.();

// Request a pre-signed upload (simulated)
// body: { fileName, mimeType, size }
app.post('/api/admin/images/request-upload', (req,res)=>{
  try {
    const { fileName, mimeType, size } = req.body || {};
    if (!fileName || !mimeType || !Number.isFinite(Number(size))) return res.status(400).json({ error: 'Missing fields' });
    const base = sanitizeFilename(String(fileName));
    const ext = path.extname(base) || safeExtByMime(mimeType);
    const uuid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    const storageKey = `uploads/originals/${uuid}${ext}`;
    const token = newUploadTokenFor(storageKey);
  // Return path under /api so client can prefix with getApiBase()
  return res.json({ storageKey, uploadUrl: `/api/admin/images/upload/${token}`, headers: { 'Content-Type': String(mimeType) } });
  } catch (e){
    return res.status(500).json({ error: e?.message || String(e) });
  }
});

// Binary upload receiver for signed token
const rawBody = express.raw({ type: '*/*', limit: '20mb' });
app.put('/api/admin/images/upload/:token', rawBody, (req,res)=>{
  try {
    const token = req.params.token;
    const rec = uploadTokens.get(token);
    if (!rec) return res.status(404).json({ error: 'Invalid or expired token' });
    if (!req.body || !(req.body instanceof Buffer) || !req.body.length) return res.status(400).json({ error: 'Empty body' });
    fs.mkdirSync(path.dirname(rec.fullPath), { recursive: true });
    fs.writeFileSync(rec.fullPath, req.body);
    uploadTokens.delete(token);
    return res.status(200).json({ ok: true });
  } catch (e){
    return res.status(500).json({ error: e?.message || String(e) });
  }
});

// Finalize upload => create ImageAsset record and trigger async processing (simulated)
// body: { storageKey, fileName, mimeType, size }
app.post('/api/admin/images/finalize-upload', (req,res)=>{
  try {
    const { storageKey, fileName, mimeType, size } = req.body || {};
    if (!storageKey || typeof storageKey !== 'string') return res.status(400).json({ error: 'storageKey required' });
    const rel = `/${storageKey.replace(/^\/+/, '')}`; // '/uploads/originals/xxx.ext'
    const full = path.join(UPLOADS_DIR, storageKey.replace(/^uploads\//,''));
    if (!fs.existsSync(full)) return res.status(400).json({ error: 'File not found for storageKey' });
    const db = readImagesDb();
    const id = nextImageId(db);
    const asset = {
      id,
      status: 'processing',
      altText: null,
      fileName: String(fileName||path.basename(full)),
      mimeType: mimeType || null,
      size: Number(size)||null,
      variants: { original: `/content-api${rel}` },
      createdAt: new Date().toISOString(),
    };
    db.images = [asset, ...(Array.isArray(db.images)?db.images:[])];
    writeImagesDb(db);
    // Simulate async processing by flipping to completed shortly after
    setTimeout(()=>{
      try {
        const cur = readImagesDb();
        const i = cur.images.findIndex(x=>String(x.id)===String(id));
        if (i>=0) { cur.images[i].status = 'completed'; writeImagesDb(cur); }
      } catch {}
    }, 300);
    return res.status(202).json({ image: asset });
  } catch (e){
    return res.status(500).json({ error: e?.message || String(e) });
  }
});

// Import from remote URL
// body: { url, fileName? }
app.post('/api/admin/images/import', async (req,res)=>{
  try {
    const { url, fileName } = req.body || {};
    if (!url || !/^https?:\/\//i.test(String(url))) return res.status(400).json({ error: 'Invalid url' });
    const resp = await fetch(url);
    if (!resp.ok) return res.status(400).json({ error: 'Failed to download' });
    const ctype = resp.headers.get('content-type') || '';
    if (!/^image\//i.test(ctype)) return res.status(400).json({ error: 'URL is not an image' });
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length > 15*1024*1024) return res.status(413).json({ error: 'File too large' });
    const ext = path.extname(String(fileName||'')) || safeExtByMime(ctype);
    const uuid = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    const storageKey = `uploads/originals/${uuid}${ext}`;
    const full = path.join(UPLOADS_DIR, storageKey.replace(/^uploads\//,''));
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, buf);
    const db = readImagesDb();
    const id = nextImageId(db);
    const asset = {
      id,
      status: 'completed',
      altText: null,
      fileName: String(fileName || path.basename(new URL(url).pathname) || `image_${id}${ext}`),
      mimeType: ctype,
      size: buf.length,
      variants: { original: `/content-api/${storageKey}` },
      createdAt: new Date().toISOString(),
    };
    db.images = [asset, ...(Array.isArray(db.images)?db.images:[])];
    writeImagesDb(db);
    return res.json({ image: asset });
  } catch (e){
    return res.status(500).json({ error: e?.message || String(e) });
  }
});

// List / Delete image assets
app.get('/api/admin/images', (_req,res)=>{
  const db = readImagesDb();
  return res.json({ images: Array.isArray(db.images) ? db.images : [] });
});
app.delete('/api/admin/images/:id', (req,res)=>{
  try {
    const id = String(req.params.id||'');
    const db = readImagesDb();
    const idx = db.images.findIndex(x=>String(x.id)===id);
    if (idx<0) return res.status(404).json({ error: 'Not found' });
    const asset = db.images[idx];
    // Try to delete original file
    const orig = asset?.variants?.original;
    if (typeof orig === 'string'){
      const rel = orig.replace(/^\/?content-api\//,'');
      const p = rel.startsWith('uploads/') ? rel.replace(/^uploads\//,'') : (orig.startsWith('/uploads/') ? orig.replace(/^\/?uploads\//,'') : null);
      const full = p ? path.join(UPLOADS_DIR, p) : null;
      try { if (fs.existsSync(full)) fs.unlinkSync(full); } catch {}
    }
    db.images.splice(idx,1);
    writeImagesDb(db);
    return res.json({ ok: true });
  } catch (e){
    return res.status(500).json({ error: e?.message || String(e) });
  }
});

// Upload base64 data URL
app.post('/api/upload-image', async (req,res)=>{
  try {
    const { folder, name, dataUrl } = req.body || {};
    const sub = ensureImagesSubdir(folder||'');
    if (!sub) return res.status(400).json({ error: 'Invalid folder' });
    if (typeof dataUrl !== 'string' || !/^data:image\//i.test(dataUrl)) return res.status(400).json({ error: 'Invalid dataUrl' });
    // dataUrl format: data:image/png;base64,XXXXX
    const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/i);
    if (!m) return res.status(400).json({ error: 'Invalid dataUrl format' });
    const mime = m[1];
    const b64 = m[2];
    const buf = Buffer.from(b64, 'base64');
    // Basic size limit ~10MB
    if (buf.length > 10 * 1024 * 1024) return res.status(413).json({ error: 'File too large (>10MB)' });
    const ext = path.extname(String(name||'')) || inferExtFromMime(mime) || '.png';
    const fname = sanitizeFilename((name||'').replace(/\.[^.]+$/, '')) + (ext.startsWith('.')? ext : ('.'+ext));
    const full = path.join(sub.dir, fname);
    fs.writeFileSync(full, buf);
    const rel = `/images/${sub.safe}/${fname}`;
    return res.json({ ok: true, path: rel, name: fname });
  } catch (e) {
    console.error('[upload-image] error', e?.message || e);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// Fetch remote image by URL and save
app.post('/api/fetch-image', async (req,res)=>{
  try {
    const { folder, url, name } = req.body || {};
    const sub = ensureImagesSubdir(folder||'');
    if (!sub) return res.status(400).json({ error: 'Invalid folder' });
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'Invalid url' });
    const resp = await fetch(url).catch((e)=>{ throw new Error('Fetch failed: ' + (e?.message||e)); });
    if (!resp || !resp.ok) return res.status(400).json({ error: 'Failed to download' });
    const ctype = resp.headers.get('content-type') || '';
    if (!/^image\//i.test(ctype)) return res.status(400).json({ error: 'URL is not an image' });
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length > 10 * 1024 * 1024) return res.status(413).json({ error: 'File too large (>10MB)' });
    const raw = sanitizeFilename(name || getFilenameFromUrl(url) || `img_${Date.now()}`);
    const ext = path.extname(raw) || inferExtFromMime(ctype) || '.png';
    const fname = (raw.replace(/\.[^.]+$/,'') || `img_${Date.now()}`) + (ext.startsWith('.')? ext : ('.'+ext));
    const full = path.join(sub.dir, fname);
    fs.writeFileSync(full, buf);
    const rel = `/images/${sub.safe}/${fname}`;
    return res.json({ ok: true, path: rel, name: fname });
  } catch (e) {
    console.error('[fetch-image] error', e?.message || e);
    return res.status(500).json({ error: 'Fetch failed' });
  }
});

// List media under public/images
app.get('/api/media-list', (_req, res) => {
  try {
    const folders = [];
    if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
    const entries = fs.readdirSync(IMAGES_DIR, { withFileTypes: true });
    // Collect root-level files as a special folder '_root'
    const rootFiles = [];
    for (const ent of entries) {
      if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (!['.png','.jpg','.jpeg','.gif','.webp','.svg'].includes(ext)) continue;
        const full = path.join(IMAGES_DIR, ent.name);
        let stat = null; try { stat = fs.statSync(full); } catch {}
        rootFiles.push({ name: ent.name, path: `/images/${ent.name}`, size: stat?.size||0, mtime: stat?.mtimeMs||0 });
      }
    }
    if (rootFiles.length) folders.push({ name: '_root', files: rootFiles });
    // Collect subfolders
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const folder = ent.name;
      const sub = path.join(IMAGES_DIR, folder);
      const files = [];
      const fileEntries = fs.readdirSync(sub, { withFileTypes: true });
      for (const f of fileEntries) {
        if (!f.isFile()) continue;
        const ext = path.extname(f.name).toLowerCase();
        if (!['.png','.jpg','.jpeg','.gif','.webp','.svg'].includes(ext)) continue;
        const full = path.join(sub, f.name);
        let stat = null; try { stat = fs.statSync(full); } catch {}
        files.push({ name: f.name, path: `/images/${folder}/${f.name}`, size: stat?.size||0, mtime: stat?.mtimeMs||0 });
      }
      folders.push({ name: folder, files });
    }
    return res.json({ ok: true, folders });
  } catch (e) {
    console.error('[media-list] error', e?.message||e);
    return res.status(500).json({ error: 'List failed' });
  }
});

// Delete an image by folder & name
app.post('/api/delete-image', (req, res) => {
  try {
    const { folder, name } = req.body || {};
    const base = sanitizeFilename(name||'');
    if (!base) return res.status(400).json({ error: 'Invalid filename' });
    let full = '';
    if (String(folder) === '_root') {
      full = path.join(IMAGES_DIR, base);
      if (!full.startsWith(IMAGES_DIR)) return res.status(400).json({ error: 'Invalid path' });
    } else {
      const sub = ensureImagesSubdir(folder||'');
      if (!sub) return res.status(400).json({ error: 'Invalid folder' });
      full = path.join(sub.dir, base);
      if (!full.startsWith(sub.dir)) return res.status(400).json({ error: 'Invalid path' });
    }
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Not found' });
    fs.unlinkSync(full);
    return res.json({ ok: true });
  } catch (e) {
    console.error('[delete-image] error', e?.message||e);
    return res.status(500).json({ error: 'Delete failed' });
  }
});

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

// Metrics store
function readMetrics(){ try { return JSON.parse(fs.readFileSync(METRICS_FILE,'utf-8')); } catch { return { pageViews: 0 }; } }
function writeMetrics(m){ fs.writeFileSync(METRICS_FILE, JSON.stringify({ pageViews: Number(m.pageViews)||0 }, null, 2), 'utf-8'); }

// SMTP config store
function readSmtpCfg(){
  const baseDefaults = {
    host:'', port:465, secure:true, user:'', pass:'', fromEmail:'', toEmails:'',
    subjectTemplate:'New Quote from {{firstName}} {{lastName}} — {{serviceType}}',
    bodyTemplate:'<h2>New Quote Notification</h2>\n<p><strong>Name:</strong> {{firstName}} {{lastName}}</p>\n<p><strong>Email:</strong> {{email}}</p>\n<p><strong>Company:</strong> {{company}}</p>\n<p><strong>Service:</strong> {{serviceType}}</p>\n<p><strong>Timeline:</strong> {{timeline}}</p>\n<p><strong>Budget:</strong> {{budget}}</p>\n<p><strong>Submitted At:</strong> {{createdAt}}</p>\n<hr/>\n<p><strong>Project Description:</strong></p>\n<p style="white-space:pre-wrap">{{projectDescription}}</p>\n{{#if additionalInfo}}<hr/><p><strong>Additional Info:</strong></p><pre style="white-space:pre-wrap">{{additionalInfo}}</pre>{{/if}}',
    subjectTemplateFull:'New Quote (Full) from {{firstName}} {{lastName}} — {{serviceType}}',
    bodyTemplateFull:'<h2>New Quote (Full) Notification</h2>\n<p><strong>Name:</strong> {{firstName}} {{lastName}}</p>\n<p><strong>Email:</strong> {{email}}</p>\n{{#if phone}}<p><strong>Phone:</strong> {{phone}}</p>{{/if}}\n<p><strong>Company:</strong> {{company}}</p>\n{{#if department}}<p><strong>Department:</strong> {{department}}</p>{{/if}}\n<p><strong>Service:</strong> {{serviceType}}</p>\n{{#if timeline}}<p><strong>Timeline:</strong> {{timeline}}</p>{{/if}}\n{{#if budget}}<p><strong>Budget:</strong> {{budget}}</p>{{/if}}\n<p><strong>Submitted At:</strong> {{createdAt}}</p>\n<hr/>\n<p><strong>Project Description:</strong></p>\n<p style="white-space:pre-wrap">{{projectDescription}}</p>\n{{#if additionalInfo}}<hr/><p><strong>Additional Info:</strong></p><pre style="white-space:pre-wrap">{{additionalInfo}}</pre>{{/if}}',
    subjectTemplateProduct:'New Product Quote from {{firstName}} {{lastName}}',
    bodyTemplateProduct:'<h2>New Product Quote</h2>\n<p><strong>Name:</strong> {{firstName}} {{lastName}}</p>\n<p><strong>Email:</strong> {{email}}</p>\n<hr/>\n<p><strong>Product:</strong> {{projectDescription}}</p>\n{{#if catalogNumber}}<p><strong>Catalog #:</strong> {{catalogNumber}}</p>{{/if}}\n<p><strong>Submitted At:</strong> {{createdAt}}</p>'
  };
  try {
    const cfg = JSON.parse(fs.readFileSync(SMTP_FILE,'utf-8'));
    return Object.assign({}, baseDefaults, cfg);
  } catch {
    return baseDefaults;
  }
}
function writeSmtpCfg(cfg){ fs.writeFileSync(SMTP_FILE, JSON.stringify(cfg, null, 2), 'utf-8'); }

function hashPassword(pw) {
  return crypto.createHash('sha256').update(String(pw)).digest('hex');
}
function newToken() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}

// ===== Admin helpers (session-based auth) =====
function getSessionUserFromReq(req){
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    const sessions = readSessions();
    const session = sessions[token];
    return session || null;
  } catch { return null; }
}
function runCmd(cmd, args, { cwd, timeoutMs = 60_000, useShell = true } = {}){
  return new Promise((resolve) => {
    let output = '';
    let finished = false;
    try {
      const p = spawn(cmd, args, { cwd, shell: !!useShell });
      const timer = setTimeout(() => {
        try { p.kill('SIGKILL'); } catch {}
        output += `\n[timeout ${timeoutMs}ms]`;
      }, timeoutMs);
      p.stdout.on('data', d => { output += d.toString(); });
      p.stderr.on('data', d => { output += d.toString(); });
      p.on('error', (err) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        output += `\n[spawn error] ${err?.message || String(err)}`;
        resolve({ code: -1, output });
      });
      p.on('close', (code) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        resolve({ code: code ?? -1, output });
      });
    } catch (err) {
      output += `\n[spawn exception] ${err?.message || String(err)}`;
      resolve({ code: -1, output });
    }
  });
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
    const { host, port, secure, user, pass, fromEmail, toEmails, subjectTemplate, bodyTemplate, subjectTemplateFull, bodyTemplateFull, subjectTemplateProduct, bodyTemplateProduct } = req.body || {};
    const cfg = {
      host: typeof host === 'string' ? host : '',
      port: Number.isFinite(Number(port)) ? Number(port) : 465,
      secure: !!secure,
      user: typeof user === 'string' ? user : '',
      pass: typeof pass === 'string' ? pass : '',
      fromEmail: typeof fromEmail === 'string' ? fromEmail : '',
      toEmails: typeof toEmails === 'string' ? toEmails : '',
      subjectTemplate: typeof subjectTemplate === 'string' ? subjectTemplate : undefined,
      bodyTemplate: typeof bodyTemplate === 'string' ? bodyTemplate : undefined,
      subjectTemplateFull: typeof subjectTemplateFull === 'string' ? subjectTemplateFull : undefined,
      bodyTemplateFull: typeof bodyTemplateFull === 'string' ? bodyTemplateFull : undefined,
      subjectTemplateProduct: typeof subjectTemplateProduct === 'string' ? subjectTemplateProduct : undefined,
      bodyTemplateProduct: typeof bodyTemplateProduct === 'string' ? bodyTemplateProduct : undefined,
    };
    const merged = Object.assign(readSmtpCfg(), cfg);
    writeSmtpCfg(merged);
    return res.json({ ok: true });
  });

  // Metrics APIs (content mode only)
  app.get('/api/metrics', (_req,res)=>{
    return res.json(readMetrics());
  });
  // Increment page views (homepage hit)
  app.post('/api/metrics/hit', (_req,res)=>{
    const m = readMetrics();
    m.pageViews = (Number(m.pageViews)||0) + 1;
    writeMetrics(m);
    return res.json({ ok: true, pageViews: m.pageViews });
  });
  // Reset metrics (admin only)
  app.post('/api/metrics/reset', (req,res)=>{
    const user = getSessionUserFromReq(req);
    if (!user || user.role !== 'Admin') return res.status(403).json({ error: 'FORBIDDEN' });
    const m = { pageViews: 0 };
    writeMetrics(m);
    return res.json({ ok: true, pageViews: 0 });
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

// ===== Admin system ops =====
app.post('/api/admin/restart', async (req, res) => {
  try {
    const user = getSessionUserFromReq(req);
    if (!user || (user.role !== 'Admin' && user.role !== 'Owner')) return res.status(403).json({ error: 'FORBIDDEN' });
    // Per request: use Restart to trigger a frontend build instead of pm2 restart.
    // Cross-platform: run via shell to resolve npm on Windows/Linux.
    const projectRoot = path.resolve(__dirname, '..');
    const r = await runCmd(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { cwd: projectRoot, timeoutMs: 10 * 60_000, useShell: true });
    const ok = r.code === 0;
    return res.status(ok ? 200 : 500).json({ ok, log: r.output });
  } catch (e) {
    return res.status(500).json({ ok:false, error: e?.message || String(e) });
  }
});

// ===== Users admin APIs =====
// All user management endpoints require Admin session
// List users (without password hashes)
app.get('/api/users', (req,res)=>{
  const me = getSessionUserFromReq(req);
  if (!me || (me.role !== 'Admin' && me.role !== 'Owner')) return res.status(403).json({ error: 'FORBIDDEN' });
  const users = readUsers()
    .filter(u => u.role === 'Admin')
    .map(u => ({ email: u.email, name: u.name, role: u.role, address: u.address }));
  return res.json({ users });
});
// Upsert user fields; body: { email, name?, role? (ignored; enforced Admin), password?, address? }
app.post('/api/users/upsert', (req,res)=>{
  const me = getSessionUserFromReq(req);
  if (!me || (me.role !== 'Admin' && me.role !== 'Owner')) return res.status(403).json({ error: 'FORBIDDEN' });
  const { email, name, role, password, address } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  const users = readUsers();
  const i = users.findIndex(u => u.email.toLowerCase() === String(email).toLowerCase());
  const enforcedRole = 'Admin';
  if (i >= 0) {
    if (name != null) users[i].name = name;
    users[i].role = enforcedRole; // enforce Admin only
    if (address != null) users[i].address = address;
    if (password) users[i].password = hashPassword(password);
  } else {
    users.push({ email, name: name || email, role: enforcedRole, address: address || '', password: password ? hashPassword(password) : hashPassword('123456') });
  }
  writeUsers(users);
  return res.json({ ok: true });
});
// Delete user
app.delete('/api/users/:email', (req,res)=>{
  const me = getSessionUserFromReq(req);
  if (!me || (me.role !== 'Admin' && me.role !== 'Owner')) return res.status(403).json({ error: 'FORBIDDEN' });
  const email = decodeURIComponent(req.params.email||'');
  const users = readUsers().filter(u => u.email.toLowerCase() !== email.toLowerCase());
  writeUsers(users);
  return res.json({ ok: true });
});

// ===== Quotes APIs =====
app.get('/api/quotes', (_req,res)=>{
  return res.json({ quotes: readQuotes() });
});
// basic template renderer: supports {{key}} and {{#if key}}...{{/if}}
function renderTemplate(tpl, data){
  if (typeof tpl !== 'string') return '';
  let out = tpl.replace(/\{\{\#if ([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, inner) => {
    const v = data && data[String(key).trim()];
    return v ? inner : '';
  });
  out = out.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
    const k = String(key).trim();
    const v = data && data[k];
    return (v == null) ? '' : String(v);
  });
  return out;
}
async function trySendQuoteEmail(quote){
  try {
    const cfg = readSmtpCfg();
    if (!cfg || !cfg.host || !cfg.user || !cfg.pass || !cfg.fromEmail || !cfg.toEmails) return;
    if (!nodemailer) { console.warn('[SMTP] nodemailer not installed'); return; }
    const transporter = nodemailer.createTransport({ host: cfg.host, port: Number(cfg.port)||465, secure: !!cfg.secure, auth: { user: cfg.user, pass: cfg.pass } });
    const toList = String(cfg.toEmails).split(',').map(s=>s.trim()).filter(Boolean);
    // derive type: product vs full
    const isProduct = String(quote?.serviceType||'').toLowerCase().includes('product');
    // parse additionalInfo for catalogNumber if JSON
    let catalogNumber = '';
    try {
      const ai = quote?.additionalInfo;
      if (typeof ai === 'string') { const parsed = JSON.parse(ai); if (parsed && typeof parsed === 'object' && parsed.catalogNumber) catalogNumber = String(parsed.catalogNumber); }
      else if (ai && typeof ai === 'object' && ai.catalogNumber) catalogNumber = String(ai.catalogNumber);
    } catch {}
    const data = Object.assign({}, quote, { catalogNumber });
    const subject = renderTemplate((isProduct ? (cfg.subjectTemplateProduct || cfg.subjectTemplate) : (cfg.subjectTemplateFull || cfg.subjectTemplate)) || 'New Quote {{id}}', data);
    const html = renderTemplate((isProduct ? (cfg.bodyTemplateProduct || cfg.bodyTemplate) : (cfg.bodyTemplateFull || cfg.bodyTemplate)) || JSON.stringify(data, null, 2), data);
    await transporter.sendMail({ from: cfg.fromEmail, to: toList, subject, html });
    console.log('[SMTP] Quote notification sent to', toList.join(', '));
  } catch (e) {
    console.warn('[SMTP] Failed to send quote email:', e?.message || e);
  }
}
app.post('/api/quotes', async (req,res)=>{
  const input = req.body || {};
  const q = Object.assign({}, input, { id: `q_${Date.now()}`, createdAt: new Date().toISOString(), read: false });
  const list = readQuotes();
  writeQuotes([q, ...list]);
  // fire-and-forget email (no await blocking response)
  trySendQuoteEmail(q);
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

// SMTP test endpoint: send a test mail with dummy data to verify config
app.post('/api/smtp-test', async (req,res)=>{
  try {
    const { type } = req.body || {};
    const isProduct = String(type||'').toLowerCase() === 'product';
    const sample = isProduct
      ? { id: 'q_test_prod', firstName:'Test', lastName:'User', email:'test@example.com', company:'BioArk', serviceType:'Product Quote', projectDescription:'BADM3362 – GN8K DNA Marker (500 μL)', additionalInfo: JSON.stringify({ catalogNumber: 'BADM3362' }), createdAt: new Date().toISOString() }
      : { id: 'q_test_full', firstName:'Test', lastName:'User', email:'test@example.com', phone:'123-456', company:'ACME', department:'R&D', serviceType:'Genome Editing', projectDescription:'CRISPR KO in HEK293', timeline:'1-2 months', budget:'$10k-$20k', createdAt: new Date().toISOString() };
    await trySendQuoteEmail(sample);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e?.message || String(e) });
  }
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
