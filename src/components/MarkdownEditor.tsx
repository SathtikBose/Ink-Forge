'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder = "Write your blog post in markdown..." }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-950/50 flex flex-col min-h-[500px]">
      <div className="flex items-center gap-2 p-2 border-b border-gray-800 bg-gray-900/50">
        <button
          type="button"
          onClick={() => setIsPreview(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!isPreview ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setIsPreview(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPreview ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
        >
          Preview
        </button>
      </div>
      
      <div className="flex-1 flex flex-col relative">
        {!isPreview ? (
          <textarea
            className="w-full h-full min-h-[450px] p-4 bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none focus:ring-0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        ) : (
          <div className="w-full h-full min-h-[450px] p-4 bg-gray-950 overflow-y-auto prose prose-invert prose-indigo max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value || '*Nothing to preview...*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
