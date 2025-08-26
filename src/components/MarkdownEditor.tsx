import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

// Minimal editor: left = textarea, right = preview (basic rendering)
export default function MarkdownEditor({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <textarea
        className="w-full min-h-72 p-3 border rounded-md bg-background"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write in Markdown..."
      />
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
