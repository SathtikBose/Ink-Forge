'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePublish = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, status: 'PUBLISHED' }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || data.error || 'Failed to create post');
      } else {
        router.push('/dashboard/writer');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <button 
          onClick={handlePublish}
          disabled={loading || !title || !content}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Publishing...' : 'Publish (AI Checked)'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          <p className="font-semibold mb-1">Could not publish your post</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-gray-600 text-white py-2"
          />
        </div>
        
        <MarkdownEditor value={content} onChange={setContent} />
      </div>
    </div>
  );
}
