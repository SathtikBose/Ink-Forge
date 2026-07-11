'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, FileText, Heart, MessageSquare } from 'lucide-react';

export default function WriterDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/posts?status=ALL&authorId=me')
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch posts');
        return data;
      })
      .then(data => {
        if (data.posts) setPosts(data.posts);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Writer Dashboard</h1>
        <Link href="/dashboard/writer/new" className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <PlusCircle className="w-5 h-5" /> New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl bg-gray-950/50 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg"><FileText /></div>
            <div>
              <p className="text-sm text-gray-400">Total Posts</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-gray-950/50 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg"><Heart /></div>
            <div>
              <p className="text-sm text-gray-400">Total Likes</p>
              <p className="text-2xl font-bold">{posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-gray-950/50 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><MessageSquare /></div>
            <div>
              <p className="text-sm text-gray-400">Total Comments</p>
              <p className="text-2xl font-bold">{posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-2">Your Posts</h2>
      
      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          <p className="font-semibold mb-1">Error Loading Dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      ) : loading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">You haven't written any posts yet. Start writing!</p>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="p-4 rounded-xl bg-gray-950/30 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Link href={`/posts/${post._id}`} className="font-semibold text-lg hover:text-indigo-400 transition-colors">
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : post.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {post.status}
                  </span>
                </div>
                {post.status === 'REJECTED' && (
                  <p className="text-sm text-red-400 mt-2 bg-red-500/5 p-2 rounded border border-red-500/10">
                    <span className="font-semibold text-red-500">AI Feedback:</span> {post.aiFeedback}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/writer/edit/${post._id}`} className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
