'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DEVELOPER_USER_ID = '922940896322940929';

interface Settings {
  guildId: string;
  prefix: string;
  premium?: boolean;
  configuration?: {
    botNickname: string;
    timezone: string;
    updatesChannel?: string;
    automod?: {
      enabled: boolean;
    };
    logging?: {
      enabled: boolean;
    };
    antiraid?: {
      enabled: boolean;
    };
    reactionRoles?: {
      enabled: boolean;
    };
    verification?: {
      enabled: boolean;
    };
  };
  modules?: {
    moderation?: { enabled: boolean };
    roleManagement?: { enabled: boolean };
    memberManagement?: { enabled: boolean };
    announcements?: { enabled: boolean };
    welcomeMessages?: { enabled: boolean };
    fun?: { enabled: boolean };
    utilities?: { enabled: boolean };
    notifications?: { enabled: boolean };
  };
}

interface Channel {
  id: string;
  name: string;
}

export default function DefaultsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [channels] = useState<Channel[]>([]);
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDeveloper = session?.user?.id === DEVELOPER_USER_ID;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    if (!isDeveloper) {
      router.push('/');
      return;
    }

    // Fetch default settings
    fetch('/api/developer/defaults/settings')
      .then(res => res.json())
      .then(data => {
        // Ensure modules object exists with all properties
        const normalizedData = {
          ...data,
          modules: {
            moderation: data.modules?.moderation || { enabled: false },
            roleManagement: data.modules?.roleManagement || { enabled: false },
            memberManagement: data.modules?.memberManagement || { enabled: false },
            announcements: data.modules?.announcements || { enabled: false },
            welcomeMessages: data.modules?.welcomeMessages || { enabled: false },
            fun: data.modules?.fun || { enabled: false },
            utilities: data.modules?.utilities || { enabled: false },
            notifications: data.modules?.notifications || { enabled: false },
          }
        };
        setSettings(normalizedData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [session, status, router, isDeveloper]);

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
    } catch (error) {
      setVerifyError('Error verifying PIN');
    } finally {
      setIsVerifying(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!isDeveloper || !settings) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Access Denied</div>;
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Developer Verification</h2>
            <p className="text-gray-600 text-center mb-6">Enter your PIN to access default settings</p>
            
            <div className="space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyPin()}
                placeholder="Enter Developer PIN"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isVerifying}
              />
              
              {verifyError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{verifyError}</span>
                </div>
              )}
              
              <button
                onClick={handleVerifyPin}
                disabled={isVerifying || !pin.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify PIN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a] flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded-lg shadow-lg border border-orange-100"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static left-0 top-0 h-screen w-64 bg-white border-r border-orange-100 shadow-lg md:shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className="p-4 sm:p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <span className="text-lg sm:text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
          </div>
          
          <div className="px-3 sm:px-4 py-3 sm:py-4">
            <Link 
              href="/developer" 
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Back to Developer Panel
            </Link>
          </div>
          
          <nav className="px-3 sm:px-4 space-y-2 text-xs sm:text-sm font-semibold text-slate-700">
            <Link 
              href="/developer/defaults" 
              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-4 sm:py-6 bg-white hover:bg-orange-50/30 text-slate-700 hover:text-orange-700 transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/dashbaord.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
              Default Settings Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-2 sm:px-3 py-4 sm:py-6 cursor-pointer select-none bg-white hover:bg-orange-50/30 transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-2 sm:gap-3">
                  <img src="/settings.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 bg-white border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <span className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '0ms'}}>
                    General (N/A for Defaults)
                  </span>
                  <span className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '50ms'}}>
                    Setup (N/A for Defaults)
                  </span>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={configOpen}>
              <summary className="flex items-center justify-between px-2 sm:px-3 py-4 sm:py-6 cursor-pointer select-none rounded-lg" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
                <span className="flex items-center gap-2 sm:gap-3">
                  <img src="/configuration.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href="/developer/defaults/automod" className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left" style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Automod
                  </Link>
                  <Link href="/developer/defaults/logging" className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left" style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Logging
                  </Link>
                  <Link href="/developer/defaults/antiraid" className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left" style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Anti-Raid
                  </Link>
                  <Link href="/developer/defaults/reaction-roles" className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left" style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Reaction Roles
                  </Link>
                  <Link href="/developer/defaults/verification" className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left" style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Verification
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-2 sm:px-3 py-4 sm:py-6 cursor-pointer select-none bg-white hover:bg-orange-50/30 transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-2 sm:gap-3">
                  <img src="/modules.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 bg-white border-l-2 border-orange-400 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href="/developer/defaults/moderation" className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Moderation
                  </Link>
                  <Link href="/developer/defaults/role-management" className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Role Management
                  </Link>
                  <Link href="/developer/defaults/member-management" className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Member Management
                  </Link>
                  <Link href="/developer/defaults/announcements" className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Announcements
                  </Link>
                  <Link href="/developer/defaults/welcome-messages" className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Welcome Messages
                  </Link>
                  <Link href="/developer/defaults/fun" className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Fun
                  </Link>
                  <Link href="/developer/defaults/utilities" className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>

          <div className="mt-auto p-4 border-t border-orange-200">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-orange-900 mb-1">⚙️ Default Settings Mode</p>
              <p className="text-xs text-orange-700">Changes here will apply to all new servers.</p>
            </div>
          </div>
      </aside>

      <div className="flex-1 md:ml-64">
        <main className="py-12 px-4 md:px-8 pt-20 md:pt-12">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Default Server Settings
            </h1>
            <p className="text-slate-600">Configure default settings that will be applied to all new servers when they first add the bot.</p>
          </div>

          {/* Info Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-orange-900 mb-1">Developer Mode - Default Settings</p>
                <p className="text-sm text-orange-800">You are managing the default configuration template. These settings will be automatically applied to new servers when they first add the bot to their server. Existing servers will not be affected.</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout for Bot Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bot Settings - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Default Bot Settings</h2>
              
              <div className="space-y-6">
                {/* Two Column Grid for Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Command Prefix */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Default Command Prefix
                    </label>
                    <input
                      type="text"
                      value={settings?.prefix || ''}
                      onChange={(e) => {
                        if (settings) {
                          setSettings({ ...settings, prefix: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="!"
                    />
                    <p className="text-xs text-gray-500 mt-1">The default prefix for bot commands (e.g., "!", "/", ".")</p>
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Default Nickname
                    </label>
                    <input
                      type="text"
                      value={settings?.configuration?.botNickname || ''}
                      onChange={(e) => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            configuration: {
                              ...settings.configuration,
                              botNickname: e.target.value,
                              timezone: settings.configuration?.timezone || 'UTC'
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Leave empty for default"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional default bot nickname for new servers</p>
                  </div>

                  {/* Updates Channel - Disabled for defaults */}
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Updates Channel
                    </label>
                    <select
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 text-slate-400 border border-slate-300 rounded-lg cursor-not-allowed appearance-none"
                    >
                      <option value="">Not applicable for defaults</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Channel-specific settings not available for defaults</p>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Default Timezone
                    </label>
                    <select
                      value={settings?.configuration?.timezone || 'UTC'}
                      onChange={(e) => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            configuration: {
                              ...settings.configuration,
                              timezone: e.target.value,
                              botNickname: settings.configuration?.botNickname || ''
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                      <option value="America/Chicago">America/Chicago</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                      <option value="Australia/Sydney">Australia/Sydney</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Default timezone for new servers</p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    onClick={async () => {
                      if (!settings) return;
                      setSaving(true);
                      try {
                        const payload = {
                          prefix: settings.prefix,
                          premium: settings.premium,
                          configuration: {
                            botNickname: settings.configuration?.botNickname,
                            timezone: settings.configuration?.timezone,
                            automod: settings.configuration?.automod,
                            logging: settings.configuration?.logging,
                            antiraid: settings.configuration?.antiraid,
                            reactionRoles: settings.configuration?.reactionRoles,
                            verification: settings.configuration?.verification
                          },
                          modules: settings.modules
                        };
                        
                        console.log('Saving defaults:', payload);
                        
                        const res = await fetch('/api/developer/defaults/settings', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload)
                        });
                        
                        const responseData = await res.json();
                        console.log('Save response:', responseData);
                        
                        if (res.ok) {
                          alert('Default settings saved successfully! These will apply to all new servers.');
                          // Refresh the data to show what was actually saved
                          setSettings(responseData);
                        } else {
                          console.error('Save failed:', responseData);
                          alert('Failed to save default settings: ' + (responseData.error || 'Unknown error'));
                        }
                      } catch (error) {
                        console.error('Failed to save settings:', error);
                        alert('Failed to save default settings');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save Default Settings'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modules Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Default Modules</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Moderation</span>
                    <button
                      onClick={() => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            modules: {
                              ...settings.modules,
                              moderation: { enabled: !settings.modules?.moderation?.enabled }
                            }
                          });
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.modules?.moderation?.enabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings?.modules?.moderation?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Role Management</span>
                    <button
                      onClick={() => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            modules: {
                              ...settings.modules,
                              roleManagement: { enabled: !settings.modules?.roleManagement?.enabled }
                            }
                          });
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.modules?.roleManagement?.enabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings?.modules?.roleManagement?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Member Management</span>
                    <button
                      onClick={() => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            modules: {
                              ...settings.modules,
                              memberManagement: { enabled: !settings.modules?.memberManagement?.enabled }
                            }
                          });
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.modules?.memberManagement?.enabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings?.modules?.memberManagement?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Announcements</span>
                    <button
                      onClick={() => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            modules: {
                              ...settings.modules,
                              announcements: { enabled: !settings.modules?.announcements?.enabled }
                            }
                          });
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.modules?.announcements?.enabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings?.modules?.announcements?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Fun</span>
                    <button
                      onClick={() => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            modules: {
                              ...settings.modules,
                              fun: { enabled: !settings.modules?.fun?.enabled }
                            }
                          });
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.modules?.fun?.enabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings?.modules?.fun?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Utilities</span>
                    <button
                      onClick={() => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            modules: {
                              ...settings.modules,
                              utilities: { enabled: !settings.modules?.utilities?.enabled }
                            }
                          });
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.modules?.utilities?.enabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings?.modules?.utilities?.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-slate-600">Premium</span>
                    <button
                      onClick={() => {
                        if (settings) {
                          setSettings({ ...settings, premium: !settings.premium });
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings?.premium ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings?.premium ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">Note</p>
                    <p className="text-sm text-blue-800">More advanced configuration options for defaults are coming soon. Currently, you can set the basic prefix and timezone defaults.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
