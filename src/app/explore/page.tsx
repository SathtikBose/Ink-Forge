'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Explore() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts?status=PUBLISHED')
      .then(res => res.json())
      .then(data => {
        if (data.posts) setPosts(data.posts);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8">Explore Blogs</h1>
      
      {loading ? (
        <p className="text-gray-400">Loading amazing content...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">No published posts yet. Be the first to write one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <Link key={post._id} href={`/posts/${post._id}`} className="group block p-6 rounded-2xl bg-gray-950/50 border border-gray-800 hover:border-indigo-500/50 transition-colors">
              <h2 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold">
                  {post.author?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-sm text-gray-400">{post.author?.name || 'Anonymous'}</span>
                <span className="text-gray-600 mx-1">•</span>
                <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-400 line-clamp-3">
                {/* Strip markdown for excerpt, just showing raw text or fallback */}
                {post.content.replace(/[#*`>]/g, '')}
              </p>
              
              <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-pink-500">♥</span> {post.likes?.length || 0}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
