import { fetchJson } from './api';

export async function uploadImageBase64(folder: string, name: string, dataUrl: string): Promise<{ path: string; name: string }>{
  const r = await fetchJson<{ ok:boolean; path:string; name:string }>(
    '/upload-image',
    { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ folder, name, dataUrl }) }
  );
  return { path: r.path, name: r.name };
}

export async function fetchImageByUrl(folder: string, url: string, name?: string): Promise<{ path: string; name: string }>{
  const r = await fetchJson<{ ok:boolean; path:string; name:string }>(
    '/fetch-image',
    { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ folder, url, name }) }
  );
  return { path: r.path, name: r.name };
}
