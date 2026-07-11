import Link from 'next/link';
import { getSession } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/50 transition-shadow">
            IF
          </div>
          <span className="tracking-tight">Ink Forge</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-6">
              <Link href="/dashboard/writer" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/explore" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Explore
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Profile Settings">
                {session.image ? (
                  <img src={session.image} alt={session.name} className="w-9 h-9 rounded-full object-cover border border-surface-border shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {session.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <span className="text-sm font-medium hidden md:block dark:text-white text-gray-900">{session.name}</span>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Link>
            </>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
