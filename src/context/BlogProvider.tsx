import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BlogPost } from '../data/blog';
import { fetchJson } from '@/lib/api';

// Bump this when built-in mock posts' content changes and we want to refresh local overrides
const DATA_VERSION = '2025-08-29-1';
const CACHE_KEY = 'bioark_blog_cache_v1';

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: BlogPost) => void;
  updatePost: (id: number, patch: Partial<BlogPost>) => void;
  deletePost: (id: number) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [version, setVersion] = useState<string>(DATA_VERSION);

  useEffect(() => {
    (async () => {
      try {
        let server: any = null;
        try { server = await fetchJson<any>('/public/blog'); } catch {}
        if (!server) server = await fetchJson<any>('/blog');
        const list: BlogPost[] = Array.isArray(server?.posts) ? server.posts : [];
        const v: string = typeof server?.version === 'string' ? server.version : DATA_VERSION;
        const sorted = list.slice().sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
        setVersion(v);
        setPosts(sorted);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version: v, posts: sorted })); } catch {}
      } catch {
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          if (raw) {
            const data = JSON.parse(raw || '{}');
            const list: BlogPost[] = Array.isArray(data?.posts) ? data.posts : [];
            const v: string = typeof data?.version === 'string' ? data.version : DATA_VERSION;
            const sorted = list.slice().sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
            setVersion(v);
            setPosts(sorted);
            return;
          }
        } catch {}
        setPosts([]);
      }
    })();
    const handler = async () => {
      try {
        let server: any = null;
        try { server = await fetchJson<any>('/public/blog'); } catch {}
        if (!server) return;
        const list: BlogPost[] = Array.isArray(server?.posts) ? server.posts : [];
        const v: string = typeof server?.version === 'string' ? server.version : version;
        const sorted = list.slice().sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
        setVersion(v);
        setPosts(sorted);
      } catch {}
    };
    window.addEventListener('bioark:blog-changed', handler);
    return () => { window.removeEventListener('bioark:blog-changed', handler); };
  }, [version]);

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
      const filteredPrev = prev.filter(p=>p.id !== post.id);
      const next = [post, ...filteredPrev];
      const seenFinal = new Set<number>();
      const deduped = next.filter(p=>{ if(seenFinal.has(p.id)) return false; seenFinal.add(p.id); return true; });
      deduped.sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
      (async ()=>{
        const payload = { version, posts: deduped, hidden: [], overrides: {} };
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version, posts: deduped })); } catch {}
        try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
        try { window.dispatchEvent(new Event('bioark:blog-changed')); } catch {}
      })();
      return deduped;
    });
  };

  const updatePost = (id: number, patch: Partial<BlogPost>) => {
    setPosts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...patch } : p));
      const sorted = next.slice().sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
      (async ()=>{
        const payload = { version, posts: sorted, hidden: [], overrides: {} };
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version, posts: sorted })); } catch {}
        try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
        try { window.dispatchEvent(new Event('bioark:blog-changed')); } catch {}
      })();
      return sorted;
    });
  };

  const deletePost = (id: number) => {
    setPosts(prev => {
      const next = prev.filter(p => p.id !== id);
      const sorted = next.slice().sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
      (async ()=>{
        const payload = { version, posts: sorted, hidden: [], overrides: {} };
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version, posts: sorted })); } catch {}
        try { await fetchJson('/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) }); } catch {}
        try { window.dispatchEvent(new Event('bioark:blog-changed')); } catch {}
      })();
      return sorted;
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

