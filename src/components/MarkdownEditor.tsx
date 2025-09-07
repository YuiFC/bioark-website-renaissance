import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { uploadImageBase64, fetchImageByUrl } from '@/lib/media';

type Props = {
  value: string;
  onChange: (v: string) => void;
  // Save under /public/images/<folder>
  folder?: string; // e.g. 'blog' | 'services' | 'products'
};

// Minimal editor: left = textarea, right = preview (basic rendering)
export default function MarkdownEditor({ value, onChange, folder = 'blog' }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  function insertAtCursor(text: string) {
    const el = textareaRef.current;
    if (!el) {
      onChange((value || '') + text);
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);
    const next = before + text + after;
    onChange(next);
    // restore cursor after inserted text
    const caret = start + text.length;
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = caret;
    });
  }

  async function handleChooseFile() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = String(reader.result || '');
        const name = file.name;
        const { path } = await uploadImageBase64(folder, name, dataUrl);
        const alt = name.replace(/\.[^.]+$/, '').replace(/[\-_]+/g, ' ');
        insertAtCursor(`\n\n![${alt}](${path})\n\n`);
        alert(`Image uploaded and inserted: ${path}`);
      } catch (err: any) {
        alert(`Upload failed: ${err?.message || String(err)}`);
      } finally {
        // reset value so the same file can be selected again
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => alert('Failed to read the selected file.');
    reader.readAsDataURL(file);
  }

  async function handleImportFromUrl() {
    const url = window.prompt('Enter a direct image URL (must be publicly accessible):');
    if (!url) return;
    try {
      const suggested = url.split('/').pop() || 'image';
      const name = window.prompt('Save as (filename, optional):', suggested) || suggested;
      const { path } = await fetchImageByUrl(folder, url, name);
      const alt = name.replace(/\.[^.]+$/, '').replace(/[\-_]+/g, ' ');
      insertAtCursor(`\n\n![${alt}](${path})\n\n`);
      alert(`Image imported and inserted: ${path}`);
    } catch (err: any) {
      alert(`Import failed: ${err?.message || String(err)}`);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button type="button" className="px-2 py-1 text-sm border rounded" onClick={handleChooseFile}>
            Upload Image
          </button>
          <button type="button" className="px-2 py-1 text-sm border rounded" onClick={handleImportFromUrl}>
            Import from URL
          </button>
          <span className="text-xs text-muted-foreground ml-2">Images will be saved under /images/{folder}. A Markdown link will be inserted automatically.</span>
        </div>
        <textarea
          ref={textareaRef}
          className="w-full min-h-72 p-3 border rounded-md bg-background"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write in Markdown..."
        />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <div className="prose max-w-none border rounded-md p-3 bg-muted/30 overflow-auto">
        {value ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value}
          </ReactMarkdown>
        ) : 'Preview'}
      </div>
    </div>
  );
}
