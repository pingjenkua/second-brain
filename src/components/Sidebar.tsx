'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: '🏠 Dashboard', icon: '🏠' },
  { href: '/memories', label: '💭 Memories', icon: '💭' },
  { href: '/documents', label: '📄 Documents', icon: '📄' },
  { href: '/tasks', label: '✅ Tasks', icon: '✅' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-zinc-900 border-r border-zinc-800 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">🧠 Second Brain</h1>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
