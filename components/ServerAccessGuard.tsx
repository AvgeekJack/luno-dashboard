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
  const [showDeveloperPin, setShowDeveloperPin] = useState(false);
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);

  // Check if developer PIN is already verified in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const verified = sessionStorage.getItem('developerPinVerified');
      if (verified === 'true') {
        setPinVerified(true);
      }
    }
  }, []);

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
        } else if (res.ok) {
          const data = await res.json();
          
          // If user is developer and not owner of this guild, require PIN
          if (session.user?.id === DEVELOPER_USER_ID && !data.isOwner && !pinVerified) {
            setShowDeveloperPin(true);
            setHasAccess(null);
            return;
          }
          
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
  }, [session, status, guildId, router, pinVerified]);

  const handleDeveloperPinVerification = async () => {
    if (!developerPinInput.trim()) return;

    setVerifyingPin(true);
    try {
      const res = await fetch('/api/developer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: developerPinInput }),
      });

      if (res.ok) {
        // PIN verified, store in session storage
        sessionStorage.setItem('developerPinVerified', 'true');
        setPinVerified(true);
        setShowDeveloperPin(false);
        // Trigger access check
        setHasAccess(null);
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

  // Show developer PIN screen if developer hasn't verified yet
  if (showDeveloperPin && session?.user?.id === DEVELOPER_USER_ID && !pinVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-yellow-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 text-center border border-yellow-500/30">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Developer Verification Required</h1>
          <p className="text-yellow-400 font-semibold mb-4">
            🔒 Bot Owner Account Detected
          </p>
          <p className="text-gray-300 mb-6">
            You are attempting to access a server you don't own. For security purposes, please enter your developer PIN. This verification will remain active for your current session.
          </p>

          <div className="mb-6">
            <div className="flex gap-2">
              <input
                type="password"
                value={developerPinInput}
                onChange={(e) => setDeveloperPinInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDeveloperPinVerification()}
                placeholder="Enter Developer PIN"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center text-lg font-mono"
                disabled={verifyingPin}
                autoFocus
              />
            </div>
            <button
              onClick={handleDeveloperPinVerification}
              disabled={verifyingPin || !developerPinInput.trim()}
              className="w-full mt-3 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-colors text-lg"
            >
              {verifyingPin ? 'Verifying...' : '🔓 Verify & Continue'}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={() => router.push('/servers')}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Server List
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't show separate loading screen - let the page handle its own loading state
  // Just silently check permissions in the background
  if (status === 'loading' || hasAccess === null) {
    return <>{children}</>;
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
