import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockBlogPosts, BlogPost } from '../data/blog';
import { fetchJson } from '@/lib/api';

// Bump this when built-in mock posts' content changes and we want to refresh local overrides
const DATA_VERSION = '2025-08-29-1';
const RESET_BUILTIN_IDS = new Set<number>([1, 2, 3, 4]);

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
        const data = await fetchJson<any>('/api/blog');
        const overrides: Record<number, Partial<BlogPost>> = data.overrides || {};
        const hidden: number[] = data.hidden || [];
        const saved: BlogPost[] = data.posts || [];
        let base = mockBlogPosts.map(p => ({ ...p, ...(overrides[p.id] || {}) }));
        base = base.filter(p => !hidden.includes(p.id));
        const all = [...base, ...saved];
        setPosts(all);
      } catch {
        setPosts(mockBlogPosts);
      }
    })();
  }, []);

  const addPost = (post: BlogPost) => {
    setPosts(prev => {
      const next = [post, ...prev];
      // Persist full blog state
      (async ()=>{ try { await fetchJson('/api/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ version: DATA_VERSION, posts: next.filter(p=>!mockBlogPosts.some(b=>b.id===p.id)), hidden: [], overrides: {} }) }); } catch {} })();
      return next;
    });
  };

  const updatePost = (id: number, patch: Partial<BlogPost>) => {
    setPosts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...patch } : p));
      (async ()=>{
        try {
          const builtinIds = new Set(mockBlogPosts.map(p=>p.id));
          const saved = next.filter(p => !builtinIds.has(p.id));
          const overrides: Record<number, Partial<BlogPost>> = {};
          for (const p of next) { if (builtinIds.has(p.id)) { const base = mockBlogPosts.find(b=>b.id===p.id)!; const diff: any = {}; for (const k of Object.keys(p)) { if ((p as any)[k] !== (base as any)[k]) diff[k] = (p as any)[k]; } if (Object.keys(diff).length) overrides[p.id] = diff; } }
          await fetchJson('/api/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ version: DATA_VERSION, posts: saved, hidden: [], overrides }) });
        } catch {}
      })();
      return next;
    });
  };

  const deletePost = (id: number) => {
    setPosts(prev => {
      const next = prev.filter(p => p.id !== id);
      (async ()=>{
        try {
          const builtinIds = new Set(mockBlogPosts.map(p=>p.id));
          const saved = next.filter(p => !builtinIds.has(p.id));
          const overrides: Record<number, Partial<BlogPost>> = {};
          for (const p of next) { if (builtinIds.has(p.id)) { const base = mockBlogPosts.find(b=>b.id===p.id)!; const diff: any = {}; for (const k of Object.keys(p)) { if ((p as any)[k] !== (base as any)[k]) diff[k] = (p as any)[k]; } if (Object.keys(diff).length) overrides[p.id] = diff; } }
          // For deletion of builtin, we simulate hide by not including it in next; we don't track hidden list here
          await fetchJson('/api/blog', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ version: DATA_VERSION, posts: saved, hidden: [], overrides }) });
        } catch {}
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

