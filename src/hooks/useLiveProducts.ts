import React from 'react';
import { fetchJson, getApiBase } from '@/lib/api';

export interface LiveProductItem { id: string; name: string; link: string; createdAt?: number }
export interface LiveCategoriesResponse { categories: Record<string, LiveProductItem[]>; ordered: string[] }

interface State {
  loading: boolean;
  error: string | null;
  categories: Record<string, LiveProductItem[]>;
  ordered: string[];
  version: number | null;
  updatedAt: number | null;
}

function shallowEqualProducts(a: Record<string, LiveProductItem[]>, b: Record<string, LiveProductItem[]>){
  const ak = Object.keys(a); const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak){
    if (!b[k]) return false;
    const al = a[k]; const bl = b[k];
    if (al.length !== bl.length) return false;
    for (let i=0;i<al.length;i++){
      const x = al[i]; const y = bl[i];
      if (x.id!==y.id || x.name!==y.name || x.link!==y.link || (x.createdAt||0)!==(y.createdAt||0)) return false;
    }
  }
  return true;
}

export function useLiveProducts(){
  const [state, setState] = React.useState<State>({ loading: true, error: null, categories: {}, ordered: [], version: null, updatedAt: null });
  const reloadRef = React.useRef(0);

  // Initial + manual fetch
  const load = React.useCallback(async ()=>{
    try {
      const data = await fetchJson<LiveCategoriesResponse>('/public/products/categories');
      let categories = data.categories;
      let ordered = data.ordered;
      // Fallback: categories empty -> build from /public/products (overrides-based)
      if (!ordered.length) {
        try {
          const raw:any = await fetchJson<any>('/public/products');
          const hidden = new Set(Array.isArray(raw.hidden)?raw.hidden:[]);
          const list = Array.isArray(raw.products)?raw.products:[];
          const map: Record<string, LiveProductItem[]> = {};
          for (const p of list){
            if (!p || hidden.has(p.id)) continue;
            if (!p.link || !p.link.startsWith('/products/')) continue;
            const cat = String(p.category||'uncategorized').trim().toLowerCase();
            if (!map[cat]) map[cat] = [];
            map[cat].push({ id: p.id, name: p.name, link: p.link, createdAt: p.createdAt });
          }
          Object.keys(map).forEach(c => { map[c] = map[c].slice().sort((a,b)=> (Number(a.createdAt||0) < Number(b.createdAt||0) ? 1 : -1)); });
          const ord = Object.keys(map).sort();
          categories = map; ordered = ord;
        } catch {}
      }
      setState(prev => shallowEqualProducts(prev.categories, categories)
        ? { ...prev, loading:false, error:null }
        : { ...prev, categories, ordered, loading:false, error:null, updatedAt: Date.now() });
    } catch (e:any){
      setState(prev => ({ ...prev, loading:false, error: e?.message||'Load failed' }));
    }
  },[]);

  React.useEffect(()=>{ load(); }, [load, reloadRef.current]);

  // SSE subscription
  React.useEffect(()=>{
    let es: EventSource | null = null;
    const base = getApiBase().replace(/\/api\/?$/,'');
    try {
      es = new EventSource(`${base}/api/public/products/stream`);
      es.addEventListener('update', (ev)=>{
        try {
          const parsed = JSON.parse(ev.data||'{}');
          // Throttle refetch: fetch after small debounce to accumulate bursts
          scheduleFetch();
          setState(prev => ({ ...prev, version: parsed.version||prev.version }));
        } catch {}
      });
      es.addEventListener('error', ()=>{
        // Attempt silent reconnect by recreating source later
        cleanup();
        setTimeout(()=>{ reloadRef.current++; load(); }, 3000);
      });
    } catch {}
    let fetchTimer: any = null;
    function scheduleFetch(){
      if (fetchTimer) return; // collapse multiple events
      fetchTimer = setTimeout(()=>{ fetchTimer = null; load(); }, 400);
    }
    function cleanup(){
      if (fetchTimer) { clearTimeout(fetchTimer); fetchTimer = null; }
      try { es && es.close(); } catch {}
    }
    return cleanup;
  }, [load]);

  const reload = React.useCallback(()=>{ reloadRef.current++; load(); }, [load]);
  return { ...state, reload };
}
