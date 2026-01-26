'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEVELOPER_USER_ID = '922940896322940929';

interface SiteSetting {
  _id: string;
  settingKey: string;
  settingValue: any;
  description?: string;
  updatedAt: string;
  updatedBy?: string;
}

export default function DeveloperPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: string }>({});
  
  const [newSettingKey, setNewSettingKey] = useState('');
  const [newSettingValue, setNewSettingValue] = useState('');
  const [newSettingDescription, setNewSettingDescription] = useState('');
  const [showNewSettingForm, setShowNewSettingForm] = useState(false);
  
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
      fetchSettings();
    } catch (error) {
      console.error('PIN verification error:', error);
      setVerifyError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/developer/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, newValue: any) => {
    setSaveStatus({ ...saveStatus, [settingKey]: 'saving' });
    
    try {
      const response = await fetch('/api/developer/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingKey, settingValue: newValue }),
      });

      if (response.ok) {
        setSaveStatus({ ...saveStatus, [settingKey]: 'saved' });
        setTimeout(() => {
          setSaveStatus({ ...saveStatus, [settingKey]: '' });
        }, 2000);
        fetchSettings();
      } else {
        setSaveStatus({ ...saveStatus, [settingKey]: 'error' });
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      setSaveStatus({ ...saveStatus, [settingKey]: 'error' });
    }
  };

  const createNewSetting = async () => {
    if (!newSettingKey.trim()) {
      alert('Setting key is required');
      return;
    }

    try {
      const response = await fetch('/api/developer/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          settingKey: newSettingKey, 
          settingValue: newSettingValue,
          description: newSettingDescription 
        }),
      });

      if (response.ok) {
        setNewSettingKey('');
        setNewSettingValue('');
        setNewSettingDescription('');
        setShowNewSettingForm(false);
        fetchSettings();
      } else {
        alert('Failed to create setting');
      }
    } catch (error) {
      console.error('Failed to create setting:', error);
      alert('Failed to create setting');
    }
  };

  const deleteSetting = async (settingKey: string) => {
    if (!confirm(`Are you sure you want to delete setting "${settingKey}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/developer/settings?settingKey=${settingKey}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSettings();
      } else {
        alert('Failed to delete setting');
      }
    } catch (error) {
      console.error('Failed to delete setting:', error);
      alert('Failed to delete setting');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isDeveloper) {
    return null;
  }

  // PIN verification screen
  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-red-500 text-4xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-white mb-2">Developer Access</h1>
            <p className="text-gray-400">Enter PIN to continue</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyPin()}
                placeholder="Enter PIN"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-center text-2xl tracking-widest"
                maxLength={10}
                autoFocus
              />
            </div>

            {verifyError && (
              <div className="text-red-500 text-sm text-center">
                {verifyError}
              </div>
            )}

            <button
              onClick={handleVerifyPin}
              disabled={isVerifying}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold"
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">🔧 Developer Control Panel</h1>
              <p className="text-gray-400">Master controls for the entire site</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              ← Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>Authenticated as Developer</span>
            <span className="ml-4">User ID: {session?.user?.id}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Site Settings */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Site-Wide Settings</h2>
                <button
                  onClick={() => setShowNewSettingForm(!showNewSettingForm)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm"
                >
                  {showNewSettingForm ? 'Cancel' : '+ Add Setting'}
                </button>
              </div>

              {/* New Setting Form */}
              {showNewSettingForm && (
                <div className="mb-6 p-4 bg-gray-700 rounded-lg space-y-3">
                  <input
                    type="text"
                    value={newSettingKey}
                    onChange={(e) => setNewSettingKey(e.target.value)}
                    placeholder="Setting Key (e.g., featureXEnabled)"
                    className="w-full px-4 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={newSettingValue}
                    onChange={(e) => setNewSettingValue(e.target.value)}
                    placeholder="Setting Value (e.g., true, false, 100)"
                    className="w-full px-4 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={newSettingDescription}
                    onChange={(e) => setNewSettingDescription(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full px-4 py-2 bg-gray-600 text-white border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={createNewSetting}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Create Setting
                  </button>
                </div>
              )}

              {/* Settings List */}
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div
                    key={setting._id}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{setting.settingKey}</h3>
                          {saveStatus[setting.settingKey] === 'saving' && (
                            <span className="text-yellow-500 text-sm">Saving...</span>
                          )}
                          {saveStatus[setting.settingKey] === 'saved' && (
                            <span className="text-green-500 text-sm">✓ Saved</span>
                          )}
                          {saveStatus[setting.settingKey] === 'error' && (
                            <span className="text-red-500 text-sm">✗ Error</span>
                          )}
                        </div>
                        {setting.description && (
                          <p className="text-gray-400 text-sm mb-3">{setting.description}</p>
                        )}
                        <div className="flex items-center gap-4">
                          {typeof setting.settingValue === 'boolean' ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={setting.settingValue}
                                onChange={(e) => updateSetting(setting.settingKey, e.target.checked)}
                                className="w-5 h-5 rounded"
                              />
                              <span className="text-sm">
                                {setting.settingValue ? 'Enabled' : 'Disabled'}
                              </span>
                            </label>
                          ) : typeof setting.settingValue === 'number' ? (
                            <input
                              type="number"
                              value={setting.settingValue}
                              onChange={(e) => updateSetting(setting.settingKey, parseInt(e.target.value))}
                              className="px-3 py-1 bg-gray-600 text-white border border-gray-500 rounded focus:outline-none focus:border-blue-500 w-32"
                            />
                          ) : (
                            <input
                              type="text"
                              value={setting.settingValue}
                              onChange={(e) => updateSetting(setting.settingKey, e.target.value)}
                              className="px-3 py-1 bg-gray-600 text-white border border-gray-500 rounded focus:outline-none focus:border-blue-500 flex-1"
                            />
                          )}
                          <button
                            onClick={() => deleteSetting(setting.settingKey)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        {setting.updatedAt && (
                          <p className="text-gray-500 text-xs mt-2">
                            Last updated: {new Date(setting.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {settings.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No settings configured yet. Click "Add Setting" to create one.
                </div>
              )}
            </div>

            {/* Bot Server Management */}
            <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-purple-400 mb-4">🤖 Bot Server Management</h2>
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
                    className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
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
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  >
                    {removeStatus === 'loading' ? 'Removing...' : 'Remove Bot'}
                  </button>
                </div>
                
                {removeMessage && (
                  <div className={`p-4 rounded-lg whitespace-pre-wrap ${ 
                    removeStatus === 'success' 
                      ? 'bg-green-900/30 border border-green-700 text-green-400' 
                      : 'bg-red-900/30 border border-red-700 text-red-400'
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
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">⭐ Premium Management</h2>
              <p className="text-gray-400 mb-4">
                Grant or revoke premium access for a server by entering the Guild ID.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={premiumGuildId}
                    onChange={(e) => setPremiumGuildId(e.target.value)}
                    placeholder="Enter Guild ID"
                    className="flex-1 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-yellow-500"
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
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
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
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  >
                    {premiumStatus === 'loading' ? 'Removing...' : 'Remove Premium'}
                  </button>
                </div>
                
                {premiumMessage && (
                  <div className={`p-4 rounded-lg whitespace-pre-wrap ${ 
                    premiumStatus === 'success' 
                      ? 'bg-green-900/30 border border-green-700 text-green-400' 
                      : 'bg-red-900/30 border border-red-700 text-red-400'
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
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-400 mb-4">🚫 User Ban Management</h2>
              <p className="text-gray-400 mb-4">
                Ban or unban users from accessing the website. Banned users can only access the home page.
              </p>
              <div className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    value={banUserId}
                    onChange={(e) => setBanUserId(e.target.value)}
                    placeholder="Enter User ID"
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-red-500"
                    disabled={banStatus === 'loading'}
                  />
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Ban reason (optional but recommended)"
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 h-24 resize-none"
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
                      className="flex-1 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
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
                      className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                    >
                      {banStatus === 'loading' ? 'Unbanning...' : 'Unban User'}
                    </button>
                  </div>
                </div>
                
                {banMessage && (
                  <div className={`p-4 rounded-lg whitespace-pre-wrap ${ 
                    banStatus === 'success' 
                      ? 'bg-green-900/30 border border-green-700 text-green-400' 
                      : 'bg-red-900/30 border border-red-700 text-red-400'
                  }`}>
                    {banMessage}
                  </div>
                )}
                
                <p className="text-gray-500 text-sm">
                  ⚠️ Warning: Banned users will be automatically signed out and redirected to the home page.
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-red-500 mb-4">⚠️ Danger Zone</h2>
              <p className="text-gray-400 mb-4">
                These actions have site-wide impact. Use with caution.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to enable maintenance mode?')) {
                      updateSetting('maintenanceMode', true);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  Enable Maintenance Mode
                </button>
                <button
                  onClick={() => fetchSettings()}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  🔄 Refresh Settings
                </button>
              </div>
            </div>

            {/* Info Panel */}
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-400 mb-2">ℹ️ Information</h2>
              <ul className="text-gray-400 space-y-1 text-sm">
                <li>• All changes are logged with your user ID</li>
                <li>• Boolean settings use toggle switches</li>
                <li>• Numeric settings can be adjusted with number inputs</li>
                <li>• Settings are applied immediately across the site</li>
                <li>• You can create custom settings for new features</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
