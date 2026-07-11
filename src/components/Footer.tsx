import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950/80 mt-auto py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Ink Forge. All rights reserved.
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
