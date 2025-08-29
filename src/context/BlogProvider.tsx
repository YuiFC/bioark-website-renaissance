import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockBlogPosts, BlogPost } from '../data/blog';

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
    try {
      // Invalidate stale overrides when data version changes
      const currentVersion = localStorage.getItem('bioark_blog_data_version');
      if (currentVersion !== DATA_VERSION) {
        try {
          const overrides = JSON.parse(localStorage.getItem('bioark_blog_overrides') || '{}') as Record<number, Partial<BlogPost>>;
          let changed = false;
          for (const idStr of Object.keys(overrides)) {
            const id = Number(idStr);
            if (RESET_BUILTIN_IDS.has(id)) {
              delete overrides[id];
              changed = true;
            }
          }
          if (changed) {
            localStorage.setItem('bioark_blog_overrides', JSON.stringify(overrides));
          }
        } catch {}
        localStorage.setItem('bioark_blog_data_version', DATA_VERSION);
      }

      const saved = JSON.parse(localStorage.getItem('bioark_blog_posts') || '[]') as BlogPost[];
      const hidden = JSON.parse(localStorage.getItem('bioark_blog_hidden') || '[]') as number[];
      const overrides = JSON.parse(localStorage.getItem('bioark_blog_overrides') || '{}') as Record<number, Partial<BlogPost>>;
      let base = mockBlogPosts.map(p => ({ ...p, ...(overrides[p.id] || {}) }));
      base = base.filter(p => !hidden.includes(p.id));
      const all = [...base, ...saved];
      setPosts(all);
    } catch {}
  }, []);

  const addPost = (post: BlogPost) => {
    setPosts(prev => {
      const next = [post, ...prev];
      try {
        const saved = JSON.parse(localStorage.getItem('bioark_blog_posts') || '[]') as BlogPost[];
        localStorage.setItem('bioark_blog_posts', JSON.stringify([post, ...saved]));
      } catch {}
      return next;
    });
  };

  const updatePost = (id: number, patch: Partial<BlogPost>) => {
    setPosts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...patch } : p));
      try {
        const saved = JSON.parse(localStorage.getItem('bioark_blog_posts') || '[]') as BlogPost[];
        const isSaved = saved.some(p => p.id === id);
        if (isSaved) {
          const updatedSaved = saved.map(p => (p.id === id ? { ...p, ...patch } : p));
          localStorage.setItem('bioark_blog_posts', JSON.stringify(updatedSaved));
        } else {
          const overrides = JSON.parse(localStorage.getItem('bioark_blog_overrides') || '{}');
          overrides[id] = { ...(overrides[id] || {}), ...patch };
          localStorage.setItem('bioark_blog_overrides', JSON.stringify(overrides));
        }
      } catch {}
      return next;
    });
  };

  const deletePost = (id: number) => {
    setPosts(prev => {
      const next = prev.filter(p => p.id !== id);
      try {
        const saved = JSON.parse(localStorage.getItem('bioark_blog_posts') || '[]') as BlogPost[];
        const updatedSaved = saved.filter(p => p.id !== id);
        localStorage.setItem('bioark_blog_posts', JSON.stringify(updatedSaved));
        if (!saved.some(p => p.id === id)) {
          const hidden = JSON.parse(localStorage.getItem('bioark_blog_hidden') || '[]') as number[];
          if (!hidden.includes(id)) {
            localStorage.setItem('bioark_blog_hidden', JSON.stringify([...hidden, id]));
          }
        }
      } catch {}
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

