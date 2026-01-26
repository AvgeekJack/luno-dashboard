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
