'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEVELOPER_USER_ID = '922940896322940929';

export default function DeveloperPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [guildIdToRemove, setGuildIdToRemove] = useState('');
  const [removeStatus, setRemoveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [removeMessage, setRemoveMessage] = useState('');
  
  const [premiumGuildId, setPremiumGuildId] = useState('');
  const [premiumStatus, setPremiumStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [premiumMessage, setPremiumMessage] = useState('');
  
  const [banUserId, setBanUserId] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banStatus, setBanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [banMessage, setBanMessage] = useState('');
  
  const [userViewId, setUserViewId] = useState('');
  const [userViewStatus, setUserViewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [userViewMessage, setUserViewMessage] = useState('');
  const [userViewData, setUserViewData] = useState<any>(null);
  
  const [defaultsStatus, setDefaultsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [defaultsMessage, setDefaultsMessage] = useState('');
  const [serverDefaults, setServerDefaults] = useState({
    prefix: '!',
    premium: false,
    modules: {
      moderation: { enabled: true },
      roleManagement: { enabled: false },
      memberManagement: { enabled: false },
      announcements: { enabled: false },
      fun: { enabled: false },
      utilities: { enabled: false },
      notifications: { enabled: false },
    }
  });
  
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceStatus, setMaintenanceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [maintenanceMessage, setMaintenanceMessage] = useState('');

  // Check if user is developer
  const isDeveloper = session?.user?.id === DEVELOPER_USER_ID;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    if (status === 'authenticated' && !isDeveloper) {
      router.push('/');
    }
  }, [status, isDeveloper, router]);

  const handleVerifyPin = async () => {
    if (!pin.trim()) {
      setVerifyError('Please enter PIN');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');

    try {
      const response = await fetch('/api/developer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        const data = await response.json();
        setVerifyError(data.error || 'Invalid PIN');
        setIsVerifying(false);
        return;
      }

      setIsVerified(true);
      setPin('');
      fetchServerDefaults();
      fetchMaintenanceStatus();
    } catch (error) {
      console.error('PIN verification error:', error);
      setVerifyError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchServerDefaults = async () => {
    try {
      const response = await fetch('/api/developer/reset-defaults');
      if (response.ok) {
        const data = await response.json();
        setServerDefaults(data.defaults);
      }
    } catch (error) {
      console.error('Failed to fetch server defaults:', error);
    }
  };

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceMode(data.maintenanceMode ?? false);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance status:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!isDeveloper) {
    return null;
  }

  // PIN verification screen
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border-2 border-orange-500">
          <div className="text-center mb-6">
            <div className="text-orange-500 text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Developer Access</h1>
            <p className="text-gray-600">Enter PIN to continue</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyPin()}
                placeholder="Enter PIN"
                className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 text-center text-2xl tracking-widest"
                maxLength={10}
                autoFocus
              />
            </div>

            {verifyError && (
              <div className="text-orange-600 text-sm text-center font-medium">
                {verifyError}
              </div>
            )}

            <button
              onClick={handleVerifyPin}
              disabled={isVerifying}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold shadow-md"
            >
              {isVerifying ? 'Verifying...' : 'Verify PIN'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main developer panel
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🔧 Developer Control Panel</h1>
              <p className="text-gray-600">Master controls for the entire site</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-white border-2 border-orange-500 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors shadow-md"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="font-medium">Authenticated as Developer</span>
            <span className="ml-4">User ID: {session?.user?.id}</span>
          </div>
        </div>

        <div className="space-y-6">
            {/* Maintenance Mode Toggle */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-orange-600 mb-2">🛠️ Maintenance Mode</h2>
                  <p className="text-gray-600">
                    Enable to prevent all users (except you) from accessing the site. Users will see a maintenance screen.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={async (e) => {
                      const newValue = e.target.checked;
                      setMaintenanceStatus('loading');
                      setMaintenanceMessage('');
                      
                      try {
                        const response = await fetch('/api/site-settings', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ maintenanceMode: newValue }),
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                          setMaintenanceMode(newValue);
                          setMaintenanceStatus('success');
                          setMaintenanceMessage(data.message || `Maintenance mode ${newValue ? 'enabled' : 'disabled'} successfully`);
                          setTimeout(() => {
                            setMaintenanceStatus('idle');
                            setMaintenanceMessage('');
                          }, 3000);
                        } else {
                          // Reset to previous value on error
                          setMaintenanceMode(!newValue);
                          setMaintenanceStatus('error');
                          setMaintenanceMessage(data.error || 'Failed to update maintenance mode');
                          console.error('Maintenance mode update failed:', data);
                        }
                      } catch (error) {
                        console.error('Maintenance mode error:', error);
                        // Reset to previous value on error
                        setMaintenanceMode(!newValue);
                        setMaintenanceStatus('error');
                        setMaintenanceMessage('Failed to update maintenance mode');
                      }
                    }}
                    disabled={maintenanceStatus === 'loading'}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-orange-600 shadow-inner"></div>
                </label>
              </div>
              
              {maintenanceMessage && (
                <div className={`mt-4 p-3 rounded-lg font-medium ${ 
                  maintenanceStatus === 'success' 
                    ? 'bg-orange-50 border-2 border-orange-500 text-orange-700' 
                    : 'bg-red-50 border-2 border-red-500 text-red-700'
                }`}>
                  {maintenanceMessage}
                </div>
              )}
              
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-orange-600">⚠️ Note:</span> When enabled, only you (developer) can bypass the maintenance screen using your PIN.
                </p>
              </div>
            </div>

            {/* Bot Server Management */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-orange-400 mb-4">🤖 Bot Server Management</h2>
              <p className="text-gray-400 mb-4">
                Remove the bot from a specific server by entering the Guild ID.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={guildIdToRemove}
                    onChange={(e) => setGuildIdToRemove(e.target.value)}
                    placeholder="Enter Guild ID (e.g., 123456789012345678)"
                    className="flex-1 px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    disabled={removeStatus === 'loading'}
                  />
                  <button
                    onClick={async () => {
                      if (!guildIdToRemove.trim()) {
                        setRemoveMessage('Please enter a Guild ID');
                        setRemoveStatus('error');
                        return;
                      }
                      
                      if (!confirm(`Are you sure you want to remove the bot from server ${guildIdToRemove}?`)) {
                        return;
                      }
                      
                      setRemoveStatus('loading');
                      setRemoveMessage('');
                      
                      try {
                        const response = await fetch('/api/developer/remove-bot', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ guildId: guildIdToRemove }),
                        });
                        
                        const data = await response.json();
                        
                        console.log('Remove bot response:', response.status, data);
                        
                        if (response.ok) {
                          setRemoveStatus('success');
                          setRemoveMessage(data.message || 'Bot removed successfully');
                          setGuildIdToRemove('');
                          setTimeout(() => {
                            setRemoveStatus('idle');
                            setRemoveMessage('');
                          }, 5000);
                        } else {
                          setRemoveStatus('error');
                          const errorMsg = data.error || 'Failed to remove bot';
                          const details = data.details ? `\n\nDetails: ${JSON.stringify(data.details, null, 2)}` : '';
                          setRemoveMessage(`${errorMsg}${details}`);
                          console.error('Discord API Error Details:', data.details);
                        }
                      } catch (error) {
                        console.error('Remove bot error:', error);
                        setRemoveStatus('error');
                        setRemoveMessage('Failed to remove bot from server');
                      }
                    }}
                    disabled={removeStatus === 'loading' || !guildIdToRemove.trim()}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  >
                    {removeStatus === 'loading' ? 'Removing...' : 'Remove Bot'}
                  </button>
                </div>
                
                {removeMessage && (
                  <div className={`p-4 rounded-lg whitespace-pre-wrap ${ 
                    removeStatus === 'success' 
                      ? 'bg-orange-900/30 border border-orange-700 text-orange-400' 
                      : 'bg-orange-900/30 border border-orange-700 text-orange-400'
                  }`}>
                    {removeMessage}
                  </div>
                )}
                
                <p className="text-gray-500 text-sm">
                  ℹ️ Note: The bot will leave the server immediately. This action cannot be undone.
                </p>
              </div>
            </div>

            {/* Premium Management */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-orange-600 mb-4">⭐ Premium Management</h2>
              <p className="text-gray-600 mb-4">
                Grant or revoke premium access for a server by entering the Guild ID.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={premiumGuildId}
                    onChange={(e) => setPremiumGuildId(e.target.value)}
                    placeholder="Enter Guild ID"
                    className="flex-1 px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    disabled={premiumStatus === 'loading'}
                  />
                  <button
                    onClick={async () => {
                      if (!premiumGuildId.trim()) {
                        setPremiumMessage('Please enter a Guild ID');
                        setPremiumStatus('error');
                        return;
                      }
                      
                      setPremiumStatus('loading');
                      setPremiumMessage('');
                      
                      try {
                        const response = await fetch('/api/developer/premium', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ guildId: premiumGuildId, premium: true }),
                        });
                        
                        const data = await response.json();
                        console.log('Premium grant response:', response.status, data);
                        
                        if (response.ok) {
                          setPremiumStatus('success');
                          setPremiumMessage(data.message || 'Premium granted successfully');
                          setTimeout(() => {
                            setPremiumStatus('idle');
                            setPremiumMessage('');
                          }, 5000);
                        } else {
                          setPremiumStatus('error');
                          setPremiumMessage(data.error || 'Failed to grant premium');
                        }
                      } catch (error) {
                        console.error('Premium grant error:', error);
                        setPremiumStatus('error');
                        setPremiumMessage('Failed to grant premium');
                      }
                    }}
                    disabled={premiumStatus === 'loading' || !premiumGuildId.trim()}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  >
                    {premiumStatus === 'loading' ? 'Granting...' : 'Grant Premium'}
                  </button>
                  <button
                    onClick={async () => {
                      if (!premiumGuildId.trim()) {
                        setPremiumMessage('Please enter a Guild ID');
                        setPremiumStatus('error');
                        return;
                      }
                      
                      if (!confirm(`Remove premium from server ${premiumGuildId}?`)) {
                        return;
                      }
                      
                      setPremiumStatus('loading');
                      setPremiumMessage('');
                      
                      try {
                        const response = await fetch('/api/developer/premium', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ guildId: premiumGuildId, premium: false }),
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                          setPremiumStatus('success');
                          setPremiumMessage(data.message || 'Premium removed successfully');
                          setTimeout(() => {
                            setPremiumStatus('idle');
                            setPremiumMessage('');
                          }, 5000);
                        } else {
                          setPremiumStatus('error');
                          setPremiumMessage(data.error || 'Failed to remove premium');
                        }
                      } catch (error) {
                        console.error('Premium remove error:', error);
                        setPremiumStatus('error');
                        setPremiumMessage('Failed to remove premium');
                      }
                    }}
                    disabled={premiumStatus === 'loading' || !premiumGuildId.trim()}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors shadow-md"
                  >
                    {premiumStatus === 'loading' ? 'Removing...' : 'Remove Premium'}
                  </button>
                </div>
                
                {premiumMessage && (
                  <div className={`p-4 rounded-lg whitespace-pre-wrap ${ 
                    premiumStatus === 'success' 
                      ? 'bg-orange-900/30 border border-orange-700 text-orange-400' 
                      : 'bg-orange-900/30 border border-orange-700 text-orange-400'
                  }`}>
                    {premiumMessage}
                  </div>
                )}
                
                <p className="text-gray-500 text-sm">
                  ℹ️ Note: Premium status is stored in MongoDB and takes effect immediately.
                </p>
              </div>
            </div>

            {/* User Ban Management */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-orange-600 mb-4">🚫 User Ban Management</h2>
              <p className="text-gray-600 mb-4">
                Ban or unban users from accessing the website. Banned users can only access the home page.
              </p>
              <div className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={banUserId}
                    onChange={(e) => setBanUserId(e.target.value)}
                    placeholder="Enter User ID"
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    disabled={banStatus === 'loading'}
                  />
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Ban reason (optional but recommended)"
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                    disabled={banStatus === 'loading'}
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={async () => {
                        if (!banUserId.trim()) {
                          setBanMessage('Please enter a User ID');
                          setBanStatus('error');
                          return;
                        }
                        
                        if (!confirm(`Ban user ${banUserId}? They will be blocked from all pages except the home page.`)) {
                          return;
                        }
                        
                        setBanStatus('loading');
                        setBanMessage('');
                        
                        try {
                          const response = await fetch('/api/developer/ban-user', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              userId: banUserId, 
                              banned: true,
                              reason: banReason.trim() || 'No reason provided'
                            }),
                          });
                          
                          const data = await response.json();
                          
                          if (response.ok) {
                            setBanStatus('success');
                            setBanMessage(data.message || 'User banned successfully');
                            setBanUserId('');
                            setBanReason('');
                            setTimeout(() => {
                              setBanStatus('idle');
                              setBanMessage('');
                            }, 5000);
                          } else {
                            setBanStatus('error');
                            setBanMessage(data.error || 'Failed to ban user');
                          }
                        } catch (error) {
                          console.error('Ban user error:', error);
                          setBanStatus('error');
                          setBanMessage('Failed to ban user');
                        }
                      }}
                      disabled={banStatus === 'loading' || !banUserId.trim()}
                      className="flex-1 px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                    >
                      {banStatus === 'loading' ? 'Banning...' : 'Ban User'}
                    </button>
                    <button
                      onClick={async () => {
                        if (!banUserId.trim()) {
                          setBanMessage('Please enter a User ID');
                          setBanStatus('error');
                          return;
                        }
                        
                        setBanStatus('loading');
                        setBanMessage('');
                        
                        try {
                          const response = await fetch('/api/developer/ban-user', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: banUserId, banned: false }),
                          });
                          
                          const data = await response.json();
                          
                          if (response.ok) {
                            setBanStatus('success');
                            setBanMessage(data.message || 'User unbanned successfully');
                            setBanUserId('');
                            setBanReason('');
                            setTimeout(() => {
                              setBanStatus('idle');
                              setBanMessage('');
                            }, 5000);
                          } else {
                            setBanStatus('error');
                            setBanMessage(data.error || 'Failed to unban user');
                          }
                        } catch (error) {
                          console.error('Unban user error:', error);
                          setBanStatus('error');
                          setBanMessage('Failed to unban user');
                        }
                      }}
                      disabled={banStatus === 'loading' || !banUserId.trim()}
                      className="flex-1 px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                    >
                      {banStatus === 'loading' ? 'Unbanning...' : 'Unban User'}
                    </button>
                  </div>
                </div>
                
                {banMessage && (
                  <div className={`p-4 rounded-lg whitespace-pre-wrap ${ 
                    banStatus === 'success' 
                      ? 'bg-orange-900/30 border border-orange-700 text-orange-400' 
                      : 'bg-orange-900/30 border border-orange-700 text-orange-400'
                  }`}>
                    {banMessage}
                  </div>
                )}
                
                <p className="text-gray-500 text-sm">
                  ⚠️ Warning: Banned users will be automatically signed out and redirected to the home page.
                </p>
              </div>
            </div>

            {/* User Account View */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-orange-600 mb-4">👤 User Account View</h2>
              <p className="text-gray-600 mb-4">
                View any user's account information and their accessible servers.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={userViewId}
                    onChange={(e) => setUserViewId(e.target.value)}
                    placeholder="Enter User ID (e.g., 123456789012345678)"
                    className="flex-1 px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                    disabled={userViewStatus === 'loading'}
                  />
                  <button
                    onClick={async () => {
                      if (!userViewId.trim()) {
                        setUserViewMessage('Please enter a User ID');
                        setUserViewStatus('error');
                        return;
                      }
                      
                      setUserViewStatus('loading');
                      setUserViewMessage('');
                      setUserViewData(null);
                      
                      try {
                        const response = await fetch(`/api/developer/user-view?userId=${userViewId}`);
                        const data = await response.json();
                        
                        if (response.ok) {
                          setUserViewStatus('success');
                          setUserViewData(data);
                          setUserViewMessage('');
                        } else {
                          setUserViewStatus('error');
                          setUserViewMessage(data.error || 'Failed to fetch user data');
                          setUserViewData(null);
                        }
                      } catch (error) {
                        console.error('User view error:', error);
                        setUserViewStatus('error');
                        setUserViewMessage('Failed to fetch user data');
                        setUserViewData(null);
                      }
                    }}
                    disabled={userViewStatus === 'loading' || !userViewId.trim()}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  >
                    {userViewStatus === 'loading' ? 'Loading...' : 'View Account'}
                  </button>
                </div>
                
                {userViewMessage && (
                  <div className="p-4 rounded-lg bg-orange-900/30 border border-orange-700 text-orange-400">
                    {userViewMessage}
                  </div>
                )}
                
                {userViewData && (
                  <div className="space-y-4">
                    {/* User Info Card */}
                    <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200 shadow-md">
                      <h3 className="text-lg font-semibold text-orange-700 mb-4">User Information</h3>
                      <div className="flex items-center gap-4">
                        {userViewData.user.avatar ? (
                          <img
                            src={`https://cdn.discordapp.com/avatars/${userViewData.user.id}/${userViewData.user.avatar}.png?size=128`}
                            alt="Avatar"
                            className="w-16 h-16 rounded-full"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-orange-600 flex items-center justify-center text-2xl font-bold">
                            {userViewData.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xl font-bold text-gray-900">
                              {userViewData.user.globalName || userViewData.user.username}
                            </h4>
                            {userViewData.user.bot && (
                              <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-semibold rounded">BOT</span>
                            )}
                          </div>
                          <p className="text-gray-700">@{userViewData.user.username}</p>
                          <p className="text-gray-600 text-sm">ID: {userViewData.user.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Servers List */}
                    <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200 shadow-md">
                      <h3 className="text-lg font-semibold text-orange-700 mb-4">
                        Accessible Servers ({userViewData.guildsCount})
                      </h3>
                      {userViewData.guilds.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">
                          This user has no servers with MANAGE_GUILD permission where Luno is present.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {userViewData.guilds.map((guild: any) => (
                            <a
                              key={guild.id}
                              href={`/servers/${guild.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-orange-100 transition-colors border-2 border-orange-200 hover:border-orange-500 shadow-sm"
                            >
                              {guild.icon ? (
                                <img
                                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64`}
                                  alt=""
                                  className="w-12 h-12 rounded-full"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center font-bold">
                                  {guild.name.charAt(0)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900 truncate">{guild.name}</p>
                                  {guild.owner && (
                                    <span className="px-1.5 py-0.5 bg-orange-600 text-white text-xs font-semibold rounded">OWNER</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 truncate">ID: {guild.id}</p>
                              </div>
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <p className="text-gray-500 text-sm">
                  ℹ️ Note: Only shows servers where the bot is present and the user has MANAGE_GUILD permission.
                </p>
              </div>
            </div>

            {/* New Server Defaults Configuration */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-orange-600 mb-4">🆕 New Server Defaults</h2>
              <p className="text-gray-600 mb-6">
                Configure default settings that will be applied when a server first adds the bot and sets up their dashboard.
              </p>
              
              <div className="space-y-6">
                {/* Prefix Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Command Prefix
                  </label>
                  <input
                    type="text"
                    value={serverDefaults.prefix}
                    onChange={(e) => setServerDefaults({ ...serverDefaults, prefix: e.target.value })}
                    placeholder="!"
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    The default prefix for bot commands (e.g., "!", "/", ".")
                  </p>
                </div>

                {/* Premium Setting */}
                <div className="flex items-center justify-between p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Default Premium Status</h3>
                    <p className="text-sm text-gray-600">Enable premium features by default for new servers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serverDefaults.premium}
                      onChange={(e) => setServerDefaults({ ...serverDefaults, premium: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </div>

                {/* Modules Configuration */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-700 mb-4">Default Module States</h3>
                  <div className="space-y-3">
                    {/* Moderation Module */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Moderation</span>
                        <p className="text-xs text-gray-600">Ban, kick, timeout, warn, etc.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serverDefaults.modules.moderation.enabled}
                          onChange={(e) => setServerDefaults({
                            ...serverDefaults,
                            modules: { ...serverDefaults.modules, moderation: { enabled: e.target.checked } }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Role Management Module */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Role Management</span>
                        <p className="text-xs text-gray-600">Create, delete, manage roles</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serverDefaults.modules.roleManagement.enabled}
                          onChange={(e) => setServerDefaults({
                            ...serverDefaults,
                            modules: { ...serverDefaults.modules, roleManagement: { enabled: e.target.checked } }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Member Management Module */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Member Management</span>
                        <p className="text-xs text-gray-600">User info, avatars, roles</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serverDefaults.modules.memberManagement.enabled}
                          onChange={(e) => setServerDefaults({
                            ...serverDefaults,
                            modules: { ...serverDefaults.modules, memberManagement: { enabled: e.target.checked } }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Announcements Module */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Announcements</span>
                        <p className="text-xs text-gray-600">Announcements, giveaways, polls</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serverDefaults.modules.announcements.enabled}
                          onChange={(e) => setServerDefaults({
                            ...serverDefaults,
                            modules: { ...serverDefaults.modules, announcements: { enabled: e.target.checked } }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Fun Module */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Fun</span>
                        <p className="text-xs text-gray-600">Memes, jokes, games</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serverDefaults.modules.fun.enabled}
                          onChange={(e) => setServerDefaults({
                            ...serverDefaults,
                            modules: { ...serverDefaults.modules, fun: { enabled: e.target.checked } }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Utilities Module */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Utilities</span>
                        <p className="text-xs text-gray-600">Server info, ping, help</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serverDefaults.modules.utilities.enabled}
                          onChange={(e) => setServerDefaults({
                            ...serverDefaults,
                            modules: { ...serverDefaults.modules, utilities: { enabled: e.target.checked } }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Notifications Module */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900">Notifications</span>
                        <p className="text-xs text-gray-600">Welcome/leave messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={serverDefaults.modules.notifications.enabled}
                          onChange={(e) => setServerDefaults({
                            ...serverDefaults,
                            modules: { ...serverDefaults.modules, notifications: { enabled: e.target.checked } }
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={async () => {
                    setDefaultsStatus('loading');
                    setDefaultsMessage('');
                    
                    try {
                      const response = await fetch('/api/developer/reset-defaults', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ defaults: serverDefaults }),
                      });
                      
                      const data = await response.json();
                      
                      if (response.ok) {
                        setDefaultsStatus('success');
                        setDefaultsMessage('Default server configuration saved successfully!');
                        setTimeout(() => {
                          setDefaultsStatus('idle');
                          setDefaultsMessage('');
                        }, 5000);
                      } else {
                        setDefaultsStatus('error');
                        setDefaultsMessage(data.error || 'Failed to save defaults');
                      }
                    } catch (error) {
                      console.error('Save defaults error:', error);
                      setDefaultsStatus('error');
                      setDefaultsMessage('Failed to save default configuration');
                    }
                  }}
                  disabled={defaultsStatus === 'loading'}
                  className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition-colors"
                >
                  {defaultsStatus === 'loading' ? 'Saving...' : '💾 Save Default Configuration'}
                </button>

                {/* Status Message */}
                {defaultsMessage && (
                  <div className={`p-4 rounded-lg ${ 
                    defaultsStatus === 'success' 
                      ? 'bg-green-900/30 border border-green-700 text-green-400' 
                      : 'bg-red-900/30 border border-red-700 text-red-400'
                  }`}>
                    {defaultsMessage}
                  </div>
                )}

                <p className="text-gray-500 text-sm">
                  ℹ️ Note: These settings will only apply to NEW servers that add the bot. Existing servers will not be affected.
                </p>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-white border-2 border-orange-500 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-orange-600 mb-2">ℹ️ Information</h2>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• All changes are logged and saved to the database</li>
                <li>• Server defaults apply only to NEW servers that add the bot</li>
                <li>• Existing servers will keep their current settings</li>
                <li>• Premium status can be granted/revoked at any time</li>
                <li>• Bot removal from servers is immediate and cannot be undone</li>
              </ul>
            </div>
          </div>
      </div>
    </div>
  );
}
