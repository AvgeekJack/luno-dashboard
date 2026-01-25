'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface AutomodSettings {
  enabled: boolean;
  antiLinkEnabled: boolean;
  antiInviteEnabled: boolean;
  antiSpamEnabled: boolean;
  antiMentionEnabled: boolean;
  antiFloodEnabled: boolean;
  antiZalgoEnabled: boolean;
  antiSwearEnabled: boolean;
  capsFilterEnabled: boolean;
  spamMessageCount: number;
  spamTimeWindow: number;
  mentionLimit: number;
  capsPercentage: number;
  floodMessageCount: number;
  floodTimeWindow: number;
  zalgoLimit: number;
  whitelistedChannels: string[];
  whitelistedRoles: string[];
  autoWhitelistModerators: boolean;
  deleteMessage: boolean;
  sendWarning: boolean;
  warningDuration: number;
  dmUser: boolean;
  autoTimeoutEnabled: boolean;
  autoTimeoutViolations: number;
  autoTimeoutWindow: number;
  autoTimeoutDuration: number;
  escalatingPunishments: boolean;
  logChannel: string | null;
}

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

export default function AutomodPage() {
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
  const [roles, setRoles] = useState<Role[]>([]);

  const [settings, setSettings] = useState<AutomodSettings>({
    enabled: false,
    antiLinkEnabled: false,
    antiInviteEnabled: false,
    antiSpamEnabled: false,
    antiMentionEnabled: false,
    antiFloodEnabled: false,
    antiZalgoEnabled: false,
    antiSwearEnabled: false,
    capsFilterEnabled: false,
    spamMessageCount: 5,
    spamTimeWindow: 5,
    mentionLimit: 5,
    capsPercentage: 70,
    floodMessageCount: 3,
    floodTimeWindow: 2,
    zalgoLimit: 10,
    whitelistedChannels: [],
    whitelistedRoles: [],
    autoWhitelistModerators: true,
    deleteMessage: true,
    sendWarning: true,
    warningDuration: 5,
    dmUser: true,
    autoTimeoutEnabled: false,
    autoTimeoutViolations: 3,
    autoTimeoutWindow: 60,
    autoTimeoutDuration: 300,
    escalatingPunishments: false,
    logChannel: null,
  });

  const [originalSettings, setOriginalSettings] = useState<AutomodSettings>({
    enabled: false,
    antiLinkEnabled: false,
    antiInviteEnabled: false,
    antiSpamEnabled: false,
    antiMentionEnabled: false,
    antiFloodEnabled: false,
    antiZalgoEnabled: false,
    antiSwearEnabled: false,
    capsFilterEnabled: false,
    spamMessageCount: 5,
    spamTimeWindow: 5,
    mentionLimit: 5,
    capsPercentage: 70,
    floodMessageCount: 3,
    floodTimeWindow: 2,
    zalgoLimit: 10,
    whitelistedChannels: [],
    whitelistedRoles: [],
    autoWhitelistModerators: true,
    deleteMessage: true,
    sendWarning: true,
    warningDuration: 5,
    dmUser: true,
    autoTimeoutEnabled: false,
    autoTimeoutViolations: 3,
    autoTimeoutWindow: 60,
    autoTimeoutDuration: 300,
    escalatingPunishments: false,
    logChannel: null,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const fetchChannelsAndRoles = async () => {
      try {
        const res = await fetch(`/api/servers/${gid}/channels-and-roles`);
        if (res.ok) {
          const data = await res.json();
          setChannels(data.channels || []);
          setRoles(data.roles || []);
        }
      } catch (error) {
        console.error("Failed to fetch channels and roles:", error);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/servers/${gid}/general`);
        if (response.ok) {
          const data = await response.json();
          if (data.configuration?.automod) {
            const loadedSettings = { ...settings, ...data.configuration.automod };
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

    fetchChannelsAndRoles();
    fetchSettings();
  }, [session, status, router, gid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/servers/${gid}/general`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'configuration.automod': settings,
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

  const updateSetting = <K extends keyof AutomodSettings>(key: K, value: AutomodSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
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
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    General
                  </Link>
                  <Link href={`/servers/${gid}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
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
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Automod
                  </Link>
                  <Link href={`/servers/${gid}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Logging
                  </Link>
                  <Link href={`/servers/${gid}/configuration/anti-raid`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Anti-Raid
                  </Link>
                  <Link href={`/servers/${gid}/configuration/reaction-roles`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Reaction Roles
                  </Link>
                  <Link href={`/servers/${gid}/configuration/verification`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
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
                  <Link href={`/servers/${gid}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Moderation
                  </Link>
                  <Link href={`/servers/${gid}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Role Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Member Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Announcements
                  </Link>
                  <Link href={`/servers/${gid}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Welcome Messages
                  </Link>
                  <Link href={`/servers/${gid}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Fun
                  </Link>
                  <Link href={`/servers/${gid}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>
      </aside>

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-5xl space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-500 font-semibold">CONFIGURATION</p>
            <h1 className="text-4xl font-bold text-[#0f172a]">Automod</h1>
          </div>

          {/* Automod Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6">
            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Automod Configuration</h2>
                <p className="text-sm text-slate-500">Configure automatic moderation filters and rules for your server.</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
                className="scale-125"
              />
            </div>

            {settings.enabled && (
              <>
            {/* Info Box about Log Channel */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">AutoMod Log Channel</p>
                  <p className="text-sm text-blue-700 mt-1">
                    AutoMod logging is now configured on the <Link href={`/servers/${gid}/configuration/logging`} className="underline hover:text-blue-800">Logging page</Link> at the top of the configuration.
                  </p>
                </div>
              </div>
            </div>
              </>
            )}
          </div>

          {/* Filter Features Card */}
          {settings.enabled && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0f172a]">Filter Features</h2>
              <p className="text-sm text-slate-500">Enable or disable specific filter types</p>
            </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Anti-Link</p>
                    <p className="text-sm text-slate-500">Block all external URLs</p>
                  </div>
                  <Switch 
                    checked={settings.antiLinkEnabled} 
                    onCheckedChange={(checked) => updateSetting('antiLinkEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Anti-Invite</p>
                    <p className="text-sm text-slate-500">Block Discord invite links</p>
                  </div>
                  <Switch 
                    checked={settings.antiInviteEnabled} 
                    onCheckedChange={(checked) => updateSetting('antiInviteEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Anti-Spam</p>
                    <p className="text-sm text-slate-500">Prevent rapid message sending</p>
                  </div>
                  <Switch 
                    checked={settings.antiSpamEnabled} 
                    onCheckedChange={(checked) => updateSetting('antiSpamEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Anti-Mention</p>
                    <p className="text-sm text-slate-500">Block excessive mentions</p>
                  </div>
                  <Switch 
                    checked={settings.antiMentionEnabled} 
                    onCheckedChange={(checked) => updateSetting('antiMentionEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Anti-Flood/Duplicate</p>
                    <p className="text-sm text-slate-500">Stop repeated messages</p>
                  </div>
                  <Switch 
                    checked={settings.antiFloodEnabled} 
                    onCheckedChange={(checked) => updateSetting('antiFloodEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Anti-Zalgo</p>
                    <p className="text-sm text-slate-500">Block corrupted text</p>
                  </div>
                  <Switch 
                    checked={settings.antiZalgoEnabled} 
                    onCheckedChange={(checked) => updateSetting('antiZalgoEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Anti-Swear/Profanity</p>
                    <p className="text-sm text-slate-500">Block bad words</p>
                  </div>
                  <Switch 
                    checked={settings.antiSwearEnabled} 
                    onCheckedChange={(checked) => updateSetting('antiSwearEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Caps Filter</p>
                    <p className="text-sm text-slate-500">Block excessive capitals</p>
                  </div>
                  <Switch 
                    checked={settings.capsFilterEnabled} 
                    onCheckedChange={(checked) => updateSetting('capsFilterEnabled', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Thresholds & Limits Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0f172a]">Thresholds & Limits</h2>
              <p className="text-sm text-slate-500">Configure detection sensitivity</p>
            </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Spam Threshold</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Messages</label>
                      <input 
                        type="number" 
                        value={settings.spamMessageCount} 
                        onChange={(e) => updateSetting('spamMessageCount', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        min="1" 
                        max="20" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Seconds</label>
                      <input 
                        type="number" 
                        value={settings.spamTimeWindow} 
                        onChange={(e) => updateSetting('spamTimeWindow', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        min="1" 
                        max="60" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Mention Limit</label>
                  <input 
                    type="number" 
                    value={settings.mentionLimit} 
                    onChange={(e) => updateSetting('mentionLimit', parseInt(e.target.value))}
                    className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    min="1" 
                    max="50" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Max mentions per message</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Caps Percentage</label>
                  <input 
                    type="number" 
                    value={settings.capsPercentage} 
                    onChange={(e) => updateSetting('capsPercentage', parseInt(e.target.value))}
                    className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    min="0" 
                    max="100" 
                  />
                  <p className="text-xs text-slate-500 mt-1">% of caps allowed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Flood/Duplicate Threshold</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Messages</label>
                      <input 
                        type="number" 
                        value={settings.floodMessageCount} 
                        onChange={(e) => updateSetting('floodMessageCount', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        min="1" 
                        max="20" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Seconds</label>
                      <input 
                        type="number" 
                        value={settings.floodTimeWindow} 
                        onChange={(e) => updateSetting('floodTimeWindow', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                        min="1" 
                        max="60" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Zalgo Character Limit</label>
                  <input 
                    type="number" 
                    value={settings.zalgoLimit} 
                    onChange={(e) => updateSetting('zalgoLimit', parseInt(e.target.value))}
                    className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    min="0" 
                    max="100" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Combining characters allowed</p>
                </div>
              </div>
            </div>
          )}

          {/* Whitelist System Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0f172a]">Whitelist System</h2>
              <p className="text-sm text-slate-500">Exempt channels, roles, or users</p>
            </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Whitelisted Channels</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    onChange={(e) => {
                      if (e.target.value && !settings.whitelistedChannels.includes(e.target.value)) {
                        updateSetting('whitelistedChannels', [...settings.whitelistedChannels, e.target.value]);
                      }
                      e.target.value = '';
                    }}
                  >
                    <option value="">Select a channel to add...</option>
                    {channels.filter(ch => !settings.whitelistedChannels.includes(ch.id)).map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                  {settings.whitelistedChannels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {settings.whitelistedChannels.map(chId => {
                        const channel = channels.find(c => c.id === chId);
                        return (
                          <span key={chId} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            #{channel?.name || chId}
                            <button type="button" onClick={() => updateSetting('whitelistedChannels', settings.whitelistedChannels.filter(id => id !== chId))}
                              className="hover:text-orange-600 font-bold">✕</button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1">Channels exempt from AutoMod</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Whitelisted Roles</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    onChange={(e) => {
                      if (e.target.value && !settings.whitelistedRoles.includes(e.target.value)) {
                        updateSetting('whitelistedRoles', [...settings.whitelistedRoles, e.target.value]);
                      }
                      e.target.value = '';
                    }}
                  >
                    <option value="">Select a role to add...</option>
                    {roles.filter(r => !settings.whitelistedRoles.includes(r.id)).map(r => (
                      <option key={r.id} value={r.id}>@{r.name}</option>
                    ))}
                  </select>
                  {settings.whitelistedRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {settings.whitelistedRoles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        return (
                          <span key={roleId} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            @{role?.name || roleId}
                            <button type="button" onClick={() => updateSetting('whitelistedRoles', settings.whitelistedRoles.filter(id => id !== roleId))}
                              className="hover:text-orange-600 font-bold">✕</button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-1">Roles exempt from AutoMod</p>
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Auto-whitelist Moderators</p>
                    <p className="text-sm text-slate-500">Automatically exempt users with Manage Messages/Admin</p>
                  </div>
                  <Switch 
                    checked={settings.autoWhitelistModerators} 
                    onCheckedChange={(checked) => updateSetting('autoWhitelistModerators', checked)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Settings Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0f172a]">Action Settings</h2>
              <p className="text-sm text-slate-500">Configure how AutoMod responds to violations</p>
            </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Delete Message</p>
                    <p className="text-sm text-slate-500">Automatically delete violating messages</p>
                  </div>
                  <Switch 
                    checked={settings.deleteMessage} 
                    onCheckedChange={(checked) => updateSetting('deleteMessage', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Send Warning</p>
                    <p className="text-sm text-slate-500">Post warning message in channel</p>
                  </div>
                  <Switch 
                    checked={settings.sendWarning} 
                    onCheckedChange={(checked) => updateSetting('sendWarning', checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Warning Duration</label>
                  <input 
                    type="number" 
                    value={settings.warningDuration} 
                    onChange={(e) => updateSetting('warningDuration', parseInt(e.target.value))}
                    className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    min="1" 
                    max="60" 
                  />
                  <p className="text-xs text-slate-500 mt-1">Seconds warning stays visible</p>
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">DM User</p>
                    <p className="text-sm text-slate-500">Send DM notification to user</p>
                  </div>
                  <Switch 
                    checked={settings.dmUser} 
                    onCheckedChange={(checked) => updateSetting('dmUser', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Auto-Timeout</p>
                    <p className="text-sm text-slate-500">Automatically timeout after violations</p>
                  </div>
                  <Switch 
                    checked={settings.autoTimeoutEnabled} 
                    onCheckedChange={(checked) => updateSetting('autoTimeoutEnabled', checked)}
                  />
                </div>

                {settings.autoTimeoutEnabled && (
                  <div className="ml-4 grid md:grid-cols-3 gap-3 p-4 rounded-lg bg-orange-50/50 border border-orange-200">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Violations</label>
                      <input type="number" value={settings.autoTimeoutViolations} onChange={(e) => updateSetting('autoTimeoutViolations', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm" min="1" max="20" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Within (seconds)</label>
                      <input type="number" value={settings.autoTimeoutWindow} onChange={(e) => updateSetting('autoTimeoutWindow', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm" min="1" max="3600" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Duration (seconds)</label>
                      <input type="number" value={settings.autoTimeoutDuration} onChange={(e) => updateSetting('autoTimeoutDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm" min="60" max="2419200" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Escalating Punishments</p>
                    <p className="text-sm text-slate-500">Warn → Timeout → Kick → Ban based on violations</p>
                  </div>
                  <Switch 
                    checked={settings.escalatingPunishments} 
                    onCheckedChange={(checked) => updateSetting('escalatingPunishments', checked)}
                  />
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
