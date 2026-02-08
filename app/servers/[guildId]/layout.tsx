'use client';

import ServerAccessGuard from '@/components/ServerAccessGuard';
import DashboardTour from '@/components/DashboardTour';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { guildId } = useParams();
  const router = useRouter();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!gid) {
      router.push('/servers');
      return;
    }

    // Check sessionStorage for active tour
    const tourActive = sessionStorage.getItem(`tour-active-${gid}`);
    if (tourActive === 'true') {
      setShowTour(true);
    }

    // Listen for tour start event from dashboard page
    const handleStartTour = () => {
      sessionStorage.setItem(`tour-active-${gid}`, 'true');
      setShowTour(true);
    };

    window.addEventListener('start-dashboard-tour', handleStartTour);

    return () => {
      window.removeEventListener('start-dashboard-tour', handleStartTour);
    };
  }, [gid, router]);

  const handleEndTour = () => {
    setShowTour(false);
    sessionStorage.removeItem(`tour-active-${gid}`);
    // Navigate back to dashboard
    router.push(`/servers/${gid}`);
  };

  if (!gid) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <ServerAccessGuard guildId={gid}>
      {children}
      
      {/* Dashboard Tour - persists across page navigation */}
      <DashboardTour
        isOpen={showTour}
        onClose={handleEndTour}
      />
    </ServerAccessGuard>
  );
}
