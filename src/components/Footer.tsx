import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-elevated/30 mt-auto py-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <img src="/logo.png" alt="Ink Forge Logo" className="w-6 h-6 rounded-md object-cover" />
          © {new Date().getFullYear()} Ink Forge. Built for the future.
        </div>
        <div className="flex items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
