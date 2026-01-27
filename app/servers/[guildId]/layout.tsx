'use client';

import ServerAccessGuard from '@/components/ServerAccessGuard';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { guildId } = useParams();
  const router = useRouter();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  useEffect(() => {
    if (!gid) {
      router.push('/servers');
    }
  }, [gid, router]);

  if (!gid) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <ServerAccessGuard guildId={gid}>
      {children}
    </ServerAccessGuard>
  );
}
