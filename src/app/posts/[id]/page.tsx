'use client';

import { useEffect, useState, use } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">{post.title}</h1>
      
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-800">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
          {post.author?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <p className="font-semibold text-gray-200">{post.author?.name || 'Anonymous'}</p>
          <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {post.coverImage && (
        <div className="mb-10 w-full rounded-2xl overflow-hidden border border-gray-800">
          <img src={post.coverImage} alt={post.title} className="w-full max-h-[500px] object-cover" />
        </div>
      )}

      <div className="prose prose-invert prose-indigo max-w-none mb-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <div className="flex items-center gap-4 py-6 border-t border-gray-800">
        <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-300 transition-colors">
          <Heart className={`w-5 h-5 transition-colors ${hasLiked ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} /> 
          <span>{likesCount} Likes</span>
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-gray-300">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <span>{comments.length} Comments</span>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Discussion</h3>
        
        <form onSubmit={handleCommentSubmit} className="mb-10">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the discussion... (Requires Login)"
            className="w-full min-h-[100px] p-4 rounded-xl bg-gray-900 border border-gray-800 focus:border-indigo-500 outline-none resize-none mb-3"
            required
          />
          {commentError && <p className="text-red-400 text-sm mb-3 font-medium bg-red-500/10 p-2 rounded">{commentError}</p>}
          <button 
            type="submit" 
            disabled={submittingComment || !newComment.trim()}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 px-6 py-2 rounded-lg font-medium text-white transition-colors"
          >
            {submittingComment ? 'Submitting...' : 'Post Comment (AI Checked)'}
          </button>
        </form>

        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment._id || Math.random()} className="p-4 rounded-xl bg-gray-950/50 border border-gray-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">
                  {comment.author?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="font-medium text-gray-300">{comment.author?.name || 'Unknown'}</span>
                <span className="text-xs text-gray-500">• {new Date(comment.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-300">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to start the discussion!</p>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-gray-400 mb-8">You need to be signed in to interact with this post. Join the Ink Forge community!</p>
            <div className="flex gap-4">
              <a href="/login" className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-center py-2 rounded-lg font-medium transition-colors">
                Log In
              </a>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
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
