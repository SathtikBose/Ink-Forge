'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Explore() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = () => {
      setLoading(true);
      const query = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : '';
      fetch(`/api/posts?status=PUBLISHED${query}`)
        .then(res => res.json())
        .then(data => {
          if (data.posts) setPosts(data.posts);
          setLoading(false);
        });
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold">Explore Blogs</h1>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-xl leading-5 bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
          />
        </div>
      </div>
      
      {loading ? (
        <p className="text-gray-400">Loading amazing content...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-400">No published posts yet. Be the first to write one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <Link key={post._id} href={`/posts/${post._id}`} className="group block rounded-2xl bg-gray-950/50 border border-gray-800 hover:border-indigo-500/50 transition-colors overflow-hidden flex flex-col">
              {post.coverImage && (
                <div className="w-full h-48 bg-gray-900 border-b border-gray-800">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
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
                <p className="text-gray-400 line-clamp-3 mb-6 flex-1">
                  {post.content.replace(/[#*`>]/g, '')}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
                  <div className="flex items-center gap-1">
                    <span className="text-pink-500">♥</span> {post.likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span> {post.comments?.length || 0}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
