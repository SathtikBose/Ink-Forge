'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '@/components/MarkdownEditor';

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetch(`/api/posts/${resolvedParams.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.post) {
          setTitle(data.post.title);
          setContent(data.post.content);
          setCoverImage(data.post.coverImage || '');
        } else {
          setError('Post not found');
        }
        setLoading(false);
      });
  }, [resolvedParams.id]);

  const handleUpdate = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, coverImage, status: 'PUBLISHED' }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.message || data.error || 'Failed to update post');
      } else {
        router.push('/dashboard/writer');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/posts/${resolvedParams.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard/writer');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete post');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 text-gray-400">Loading editor...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <div className="flex gap-4">
          <button 
            onClick={handleDelete}
            className="text-red-400 hover:text-red-300 font-medium px-4 py-2 transition-colors"
          >
            Delete
          </button>
          <button 
            onClick={handleUpdate}
            disabled={saving || !title || !content}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Update (AI Checked)'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          <p className="font-semibold mb-1">Issue</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Cover Image (Optional)</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
            />
            {uploading && <span className="text-sm text-gray-400">Uploading...</span>}
          </div>
          {coverImage && (
            <img src={coverImage} alt="Cover Preview" className="mt-4 w-full h-48 object-cover rounded-xl border border-gray-800" />
          )}
        </div>

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
