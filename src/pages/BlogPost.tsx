import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useBlog } from '../context/BlogProvider';
import NotFound from './NotFound';
import { ChevronLeft, Clock, Eye, Heart, Share2, Tag } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = useBlog();
  const post = posts.find(p => p.slug === slug);
  const [liked, setLiked] = useState(false);
  const dateStr = useMemo(() => post ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '', [post]);

  const onShare = async () => {
    try {
      const url = window.location.href;
      if (navigator.share) {
        await navigator.share({ title: post?.title, text: post?.excerpt, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      }
    } catch {
      // ignore
    }
  };

  if (!post) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="mb-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ChevronLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>

        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        )}

        <header className="mb-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{post.category || 'Uncategorized'}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{post.title}</h1>
          <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3">
            <span>By {post.author}</span>
            <span>·</span>
            <span>{dateStr}</span>
            {post.readTime && (
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime} min read</span>
            )}
            {typeof post.views === 'number' && (
              <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {post.views} views</span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Tags:</span>
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full border bg-muted">{t}</span>
              ))}
            </div>
          )}
        </header>

        <article className="prose md:prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => setLiked(v => !v)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors ${liked ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted'}`}
            aria-pressed={liked}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} /> {liked ? 'Liked' : 'Like'}
          </button>
          <button
            onClick={onShare}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border hover:bg-muted"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>

      </div>
      {/* SEO: Structured data for BlogPosting */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        author: { '@type': 'Person', name: post.author },
        image: post.coverImage ? [post.coverImage] : undefined,
        articleSection: post.category,
        keywords: post.tags && post.tags.length ? post.tags.join(', ') : undefined,
        mainEntityOfPage: typeof window !== 'undefined' ? window.location.href : undefined,
        description: post.excerpt,
        articleBody: post.content
      }) }} />
    </Layout>
  );
};

export default BlogPost;