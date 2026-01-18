'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserDropdown from '@/components/UserDropdown';
import { useState } from 'react';

interface ServerHeaderProps {
  guildId?: string;
}

export default function ServerHeader({ guildId }: ServerHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
            <span className="text-lg sm:text-xl font-bold text-[#0f172a]">LUNO</span>
          </Link>
        </div>

        {session?.user && (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/servers"
              className="hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-xs sm:text-sm"
            >
              Manage Servers
            </Link>
            <Link 
              href="/servers"
              className="sm:hidden px-3 py-1.5 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors text-xs"
            >
              Servers
            </Link>
            <UserDropdown 
              userName={session.user.name || 'User'}
              userImage={session.user.image ?? undefined}
            />
          </div>
        )}
      </div>
    </header>
  );
}
