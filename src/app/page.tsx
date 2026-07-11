import Link from 'next/link';
import { ShieldCheck, Zap, MessageSquareText, PenTool } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-5 dark:opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 font-medium text-sm mb-8 border border-indigo-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>AI-Protected Blog Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Forge Your Thoughts,<br/>Without the Toxicity.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Discover beautifully crafted articles and write your own. Our AI ensures that every post and comment is constructive, keeping the community safe.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/explore" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]"
            >
              Explore Blogs
            </Link>
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800 font-bold transition-all"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Markdown Editing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Write beautifully formatted blogs using our intuitive markdown editor. Add images, code blocks, and rich text effortlessly.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-6 relative z-10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">AI Moderation</h3>
              <p className="text-gray-600 dark:text-gray-400 relative z-10">
                Powered by Nvidia's Llama 3.1, every post and comment is scanned instantly to reject toxicity and maintain a healthy community.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-6">
                <MessageSquareText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Engage & Discuss</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to like your favorite posts and join the conversation in the comments section.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
