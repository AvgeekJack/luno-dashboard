'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function BanCheckWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [banInfo, setBanInfo] = useState<{ banned: boolean; reason: string | null } | null>(null);

  useEffect(() => {
    const checkBanStatus = async () => {
      if (status === 'loading') return;
      
      // Allow unauthenticated users
      if (!session?.user?.id) {
        setChecking(false);
        return;
      }

      // Allow access to home page always
      if (pathname === '/') {
        setChecking(false);
        return;
      }

      // Check if user is banned
      try {
        const response = await fetch(`/api/developer/ban-user?userId=${session.user.id}`);
        const data = await response.json();

        if (data.banned) {
          setBanInfo({ banned: true, reason: data.reason });
          // Sign out the user
          await signOut({ redirect: false });
          // Redirect to home
          router.push('/');
        } else {
          setChecking(false);
        }
      } catch (error) {
        console.error('Error checking ban status:', error);
        setChecking(false);
      }
    };

    checkBanStatus();
  }, [session, status, pathname, router]);

  // Show loading state while checking
  if (checking && pathname !== '/') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show ban message if banned
  if (banInfo?.banned) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              Your account has been banned from accessing this website.
            </p>
            {banInfo.reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold text-red-800 mb-1">Reason:</p>
                <p className="text-sm text-red-700">{banInfo.reason}</p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              If you believe this is a mistake, please contact support.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
