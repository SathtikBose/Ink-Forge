'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MessageSquareText } from 'lucide-react';

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">Explore <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Blogs</span></h1>
        
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-surface-border rounded-xl leading-5 bg-surface-elevated/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm backdrop-blur-sm transition-all"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card h-[400px]" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">No published posts yet. Be the first to write one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <Link key={post._id} href={`/posts/${post._id}`} className="group block glass-card hover:border-primary/50 transition-all hover:-translate-y-1 overflow-hidden flex flex-col">
              {post.coverImage && (
                <div className="w-full h-52 bg-surface-elevated border-b border-surface-border overflow-hidden">
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <div className="flex items-center gap-3 mb-5">
                  {post.author?.image ? (
                    <img src={post.author.image} alt={post.author.name} className="w-8 h-8 rounded-full border border-surface-border object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {post.author?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{post.author?.name || 'Anonymous'}</span>
                  <span className="text-gray-400 dark:text-gray-600 mx-1">•</span>
                  <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {post.content.replace(/[#*`>]/g, '')}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500 mt-auto pt-4 border-t border-surface-border/50">
                  <div className="flex items-center gap-2 group-hover:text-pink-500 transition-colors">
                    <span className="text-pink-500">♥</span> {post.likes?.length || 0}
                  </div>
                  <div className="flex items-center gap-2 group-hover:text-primary transition-colors">
                    <MessageSquareText className="w-4 h-4" /> {post.comments?.length || 0}
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
