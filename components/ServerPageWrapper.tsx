'use client';

import { useSession } from 'next-auth/react';
import MaintenanceScreen from '@/components/MaintenanceScreen';
import { useMaintenanceCheck } from '@/lib/hooks/useMaintenanceCheck';
import { ReactNode } from 'react';

interface ServerPageWrapperProps {
  children: ReactNode;
}

export default function ServerPageWrapper({ children }: ServerPageWrapperProps) {
  const { data: session } = useSession();
  const { shouldShowMaintenance, loading } = useMaintenanceCheck();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (shouldShowMaintenance) {
    return <MaintenanceScreen userId={session?.user?.id} />;
  }

  return <>{children}</>;
}
