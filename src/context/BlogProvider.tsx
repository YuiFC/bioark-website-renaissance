import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockBlogPosts, BlogPost } from '../data/blog';

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: BlogPost) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bioark_blog_posts') || '[]') as BlogPost[];
      if (saved.length) {
        setPosts([...saved, ...mockBlogPosts]);
      }
    } catch {}
  }, []);

  const addPost = (post: BlogPost) => {
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  return (
    <BlogContext.Provider value={{ posts, addPost }}>
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

