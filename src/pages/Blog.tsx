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
  const [category, setCategory] = useState<string>('All');
  const [limit, setLimit] = useState(6);

  const categories = useMemo(() => ['All', 'Tutorials', 'AI Trends', 'Business Use Cases', 'Company News', 'Operations'], []);
  const filtered = useMemo(() => {
    const byCategory = category === 'All' ? posts : posts.filter(p => p.category === category);
    if (!query.trim()) return byCategory;
    const q = query.toLowerCase();
      return byCategory.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }, [posts, query, category]);
  const visible = filtered.slice(0, limit);

  return (
    <Layout>
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">Blog</h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl">Explore insights on gene editing, delivery technologies, and BioArk news.</p>
              </div>
              <Button asChild className="shrink-0 h-9 px-4">
                <Link to="/blog/new">Create Blog</Link>
              </Button>
            </div>
            {/* Search + Categories */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blog posts..."
                  className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setLimit(6); }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${category === c ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
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
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{post.category || 'Uncategorized'}</div>
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