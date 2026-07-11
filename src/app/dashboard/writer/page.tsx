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
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Writer <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dashboard</span></h1>
        <Link href="/dashboard/writer/new" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          <PlusCircle className="w-5 h-5" /> New Post
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="glass-card p-8 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary rounded-2xl shadow-inner border border-primary/20"><FileText className="w-7 h-7" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-8 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-500 rounded-2xl shadow-inner border border-pink-500/20"><Heart className="w-7 h-7" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-8 group">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-500 rounded-2xl shadow-inner border border-cyan-500/20"><MessageSquare className="w-7 h-7" /></div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Comments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white border-b border-surface-border pb-4">Your Posts</h2>
      
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
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
              <div>
                <Link href={`/posts/${post._id}`} className="font-bold text-xl text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors block mb-2">
                  {post.title}
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${post.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : post.status === 'REJECTED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                    {post.status}
                  </span>
                </div>
                {post.status === 'REJECTED' && (
                  <div className="mt-4 bg-red-500/5 p-4 rounded-xl border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                    <span className="font-bold block mb-1">AI Moderation Feedback:</span>
                    {post.aiFeedback}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Link href={`/dashboard/writer/edit/${post._id}`} className="px-5 py-2.5 rounded-xl bg-surface-elevated border border-surface-border hover:bg-surface-border text-gray-900 dark:text-white text-sm font-bold transition-colors shadow-sm">
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
