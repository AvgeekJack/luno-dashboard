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
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
          </div>
          
          <div className="px-4 py-4">
            <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3">← Back to Servers</Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link href={`/servers/${gid}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors">
              Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-3">
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    General
                  </Link>
                  <Link href={`/servers/${gid}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    Setup
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={configOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
                <span className="flex items-center gap-3">
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    Automod
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-3">
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    Moderation
                  </Link>
                  <Link href={`/servers/${gid}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    Role Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                    Member Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                    Announcements
                  </Link>
                  <Link href={`/servers/${gid}/modules/tickets`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}}>
                    Tickets
                  </Link>
                  <Link href={`/servers/${gid}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}}>
                    Notifications
                  </Link>
                  <Link href={`/servers/${gid}/modules/custom-commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}}>
                    Custom Commands
                  </Link>
                  <Link href={`/servers/${gid}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '350ms'}}>
                    Fun
                  </Link>
                  <Link href={`/servers/${gid}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '400ms'}}>
                    Utilities
                  </Link>
                  <Link href={`/servers/${gid}/modules/security`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '450ms'}}>
                    Security
                  </Link>
                </div>
              )}
            </details>
          </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="w-full max-w-6xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Configuration</p>
            <h1 className="text-3xl font-bold">Automod</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            {/* Master Toggle */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Automod Configuration</h2>
                <p className="text-slate-600">Configure automatic moderation filters and rules for your server.</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={settings.enabled} 
                  onCheckedChange={(checked) => updateSetting('enabled', checked)}
                  className="scale-150"
                />
              </div>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-700 ${settings.enabled ? 'max-h-[20000px] opacity-100' : 'max-h-0 opacity-0'}`}
              style={{ transitionProperty: 'max-height, opacity' }}
            >
              <div className="space-y-8 border-t border-orange-100 pt-8">
            {/* Filter Features Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Filter Features</h2>
                <p className="text-sm text-slate-600">Enable or disable specific filter types</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Anti-Link</p>
                    <p className="text-xs text-slate-500">Block all external URLs</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('antiLinkEnabled', !settings.antiLinkEnabled)}
                    className={`${settings.antiLinkEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.antiLinkEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Anti-Invite</p>
                    <p className="text-xs text-slate-500">Block Discord invite links</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('antiInviteEnabled', !settings.antiInviteEnabled)}
                    className={`${settings.antiInviteEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.antiInviteEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Anti-Spam</p>
                    <p className="text-xs text-slate-500">Prevent rapid message sending</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('antiSpamEnabled', !settings.antiSpamEnabled)}
                    className={`${settings.antiSpamEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.antiSpamEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Anti-Mention</p>
                    <p className="text-xs text-slate-500">Block excessive mentions</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('antiMentionEnabled', !settings.antiMentionEnabled)}
                    className={`${settings.antiMentionEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.antiMentionEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Anti-Flood/Duplicate</p>
                    <p className="text-xs text-slate-500">Stop repeated messages</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('antiFloodEnabled', !settings.antiFloodEnabled)}
                    className={`${settings.antiFloodEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.antiFloodEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Anti-Zalgo</p>
                    <p className="text-xs text-slate-500">Block corrupted text</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('antiZalgoEnabled', !settings.antiZalgoEnabled)}
                    className={`${settings.antiZalgoEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.antiZalgoEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Anti-Swear/Profanity</p>
                    <p className="text-xs text-slate-500">Block bad words</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('antiSwearEnabled', !settings.antiSwearEnabled)}
                    className={`${settings.antiSwearEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.antiSwearEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Caps Filter</p>
                    <p className="text-xs text-slate-500">Block excessive capitals</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('capsFilterEnabled', !settings.capsFilterEnabled)}
                    className={`${settings.capsFilterEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.capsFilterEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thresholds Section */}
            <div className="space-y-4 border-t border-orange-100 pt-8">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Thresholds & Limits</h2>
                <p className="text-sm text-slate-600">Configure detection sensitivity</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Spam Threshold</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500">Messages</label>
                      <input type="number" value={settings.spamMessageCount} onChange={(e) => updateSetting('spamMessageCount', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="20" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Seconds</label>
                      <input type="number" value={settings.spamTimeWindow} onChange={(e) => updateSetting('spamTimeWindow', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="60" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Mention Limit</label>
                  <input type="number" value={settings.mentionLimit} onChange={(e) => updateSetting('mentionLimit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="50" />
                  <p className="text-xs text-slate-500">Max mentions per message</p>
                </div>

                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Caps Percentage</label>
                  <input type="number" value={settings.capsPercentage} onChange={(e) => updateSetting('capsPercentage', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="0" max="100" />
                  <p className="text-xs text-slate-500">% of caps allowed</p>
                </div>

                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Flood/Duplicate Threshold</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500">Messages</label>
                      <input type="number" value={settings.floodMessageCount} onChange={(e) => updateSetting('floodMessageCount', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="20" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500">Seconds</label>
                      <input type="number" value={settings.floodTimeWindow} onChange={(e) => updateSetting('floodTimeWindow', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="60" />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Zalgo Character Limit</label>
                  <input type="number" value={settings.zalgoLimit} onChange={(e) => updateSetting('zalgoLimit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="0" max="100" />
                  <p className="text-xs text-slate-500">Combining characters allowed</p>
                </div>
              </div>
            </div>

            {/* Whitelist Section */}
            <div className="space-y-4 border-t border-orange-100 pt-8">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Whitelist System</h2>
                <p className="text-sm text-slate-600">Exempt channels, roles, or users</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Whitelisted Channels</label>
                  <textarea value={settings.whitelistedChannels.join('\n')} onChange={(e) => updateSetting('whitelistedChannels', e.target.value.split('\n').filter(id => id.trim()))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-mono" rows={3} placeholder="Enter channel IDs (one per line)" />
                  <p className="text-xs text-slate-500">Channels exempt from AutoMod</p>
                </div>

                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Whitelisted Roles</label>
                  <textarea value={settings.whitelistedRoles.join('\n')} onChange={(e) => updateSetting('whitelistedRoles', e.target.value.split('\n').filter(id => id.trim()))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-mono" rows={3} placeholder="Enter role IDs (one per line)" />
                  <p className="text-xs text-slate-500">Roles exempt from AutoMod</p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Auto-whitelist Moderators</p>
                    <p className="text-xs text-slate-500">Automatically exempt users with Manage Messages/Admin</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('autoWhitelistModerators', !settings.autoWhitelistModerators)}
                    className={`${settings.autoWhitelistModerators ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.autoWhitelistModerators ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Settings Section */}
            <div className="space-y-4 border-t border-orange-100 pt-8">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Action Settings</h2>
                <p className="text-sm text-slate-600">Configure how AutoMod responds to violations</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Delete Message</p>
                    <p className="text-xs text-slate-500">Automatically delete violating messages</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('deleteMessage', !settings.deleteMessage)}
                    className={`${settings.deleteMessage ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.deleteMessage ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Send Warning</p>
                    <p className="text-xs text-slate-500">Post warning message in channel</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('sendWarning', !settings.sendWarning)}
                    className={`${settings.sendWarning ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.sendWarning ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Warning Duration</label>
                  <input type="number" value={settings.warningDuration} onChange={(e) => updateSetting('warningDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="60" />
                  <p className="text-xs text-slate-500">Seconds warning stays visible</p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">DM User</p>
                    <p className="text-xs text-slate-500">Send DM notification to user</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('dmUser', !settings.dmUser)}
                    className={`${settings.dmUser ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.dmUser ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Auto-Timeout</p>
                    <p className="text-xs text-slate-500">Automatically timeout after violations</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('autoTimeoutEnabled', !settings.autoTimeoutEnabled)}
                    className={`${settings.autoTimeoutEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.autoTimeoutEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                {settings.autoTimeoutEnabled && (
                  <div className="ml-4 grid md:grid-cols-3 gap-3 p-4 rounded-lg bg-orange-50/50 border border-orange-100">
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Violations</label>
                      <input type="number" value={settings.autoTimeoutViolations} onChange={(e) => updateSetting('autoTimeoutViolations', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="20" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Within (seconds)</label>
                      <input type="number" value={settings.autoTimeoutWindow} onChange={(e) => updateSetting('autoTimeoutWindow', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="3600" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">Duration (seconds)</label>
                      <input type="number" value={settings.autoTimeoutDuration} onChange={(e) => updateSetting('autoTimeoutDuration', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="60" max="2419200" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Escalating Punishments</p>
                    <p className="text-xs text-slate-500">Warn → Timeout → Kick → Ban based on violations</p>
                  </div>
                  <button type="button" onClick={() => updateSetting('escalatingPunishments', !settings.escalatingPunishments)}
                    className={`${settings.escalatingPunishments ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                    <span className={`${settings.escalatingPunishments ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Log Channel</label>
                  <input type="text" value={settings.logChannel || ''} onChange={(e) => updateSetting('logChannel', e.target.value || null)}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm font-mono" placeholder="Enter channel ID" />
                  <p className="text-xs text-slate-500">Channel to log AutoMod actions</p>
                </div>
              </div>
            </div>

              </div>
            </div>
          </div>
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
