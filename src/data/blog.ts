export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category?: string;
  coverImage?: string;
  readTime?: number;
  views?: number;
  tags?: string[];
}

// Legacy mock list disabled after migration to server/data/blog.json source.
// Keeping this array to avoid breaking old imports in compiled bundles.
export const mockBlogPosts: BlogPost[] = [];
