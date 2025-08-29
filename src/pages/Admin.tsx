import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import adminConfig from '@/config/admin.json';
import { useBlog } from '@/context/BlogProvider';
import { featuredProducts, geneEditingProducts } from '@/data/showcase';
import { getProductBySlug } from '@/data/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getQuotes, getUnreadQuotesCount, markAllQuotesRead, markQuoteRead, deleteQuote } from '@/lib/quotes';

type AdminUser = { email: string; password: string };

const Admin = () => {
  const navigate = useNavigate();
  const { posts } = useBlog();
  const [authed, setAuthed] = useState<boolean>(() => !!localStorage.getItem('bioark_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState<'overview'|'user'|'product'|'blog'|'quotes'>('overview');
  const [unreadQuotes, setUnreadQuotes] = useState<number>(()=>getUnreadQuotesCount());

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
                {k:'quotes', label:'Quotes'},
              ].map(i => (
                <button key={i.k} onClick={()=>{
                  setActive(i.k as any);
                  if (i.k==='quotes'){ markAllQuotesRead(); setUnreadQuotes(0); }
                }} className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${active===i.k ? 'bg-muted text-foreground' : 'hover:bg-muted/60'}`}>
                  <span>{i.label}</span>
                  {i.k==='quotes' && unreadQuotes>0 && (
                    <span className="ml-2 inline-flex items-center justify-center text-xs bg-primary text-white rounded-full px-2 py-0.5">{unreadQuotes}</span>
                  )}
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
              <UserPanel />
            )}

            {active === 'product' && (
              <ProductPanel />
            )}

            {active === 'blog' && (
              <BlogPanel />
            )}

            {active === 'quotes' && (
              <QuotesPanel onChangeUnread={setUnreadQuotes} />
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
function getUsers(){ try { return JSON.parse(localStorage.getItem('bioark_users')||'[]'); } catch { return []; } }
function setUsers(list:any[]){ localStorage.setItem('bioark_users', JSON.stringify(list)); }

// ===== Quotes Panel =====
function QuotesPanel({ onChangeUnread }:{ onChangeUnread: (n:number)=>void }){
  const [q, setQ] = useState('');
  const [items, setItems] = useState(()=>getQuotes());
  const [selected, setSelected] = useState<any|null>(null);

  const refresh = () => { const list = getQuotes(); setItems(list); onChangeUnread(list.filter(x=>!x.read).length); };

  const filtered = useMemo(()=>{
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter((x:any)=>[
      x.firstName, x.lastName, x.email, x.company, x.department, x.serviceType, x.projectDescription, x.additionalInfo
    ].some((v:any)=>String(v||'').toLowerCase().includes(s)));
  },[q, items]);

  const open = (x:any) => { setSelected(x); if (!x.read){ markQuoteRead(x.id, true); refresh(); } };
  const del = (x:any) => { if (confirm('Delete this quote?')){ deleteQuote(x.id); refresh(); } };

  const Badge = ({children}:{children:React.ReactNode}) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-foreground/80">{children}</span>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input className="border rounded-md px-3 py-2 w-full max-w-md" placeholder="Search quotes..." value={q} onChange={e=>setQ(e.target.value)} />
        <Button variant="outline" onClick={()=>{ markAllQuotesRead(); refresh(); }}>Mark all read</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((x:any)=> (
          <Card key={x.id}>
            <CardContent className={`p-4 space-y-2 ${x.read ? '' : 'ring-2 ring-primary/60'}`}>
              <div className="flex items-center justify-between">
                <div className="font-semibold">{x.firstName} {x.lastName}</div>
                <div className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>{x.serviceType}</Badge>
                {x.budget && <Badge>{x.budget}</Badge>}
                {x.timeline && <Badge>{x.timeline}</Badge>}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">{x.projectDescription}</div>
              <div className="flex justify-end gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={()=>open(x)}>View</Button>
                <Button size="sm" variant="destructive" onClick={()=>del(x)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {!filtered.length && <p className="text-sm text-muted-foreground">No quotes found.</p>}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(o)=>{ if(!o) setSelected(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quote Detail</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-3 max-h-[70vh] overflow-auto pr-1">
              <div className="text-sm text-muted-foreground">Submitted: {new Date(selected.createdAt).toLocaleString()}</div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Contact</div>
                  <div className="font-medium">{selected.firstName} {selected.lastName}</div>
                  <div className="text-sm">{selected.email}</div>
                  {selected.phone && <div className="text-sm">{selected.phone}</div>}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Organization</div>
                  <div className="font-medium">{selected.company}</div>
                  {selected.department && <div className="text-sm">{selected.department}</div>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Service Type</div>
                  <div className="font-medium">{selected.serviceType}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Timeline</div>
                  <div className="font-medium">{selected.timeline || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Budget</div>
                  <div className="font-medium">{selected.budget || '—'}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground">Project Description</div>
                <div className="prose prose-sm max-w-none text-foreground">{selected.projectDescription}</div>
              </div>
              {selected.additionalInfo && (
                <div>
                  <div className="text-xs text-muted-foreground">Additional Info</div>
                  <div className="prose prose-sm max-w-none text-foreground">{selected.additionalInfo}</div>
                </div>
              )}

              <div className="border-t pt-3">
                <div className="text-xs text-muted-foreground mb-1">User Registration Snapshot</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="font-medium">{selected.submittedByEmail || '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Address</div>
                    <div className="font-medium whitespace-pre-wrap">{selected.submittedByAddress || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserPanel(){
  const [q, setQ] = useState('');
  const [users, setUsersState] = useState<any[]>(getUsers());

  const filtered = useMemo(()=>{
    if(!q.trim()) return users;
    const s = q.toLowerCase();
    return users.filter(u => (u.name||'').toLowerCase().includes(s) || (u.email||'').toLowerCase().includes(s) || (u.role||'').toLowerCase().includes(s));
  },[q, users]);

  const onEdit = (email:string, patch:Partial<any>) => {
    const next = users.map(u => u.email===email ? { ...u, ...patch } : u);
    setUsersState(next); setUsers(next);
  };
  const onDelete = (email:string) => {
    if (!confirm('Delete this user?')) return;
    const next = users.filter(u => u.email !== email);
    setUsersState(next); setUsers(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input className="border rounded-md px-3 py-2 w-full max-w-md" placeholder="Search users..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(u => (
          <Card key={u.email}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-foreground">{u.name || '—'}</div>
                <select className="border rounded-md px-2 py-1 text-sm" value={u.role||'User'} onChange={e=>onEdit(u.email,{ role: e.target.value })}>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <input className="border rounded-md px-2 py-1 w-full" value={u.name||''} placeholder="Full name" onChange={e=>onEdit(u.email,{ name:e.target.value })} />
              <input className="border rounded-md px-2 py-1 w-full" value={u.email||''} disabled />
              <textarea className="border rounded-md px-2 py-1 w-full" rows={2} placeholder="Shipping Address" value={u.address||''} onChange={e=>onEdit(u.email,{ address:e.target.value })} />
              <div className="flex justify-end gap-2">
                <Button variant="destructive" size="sm" onClick={()=>onDelete(u.email)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {!filtered.length && <p className="text-sm text-muted-foreground">No users found.</p>}
    </div>
  );
}

function ProductPanel() {
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', description:'', imageUrl:'', link:'', category:'featured' as 'featured'|'gene-editing' });
  const [hidden, setHidden] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('bioark_products_hidden')||'[]'); } catch { return []; } });
  const [overrides, setOverrides] = useState<Record<string, any>>(() => { try { return JSON.parse(localStorage.getItem('bioark_products_overrides')||'{}'); } catch { return {}; } });
  const [custom, setCustom] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('bioark_products')||'[]'); } catch { return []; } });
  const [detailsOverrides, setDetailsOverrides] = useState<Record<string, any>>(() => { try { return JSON.parse(localStorage.getItem('bioark_product_details_overrides')||'{}'); } catch { return {}; } });
  const [editing, setEditing] = useState<any|null>(null);
  const [detailsForm, setDetailsForm] = useState<any|null>(null);

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
  const saveDetailsOverrides = (next: Record<string, any>) => {
    setDetailsOverrides(next);
    localStorage.setItem('bioark_product_details_overrides', JSON.stringify(next));
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

  const openEditDetails = (p:any) => {
    setEditing(p);
    const slug = (p.link||'').replace('/products/','');
    let base = slug ? getProductBySlug(slug) : undefined;
    const dOv = detailsOverrides[p.id] || {};
    const dispOv = overrides[p.id] || {};
    const merged = {
      id: p.id,
      name: p.name,
      description: p.description,
      imageUrl: p.imageUrl,
      link: p.link,
      catalogNumber: base?.catalogNumber || '',
      availability: base?.availability || 'In Stock',
      listPrice: base?.listPrice || '',
      options: base?.options || [],
      keyFeatures: base?.keyFeatures || [],
      storageStability: base?.storageStability || '',
      performanceData: base?.performanceData || '',
      manuals: base?.manuals || [],
      storeLink: base?.storeLink || '',
      ...dispOv,
      ...dOv,
    };
    setDetailsForm({
      ...merged,
      optionsText: (merged.options||[]).join(', '),
      keyFeaturesText: (merged.keyFeatures||[]).join('\n'),
      manualsText: (merged.manuals||[]).join(', '),
    });
  };

  const saveEditDetails = () => {
    if (!editing || !detailsForm) return;
    const id = editing.id;
    if (!custom.some(c=>c.id===id)) {
      const nextDisp = { ...overrides, [id]: { ...(overrides[id]||{}), name: detailsForm.name, description: detailsForm.description, imageUrl: detailsForm.imageUrl, link: detailsForm.link } };
      saveOverrides(nextDisp);
    } else {
      const nextCustom = custom.map(c => c.id===id ? { ...c, name: detailsForm.name, description: detailsForm.description, imageUrl: detailsForm.imageUrl, link: detailsForm.link } : c);
      saveCustom(nextCustom);
    }
    const normalized = {
      catalogNumber: detailsForm.catalogNumber || '',
      availability: detailsForm.availability || '',
      listPrice: detailsForm.listPrice || '',
      options: (detailsForm.optionsText||'').split(',').map((s:string)=>s.trim()).filter(Boolean),
      keyFeatures: (detailsForm.keyFeaturesText||'').split('\n').map((s:string)=>s.trim()).filter(Boolean),
      storageStability: detailsForm.storageStability || '',
      performanceData: detailsForm.performanceData || '',
      manuals: (detailsForm.manualsText||'').split(',').map((s:string)=>s.trim()).filter(Boolean),
      storeLink: detailsForm.storeLink || '',
    };
    const nextDetails = { ...detailsOverrides, [id]: { ...(detailsOverrides[id]||{}), ...normalized } };
    saveDetailsOverrides(nextDetails);
    setEditing(null);
    setDetailsForm(null);
    alert('Saved product details.');
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
                  <Button size="sm" variant="outline" onClick={()=>openEditDetails(p)}>Edit details</Button>
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

      {/* Edit Details Dialog */}
      <Dialog open={!!editing} onOpenChange={(o)=>{ if(!o){ setEditing(null); setDetailsForm(null); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product Details</DialogTitle>
          </DialogHeader>
          {detailsForm && (
            <div className="grid gap-3 max-h-[70vh] overflow-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.name} onChange={e=>setDetailsForm((f:any)=>({...f,name:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Catalog #</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.catalogNumber} onChange={e=>setDetailsForm((f:any)=>({...f,catalogNumber:e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Availability</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.availability} onChange={e=>setDetailsForm((f:any)=>({...f,availability:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">List Price</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.listPrice} onChange={e=>setDetailsForm((f:any)=>({...f,listPrice:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Description</label>
                <textarea className="border rounded-md px-3 py-2 w-full" rows={3} value={detailsForm.description} onChange={e=>setDetailsForm((f:any)=>({...f,description:e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Image URL</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.imageUrl||''} onChange={e=>setDetailsForm((f:any)=>({...f,imageUrl:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Product Link (/products/slug)</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.link||''} onChange={e=>setDetailsForm((f:any)=>({...f,link:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Options (comma separated)</label>
                <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.optionsText} onChange={e=>setDetailsForm((f:any)=>({...f,optionsText:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Key Features (one per line)</label>
                <textarea className="border rounded-md px-3 py-2 w-full" rows={4} value={detailsForm.keyFeaturesText} onChange={e=>setDetailsForm((f:any)=>({...f,keyFeaturesText:e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Storage & Stability</label>
                  <textarea className="border rounded-md px-3 py-2 w-full" rows={3} value={detailsForm.storageStability} onChange={e=>setDetailsForm((f:any)=>({...f,storageStability:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Performance Data</label>
                  <textarea className="border rounded-md px-3 py-2 w-full" rows={3} value={detailsForm.performanceData} onChange={e=>setDetailsForm((f:any)=>({...f,performanceData:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Manuals (comma separated)</label>
                <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.manualsText} onChange={e=>setDetailsForm((f:any)=>({...f,manualsText:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Store Link</label>
                <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.storeLink||''} onChange={e=>setDetailsForm((f:any)=>({...f,storeLink:e.target.value}))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={()=>{ setEditing(null); setDetailsForm(null); }}>Cancel</Button>
                <Button onClick={saveEditDetails}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// (Design Editor removed as requested)

// ===== Helpers: Blog Manager (uses BlogProvider) =====
function BlogPanel() {
  const { posts, updatePost, deletePost, addPost } = useBlog();
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', excerpt:'', coverImage:'', category:'General' });
  const [editing, setEditing] = useState<any|null>(null);
  const [editForm, setEditForm] = useState<any|null>(null);

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

  const openEdit = (post:any) => {
    setEditing(post);
    setEditForm({
      ...post,
      tagsText: (post.tags||[]).join(', '),
      date: post.date ? new Date(post.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10),
      readTime: post.readTime || 5,
      views: post.views || 0,
    });
  };

  const saveEdit = () => {
    if (!editing || !editForm) return;
    const patch:any = {
      slug: editForm.slug,
      title: editForm.title,
      excerpt: editForm.excerpt,
      content: editForm.content,
      author: editForm.author,
      date: new Date(editForm.date).toISOString(),
      category: editForm.category,
      coverImage: editForm.coverImage || undefined,
      readTime: Number(editForm.readTime)||0,
      views: Number(editForm.views)||0,
      tags: (editForm.tagsText||'').split(',').map((s:string)=>s.trim()).filter(Boolean),
    };
    updatePost(editing.id, patch);
    setEditing(null);
    setEditForm(null);
    alert('Saved blog post.');
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
                    <Button size="sm" variant="outline" onClick={()=>openEdit(post)}>Edit</Button>
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

      {/* Edit Blog Dialog */}
      <Dialog open={!!editing} onOpenChange={(o)=>{ if(!o){ setEditing(null); setEditForm(null); } }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="grid gap-3 max-h-[70vh] overflow-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Title</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={editForm.title} onChange={e=>setEditForm((f:any)=>({...f,title:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Slug</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={editForm.slug} onChange={e=>setEditForm((f:any)=>({...f,slug:e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Author</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={editForm.author} onChange={e=>setEditForm((f:any)=>({...f,author:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Date</label>
                  <input type="date" className="border rounded-md px-3 py-2 w-full" value={editForm.date} onChange={e=>setEditForm((f:any)=>({...f,date:e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={editForm.category||''} onChange={e=>setEditForm((f:any)=>({...f,category:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Cover Image URL</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={editForm.coverImage||''} onChange={e=>setEditForm((f:any)=>({...f,coverImage:e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Read Time (min)</label>
                  <input type="number" className="border rounded-md px-3 py-2 w-full" value={editForm.readTime} onChange={e=>setEditForm((f:any)=>({...f,readTime:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Views</label>
                  <input type="number" className="border rounded-md px-3 py-2 w-full" value={editForm.views} onChange={e=>setEditForm((f:any)=>({...f,views:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Tags (comma separated)</label>
                <input className="border rounded-md px-3 py-2 w-full" value={editForm.tagsText} onChange={e=>setEditForm((f:any)=>({...f,tagsText:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Excerpt</label>
                <textarea className="border rounded-md px-3 py-2 w-full" rows={3} value={editForm.excerpt} onChange={e=>setEditForm((f:any)=>({...f,excerpt:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Content (Markdown)</label>
                <textarea className="border rounded-md px-3 py-2 w-full font-mono text-sm" rows={12} value={editForm.content} onChange={e=>setEditForm((f:any)=>({...f,content:e.target.value}))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={()=>{ setEditing(null); setEditForm(null); }}>Cancel</Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
