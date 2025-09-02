import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import adminConfig from '@/config/admin.json';
import { useBlog } from '@/context/BlogProvider';
import { featuredProducts, geneEditingProducts } from '@/data/showcase';
import { getProductBySlug, listAllProducts } from '@/data/products';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getQuotes, getUnreadQuotesCount, markAllQuotesRead, markQuoteRead, deleteQuote } from '@/lib/quotes';
import { getAllServices } from '@/data/services';

type AdminUser = { email: string; password: string };

const Admin = () => {
  const navigate = useNavigate();
  const { posts } = useBlog();
  const [authed, setAuthed] = useState<boolean>(() => !!localStorage.getItem('bioark_admin_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState<'overview'|'user'|'product'|'services'|'blog'|'quotes'|'email'>('overview');
  const [unreadQuotes, setUnreadQuotes] = useState<number>(0);
  React.useEffect(()=>{ (async()=>{ try { const n = await getUnreadQuotesCount(); setUnreadQuotes(n); } catch {} })(); },[]);

  const metrics = { pageViews: 12890, users: 1, posts: posts.length };

  const handleLogin = () => {
    try {
      const users = adminConfig as unknown as AdminUser[];
      const ok = users.some(u => u.email === email && u.password === password);
      if (ok){
        localStorage.setItem('bioark_admin_token', '1');
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

  if (!authed){
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input className="border rounded-md px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="border rounded-md px-3 py-2 w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={handleLogin}>Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid grid-rows-[56px_minmax(0,1fr)]">
      <header className="border-b">
        <div className="px-3 sm:px-4 h-14 w-full flex items-center justify-between">
          <div className="font-semibold">Admin Portal</div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-0">
        {/* Left sidebar */}
        <aside className="border-r bg-muted/30">
          <nav className="p-3 space-y-1">
            {[
              {k:'overview', label:'Overview'},
              {k:'user', label:'Users'},
              {k:'product', label:'Products'},
              {k:'services', label:'Services'},
              {k:'blog', label:'Blog'},
              {k:'quotes', label:'Quotes'},
              {k:'email', label:'Email (SMTP)'},
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
        {/* Right content */}
        <main className="p-4 max-w-[1400px] w-full mx-auto">
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

          {active === 'user' && <UserPanel />}
          {active === 'product' && <ProductPanel />}
          {active === 'services' && <ServicesPanel />}
          {active === 'blog' && <BlogPanel />}
          {active === 'quotes' && <QuotesPanel onChangeUnread={setUnreadQuotes} />}
          {active === 'email' && <EmailPanel />}
        </main>
      </div>
    </div>
  );
};

export default Admin;

// ===== Helpers: Product Manager (local cache) =====
// Users API helpers
import { listUsers as apiListUsers, upsertUser as apiUpsertUser, deleteUser as apiDeleteUser } from '@/lib/users';

// ===== Services Panel (manage Services data locally) =====
import { fetchJson } from '@/lib/api';
function ServicesPanel(){
  type Svc = ReturnType<typeof getAllServices>[number];
  const base = getAllServices();
  const [q, setQ] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', description:'', link:'/services/', imageUrl:'', icon:'' });
  const [overrides, setOverrides] = useState<Record<string, any>>({});
  const [custom, setCustom] = useState<any[]>([]);
  const [editing, setEditing] = useState<any|null>(null);
  const [editForm, setEditForm] = useState<any|null>(null);
  const [editingDetail, setEditingDetail] = useState<any|null>(null);
  const [detailForm, setDetailForm] = useState<any|null>(null);
  const MEDIA_KEY = 'bioark_services_media_v2_paths';
  const [media, setMedia] = useState<Record<string, string[]>>({});
  const saveMedia = async (next: Record<string, string[]>) => { setMedia(next); await fetchJson('/api/services-config', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ overrides, custom, media: next }) }); };

  React.useEffect(()=>{
    fetchJson('/api/services-config').then((cfg:any)=>{ setOverrides(cfg.overrides||{}); setCustom(cfg.custom||[]); setMedia(cfg.media||{}); }).catch(()=>{});
  },[]);

  const saveOverrides = async (next: Record<string, any>) => { setOverrides(next); await fetchJson('/api/services-config', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ overrides: next, custom, media }) }); };
  const saveCustom = async (next: any[]) => { setCustom(next); await fetchJson('/api/services-config', { method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ overrides, custom: next, media }) }); };

  const applyOverrides = (s:Svc) => ({ ...s, ...(overrides[s.id]||{}) });
  const baseApplied = base.map(applyOverrides);
  const all = [...baseApplied, ...custom];
  const filtered = q ? all.filter(s => (s.name||'').toLowerCase().includes(q.toLowerCase()) || (s.description||'').toLowerCase().includes(q.toLowerCase())) : all;

  const onEdit = (item:any, patch:Partial<any>) => {
    if (custom.some(c => c.id === item.id)) {
      const next = custom.map(c => c.id===item.id ? { ...c, ...patch } : c);
      saveCustom(next);
    } else {
      const next = { ...overrides, [item.id]: { ...(overrides[item.id]||{}), ...patch } };
      saveOverrides(next);
    }
  };
  const onDelete = (item:any) => {
    if (!confirm(`Delete service "${item.name}"?`)) return;
    if (custom.some(c => c.id === item.id)) {
      const next = custom.filter(c => c.id !== item.id);
      saveCustom(next);
    } else {
      const next = { ...overrides }; delete next[item.id]; saveOverrides(next);
    }
  };
  const openEdit = (item:any) => {
    setEditing(item);
    setEditForm({
      id: item.id,
      name: item.name || '',
      description: item.description || '',
      link: item.link || '/services/',
      imageUrl: item.imageUrl || '',
      icon: item.icon || ''
    });
  };
  const saveEdit = () => {
    if (!editing || !editForm) return;
    const id = editing.id;
    if (custom.some(c => c.id === id)) {
      const next = custom.map(c => c.id===id ? { ...c, name: editForm.name, description: editForm.description, link: editForm.link, imageUrl: editForm.imageUrl, icon: editForm.icon } : c);
      saveCustom(next);
    } else {
      const next = { ...overrides, [id]: { ...(overrides[id]||{}), name: editForm.name, description: editForm.description, link: editForm.link, imageUrl: editForm.imageUrl, icon: editForm.icon } };
      saveOverrides(next);
    }
    setEditing(null); setEditForm(null);
  };
  const resetToDefault = () => {
    if (!editing) return;
    if (custom.some(c=>c.id===editing.id)) return; // Not applicable for custom
    const next = { ...overrides }; delete next[editing.id]; saveOverrides(next);
    setEditing(null); setEditForm(null);
  };
  const onAdd = () => {
    const id = `svc-custom-${Date.now()}`;
    const payload = { id, ...form, longDescription:'', keyBenefits:[], processOverview:[], relatedProducts:[], caseStudies:[], markdown:'' } as any;
    saveCustom([payload, ...custom]);
    setShowAdd(false);
    setForm({ name:'', description:'', link:'/services/', imageUrl:'', icon:'' });
  };

  // Open detail editor with full fields
  const openEditDetail = (item:any) => {
    setEditingDetail(item);
    const current = all.find(s=>s.id===item.id) || item;
    setDetailForm({
      id: current.id,
      name: current.name||'',
      description: current.description||'',
      link: current.link||'/services/',
      imageUrl: current.imageUrl||'',
      longDescription: current.longDescription||'',
      keyBenefitsText: (current.keyBenefits||[]).join('\n'),
      processText: (current.processOverview||[]).map((p:any)=>`${p.step} :: ${p.description}`).join('\n'),
      relatedText: (current.relatedProducts||[]).map((r:any)=>`${r.name} -> ${r.link}`).join('\n'),
      caseText: (current.caseStudies||[]).map((c:any)=>`${c.title} -> ${c.link}`).join('\n'),
      markdown: current.markdown||''
    });
  };
  const parsePairs = (txt:string, sep:'->'|'::') => {
    const lines = (txt||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
    if (sep==='::'){
      return lines.map(l=>{ const i=l.indexOf('::'); if(i<0) return null; return { step: l.slice(0,i).trim(), description: l.slice(i+2).trim() }; }).filter(Boolean);
    }
    return lines.map(l=>{ const i=l.indexOf('->'); if(i<0) return null; return { name: l.slice(0,i).trim(), link: l.slice(i+2).trim() }; }).filter(Boolean);
  };
  const saveDetail = () => {
    if (!editingDetail || !detailForm) return;
    const id = editingDetail.id;
    const patch = {
      name: detailForm.name,
      description: detailForm.description,
      link: detailForm.link,
      imageUrl: detailForm.imageUrl,
      longDescription: detailForm.longDescription,
      keyBenefits: (detailForm.keyBenefitsText||'').split('\n').map((s:string)=>s.trim()).filter(Boolean),
      processOverview: parsePairs(detailForm.processText,'::'),
      relatedProducts: parsePairs(detailForm.relatedText,'->'),
      caseStudies: parsePairs(detailForm.caseText,'->'),
      markdown: detailForm.markdown||''
    };
    if (custom.some(c=>c.id===id)){
      const next = custom.map(c=>c.id===id ? { ...c, ...patch } : c);
      saveCustom(next);
    } else {
      const next = { ...overrides, [id]: { ...(overrides[id]||{}), ...patch } };
      saveOverrides(next);
    }
    setEditingDetail(null); setDetailForm(null);
    alert('Saved service details.');
  };
  const addImageByName = (raw:string) => {
    if (!editingDetail) return;
    const name = (raw||'').trim().replace(/^\\+|^\/+/, '');
    if (!name) return;
    const list = media[editingDetail.id] || [];
    if (list.includes(name)) return;
    const next = { ...media, [editingDetail.id]: [name, ...list] };
    saveMedia(next);
  };
  const insertImagePathToMarkdown = async (name:string) => {
    const path = `/images/services/${name}`;
    const snippet = `\n\n![${name}](${path})\n\n`;
    try {
      await navigator.clipboard.writeText(snippet);
      alert('Image markdown copied to clipboard. Please paste it into the Markdown field below at your desired position.');
    } catch {
      alert('Failed to copy to clipboard. You can manually copy the snippet: ' + snippet);
    }
  };
  const setAsCoverPath = (name:string) => {
    if (!detailForm) return; setDetailForm((f:any)=>({ ...f, imageUrl: `/images/services/${name}` }));
  };
  const removeMedia = (idx:number) => {
    if (!editingDetail) return;
    const list = media[editingDetail.id] || [];
    const nextList = list.filter((_,i)=>i!==idx);
    const next = { ...media, [editingDetail.id]: nextList };
    saveMedia(next);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <input className="border rounded-md px-3 py-2 w-full max-w-md" placeholder="Search services..." value={q} onChange={e=>setQ(e.target.value)} />
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <input className="border rounded-md px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              <textarea className="border rounded-md px-3 py-2" placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
              <input className="border rounded-md px-3 py-2" placeholder="Link (/services/slug)" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} />
              <input className="border rounded-md px-3 py-2" placeholder="Image URL (optional)" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Button>
                <Button onClick={onAdd}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => (
          <Card key={s.id}>
            <CardContent className="p-4 space-y-3">
              {s.imageUrl && <img src={s.imageUrl} alt={s.name} className="w-full h-28 object-cover rounded" />}
              <input className="border rounded-md px-2 py-1 w-full" value={s.name} onChange={e=>onEdit(s,{name:e.target.value})} />
              <textarea className="border rounded-md px-2 py-1 w-full" rows={3} value={s.description} onChange={e=>onEdit(s,{description:e.target.value})} />
              <div className="flex justify-between gap-2">
                <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={()=>openEditDetail(s)}>Edit details</Button>
                  <Button asChild variant="secondary" size="sm"><Link to={s.link || '#'}>Open</Link></Button>
                </div>
                <Button variant="destructive" size="sm" onClick={()=>onDelete(s)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {!filtered.length && <p className="text-sm text-muted-foreground">No services.</p>}

      {/* Edit Service Dialog */}
      <Dialog open={!!editing} onOpenChange={(o)=>{ if(!o){ setEditing(null); setEditForm(null); } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Service</DialogTitle></DialogHeader>
          {editForm && (
            <div className="grid gap-3 max-h-[70vh] overflow-auto pr-1">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <input className="border rounded-md px-3 py-2 w-full" value={editForm.name} onChange={e=>setEditForm((f:any)=>({...f,name:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Description</label>
                <textarea className="border rounded-md px-3 py-2 w-full" rows={4} value={editForm.description} onChange={e=>setEditForm((f:any)=>({...f,description:e.target.value}))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Link (/services/slug)</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={editForm.link} onChange={e=>setEditForm((f:any)=>({...f,link:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Image URL (optional)</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={editForm.imageUrl} onChange={e=>setEditForm((f:any)=>({...f,imageUrl:e.target.value}))} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                {!custom.some(c=>c.id===editing?.id) && (
                  <Button variant="outline" onClick={resetToDefault}>Reset to Default</Button>
                )}
                <Button variant="secondary" onClick={()=>{ setEditing(null); setEditForm(null); }}>Cancel</Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Full Details Dialog */}
      <Dialog open={!!editingDetail} onOpenChange={(o)=>{ if(!o){ setEditingDetail(null); setDetailForm(null); } }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Edit Service Details</DialogTitle></DialogHeader>
          {detailForm && (
            <div className="grid gap-4 max-h-[75vh] overflow-auto pr-1">
              {/* Image Upload & Library */}
              <div className="border rounded-md p-3 bg-muted/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Images</div>
                    <div className="text-xs text-muted-foreground">Place files under public/images/services. This panel will reference images by filename and help you insert the Markdown snippet that links to /images/services/filename.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="svc-media-name" className="border rounded-md px-2 py-1 text-sm" placeholder="filename.png (in public/images/services)" onKeyDown={(e)=>{ if(e.key==='Enter'){ addImageByName((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value=''; } }} />
                    <Button size="sm" variant="outline" onClick={()=>{
                      const el = document.getElementById('svc-media-name') as HTMLInputElement|null; if(el){ addImageByName(el.value); el.value=''; }
                    }}>Add</Button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(media[detailForm.id]||[]).map((name,idx)=>(
                    <div key={idx} className="border rounded-md p-2 bg-background">
                      <div className="flex items-center gap-2">
                        <img src={`/images/services/${name}`} alt={name} className="w-16 h-16 object-cover rounded" onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.opacity='0.4'; }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate" title={name}>{name}</div>
                          <div className="text-xs text-muted-foreground truncate">/images/services/{name}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={()=>insertImagePathToMarkdown(name)}>Insert to Markdown (Path)</Button>
                        <Button size="sm" variant="outline" onClick={()=>setAsCoverPath(name)}>Set as Cover</Button>
                        <Button size="sm" variant="destructive" onClick={()=>removeMedia(idx)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  {!(media[detailForm.id]||[]).length && (
                    <div className="text-xs text-muted-foreground">No images yet. Place files under public/images/services, then type the filename above and click Add to preview and insert.</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Name</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailForm.name} onChange={e=>setDetailForm((f:any)=>({...f,name:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Link (/services/slug)</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailForm.link} onChange={e=>setDetailForm((f:any)=>({...f,link:e.target.value}))} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Image URL</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailForm.imageUrl} onChange={e=>setDetailForm((f:any)=>({...f,imageUrl:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Short Description</label>
                  <input className="border rounded-md px-3 py-2 w-full" value={detailForm.description} onChange={e=>setDetailForm((f:any)=>({...f,description:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Long Description</label>
                <textarea className="border rounded-md px-3 py-2 w-full" rows={4} value={detailForm.longDescription} onChange={e=>setDetailForm((f:any)=>({...f,longDescription:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Key Benefits (one per line)</label>
                <textarea className="border rounded-md px-3 py-2 w-full" rows={4} value={detailForm.keyBenefitsText} onChange={e=>setDetailForm((f:any)=>({...f,keyBenefitsText:e.target.value}))} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Process Overview (one per line, format: Step :: Description)</label>
                <textarea className="border rounded-md px-3 py-2 w-full" rows={5} value={detailForm.processText} onChange={e=>setDetailForm((f:any)=>({...f,processText:e.target.value}))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Related Products (one per line, format: Name -&gt; /products/slug)</label>
                  <textarea className="border rounded-md px-3 py-2 w-full" rows={4} value={detailForm.relatedText} onChange={e=>setDetailForm((f:any)=>({...f,relatedText:e.target.value}))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Case Studies (one per line, format: Title -&gt; /blog/slug or URL)</label>
                  <textarea className="border rounded-md px-3 py-2 w-full" rows={4} value={detailForm.caseText} onChange={e=>setDetailForm((f:any)=>({...f,caseText:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Full Markdown (optional; overrides structured sections when present)</label>
                <textarea className="border rounded-md px-3 py-2 w-full font-mono text-sm" rows={10} value={detailForm.markdown} onChange={e=>setDetailForm((f:any)=>({...f,markdown:e.target.value}))} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={()=>{ setEditingDetail(null); setDetailForm(null); }}>Cancel</Button>
                <Button onClick={saveDetail}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Email (SMTP) Config Panel =====
function EmailPanel(){
  type SMTP = { host:string; port:number; secure:boolean; user:string; pass:string; fromEmail:string; toEmails:string };
  const KEY = 'bioark_smtp_config_v1';
  const read = (): SMTP => {
    try{ const raw = localStorage.getItem(KEY); if(!raw) return {host:'',port:465,secure:true,user:'',pass:'',fromEmail:'',toEmails:''}; const o = JSON.parse(raw); return { host:o.host||'', port:Number(o.port)||465, secure:!!o.secure, user:o.user||'', pass:o.pass||'', fromEmail:o.fromEmail||'', toEmails:o.toEmails||'' }; }catch{ return {host:'',port:465,secure:true,user:'',pass:'',fromEmail:'',toEmails:''}; }
  };
  const save = (cfg:SMTP) => localStorage.setItem(KEY, JSON.stringify(cfg));

  const [form, setForm] = useState<SMTP>(read());
  const [saved, setSaved] = useState<string>('');

  const onSave = () => {
    save(form);
    setSaved('Saved.');
    setTimeout(()=>setSaved(''), 2000);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>SMTP Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Host</div>
              <input className="border rounded-md px-3 py-2 w-full" value={form.host} onChange={e=>setForm(f=>({...f,host:e.target.value}))} placeholder="smtp.example.com" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Port</div>
              <input className="border rounded-md px-3 py-2 w-full" value={form.port} onChange={e=>setForm(f=>({...f,port: Number(e.target.value)||0}))} placeholder="465 or 587" />
            </div>
            <div className="flex items-center gap-2">
              <input id="smtp-secure" type="checkbox" checked={form.secure} onChange={e=>setForm(f=>({...f,secure:e.target.checked}))} />
              <label htmlFor="smtp-secure" className="text-sm">Secure (TLS/SSL)</label>
            </div>
            <div />
            <div>
              <div className="text-sm text-muted-foreground mb-1">User</div>
              <input className="border rounded-md px-3 py-2 w-full" value={form.user} onChange={e=>setForm(f=>({...f,user:e.target.value}))} placeholder="SMTP username" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Password</div>
              <input type="password" className="border rounded-md px-3 py-2 w-full" value={form.pass} onChange={e=>setForm(f=>({...f,pass:e.target.value}))} placeholder="SMTP password" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">From Email</div>
              <input className="border rounded-md px-3 py-2 w-full" value={form.fromEmail} onChange={e=>setForm(f=>({...f,fromEmail:e.target.value}))} placeholder="no-reply@yourdomain.com" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Admin To Emails</div>
              <input className="border rounded-md px-3 py-2 w-full" value={form.toEmails} onChange={e=>setForm(f=>({...f,toEmails:e.target.value}))} placeholder="admin@yourdomain.com, sales@yourdomain.com" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            {saved && <span className="text-sm text-green-600 self-center">{saved}</span>}
            <Button onClick={onSave}>Save</Button>
          </div>
          <p className="text-xs text-muted-foreground">Note: Hostinger 部署后，将在服务器端使用上述配置通过 SMTP 发送邮件；前端仅保存配置并供服务端读取/调用。</p>
        </CardContent>
      </Card>
    </div>
  );
}
// ===== Quotes Panel =====
function QuotesPanel({ onChangeUnread }:{ onChangeUnread: (n:number)=>void }){
  const [q, setQ] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any|null>(null);
  const refresh = async () => { const list = await getQuotes(); setItems(list); onChangeUnread(list.filter(x=>!x.read).length); };
  React.useEffect(()=>{ refresh(); },[]);

  const filtered = useMemo(()=>{
    const base = items.slice().sort((a:any,b:any)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (!q.trim()) return base;
    const s = q.toLowerCase();
    return base.filter((x:any)=>[
      x.firstName, x.lastName, x.email, x.company, x.department, x.serviceType, x.projectDescription, x.additionalInfo
    ].some((v:any)=>String(v||'').toLowerCase().includes(s)));
  },[q, items]);

  const open = async (x:any) => { setSelected(x); if (!x.read){ await markQuoteRead(x.id, true); await refresh(); } };
  const del = async (x:any, e?:React.MouseEvent) => { e?.stopPropagation(); if (confirm('Delete this quote?')){ await deleteQuote(x.id); await refresh(); if(selected?.id===x.id) setSelected(null); } };

  const Badge = ({children}:{children:React.ReactNode}) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-muted text-foreground/80">{children}</span>
  );

  const Section = ({title, children}:{title:string; children:React.ReactNode}) => (
    <div>
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className="text-sm leading-6 whitespace-pre-wrap break-words">{children}</div>
    </div>
  );

  // Helpers to present JSON-like additional info in a readable way
  const tryParse = (v:any) => {
    if (v && typeof v === 'object') return v;
    if (typeof v === 'string') {
      try { return JSON.parse(v); } catch { return null; }
    }
    return null;
  };
  const labelize = (k:string) => k
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^\w|\s\w/g, (s) => s.toUpperCase());
  const renderPairs = (obj:any): React.ReactNode => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
      {Object.entries(obj).map(([k, v]) => (
        <div key={k} className="flex gap-3">
          <div className="w-32 shrink-0 text-xs text-muted-foreground">{labelize(k)}</div>
          <div className="text-sm break-words">{formatVal(v)}</div>
        </div>
      ))}
    </div>
  );
  const formatVal = (v:any): React.ReactNode => {
    if (v == null || v === '') return '—';
    if (Array.isArray(v)) return v.join(', ');
    if (typeof v === 'object') return renderPairs(v);
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    return String(v);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input className="border rounded-md px-3 py-2 w-full max-w-md" placeholder="Search quotes..." value={q} onChange={e=>setQ(e.target.value)} />
  <Button variant="outline" onClick={async ()=>{ await markAllQuotesRead(); await refresh(); }}>Mark all read</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)] gap-4">
        {/* Left: list */}
        <Card className="h-[70vh] overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="px-3 py-2 border-b text-sm text-muted-foreground">{filtered.length} quotes</div>
            <div className="flex-1 overflow-auto">
              {filtered.map((x:any)=>{
                const isActive = selected?.id === x.id;
                return (
                  <button key={x.id} onClick={()=>open(x)} className={`w-full text-left px-3 py-3 border-b hover:bg-muted/50 ${isActive ? 'bg-muted' : ''}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium truncate flex-1">
                        {!x.read && <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 align-middle"/>}
                        {x.firstName} {x.lastName}
                        <span className="mx-2 text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground truncate align-middle">{x.email}</span>
                      </div>
                      <div className="shrink-0 text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge>{x.serviceType}</Badge>
                      {x.budget && <Badge>{x.budget}</Badge>}
                      {x.timeline && <Badge>{x.timeline}</Badge>}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-2 break-words">{x.projectDescription}</div>
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" variant="destructive" onClick={(e)=>del(x,e)}>Delete</Button>
                    </div>
                  </button>
                );
              })}
              {!filtered.length && (
                <div className="px-3 py-6 text-sm text-muted-foreground">No quotes found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: detail */}
        <Card className="min-h-[50vh]">
          <CardContent className="p-4">
            {!selected ? (
              <div className="h-[60vh] flex items-center justify-center text-sm text-muted-foreground">Select a quote from the list to view details.</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold">{selected.firstName} {selected.lastName}</div>
                    <div className="text-sm text-muted-foreground">Submitted: {new Date(selected.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a className="text-sm underline" href={`mailto:${selected.email}`}>Email</a>
                    <Button size="sm" variant="destructive" onClick={()=>del(selected)}>Delete</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Section title="Contact">
                      <div className="font-medium">{selected.firstName} {selected.lastName}</div>
                      <div>{selected.email}</div>
                      {selected.phone && <div>{selected.phone}</div>}
                    </Section>
                    <Section title="Organization">
                      <div className="font-medium">{selected.company || '—'}</div>
                      {selected.department && <div>{selected.department}</div>}
                    </Section>
                  </div>
                  <div className="space-y-2">
                    <Section title="Request">
                      <div className="flex flex-wrap gap-2 mb-1">
                        <Badge>{selected.serviceType}</Badge>
                        {selected.timeline && <Badge>{selected.timeline}</Badge>}
                        {selected.budget && <Badge>{selected.budget}</Badge>}
                      </div>
                      <div className="sr-only">Meta</div>
                    </Section>
                  </div>
                </div>

                <Section title="Project Description">
                  {selected.projectDescription || '—'}
                </Section>
                {selected.additionalInfo && (
                  <Section title="Additional Info">
                    {(() => {
                      const parsed = tryParse(selected.additionalInfo);
                      if (parsed) {
                        const main = parsed.summary && typeof parsed.summary === 'object' ? parsed.summary : parsed;
                        return renderPairs(main);
                      }
                      return selected.additionalInfo;
                    })()}
                  </Section>
                )}

                <div className="border-t pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Section title="User Email">
                    {selected.submittedByEmail || '—'}
                  </Section>
                  <Section title="User Address">
                    {selected.submittedByAddress || '—'}
                  </Section>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function UserPanel(){
  const [q, setQ] = useState('');
  const [users, setUsersState] = useState<any[]>([]);
  React.useEffect(()=>{ apiListUsers().then(setUsersState).catch(()=>setUsersState([])); },[]);

  const filtered = useMemo(()=>{
    if(!q.trim()) return users;
    const s = q.toLowerCase();
    return users.filter(u => (u.name||'').toLowerCase().includes(s) || (u.email||'').toLowerCase().includes(s) || (u.role||'').toLowerCase().includes(s));
  },[q, users]);

  const onEdit = async (email:string, patch:Partial<any>) => {
    const next = users.map(u => u.email===email ? { ...u, ...patch } : u);
    setUsersState(next);
    try { await apiUpsertUser({ email, ...patch }); } catch (e:any) { alert(e.message||'Save failed'); }
  };
  const onDelete = async (email:string) => {
    if (!confirm('Delete this user?')) return;
    try { await apiDeleteUser(email); setUsersState(users.filter(u => u.email !== email)); } catch (e:any) { alert(e.message||'Delete failed'); }
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
  const [form, setForm] = useState({ name:'', description:'', imageUrl:'', imagesText:'', link:'', category:'featured' as 'featured'|'gene-editing' });
  const [hidden, setHidden] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, any>>({});
  const [custom, setCustom] = useState<any[]>([]);
  const [detailsOverrides, setDetailsOverrides] = useState<Record<string, any>>({});
  const [editing, setEditing] = useState<any|null>(null);
  const [detailsForm, setDetailsForm] = useState<any|null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Load products config from backend
  React.useEffect(()=>{
    (async()=>{
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE|| (window as any).BIOARK_API_BASE || 'http://localhost:4242'}/api/products-config`);
        const cfg = await res.json();
        setHidden(Array.isArray(cfg.hidden)?cfg.hidden:[]);
        setOverrides(cfg.overrides&&typeof cfg.overrides==='object'?cfg.overrides:{});
        setCustom(Array.isArray(cfg.products)?cfg.products:[]);
        setDetailsOverrides(cfg.details&&typeof cfg.details==='object'?cfg.details:{});
      } catch (e) {
        console.warn('Failed to load products-config from backend, fallback to in-memory defaults.', e);
      }
    })();
  },[]);

  const saveAll = async (next:{ products?:any[]; overrides?:Record<string,any>; details?:Record<string,any>; hidden?:string[] }) => {
    const payload = {
      version: 1,
      products: next.products ?? custom,
      overrides: next.overrides ?? overrides,
      details: next.details ?? detailsOverrides,
      hidden: next.hidden ?? hidden,
    };
    setCustom(payload.products);
    setOverrides(payload.overrides);
    setDetailsOverrides(payload.details);
    setHidden(payload.hidden);
    // Mirror to LocalStorage as a read cache for existing product readers (temporary shim)
    try {
      localStorage.setItem('bioark_products', JSON.stringify(payload.products));
      localStorage.setItem('bioark_products_overrides', JSON.stringify(payload.overrides));
      localStorage.setItem('bioark_product_details_overrides', JSON.stringify(payload.details));
      localStorage.setItem('bioark_products_hidden', JSON.stringify(payload.hidden));
    } catch {}
    try {
      await fetch(`${import.meta.env.VITE_API_BASE|| (window as any).BIOARK_API_BASE || 'http://localhost:4242'}/api/products-config`, {
        method:'PUT', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload)
      });
    } catch (e){ console.error('Save products-config failed', e); }
  };

  const exportProducts = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      products: custom,
      overrides,
      details: detailsOverrides,
      hidden,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bioark-products-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  };

  const onImportFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      const f = e.target.files?.[0];
      if (!f) return;
      const text = await f.text();
      const data = JSON.parse(text);
      if (data && typeof data === 'object') {
        await saveAll({
          products: Array.isArray(data.products)?data.products:undefined,
          overrides: data.overrides&&typeof data.overrides==='object'?data.overrides:undefined,
          details: data.details&&typeof data.details==='object'?data.details:undefined,
          hidden: Array.isArray(data.hidden)?data.hidden:undefined,
        });
        alert('Imported product settings. Please refresh to ensure all changes take effect.');
        e.target.value = '';
      }
    } catch (err) {
      console.error('Import failed', err);
      alert('Import failed: invalid file or corrupted content.');
    }
  };

  const applyOverrides = (item: any) => ({ ...item, ...(overrides[item.id] || {}) });
  // Build a unified list of all products: base catalog (from data) + custom entries
  const baseAll = listAllProducts().map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    link: p.link,
    category: p.id.startsWith('fp-') ? 'featured' : (p.id.startsWith('gep-') ? 'gene-editing' : 'other')
  }));
  const baseApplied = baseAll.filter(p => !hidden.includes(p.id)).map(applyOverrides);
  const customApplied = custom.filter(c => !hidden.includes(c.id));
  const all = [...baseApplied, ...customApplied];

  const matches = (p:any) => [p.name, p.description, p.link].some((s)=>String(s||'').toLowerCase().includes(q.toLowerCase()));
  const filteredAll = q ? all.filter(matches) : all;

  const saveCustom = (next: any[]) => { void saveAll({ products: next }); };
  const saveOverrides = (next: Record<string, any>) => { void saveAll({ overrides: next }); };
  const saveHidden = (next: string[]) => { void saveAll({ hidden: next }); };
  const saveDetailsOverrides = (next: Record<string, any>) => { void saveAll({ details: next }); };

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
  const images = String(form.imagesText||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  const payload = { id, name: form.name, description: form.description, imageUrl: form.imageUrl, images: images.length?images:undefined, link: form.link, category: form.category };
    saveCustom([payload, ...custom]);
    setShowAdd(false);
  setForm({ name:'', description:'', imageUrl:'', imagesText:'', link:'', category: 'featured' });
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
      images: (dOv.images || (base as any)?.images || (p.imageUrl ? [p.imageUrl] : [])),
      catalogNumber: base?.catalogNumber || '',
      availability: base?.availability || 'In Stock',
      listPrice: base?.listPrice || '',
      options: base?.options || [],
      optionPrices: (base as any)?.optionPrices || {},
      keyFeatures: base?.keyFeatures || [],
      storageStability: base?.storageStability || '',
      performanceData: base?.performanceData || '',
  manuals: base?.manuals || [],
  manualUrls: (base as any)?.manualUrls || [],
      storeLink: base?.storeLink || '',
      quoteOnly: !!(dOv.quoteOnly ?? (slug && !String(base?.catalogNumber||'').startsWith('FP'))),
      contentText: dOv.contentText || '',
      ...dispOv,
      ...dOv,
    };
    setDetailsForm({
      ...merged,
  imagesText: (merged.images||[]).join('\n'),
      optionsText: (merged.options||[]).join(', '),
      optionPricesText: Object.entries((merged.optionPrices||{} as any)).map(([k,v])=>`${k}=${v}`).join('\n'),
      keyFeaturesText: (merged.keyFeatures||[]).join('\n'),
  manualsText: (merged.manuals||[]).join(', '),
  manualUrlsText: (merged.manualUrls||[]).join(', '),
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
    const optionPricesMap = (() => {
      const txt = detailsForm.optionPricesText || '';
      const map: Record<string,string> = {};
      txt.split(/\r?\n/).map((s:string)=>s.trim()).filter(Boolean).forEach((line:string)=>{
        const idx = line.indexOf('=');
        if (idx>0) {
          const k = line.slice(0, idx).trim();
          const v = line.slice(idx+1).trim();
          if (k) map[k] = v;
        }
      });
      return map;
    })();

    const normalized = {
      catalogNumber: detailsForm.catalogNumber || '',
      availability: detailsForm.availability || '',
      listPrice: detailsForm.listPrice || '',
      options: (detailsForm.optionsText||'').split(',').map((s:string)=>s.trim()).filter(Boolean),
      optionPrices: optionPricesMap,
      keyFeatures: (detailsForm.keyFeaturesText||'').split('\n').map((s:string)=>s.trim()).filter(Boolean),
      storageStability: detailsForm.storageStability || '',
      performanceData: detailsForm.performanceData || '',
      manuals: (detailsForm.manualsText||'').split(',').map((s:string)=>s.trim()).filter(Boolean),
      manualUrls: (detailsForm.manualUrlsText||'').split(',').map((s:string)=>s.trim()).filter(Boolean),
      storeLink: detailsForm.storeLink || '',
      quoteOnly: !!detailsForm.quoteOnly,
      contentText: detailsForm.contentText || '',
      images: String(detailsForm.imagesText||'').split(/\r?\n/).map((s:string)=>s.trim()).filter(Boolean),
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
                {((p as any).images?.[0] || p.imageUrl) && <img src={(p as any).images?.[0] || p.imageUrl} alt={p.name} className="w-full h-28 object-cover rounded" />}
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
  <Button variant="outline" onClick={exportProducts}>Export</Button>
  <Button variant="outline" onClick={()=>fileRef.current?.click()}>Import</Button>
  <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button>Add</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <input className="border rounded-md px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              <textarea className="border rounded-md px-3 py-2" placeholder="Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
              <input className="border rounded-md px-3 py-2" placeholder="Cover Image URL (optional when using list below)" value={form.imageUrl} onChange={e=>setForm(f=>({...f,imageUrl:e.target.value}))} />
              <textarea className="border rounded-md px-3 py-2" rows={3} placeholder="Gallery Images (one URL per line)" value={form.imagesText} onChange={e=>setForm(f=>({...f,imagesText:e.target.value}))} />
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

      {(() => {
        // Determine type for each item based on merged details overrides
        const withType = filteredAll.map(p => {
          const slug = (p.link||'').startsWith('/products/') ? p.link!.replace('/products/','') : '';
          const det = slug ? getProductBySlug(slug) : undefined;
          const byPrefix = det?.catalogNumber ? String(det.catalogNumber).startsWith('FP') : p.id.startsWith('fp-');
          const inferred = !byPrefix; // FP -> purchasable, else quote
          const quoteOnly = (det as any)?.quoteOnly ?? inferred;
          return { ...p, __quoteOnly: !!quoteOnly } as any;
        });
        const purch = withType.filter((x:any)=>!x.__quoteOnly);
        const quote = withType.filter((x:any)=>x.__quoteOnly);
        return (
          <>
            <Section title="Purchasable (Reagents and Markers)" items={purch} />
            <Section title="Quote-only (Genome Editing / Services)" items={quote} />
          </>
        );
      })()}

      {/* Edit Details Dialog */}
      <Dialog open={!!editing} onOpenChange={(o)=>{ if(!o){ setEditing(null); setDetailsForm(null); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product Details</DialogTitle>
          </DialogHeader>
          {detailsForm && (
            <div className="grid gap-3 max-h-[70vh] overflow-auto pr-1">
              {/* Product Type */}
              <div>
                <label className="text-sm text-muted-foreground">Product Type</label>
                <select
                  className="border rounded-md px-3 py-2 w-full"
                  value={detailsForm.quoteOnly ? 'quote' : 'buy'}
                  onChange={e=>setDetailsForm((f:any)=>({...f, quoteOnly: e.target.value==='quote'}))}
                >
                  <option value="buy">Purchasable (Reagents and Markers)</option>
                  <option value="quote">Quote-only (Genome Editing / Services)</option>
                </select>
              </div>
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
                {!detailsForm.quoteOnly && (
                  <div>
                    <label className="text-sm text-muted-foreground">List Price</label>
                    <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.listPrice} onChange={e=>setDetailsForm((f:any)=>({...f,listPrice:e.target.value}))} />
                  </div>
                )}
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
                      {/* Images (multiple) */}
                      <div>
                        <label className="text-sm text-muted-foreground">Gallery Images (one URL per line)</label>
                        <textarea className="border rounded-md px-3 py-2 w-full" rows={4} value={detailsForm.imagesText||''} onChange={e=>setDetailsForm((f:any)=>({...f,imagesText:e.target.value}))} />
                        <p className="text-xs text-muted-foreground mt-1">The first line is used as the cover image. Paste external URLs or server paths (e.g., /uploads/... or /images/...).</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(detailsForm.imagesText||'').split(/\r?\n/).map((s:string)=>s.trim()).filter(Boolean).slice(0,6).map((src:string,idx:number)=>(
                            <img key={idx} src={src} alt="preview" className="h-16 w-16 object-cover rounded border" />
                          ))}
                        </div>
                        
                      </div>
              {/* Purchasable-only fields */}
              {!detailsForm.quoteOnly && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground">Options (comma separated)</label>
                    <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.optionsText} onChange={e=>setDetailsForm((f:any)=>({...f,optionsText:e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Option Prices (one per line, format: option=price) — e.g. 250 μL=$48.00</label>
                    <textarea className="border rounded-md px-3 py-2 w-full" rows={3} value={detailsForm.optionPricesText||''} onChange={e=>setDetailsForm((f:any)=>({...f,optionPricesText:e.target.value}))} />
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
                    <label className="text-sm text-muted-foreground">Manual Links (comma separated, aligns by index with Manuals)</label>
                    <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.manualUrlsText||''} onChange={e=>setDetailsForm((f:any)=>({...f,manualUrlsText:e.target.value}))} />
                    <p className="text-xs text-muted-foreground mt-1">Tip: Manuals and Links should have the same count; if a link is missing, the manual text will be displayed without a hyperlink.</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Store Link</label>
                    <input className="border rounded-md px-3 py-2 w-full" value={detailsForm.storeLink||''} onChange={e=>setDetailsForm((f:any)=>({...f,storeLink:e.target.value}))} />
                  </div>
                </>
              )}

              {/* Quote-only fields */}
              {detailsForm.quoteOnly && (
                <div>
                  <label className="text-sm text-muted-foreground">Details (Markdown supported, supports headings/bold/tables)</label>
                  <textarea className="border rounded-md px-3 py-2 w-full" rows={12} value={detailsForm.contentText||''} onChange={e=>setDetailsForm((f:any)=>({...f,contentText:e.target.value}))} />
                </div>
              )}
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
  const BLOG_MEDIA_KEY = 'bioark_blog_media_v1_paths';
  const readBlogMedia = () => { try { return JSON.parse(localStorage.getItem(BLOG_MEDIA_KEY)||'{}'); } catch { return {}; } };
  const [blogMedia, setBlogMedia] = useState<Record<string, string[]>>(readBlogMedia());
  const saveBlogMedia = (next: Record<string, string[]>) => { setBlogMedia(next); localStorage.setItem(BLOG_MEDIA_KEY, JSON.stringify(next)); };

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

  // Blog Images helpers (use files placed under public/images/blog)
  const addBlogImageByName = (raw:string) => {
    if (!editing) return;
    const name = (raw||'').trim().replace(/^\\+|^\/+/, '');
    if (!name) return;
    const key = String(editing.id);
    const list = blogMedia[key] || [];
    if (list.includes(name)) return;
    const next = { ...blogMedia, [key]: [name, ...list] };
    saveBlogMedia(next);
  };
  const insertBlogImagePathToMarkdown = async (name:string) => {
    const path = `/images/blog/${name}`;
    const snippet = `\n\n![${name}](${path})\n\n`;
    try {
      await navigator.clipboard.writeText(snippet);
      alert('Image markdown copied to clipboard. Please paste it into the Content field at your desired position.');
    } catch {
      alert('Failed to copy to clipboard. You can manually copy the snippet: ' + snippet);
    }
  };
  const setBlogCoverPath = (name:string) => {
    if (!editForm) return;
    setEditForm((f:any)=>({ ...f, coverImage: `/images/blog/${name}` }));
  };
  const removeBlogMedia = (idx:number) => {
    if (!editing) return;
    const key = String(editing.id);
    const list = blogMedia[key] || [];
    const nextList = list.filter((_,i)=>i!==idx);
    const next = { ...blogMedia, [key]: nextList };
    saveBlogMedia(next);
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
              {/* Image Guidance & Library (public/images/blog) */}
              <div className="border rounded-md p-3 bg-muted/30">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">Images</div>
                    <div className="text-xs text-muted-foreground">Place files under public/images/blog. This panel references images by filename and helps you insert Markdown linking to /images/blog/filename.</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="blog-media-name" className="border rounded-md px-2 py-1 text-sm" placeholder="filename.png (in public/images/blog)" onKeyDown={(e)=>{ if(e.key==='Enter'){ addBlogImageByName((e.target as HTMLInputElement).value); (e.target as HTMLInputElement).value=''; } }} />
                    <Button size="sm" variant="outline" onClick={()=>{ const el=document.getElementById('blog-media-name') as HTMLInputElement|null; if(el){ addBlogImageByName(el.value); el.value=''; } }}>Add</Button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(blogMedia[String(editing.id)]||[]).map((name,idx)=>(
                    <div key={idx} className="border rounded-md p-2 bg-background">
                      <div className="flex items-center gap-2">
                        <img src={`/images/blog/${name}`} alt={name} className="w-16 h-16 object-cover rounded" onError={(e)=>{ (e.currentTarget as HTMLImageElement).style.opacity='0.4'; }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate" title={name}>{name}</div>
                          <div className="text-xs text-muted-foreground truncate">/images/blog/{name}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={()=>insertBlogImagePathToMarkdown(name)}>Insert to Markdown (Path)</Button>
                        <Button size="sm" variant="outline" onClick={()=>setBlogCoverPath(name)}>Set as Cover</Button>
                        <Button size="sm" variant="destructive" onClick={()=>removeBlogMedia(idx)}>Remove</Button>
                      </div>
                    </div>
                  ))}
                  {!(blogMedia[String(editing.id)]||[]).length && (
                    <div className="text-xs text-muted-foreground">No images yet. Place files under public/images/blog, then type the filename above and click Add to preview and insert.</div>
                  )}
                </div>
              </div>
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
