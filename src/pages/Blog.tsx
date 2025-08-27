import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useBlog } from '../context/BlogProvider';
import { Button } from '../components/ui/button';
import { Search, Clock, Eye } from 'lucide-react';

const Blog = () => {
  const { posts } = useBlog();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(6);

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [posts, query]);
  const visible = filtered.slice(0, limit);

  return (
    <Layout>
      <section className="py-16 bioark-hero-gradient border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="mx-auto text-3xl md:text-4xl lg:text-5xl font-bold text-foreground max-w-4xl">
                Explore insights on gene editing, delivery technologies, and BioArk news.
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search blog posts..."
                  className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <Button asChild className="shrink-0 h-9 px-4">
                <Link to="/blog/new">Create Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {visible.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">No matching posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visible.map(post => (
              <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover" />
                )}
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl mt-1">
                    <Link to={`/blog/${post.slug}`} className="hover:underline" aria-label={`${post.title} - ${post.excerpt}`} title={post.excerpt}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 pt-1">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {post.readTime && (
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime} min read</span>
                    )}
                    {typeof post.views === 'number' && (
                      <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {post.views} views</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link to={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                      Read article →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filtered.length > visible.length && (
          <div className="text-center mt-10">
            <Button onClick={() => setLimit((n) => n + 6)}>Load more</Button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Blog;