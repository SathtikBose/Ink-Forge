'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setCoverImage(data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('An error occurred while uploading');
    }
    setUploading(false);
  };

  const handlePublish = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, coverImage, status: 'PUBLISHED' }),
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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Create <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">New Post</span></h1>
        <button 
          onClick={handlePublish}
          disabled={loading || !title || !content}
          className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] w-full md:w-auto"
        >
          {loading ? 'Publishing...' : 'Publish (AI Checked)'}
        </button>
      </div>

      {error && (
        <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400">
          <p className="font-bold mb-1">Could not publish your post</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-8 glass-card p-8">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Cover Image (Optional)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
            />
            {uploading && <span className="text-sm font-medium text-primary animate-pulse">Uploading...</span>}
          </div>
          {coverImage && (
            <div className="mt-6 w-full rounded-2xl overflow-hidden border border-surface-border shadow-md">
              <img src={coverImage} alt="Cover Preview" className="w-full h-64 object-cover" />
            </div>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Post Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-600 text-gray-900 dark:text-white py-4"
          />
        </div>
        
        <div className="min-h-[400px]">
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}
