import Link from 'next/link';
import { ArrowRight, PenTool, Sparkles, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 flex flex-col items-center text-center px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
          Write with Freedom, <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Publish with Confidence.
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          Ink Forge is a next-generation blog platform featuring AI-powered moderation to ensure high-quality content and safe discussions for everyone.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="px-8 py-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] flex items-center gap-2">
            Start Writing <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/explore" className="px-8 py-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg transition-colors border border-gray-700">
            Explore Blogs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 bg-gray-900/50 border-y border-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-950/50 border border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Rich Markdown Editor</h3>
              <p className="text-gray-400 leading-relaxed">
                Focus on your writing with our beautiful, distraction-free markdown editor tailored for modern authors.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gray-950/50 border border-gray-800 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6 relative z-10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10">AI Moderation</h3>
              <p className="text-gray-400 leading-relaxed relative z-10">
                Our smart AI automatically reviews posts and comments, ensuring a safe and constructive environment.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-950/50 border border-gray-800 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Feedback</h3>
              <p className="text-gray-400 leading-relaxed">
                Get actionable feedback from AI if your content violates guidelines, helping you improve and publish.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
