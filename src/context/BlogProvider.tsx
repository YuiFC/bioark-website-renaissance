import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockBlogPosts, BlogPost } from '../data/blog';
import { fetchJson } from '@/lib/api';

// Bump this when built-in mock posts' content changes and we want to refresh local overrides
const DATA_VERSION = '2025-08-29-1';
const RESET_BUILTIN_IDS = new Set<number>([1, 2, 3, 4]);
const CACHE_KEY = 'bioark_blog_cache_v1';

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: BlogPost) => void;
  updatePost: (id: number, patch: Partial<BlogPost>) => void;
  deletePost: (id: number) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);

  useEffect(() => {
    (async () => {
      try {
    // 1) Load from server (prefer public endpoint so new posts appear across browsers)
    let server: any = null;
    try { server = await fetchJson<any>('/public/blog'); } catch {}
    if (!server) server = await fetchJson<any>('/blog');
        const sOverrides: Record<number, Partial<BlogPost>> = server.overrides || {};
        const sHidden: number[] = server.hidden || [];
        const sSaved: BlogPost[] = server.posts || [];

        // 2) Load local cache (if any)
        let lOverrides: Record<number, Partial<BlogPost>> = {};
        let lHidden: number[] = [];
        let lSaved: BlogPost[] = [];
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (raw) {
            const cache = JSON.parse(raw || '{}');
            lOverrides = cache.overrides || {};
            lHidden = cache.hidden || [];
            lSaved = cache.posts || [];
          }
        } catch {}

        // 3) Merge (local wins)
        const mergedOverrides: Record<number, Partial<BlogPost>> = { ...sOverrides, ...lOverrides };
        const mergedHidden: number[] = Array.from(new Set([...(sHidden||[]), ...(lHidden||[])]));
        const byId = (arr: BlogPost[]) => {
          const m = new Map<number, BlogPost>();
          for (const p of arr) m.set(p.id, p);
          return m;
        };
        const savedMap = byId(sSaved);
        for (const p of lSaved) savedMap.set(p.id, p);
        const mergedSaved = Array.from(savedMap.values());

        // 4) Build display list
        let base = mockBlogPosts.map(p => ({ ...p, ...(mergedOverrides[p.id] || {}) }));
        base = base.filter(p => !mergedHidden.includes(p.id));
        // Merge base + saved, but avoid duplicate IDs (can happen after /blog-sync-source overwrites mockBlogPosts including custom posts)
        const seen = new Set<number>();
        const all: BlogPost[] = [];
        for (const p of [...base, ...mergedSaved]) {
          if (!seen.has(p.id)) { seen.add(p.id); all.push(p); }
        }
        // Sort by date desc for stable ordering
        all.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(all);

        // 5) Persist merged both locally and back to server (best-effort)
        const payload = { version: DATA_VERSION, posts: mergedSaved, hidden: mergedHidden, overrides: mergedOverrides };
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch {}
  try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
      } catch {
        // Fallback to local cache, then mock
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (raw) {
            const data = JSON.parse(raw || '{}');
            const overrides: Record<number, Partial<BlogPost>> = data.overrides || {};
            const hidden: number[] = data.hidden || [];
            const saved: BlogPost[] = data.posts || [];
            let base = mockBlogPosts.map(p => ({ ...p, ...(overrides[p.id] || {}) }));
            base = base.filter(p => !hidden.includes(p.id));
            const seenFb = new Set<number>();
            const all = [...base, ...saved].filter(p=>{ if(seenFb.has(p.id)) return false; seenFb.add(p.id); return true; });
            all.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
            setPosts(all);
            return;
          }
        } catch {}
        setPosts(mockBlogPosts);
      }
    })();
    const handler = async () => {
      try {
        let server: any = null;
        try { server = await fetchJson<any>('/public/blog'); } catch {}
        if (!server) return; // do not fallback here to avoid auth requirement in other tabs
        const sOverrides: Record<number, Partial<BlogPost>> = server.overrides || {};
        const sHidden: number[] = server.hidden || [];
        const sSaved: BlogPost[] = server.posts || [];
        let base = mockBlogPosts.map(p => ({ ...p, ...(sOverrides[p.id] || {}) }));
        base = base.filter(p => !sHidden.includes(p.id));
        const seen = new Set<number>();
        const all: BlogPost[] = [];
        for (const p of [...base, ...sSaved]) { if (!seen.has(p.id)) { seen.add(p.id); all.push(p); } }
        all.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(all);
      } catch {}
    };
    window.addEventListener('bioark:blog-changed', handler);
    return () => { window.removeEventListener('bioark:blog-changed', handler); };
  }, []);

  const addPost = (post: BlogPost) => {
    setPosts(prev => {
      // Normalize slug once here to avoid slightly different duplicates
      const normSlug = post.slug.toLowerCase();
      post = { ...post, slug: normSlug };
      // If a duplicate (same slug different id) already exists, adjust slug
      const slugSet = new Set(prev.map(p=>p.slug));
      if (slugSet.has(normSlug) && !prev.some(p=>p.id===post.id && p.slug===normSlug)) {
        let base = normSlug.replace(/-\d+$/,'');
        let c = 2;
        let nextSlug = `${base}-${c}`;
        while (slugSet.has(nextSlug)) { c++; nextSlug = `${base}-${c}`; }
        post.slug = nextSlug;
      }
      // Remove any pre-existing item with same id to prevent duplicate rendering side-effects
      const filteredPrev = prev.filter(p=>p.id !== post.id);
      // If id already exists, treat as update instead of duplicating
      if (prev.some(p=>p.id === post.id)) {
        const updated = filteredPrev.concat([post]).sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
        (async ()=>{ 
          const payload = { version: DATA_VERSION, posts: updated.filter(p=>!mockBlogPosts.some(b=>b.id===p.id)), hidden: [], overrides: {} };
          try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch {}
          try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
          try { await fetchJson('/blog-sync-source', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ posts: updated }) }); } catch {}
          try { window.dispatchEvent(new Event('bioark:blog-changed')); } catch {}
        })();
        return updated;
      }
      const next = [post, ...filteredPrev].reduce((acc, cur)=>{
        if (!acc.some(p=>p.id===cur.id)) acc.push(cur); // keep first occurrence
        return acc;
      }, [] as BlogPost[]);
      // Persist full blog state
      (async ()=>{ 
        const payload = { version: DATA_VERSION, posts: next.filter(p=>!mockBlogPosts.some(b=>b.id===p.id)), hidden: [], overrides: {} };
        // Always cache locally so refresh retains changes even if server is down
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch {}
        // Best-effort push to server
  try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
  // Also best-effort write to source file for persistence in repo
  try { await fetchJson('/blog-sync-source', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ posts: next }) }); } catch {}
    try { window.dispatchEvent(new Event('bioark:blog-changed')); } catch {}
      })();
      // Final defensive dedupe + sort
      const seenFinal = new Set<number>();
      const deduped = next.filter(p=>{ if(seenFinal.has(p.id)) return false; seenFinal.add(p.id); return true; });
      deduped.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
      return deduped;
    });
  };

  const updatePost = (id: number, patch: Partial<BlogPost>) => {
    setPosts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...patch } : p));
      (async ()=>{
        const builtinIds = new Set(mockBlogPosts.map(p=>p.id));
        const saved = next.filter(p => !builtinIds.has(p.id));
        const overrides: Record<number, Partial<BlogPost>> = {};
        for (const p of next) {
          if (builtinIds.has(p.id)) {
            const base = mockBlogPosts.find(b=>b.id===p.id)!;
            const diff: any = {};
            for (const k of Object.keys(p)) { if ((p as any)[k] !== (base as any)[k]) diff[k] = (p as any)[k]; }
            if (Object.keys(diff).length) overrides[p.id] = diff;
          }
        }
        const payload = { version: DATA_VERSION, posts: saved, hidden: [], overrides };
        // Always cache locally
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch {}
        // Best-effort push
  try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
  // Also best-effort write to source file
  try { await fetchJson('/blog-sync-source', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ posts: next }) }); } catch {}
    try { window.dispatchEvent(new Event('bioark:blog-changed')); } catch {}
      })();
      return next;
    });
  };

  const deletePost = (id: number) => {
    setPosts(prev => {
      const next = prev.filter(p => p.id !== id);
      (async ()=>{
        const builtinIds = new Set(mockBlogPosts.map(p=>p.id));
        const saved = next.filter(p => !builtinIds.has(p.id));
        const overrides: Record<number, Partial<BlogPost>> = {};
        for (const p of next) {
          if (builtinIds.has(p.id)) {
            const base = mockBlogPosts.find(b=>b.id===p.id)!;
            const diff: any = {};
            for (const k of Object.keys(p)) { if ((p as any)[k] !== (base as any)[k]) diff[k] = (p as any)[k]; }
            if (Object.keys(diff).length) overrides[p.id] = diff;
          }
        }
        const payload = { version: DATA_VERSION, posts: saved, hidden: [], overrides };
        // For deletion of builtin, we simulate hide by exclusion in next
        // Always cache locally
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(payload)); } catch {}
        // Best-effort push
  try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
  // Also best-effort write to source file
  try { await fetchJson('/blog-sync-source', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ posts: next }) }); } catch {}
    try { window.dispatchEvent(new Event('bioark:blog-changed')); } catch {}
      })();
      return next;
    });
  };

  return (
    <BlogContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

