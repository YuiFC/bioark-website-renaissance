import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '/src/components/Layout';
import { useBlog } from '/src/context/BlogProvider';
import NotFound from './NotFound';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = useBlog();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <article className="prose lg:prose-xl dark:prose-invert max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="text-muted-foreground">
              <span>By {post.author}</span> &bull; <span>Published on {post.date}</span>
            </div>
          </header>
          
          <p>{post.content}</p>
          
          <div className="mt-12 border-t pt-8">
            <Link to="/blog" className="text-primary hover:underline">&larr; Back to all posts</Link>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;