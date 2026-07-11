'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to register');
      } else {
        router.push('/dashboard/writer');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface to-secondary/5 pointer-events-none" />
      <div className="w-full max-w-md p-10 glass-card relative z-10 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary" />
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">Create an Account</h1>
        
        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-5 py-3 rounded-xl bg-surface-elevated/50 border border-surface-border text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-5 py-3 rounded-xl bg-surface-elevated/50 border border-surface-border text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-5 py-3 rounded-xl bg-surface-elevated/50 border border-surface-border text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm" />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all mt-8 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link href="/login" className="text-primary hover:text-primary-hover font-bold transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
}
