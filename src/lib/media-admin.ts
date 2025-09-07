import { fetchJson } from './api';

export type MediaFile = { name: string; path: string; size: number; mtime: number };
export type MediaFolder = { name: string; files: MediaFile[] };

export async function listMedia(): Promise<{ folders: MediaFolder[] }>{
  const r = await fetchJson<{ ok:boolean; folders: MediaFolder[] }>('/media-list');
  return { folders: r.folders || [] };
}

export async function deleteImage(folder: string, name: string): Promise<void>{
  await fetchJson('/delete-image', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ folder, name }) });
}
