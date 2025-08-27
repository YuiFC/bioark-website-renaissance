import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import adminConfig from '@/config/admin.json';
import { useBlog } from '@/context/BlogProvider';
import { featuredProducts, geneEditingProducts } from '@/data/showcase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type AdminUser = { email: string; password: string };

const Admin = () => {
  const navigate = useNavigate();
  const { posts } = useBlog();
  const [authed, setAuthed] = useState<boolean>(() => !!localStorage.getItem('bioark_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState<'overview'|'user'|'product'|'blog'>('overview');

  const metrics = { pageViews: 12890, users: 1, posts: posts.length };

  const handleLogin = () => {
    try {
      const users = adminConfig as unknown as AdminUser[];
      const ok = users.some(u => u.email === email && u.password === password);
      if (ok) {
        localStorage.setItem('bioark_admin_token', 'ok');
        setAuthed(true);
      } else {
        alert('Invalid credentials');
      }
    } catch {
      alert('Login config error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bioark_admin_token');
    setAuthed(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/Logo-Transparent.png" alt="BioArk" className="h-8 w-auto" />
            <span className="font-semibold">Admin Portal</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm"><Link to="/">Back to Home</Link></Button>
            {authed && <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>}
          </div>
        </div>
      </header>

      <main className="py-8">
        {!authed ? (
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-sm mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input className="border rounded-md px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
                  <input className="border rounded-md px-3 py-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                  <div className="flex justify-end">
                    <Button onClick={handleLogin}>Login</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
          <aside className="border rounded-lg h-fit sticky top-6">
            <nav className="p-2">
              {[
                {k:'overview', label:'Overview'},
                {k:'user', label:'User'},
                {k:'product', label:'Product'},
                {k:'blog', label:'Blog'},
              ].map(i => (
                <button key={i.k} onClick={()=>setActive(i.k as any)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${active===i.k ? 'bg-muted text-foreground' : 'hover:bg-muted/60'}`}>
                  {i.label}
                </button>
              ))}
            </nav>
          </aside>
          <section>
            {active === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[{label:'Page Views',value:metrics.pageViews},{label:'Registered Users',value:metrics.users},{label:'Blog Posts',value:metrics.posts}].map((m,idx)=>(
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-sm text-muted-foreground">{m.label}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{m.value}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Note: Metrics are placeholders. Future: analytics, OA, payments.</p>
              </div>
            )}

            {active === 'user' && (
              <Card>
                <CardHeader><CardTitle>User</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Coming soon.</p>
                </CardContent>
              </Card>
            )}

            {active === 'product' && (
              <ProductPanel />
            )}

            {active === 'blog' && (
              <BlogPanel />
            )}
          </section>
        </div>
        )}
      </main>
    </div>
  );
};

export default Admin;

// ===== Helpers: Product Manager (local cache) =====
function ProductPanel() {
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', description:'', imageUrl:'', link:'', category:'featured' as 'featured'|'gene-editing' });
  const [hidden, setHidden] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('bioark_products_hidden')||'[]'); } catch { return []; } });
  const [overrides, setOverrides] = useState<Record<string, any>>(() => { try { return JSON.parse(localStorage.getItem('bioark_products_overrides')||'{}'); } catch { return {}; } });
  const [custom, setCustom] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('bioark_products')||'[]'); } catch { return []; } });

  const applyOverrides = (item: any) => ({ ...item, ...(overrides[item.id] || {}) });
  const baseFeatured = featuredProducts.filter(p => !hidden.includes(p.id)).map(applyOverrides);
  const baseGene = geneEditingProducts.filter(p => !hidden.includes(p.id)).map(applyOverrides);
  const customFeatured = custom.filter(c => c.category === 'featured' && !hidden.includes(c.id));
  const customGene = custom.filter(c => c.category === 'gene-editing' && !hidden.includes(c.id));

  const featuredAll = [...baseFeatured, ...customFeatured];
  const geneAll = [...baseGene, ...customGene];

  const matches = (p:any) => p.name?.toLowerCase().includes(q.toLowerCase()) || p.description?.toLowerCase().includes(q.toLowerCase());
  const featuredFiltered = q ? featuredAll.filter(matches) : featuredAll;
  const geneFiltered = q ? geneAll.filter(matches) : geneAll;

  const saveCustom = (next: any[]) => {
    setCustom(next);
    localStorage.setItem('bioark_products', JSON.stringify(next));
  };
  const saveOverrides = (next: Record<string, any>) => {
    setOverrides(next);
    localStorage.setItem('bioark_products_overrides', JSON.stringify(next));
  };
  const saveHidden = (next: string[]) => {
    setHidden(next);
    localStorage.setItem('bioark_products_hidden', JSON.stringify(next));
  };

  const onEdit = (item: any, patch: Partial<any>) => {
    if (custom.some(c => c.id === item.id)) {
      const next = custom.map(c => (c.id === item.id ? { ...c, ...patch } : c));
      saveCustom(next);
    } else {
      const next = { ...overrides, [item.id]: { ...(overrides[item.id]||{}), ...patch } };
      saveOverrides(next);
    }
  };

  const onDelete = (item: any) => {
    if (!confirm(`Delete product "${item.name}"? This can be restored by code or by clearing hidden list.`)) return;
    if (custom.some(c => c.id === item.id)) {
      const next = custom.filter(c => c.id !== item.id);
      saveCustom(next);
    } else {
      if (!hidden.includes(item.id)) saveHidden([...hidden, item.id]);
    }
  };

  const onAdd = () => {
    const id = `custom-${Date.now()}`;
    const payload = { id, ...form };
    saveCustom([payload, ...custom]);
    setShowAdd(false);
    setForm({ name:'', description:'', imageUrl:'', link:'', category: 'featured' });
  };

  const Section = ({title, items}:{title:string, items:any[]}) => (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!items.length && <p className="text-sm text-muted-foreground">No products.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-3">
                {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-28 object-cover rounded" />}
                <input className="border rounded-md px-2 py-1 w-full" value={p.name} onChange={e=>onEdit(p,{name:e.target.value})} />
                <textarea className="border rounded-md px-2 py-1 w-full" rows={3} value={p.description} onChange={e=>onEdit(p,{description:e.target.value})} />
                <div className="flex justify-between">
                  <Button asChild variant="secondary" size="sm"><Link to={p.link || '#'}>Open</Link></Button>
                  <Button variant="destructive" size="sm" onClick={()=>onDelete(p)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input className="border rounded-md px-3 py-2 w-full max-w-md" placeholder="Search products..." value={q} onChange={e=>setQ(e.target.value)} />
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <input className="border rounded-md px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              <textarea className="border rounded-md px-3 py-2" placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
              <input className="border rounded-md px-3 py-2" placeholder="Image URL" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} />
              <input className="border rounded-md px-3 py-2" placeholder="Link (/products/slug)" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} />
              <select className="border rounded-md px-3 py-2" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value as any}))}>
                <option value="featured">Featured</option>
                <option value="gene-editing">Gene Editing</option>
              </select>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Button>
                <Button onClick={onAdd}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Section title="Featured Products" items={featuredFiltered} />
      <Section title="Gene Editing Products" items={geneFiltered} />
    </div>
  );
}

// ===== Helpers: Blog Manager (uses BlogProvider) =====
function BlogPanel() {
  const { posts, updatePost, deletePost, addPost } = useBlog();
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', excerpt:'', coverImage:'', category:'General' });

  const filtered = useMemo(() => {
    if (!q.trim()) return posts;
    const s = q.toLowerCase();
    return posts.filter(p => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s) || p.slug.toLowerCase().includes(s));
  }, [q, posts]);

  const extractFirstImage = (md: string): string | undefined => {
    const urlMatch = md.match(/https?:\/\/[^\s)"']+\.(?:png|jpe?g|gif|webp|svg)/i);
    return urlMatch ? urlMatch[0] : undefined;
  };

  const fallbackImage = '/placeholder.svg';

  const onAdd = () => {
    const id = Date.now();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    addPost({
      id,
      slug,
      title: form.title,
      excerpt: form.excerpt || '—',
      content: '# New Post\n\nDraft content...\n',
      author: 'Admin',
      date: new Date().toISOString(),
      category: form.category,
      coverImage: form.coverImage || undefined,
      readTime: 5,
      views: 0,
      tags: []
    } as any);
    setShowAdd(false);
    setForm({ title:'', excerpt:'', coverImage:'', category:'General' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input className="border rounded-md px-3 py-2 w-full max-w-md" placeholder="Search blogs..." value={q} onChange={e=>setQ(e.target.value)} />
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Blog</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <input className="border rounded-md px-3 py-2" placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
              <textarea className="border rounded-md px-3 py-2" placeholder="Excerpt" value={form.excerpt} onChange={e=>setForm(f=>({...f,excerpt:e.target.value}))} />
              <input className="border rounded-md px-3 py-2" placeholder="Cover Image URL (optional)" value={form.coverImage} onChange={e=>setForm(f=>({...f,coverImage:e.target.value}))} />
              <input className="border rounded-md px-3 py-2" placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Button>
                <Button onClick={onAdd}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(post => {
          const img = post.coverImage || extractFirstImage(post.content) || fallbackImage;
          return (
            <Card key={post.id}>
              <CardContent className="p-0">
                <div className="w-full h-36 overflow-hidden rounded-t">
                  <img src={img} alt={post.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="text-xs text-muted-foreground">{post.category || 'General'} · {new Date(post.date).toLocaleDateString()}</div>
                  <input className="w-full text-base font-semibold outline-none" value={post.title} onChange={e=>updatePost(post.id, { title: e.target.value })} />
                  <textarea className="w-full text-sm text-muted-foreground outline-none" rows={2} value={post.excerpt} onChange={e=>updatePost(post.id, { excerpt: e.target.value })} />
                  <div className="flex items-center justify-end pt-2 gap-2">
                    <Button size="sm" variant="secondary" asChild><Link to={`/blog/${post.slug}`}>Open</Link></Button>
                    <Button size="sm" variant="destructive" onClick={()=>{ if (confirm(`Delete blog "${post.title}"?`)) deletePost(post.id); }}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {!filtered.length && <p className="text-sm text-muted-foreground">No blog posts found.</p>}
    </div>
  );
}
