import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '/src/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '/src/components/ui/card';
import { useBlog } from '/src/context/BlogProvider';
import { Button } from '/src/components/ui/button';

const Blog = () => {
  const { posts } = useBlog();

  return (
    <Layout>
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Blog
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights, discoveries, and news from the forefront of biotechnology.
            </p>
            <Button asChild className="mt-8">
              <Link to="/blog/new">Create New Post</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <div className="text-sm text-muted-foreground pt-2">
                  <span>By {post.author}</span> | <span>{post.date}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground text-sm flex-grow">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="text-primary font-semibold mt-4 hover:underline self-start">
                  Read More &rarr;
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;