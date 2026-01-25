'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface AntiRaidSettings {
  enabled: boolean;
  protectionLevel: 'low' | 'medium' | 'high' | 'extreme' | 'custom';
  accountAge: number;
  joinRateLimit: number;
  joinRateWindow: number;
  verificationLevel: number;
  autoKickNewAccounts: boolean;
  kickOnRateExceeded: boolean;
  premium?: boolean;
  enabledBy: string | null;
  enabledAt: Date | null;
  lastUpdatedBy: string | null;
  lastUpdatedAt: Date | null;
}

interface Channel {
  id: string;
  name: string;
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

export default function AntiRaidPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);

  const [settings, setSettings] = useState<AntiRaidSettings>({
    enabled: false,
    protectionLevel: 'medium',
    accountAge: 600000,
    joinRateLimit: 5,
    joinRateWindow: 60000,
    verificationLevel: 1,
    autoKickNewAccounts: true,
    kickOnRateExceeded: true,
    enabledBy: null,
    enabledAt: null,
    lastUpdatedBy: null,
    lastUpdatedAt: null,
  });

  const [originalSettings, setOriginalSettings] = useState<AntiRaidSettings>(settings);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [channelsRes, antiRaidRes, settingsRes] = await Promise.all([
          fetch(`/api/servers/${gid}/channels-and-roles`),
          fetch(`/api/servers/${gid}/configuration/anti-raid`),
          fetch(`/api/servers/${gid}/settings`)
        ]);

        if (channelsRes.ok) {
          const data = await channelsRes.json();
          setChannels(data.channels || []);
        }

        let premiumStatus = false;
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          premiumStatus = data.premium || false;
          console.log('Premium status from MongoDB:', premiumStatus);
        }

        if (antiRaidRes.ok) {
          const data = await antiRaidRes.json();
          if (data.antiRaid) {
            const loadedSettings = { 
              ...settings, 
              ...data.antiRaid,
              premium: premiumStatus 
            };
            setSettings(loadedSettings);
            setOriginalSettings(loadedSettings);
          }
        } else {
          // If no anti-raid settings, just set premium
          setSettings(prev => ({ ...prev, premium: premiumStatus }));
          setOriginalSettings(prev => ({ ...prev, premium: premiumStatus }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router, gid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/servers/${gid}/configuration/anti-raid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
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

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
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
          <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>← Back to Servers</Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href={`/servers/${gid}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <img src="/dashbaord.png" alt="" className="w-5 h-5" />
            Dashboard
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
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/general`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  General
                </Link>
                <Link href={`/servers/${gid}/setup`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Setup
                </Link>
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
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/configuration/automod`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Automod
                </Link>
                <Link href={`/servers/${gid}/configuration/logging`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Logging
                </Link>
                <Link href={`/servers/${gid}/configuration/anti-raid`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Anti-Raid
                </Link>
                <Link href={`/servers/${gid}/configuration/reaction-roles`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Reaction Roles
                </Link>
                <Link href={`/servers/${gid}/configuration/verification`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Verification
                </Link>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3"><img src="/modules.png" alt="" className="w-5 h-5" />Modules</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/modules/moderation`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Moderation
                </Link>
                <Link href={`/servers/${gid}/modules/role-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Role Management
                </Link>
                <Link href={`/servers/${gid}/modules/member-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Member Management
                </Link>
                <Link href={`/servers/${gid}/modules/announcements`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Announcements
                </Link>
                <Link href={`/servers/${gid}/modules/notifications`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Welcome Messages
                </Link>
                <Link href={`/servers/${gid}/modules/fun`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Fun
                </Link>
                <Link href={`/servers/${gid}/modules/utilities`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center bg-[#f8f9fa]">
        <div className="w-full max-w-5xl space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-500 font-semibold">CONFIGURATION</p>
            <h1 className="text-4xl font-bold text-[#0f172a]">Anti-Raid Protection</h1>
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

          {/* Info Box about Alert Channel */}
          {settings.enabled && (
            <div className="p-5 rounded-lg border border-blue-200 bg-blue-50">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-blue-900">Anti-Raid Alert Channel</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Anti-raid alerts are now configured on the <Link href={`/servers/${gid}/configuration/logging`} className="font-semibold underline">Logging</Link> page under the configuration section.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Display Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Current Status</h2>
                <p className="text-sm text-slate-500">Monitor your anti-raid system status</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-slate-500 text-xs mb-2">Protection Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
                    <p className="font-semibold text-slate-900">{getStatusText()}</p>
                  </div>
                </div>
                {settings.enabledAt && (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500 text-xs mb-2">Enabled Date</p>
                    <p className="font-semibold text-slate-900">{new Date(settings.enabledAt).toLocaleDateString()}</p>
                  </div>
                )}
                {settings.enabledBy && (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500 text-xs mb-2">Enabled By</p>
                    <p className="font-semibold text-slate-900">{settings.enabledBy}</p>
                  </div>
                )}
                {settings.lastUpdatedAt && (
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-slate-500 text-xs mb-2">Last Updated</p>
                    <p className="font-semibold text-slate-900">{new Date(settings.lastUpdatedAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Protection Level Selection Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Protection Level</h2>
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
                <h2 className="text-lg font-semibold text-[#0f172a]">Custom Settings</h2>
                <p className="text-sm text-slate-500">Fine-tune protection parameters</p>
              </div>

              {/* Premium Overlay - Only show if premium is false */}
              {!settings.premium && (
                <div className="absolute inset-0 bg-orange-100/95 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 pointer-events-auto cursor-not-allowed p-6 overflow-hidden">
                  <div className="text-center space-y-4 pointer-events-none max-w-xl">
                    <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                      <img src="/premium-icon.svg" alt="Premium" className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Custom Settings</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      To unlock this feature, upgrade to premium and gain access to advanced anti-raid customization with fine-tuned protection parameters and precise rate limiting tailored to your community.
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-left mx-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-900 text-sm">Custom account age limits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-900 text-sm">Advanced rate limiting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-900 text-sm">Fine-tuned verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-900 text-sm">Custom action triggers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-900 text-sm">Join rate window control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-slate-900 text-sm">Priority support</span>
                      </div>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 mx-auto transition pointer-events-auto text-sm">
                      <img src="/premium-icon.svg" alt="Premium" className="w-4 h-4" />
                      Upgrade to Premium
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <p className="text-slate-600 text-xs">Starting at $4.99/month • Cancel anytime</p>
                  </div>
                </div>
              )}
              
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
                <h2 className="text-lg font-semibold text-[#0f172a]">Actions</h2>
                <p className="text-sm text-slate-500">Configure automated responses to threats</p>
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
