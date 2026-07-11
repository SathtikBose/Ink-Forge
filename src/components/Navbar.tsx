import Link from 'next/link';
import { getSession, logout } from '@/lib/auth';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-50 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
            IF
          </div>
          Ink Forge
        </Link>
        
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-6">
              <Link href={session.role === 'WRITER' ? '/dashboard/writer' : '/explore'} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {session.role === 'WRITER' ? 'Dashboard' : 'Explore'}
              </Link>
              <Link href="/dashboard/settings" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Profile Settings">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {session.name?.[0]?.toUpperCase() || '?'}
                </div>
                <span className="text-sm font-medium hidden md:block">{session.name}</span>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
