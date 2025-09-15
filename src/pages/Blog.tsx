import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useBlog } from '../context/BlogProvider';
import { Button } from '../components/ui/button';
import { Search, Clock, Eye, Filter } from 'lucide-react';

const Blog = () => {
  const { posts } = useBlog();
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(6);
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => { if (p.category) set.add(p.category); });
    const list = Array.from(set);
    list.sort();
    return ['All', ...list];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return posts.filter(p => {
      const matchQ = !q.trim() || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || (p.tags || []).some(t => String(t||'').toLowerCase().includes(q));
      const matchC = category === 'All' || (p.category || '') === category;
      return matchQ && matchC;
    });
  }, [posts, query, category]);
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
            {/* Create Blog button removed; blogs are added via Admin panel */}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-14 md:py-16">
        {/* Mobile filters bar */}
        <div className="lg:hidden -mt-2 mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => { setLimit(6); setQuery(e.target.value); }}
              placeholder="Search blog posts..."
              className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-base outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setLimit(6); setCategory(cat); }}
                className={`shrink-0 px-3 py-1.5 rounded-full border text-sm transition-colors ${category===cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-muted'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-8">
          {/* Sidebar: Search + Categories (desktop/tablet only) */}
      <aside className="hidden lg:block border rounded-lg h-fit sticky top-24 p-4 bg-white">
            <div className="space-y-5">
              <div>
        <div className="text-base font-semibold mb-2">Search</div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(e) => { setLimit(6); setQuery(e.target.value); }}
                    placeholder="Search blog posts..."
          className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-base outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
        <div className="text-base font-semibold mb-2">Categories</div>
                <div className="flex flex-col gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setLimit(6); setCategory(cat); }}
            className={`text-left px-3 py-1.5 rounded-md text-base ${category===cat ? 'bg-muted text-foreground' : 'hover:bg-muted/60'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main: Cards */}
          <div>
            {visible.length === 0 ? (
              <div className="text-center text-muted-foreground py-24">No matching posts found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                {visible.map(post => (
                  <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover" />
                    )}
                    <CardHeader>
                      {/* Category label above title */}
                      <div className="text-xs text-muted-foreground">{post.category || 'General'}</div>
                      <CardTitle className="text-xl md:text-2xl font-bold leading-tight mt-1">
                        <Link to={`/blog/${post.slug}`} className="hover:underline" aria-label={`${post.title} - ${post.excerpt}`} title={post.excerpt}>
                          {post.title}
                        </Link>
                      </CardTitle>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 pt-2">
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
                      <p className="text-muted-foreground text-base md:text-[17px] leading-relaxed line-clamp-4 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="mt-5 flex items-center justify-between">
                        <Link to={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                          Read Article →
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
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;