import Link from 'next/link';
import { ShieldCheck, Zap, MessageSquareText, PenTool } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-surface to-secondary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba')] bg-cover bg-center opacity-5 dark:opacity-20 mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8 border border-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="w-4 h-4" />
            <span>AI-Protected Blog Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 dark:text-white">
            Forge Your Thoughts,<br/>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-glow">Without the Toxicity.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover beautifully crafted articles and write your own. Our AI ensures that every post and comment is constructive, keeping the community safe.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/explore" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95"
            >
              Explore Blogs
            </Link>
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-surface-elevated border border-surface-border hover:bg-surface-border text-gray-900 dark:text-white font-bold transition-all hover:scale-105 active:scale-95"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 shadow-inner border border-cyan-500/20">
                <PenTool className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Markdown Editing</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Write beautifully formatted blogs using our intuitive markdown editor. Add images, code blocks, and rich text effortlessly.
              </p>
            </div>
            
            <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary flex items-center justify-center mb-6 shadow-inner border border-primary/20 relative z-10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white text-gray-900 relative z-10">AI Moderation</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">
                Powered by Nvidia's Llama 3.1, every post and comment is scanned instantly to reject toxicity and maintain a healthy community.
              </p>
            </div>
            
            <div className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 text-pink-400 flex items-center justify-center mb-6 shadow-inner border border-pink-500/20">
                <MessageSquareText className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Engage & Discuss</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Sign in to like your favorite posts and join the conversation in the comments section.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
