'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

const DEVELOPER_USER_ID = '922940896322940929';

interface AntiRaidSettings {
  enabled: boolean;
  protectionLevel: 'low' | 'medium' | 'high' | 'extreme' | 'custom';
  accountAge: number;
  joinRateLimit: number;
  joinRateWindow: number;
  verificationLevel: number;
  autoKickNewAccounts: boolean;
  kickOnRateExceeded: boolean;
}

const PROTECTION_LEVELS = {
  low: {
    accountAge: 300000, // 5 minutes
    joinRateLimit: 10,
    description: '5 min account age, 10 joins/min'
  },
  medium: {
    accountAge: 600000, // 10 minutes
    joinRateLimit: 5,
    description: '10 min account age, 5 joins/min'
  },
  high: {
    accountAge: 1800000, // 30 minutes
    joinRateLimit: 3,
    description: '30 min account age, 3 joins/min'
  },
  extreme: {
    accountAge: 86400000, // 24 hours
    joinRateLimit: 2,
    description: '24 hour account age, 2 joins/min'
  }
};

export default function DefaultsAntiRaidPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [settings, setSettings] = useState<AntiRaidSettings>({
    enabled: false,
    protectionLevel: 'medium',
    accountAge: 600000,
    joinRateLimit: 5,
    joinRateWindow: 60000,
    verificationLevel: 1,
    autoKickNewAccounts: true,
    kickOnRateExceeded: true,
  });

  const [originalSettings, setOriginalSettings] = useState<AntiRaidSettings>(settings);

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

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/developer/defaults/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.configuration?.antiraid) {
            const loadedSettings = { ...settings, ...data.configuration.antiraid };
            setSettings(loadedSettings);
            setOriginalSettings(loadedSettings);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [session, status, router, isDeveloper]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/developer/defaults/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'configuration.antiraid': settings,
        }),
      });

      if (response.ok) {
        setOriginalSettings({ ...settings });
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({ ...originalSettings });
    setHasUnsavedChanges(false);
  };

  const updateSetting = <K extends keyof AntiRaidSettings>(key: K, value: AntiRaidSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleProtectionLevelChange = (level: 'low' | 'medium' | 'high' | 'extreme') => {
    const preset = PROTECTION_LEVELS[level];
    setSettings(prev => ({
      ...prev,
      protectionLevel: level,
      accountAge: preset.accountAge,
      joinRateLimit: preset.joinRateLimit
    }));
    setHasUnsavedChanges(true);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const getStatusColor = () => {
    if (!settings.enabled) return 'bg-slate-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!settings.enabled) return 'Inactive';
    return `Active (${settings.protectionLevel.toUpperCase()})`;
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!isDeveloper) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] flex">
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
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12 md:ml-0">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#0f172a]">Luno</span>
          </Link>
        </div>
        
        <div className="px-4 py-4">
          <Link href="/developer" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>← Back to Developer Panel</Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href="/developer/defaults" className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <img src="/dashbaord.png" alt="" className="w-5 h-5" />
            Default Settings Dashboard
          </Link>
          <details className="text-slate-800" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span className="flex items-center gap-3">
                <img src="/settings.png" alt="" className="w-5 h-5" />
                Settings
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '0ms'}}>
                  General (N/A for Defaults)
                </span>
                <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '50ms'}}>
                  Setup (N/A for Defaults)
                </span>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={configOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
              <span className="flex items-center gap-3">
                <img src="/configuration.png" alt="" className="w-5 h-5" />
                Configuration
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {configOpen && (
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href="/developer/defaults/automod" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Automod
                </Link>
                <Link href="/developer/defaults/logging" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Logging
                </Link>
                <Link href="/developer/defaults/antiraid" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Anti-Raid
                </Link>
                <Link href="/developer/defaults/reaction-roles" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Reaction Roles
                </Link>
                <Link href="/developer/defaults/verification" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Verification
                </Link>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3">
                <img src="/modules.png" alt="" className="w-5 h-5" />
                Modules
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href="/developer/defaults/moderation" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Moderation
                </Link>
                <Link href="/developer/defaults/role-management" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Role Management
                </Link>
                <Link href="/developer/defaults/member-management" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Member Management
                </Link>
                <Link href="/developer/defaults/announcements" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Announcements
                </Link>
                <Link href="/developer/defaults/welcome-messages" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Welcome Messages
                </Link>
                <Link href="/developer/defaults/fun" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Fun
                </Link>
                <Link href="/developer/defaults/utilities" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
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

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center bg-[#f8f9fa]">
        <div className="w-full max-w-5xl space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-500 font-semibold">DEFAULT CONFIGURATION</p>
            <h1 className="text-4xl font-bold text-[#0f172a]">Anti-Raid Defaults</h1>
          </div>

          {/* Warning Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-orange-900 mb-1">⚠️ These are default settings applied to new servers</p>
                <p className="text-sm text-orange-800">Any changes made here will only affect newly added servers. Existing servers will retain their current settings.</p>
              </div>
            </div>
          </div>

          {/* Master Toggle Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Anti-Raid System</h2>
                <p className="text-sm text-slate-500">Protect your server from raid attacks</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
                className="scale-125"
              />
            </div>
          </div>

          {/* Status Display Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Default Status</h2>
                <p className="text-sm text-slate-500">Default anti-raid system configuration for new servers</p>
              </div>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-xs mb-2">Default Protection Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
                    <p className="font-semibold text-slate-900">{getStatusText()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Protection Level Selection Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Default Protection Level</h2>
                <p className="text-sm text-slate-500">Choose a preset protection level or customize your own</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.keys(PROTECTION_LEVELS) as Array<keyof typeof PROTECTION_LEVELS>).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleProtectionLevelChange(level)}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      settings.protectionLevel === level
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <p className="font-bold text-sm uppercase text-slate-900">{level}</p>
                    <p className="text-xs text-slate-500 mt-1">{PROTECTION_LEVELS[level].description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Settings Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 relative">
              <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0f172a]">Custom Default Settings</h2>
              <p className="text-sm text-slate-500">Fine-tune default protection parameters</p>
            </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Minimum Account Age</label>
                  <input 
                    type="number" 
                    value={settings.accountAge / 60000} 
                    onChange={(e) => {
                      updateSetting('accountAge', parseInt(e.target.value) * 60000);
                      updateSetting('protectionLevel', 'custom');
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                  />
                  <p className="text-sm text-slate-500">Minutes (current: {formatDuration(settings.accountAge)})</p>
                </div>

                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Join Rate Limit</label>
                  <input 
                    type="number" 
                    value={settings.joinRateLimit} 
                    onChange={(e) => {
                      updateSetting('joinRateLimit', parseInt(e.target.value));
                      updateSetting('protectionLevel', 'custom');
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="1"
                    max="100"
                  />
                  <p className="text-sm text-slate-500">Maximum joins per minute</p>
                </div>

                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Join Rate Window</label>
                  <input 
                    type="number" 
                    value={settings.joinRateWindow / 1000} 
                    onChange={(e) => updateSetting('joinRateWindow', parseInt(e.target.value) * 1000)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="10"
                    max="300"
                  />
                  <p className="text-sm text-slate-500">Seconds to track join rate</p>
                </div>

                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Verification Level</label>
                  <select 
                    value={settings.verificationLevel} 
                    onChange={(e) => updateSetting('verificationLevel', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="0">None</option>
                    <option value="1">Low - Verified email</option>
                    <option value="2">Medium - Registered for 5+ min</option>
                    <option value="3">High - Member for 10+ min</option>
                    <option value="4">Highest - Verified phone</option>
                  </select>
                  <p className="text-sm text-slate-500">Discord server verification level</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Settings Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Default Actions</h2>
                <p className="text-sm text-slate-500">Configure default automated responses to threats</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.autoKickNewAccounts} 
                    onCheckedChange={(checked) => updateSetting('autoKickNewAccounts', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Auto-kick New Accounts</p>
                    <p className="text-sm text-slate-500">Kick accounts below minimum age</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.kickOnRateExceeded} 
                    onCheckedChange={(checked) => updateSetting('kickOnRateExceeded', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Kick on Rate Exceeded</p>
                    <p className="text-sm text-slate-500">Kick when join rate limit is exceeded</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Save Changes Overlay */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl transition-transform duration-300 ease-out z-50 ${
          hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm">Careful — you have unsaved changes!</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-white hover:underline transition"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
