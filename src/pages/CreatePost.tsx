import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '/src/components/Layout';
import { Button } from '/src/components/ui/button';
import { Input } from '/src/components/ui/input';
import { Textarea } from '/src/components/ui/textarea';
import { Label } from '/src/components/ui/label';
import { useBlog } from '/src/context/BlogProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '/src/components/ui/card';

type FormData = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
};

const CreatePost = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { addPost } = useBlog();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    const newPost = {
      id: Date.now(), // Simple unique ID
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      date: new Date().toISOString().split('T')[0],
      ...data,
    };
    addPost(newPost);
    navigate('/blog');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create a New Blog Post</CardTitle>
            <CardDescription>Fill out the form below to publish a new article.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title', { required: 'Title is required' })} />
                {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input id="author" {...register('author', { required: 'Author is required' })} />
                {errors.author && <p className="text-destructive text-sm mt-1">{errors.author.message}</p>}
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" {...register('excerpt', { required: 'Excerpt is required' })} placeholder="A short summary of the post..." />
                {errors.excerpt && <p className="text-destructive text-sm mt-1">{errors.excerpt.message}</p>}
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" {...register('content', { required: 'Content is required' })} className="min-h-48" placeholder="Write your full article here..." />
                {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
              </div>
              <Button type="submit" className="w-full">Publish Post</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreatePost;