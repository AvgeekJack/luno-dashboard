'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ServerAccessGuardProps {
  guildId: string;
  children: React.ReactNode;
}

const DEVELOPER_USER_ID = '922940896322940929';

export default function ServerAccessGuard({ guildId, children }: ServerAccessGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [developerPinInput, setDeveloperPinInput] = useState('');
  const [showDeveloperBypass, setShowDeveloperBypass] = useState(false);
  const [verifyingPin, setVerifyingPin] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/');
      return;
    }

    const checkAccess = async () => {
      try {
        // Make a lightweight request to check access
        const res = await fetch(`/api/servers/${guildId}/settings`);
        
        if (res.status === 403) {
          // User doesn't have access
          setHasAccess(false);
          // Show developer bypass option if user is the bot owner
          if (session.user?.id === DEVELOPER_USER_ID) {
            setShowDeveloperBypass(true);
          }
        } else if (res.ok) {
          setHasAccess(true);
        } else if (res.status === 401) {
          router.push('/');
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Access check failed:', error);
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [session, status, guildId, router]);

  const handleDeveloperBypass = async () => {
    if (!developerPinInput.trim()) return;

    setVerifyingPin(true);
    try {
      const res = await fetch('/api/developer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: developerPinInput }),
      });

      if (res.ok) {
        // PIN verified, grant access
        setHasAccess(true);
        setShowDeveloperBypass(false);
      } else {
        alert('Invalid developer PIN');
      }
    } catch (error) {
      console.error('PIN verification failed:', error);
      alert('Failed to verify PIN');
    } finally {
      setVerifyingPin(false);
      setDeveloperPinInput('');
    }
  };

  if (status === 'loading' || hasAccess === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-lg">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center border border-red-500/30">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            You don't have permission to access this server's dashboard. You need the <span className="font-semibold text-purple-400">MANAGE_GUILD</span> permission to view and modify server settings.
          </p>

          {showDeveloperBypass && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <h3 className="text-yellow-400 font-semibold mb-3">Developer Bypass</h3>
              <p className="text-gray-300 text-sm mb-3">Enter your developer PIN to access this server:</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={developerPinInput}
                  onChange={(e) => setDeveloperPinInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDeveloperBypass()}
                  placeholder="Enter PIN"
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  disabled={verifyingPin}
                />
                <button
                  onClick={handleDeveloperBypass}
                  disabled={verifyingPin || !developerPinInput.trim()}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded transition-colors"
                >
                  {verifyingPin ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => router.push('/servers')}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Return to Server List
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
