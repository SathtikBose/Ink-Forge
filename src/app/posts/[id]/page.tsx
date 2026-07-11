'use client';

import { useEffect, useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Heart, MessageSquare } from 'lucide-react';

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Fetch post and comments in parallel
    Promise.all([
      fetch(`/api/posts/${resolvedParams.id}`).then(res => res.json()),
      fetch(`/api/posts/${resolvedParams.id}/comments`).then(res => res.json())
    ]).then(([postData, commentsData]) => {
      if (postData.post) {
        setPost(postData.post);
        setLikesCount(postData.post.likes?.length || 0);
        // We'd need session to know if we liked, but for now we'll just check if API returns it
      }
      if (commentsData.comments) setComments(commentsData.comments);
      setLoading(false);
    });
  }, [resolvedParams.id]);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/posts/${resolvedParams.id}/like`, {
        method: 'POST',
      });
      
      if (res.status === 401) {
        setShowLoginModal(true);
        return;
      }
      
      const data = await res.json();
      
      if (res.ok) {
        setLikesCount(data.likesCount);
        setHasLiked(data.hasLiked);
      } else {
        alert(data.error || 'Failed to like post');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    setCommentError('');
    
    try {
      const res = await fetch(`/api/posts/${resolvedParams.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      
      if (res.status === 401) {
        setShowLoginModal(true);
        setSubmittingComment(false);
        return;
      }

      const data = await res.json();
      
      if (!res.ok) {
        setCommentError(data.error || 'Failed to submit comment');
      } else {
        setNewComment('');
        // Append new comment locally or refetch
        setComments([{ ...data.comment, author: { name: 'You' } }, ...comments]);
      }
    } catch (err: any) {
      setCommentError(err.message || 'An error occurred');
    }
    setSubmittingComment(false);
  };

  if (loading) return <div className="container mx-auto px-4 py-12 text-center text-gray-400">Loading post...</div>;
  if (!post) return <div className="container mx-auto px-4 py-12 text-center text-gray-400">Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight leading-tight">{post.title}</h1>
      
      <div className="flex items-center gap-4 mb-10 pb-8 border-b border-surface-border">
        {post.author?.image ? (
          <img src={post.author.image} alt={post.author.name} className="w-12 h-12 rounded-full border border-surface-border object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {post.author?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{post.author?.name || 'Anonymous'}</p>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {post.coverImage && (
        <div className="mb-12 w-full rounded-3xl overflow-hidden border border-surface-border shadow-2xl">
          <img src={post.coverImage} alt={post.title} className="w-full max-h-[500px] object-cover" />
        </div>
      )}

      <div className="prose prose-lg dark:prose-invert prose-indigo max-w-none mb-16 dark:prose-p:text-gray-300 dark:prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary-hover">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>{post.content}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-4 py-8 border-t border-surface-border">
        <button onClick={handleLike} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-elevated hover:bg-surface-border border border-surface-border text-gray-900 dark:text-gray-100 transition-colors shadow-sm">
          <Heart className={`w-5 h-5 transition-colors ${hasLiked ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} /> 
          <span className="font-medium">{likesCount} Likes</span>
        </button>
        <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-elevated border border-surface-border text-gray-900 dark:text-gray-100 shadow-sm">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="font-medium">{comments.length} Comments</span>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Discussion</h3>
        
        <form onSubmit={handleCommentSubmit} className="mb-12">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the discussion... (Requires Login)"
            className="w-full min-h-[120px] p-5 rounded-2xl bg-surface-elevated border border-surface-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none mb-4 text-gray-900 dark:text-gray-100 shadow-sm transition-all"
            required
          />
          {commentError && <p className="text-red-500 text-sm mb-4 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{commentError}</p>}
          <button 
            type="submit" 
            disabled={submittingComment || !newComment.trim()}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            {submittingComment ? 'Submitting...' : 'Post Comment (AI Checked)'}
          </button>
        </form>

        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment._id || Math.random()} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                {comment.author?.image ? (
                  <img src={comment.author.image} alt={comment.author.name} className="w-10 h-10 rounded-full border border-surface-border object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {comment.author?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div>
                  <span className="font-bold text-gray-900 dark:text-gray-100 block">{comment.author?.name || 'Unknown'}</span>
                  <span className="text-xs text-gray-500">{new Date(comment.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to start the discussion!</p>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-surface/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Login Required</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">You need to be signed in to interact with this post. Join the Ink Forge community!</p>
            <div className="flex gap-4">
              <a href="/login" className="flex-1 bg-primary hover:bg-primary-hover text-white text-center py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:scale-[1.02]">
                Log In
              </a>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="flex-1 bg-surface-elevated border border-surface-border hover:bg-surface-border text-gray-900 dark:text-white text-center py-3 rounded-xl font-bold transition-all hover:scale-[1.02]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
