import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useBlog } from '../context/BlogProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import MarkdownEditor from '../components/MarkdownEditor';
import { isAdmin } from '../lib/auth';

type FormData = {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category?: string;
  coverImage?: string; // path under /images/blog
  readTime?: number;
  tags?: string; // comma separated
  adminEmail: string;
  adminPassword: string;
};

const CreatePost = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>();
  const { addPost } = useBlog();
  const navigate = useNavigate();
  const contentVal = watch('content') || '';

  const onSubmit = (data: FormData) => {
    // admin gate
    if (!isAdmin(data.adminEmail, data.adminPassword)) {
      alert('Admin verification failed. Please check your credentials.');
      return;
    }

    const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [] as string[];
    const newPost = {
      id: Date.now(), // Simple unique ID
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      date: new Date().toISOString().split('T')[0],
      category: data.category || 'Uncategorized',
      coverImage: data.coverImage?.trim() || '/images/blog/placeholder-blog.svg',
      readTime: data.readTime ? Number(data.readTime) : undefined,
      tags: tagsArray,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
    };
    // Optional: persist to localStorage as a stand-in for backend storage
    try {
      const existing = JSON.parse(localStorage.getItem('bioark_blog_posts') || '[]');
      localStorage.setItem('bioark_blog_posts', JSON.stringify([newPost, ...existing]));
    } catch {}

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
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g. Tutorials, AI Trends, Company News" {...register('category')} />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea id="excerpt" {...register('excerpt', { required: 'Excerpt is required' })} placeholder="A short summary of the post..." />
                {errors.excerpt && <p className="text-destructive text-sm mt-1">{errors.excerpt.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (Markdown)</Label>
                <MarkdownEditor value={contentVal} onChange={(v) => setValue('content', v, { shouldValidate: true })} />
                {errors.content && <p className="text-destructive text-sm mt-1">{errors.content.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coverImage">Cover Image Path</Label>
                  <Input id="coverImage" placeholder="/images/blog/your-cover.jpg" {...register('coverImage')} />
                </div>
                <div>
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input id="readTime" type="number" min={1} {...register('readTime', { valueAsNumber: true })} />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="comma separated, e.g. CRISPR, Oncology" {...register('tags')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" type="email" placeholder="admin@bioark.com" {...register('adminEmail', { required: 'Admin email is required' })} />
                  {errors.adminEmail && <p className="text-destructive text-sm mt-1">{errors.adminEmail.message}</p>}
                </div>
                <div>
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input id="adminPassword" type="password" placeholder="••••••••" {...register('adminPassword', { required: 'Admin password is required' })} />
                  {errors.adminPassword && <p className="text-destructive text-sm mt-1">{errors.adminPassword.message}</p>}
                </div>
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