import { fetchJson, getApiBase } from './api';

export type ImageAsset = {
  id: number | string;
  status: 'processing' | 'completed' | 'failed';
  altText?: string | null;
  fileName: string;
  mimeType?: string | null;
  size?: number | null;
  variants: Record<string, string>; // e.g., { original: "/uploads/originals/.." }
  createdAt?: string;
};

export async function requestUpload(file: File): Promise<{ uploadUrl: string; storageKey: string; headers: Record<string,string> }>{
  const r = await fetchJson<{ uploadUrl:string; storageKey:string; headers:Record<string,string> }>(
    '/admin/images/request-upload',
    { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ fileName: file.name, mimeType: file.type, size: file.size }) }
  );
  return r;
}

export async function uploadBinary(uploadUrl: string, file: File, headers: Record<string,string> = {}): Promise<void>{
  const base = getApiBase();
  const isAbsolute = /^https?:\/\//.test(uploadUrl) || uploadUrl.startsWith('/content-api');
  const url = isAbsolute ? uploadUrl : `${base}${uploadUrl}`;
  const r = await fetch(url, { method:'PUT', headers, body: file });
  if (!r.ok) throw new Error(`Upload failed: HTTP ${r.status}`);
}

export async function finalizeUpload(input: { storageKey: string; fileName: string; mimeType: string; size: number }): Promise<ImageAsset>{
  const r = await fetchJson<{ image: ImageAsset }>(
    '/admin/images/finalize-upload',
    { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(input) }
  );
  return r.image;
}

export async function importImage(url: string, fileName?: string): Promise<ImageAsset>{
  const r = await fetchJson<{ image: ImageAsset }>(
    '/admin/images/import',
    { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ url, fileName }) }
  );
  return r.image;
}

export async function listImages(): Promise<ImageAsset[]>{
  const r = await fetchJson<{ images: ImageAsset[] }>('/admin/images');
  return Array.isArray(r.images) ? r.images : [];
}

export async function deleteImageAsset(id: number|string): Promise<void>{
  await fetchJson(`/admin/images/${encodeURIComponent(String(id))}`, { method:'DELETE' });
}
