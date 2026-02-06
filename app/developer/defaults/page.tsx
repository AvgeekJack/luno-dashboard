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
  };
}

interface Channel {
  id: string;
  name: string;
}

export default function DefaultsManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
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
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [session, status, router, isDeveloper]);

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!isDeveloper || !settings) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Access Denied</div>;
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
                  <span className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-gray-400 cursor-not-allowed text-left" style={{animationDelay: '0ms'}}>
                    Moderation (Coming Soon)
                  </span>
                  <span className="flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 text-gray-400 cursor-not-allowed text-left" style={{animationDelay: '50ms'}}>
                    Role Management (Coming Soon)
                  </span>
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
                        const res = await fetch('/api/developer/defaults/settings', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            prefix: settings.prefix,
                            premium: settings.premium,
                            configuration: {
                              botNickname: settings.configuration?.botNickname,
                              timezone: settings.configuration?.timezone
                            }
                          })
                        });
                        if (res.ok) {
                          alert('Default settings saved successfully! These will apply to all new servers.');
                        } else {
                          alert('Failed to save default settings');
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

            {/* Status Card */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Default Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Automod</span>
                    {settings?.configuration?.automod?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Enabled by Default
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Disabled by Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Logging</span>
                    {settings?.configuration?.logging?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Enabled by Default
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Disabled by Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Anti-Raid</span>
                    {settings?.configuration?.antiraid?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Enabled by Default
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Disabled by Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-slate-600">Premium</span>
                    {settings?.premium ? (
                      <span className="flex items-center gap-2 text-orange-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                        Enabled by Default
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        Disabled by Default
                      </span>
                    )}
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
