'use client';

import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bold, Italic, Heading1, Heading2, Quote } from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder = "Write your blog post in markdown..." }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = value;
    const selectedText = text.substring(start, end);
    const newValue = text.substring(0, start) + before + selectedText + after + text.substring(end);
    onChange(newValue);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-800 bg-gray-950/50 flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between p-2 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-1">
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
        {!isPreview && (
          <div className="flex items-center gap-1 bg-gray-950/50 p-1 rounded-lg border border-gray-800">
            <button type="button" onClick={() => insertText('**', '**')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => insertText('_', '_')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-700 mx-1" />
            <button type="button" onClick={() => insertText('# ', '')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Heading 1">
              <Heading1 className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => insertText('## ', '')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Heading 2">
              <Heading2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-gray-700 mx-1" />
            <button type="button" onClick={() => insertText('> ', '')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Blockquote">
              <Quote className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col relative">
        {!isPreview ? (
          <textarea
            ref={textareaRef}
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
