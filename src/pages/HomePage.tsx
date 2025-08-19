import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '/src/components/ui/button';
import Layout from '/src/components/Layout';
import Hero from '/src/components/Hero';
import FeaturedSections from '/src/components/FeaturedSections';
import { useBlog } from '/src/context/BlogProvider';

const BlogSection = () => {
  const { posts } = useBlog();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">From Our Blog</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Insights, discoveries, and news from the forefront of biotechnology.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {posts.slice(0, 4).map(post => (
          <div key={post.id} className="bioark-card p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
            <p className="text-muted-foreground text-sm flex-grow">{post.excerpt}</p>
            <Link to={`/blog/${post.slug}`} className="text-primary font-semibold mt-4 hover:underline">Read More &rarr;</Link>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button asChild variant="outline">
          <Link to="/blog">View All Posts</Link>
        </Button>
      </div>
    </section>
  );
};

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedSections />
      <BlogSection />
    </Layout>
  );
};

export default HomePage;