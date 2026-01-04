'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ServerHeaderProps {
  guildId?: string;
}

export default function ServerHeader({ guildId }: ServerHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#0f172a]">LUNO</span>
          </Link>
        </div>

        {session?.user && (
          <div className="flex items-center gap-4">
            <Link 
              href="/servers"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
            >
              Manage Servers
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-sm font-semibold text-[#0f172a]">
                {session.user.name || 'User'}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
