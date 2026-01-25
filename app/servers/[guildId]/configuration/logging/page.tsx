'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface LoggingSettings {
  enabled: boolean;
  automodLogChannel: string | null;
  logAutomodViolations: boolean;
  logAutomodActions: boolean;
  logAutomodFilters: boolean;
  antiRaidChannel: string | null;
  logRaidDetections: boolean;
  logRaidActions: boolean;
  logJoinPatterns: boolean;
  
  // Verification Logs
  verificationChannel: string | null;
  trackVerificationMetrics: boolean;
  logFailedVerificationAttempts: boolean;
  
  // Section Channels
  moderationChannel: string | null;
  memberChannel: string | null;
  messageChannel: string | null;
  channelLogsChannel: string | null;
  roleLogsChannel: string | null;
  voiceChannel: string | null;
  serverChannel: string | null;
  
  // Moderation Logs (toggles only)
  warnsEnabled: boolean;
  kicksEnabled: boolean;
  bansEnabled: boolean;
  unbansEnabled: boolean;
  timeoutsEnabled: boolean;
  untimeoutsEnabled: boolean;
  softbansEnabled: boolean;
  channelLocksEnabled: boolean;
  lockdownsEnabled: boolean;
  slowmodeEnabled: boolean;
  messagePurgeEnabled: boolean;
  automodActionsEnabled: boolean;
  
  // Member Logs (toggles only)
  memberJoinEnabled: boolean;
  memberLeaveEnabled: boolean;
  roleUpdatesEnabled: boolean;
  nicknameChangesEnabled: boolean;
  usernameChangesEnabled: boolean;
  
  // Message Logs (toggles only)
  messageDeleteEnabled: boolean;
  messageEditEnabled: boolean;
  bulkDeleteEnabled: boolean;
  messageAttachmentsEnabled: boolean;
  
  // Channel Logs (toggles only)
  channelCreateEnabled: boolean;
  channelDeleteEnabled: boolean;
  channelUpdateEnabled: boolean;
  
  // Role Logs (toggles only)
  roleCreateEnabled: boolean;
  roleDeleteEnabled: boolean;
  roleUpdateEnabled: boolean;
  
  // Voice Logs (toggles only)
  voiceJoinEnabled: boolean;
  voiceLeaveEnabled: boolean;
  voiceMoveEnabled: boolean;
  voiceMuteDeafenEnabled: boolean;
  voiceStreamingEnabled: boolean;
  
  // Server Logs (toggles only)
  serverUpdateEnabled: boolean;
  emojiEnabled: boolean;
  stickerEnabled: boolean;
  webhookEnabled: boolean;
  inviteEnabled: boolean;
  integrationEnabled: boolean;
  
  // Advanced Settings
  ignoredChannels: string[];
  ignoredRoles: string[];
  ignoredUsers: string[];
  includeBotActions: boolean;
  logMessageContent: boolean;
  logEmbedUrls: boolean;
  retentionPeriod: number;
}

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

export default function LoggingPage() {
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

  const [settings, setSettings] = useState<LoggingSettings>({
    enabled: false,
    automodLogChannel: null,
    logAutomodViolations: true,
    logAutomodActions: true,
    logAutomodFilters: false,
    antiRaidChannel: null,
    logRaidDetections: true,
    logRaidActions: true,
    logJoinPatterns: false,
    verificationChannel: null,
    trackVerificationMetrics: false,
    logFailedVerificationAttempts: false,
    moderationChannel: null,
    memberChannel: null,
    messageChannel: null,
    channelLogsChannel: null,
    roleLogsChannel: null,
    voiceChannel: null,
    serverChannel: null,
    warnsEnabled: false,
    kicksEnabled: false,
    bansEnabled: false,
    unbansEnabled: false,
    timeoutsEnabled: false,
    untimeoutsEnabled: false,
    softbansEnabled: false,
    channelLocksEnabled: false,
    lockdownsEnabled: false,
    slowmodeEnabled: false,
    messagePurgeEnabled: false,
    automodActionsEnabled: false,
    memberJoinEnabled: false,
    memberLeaveEnabled: false,
    roleUpdatesEnabled: false,
    nicknameChangesEnabled: false,
    usernameChangesEnabled: false,
    messageDeleteEnabled: false,
    messageEditEnabled: false,
    bulkDeleteEnabled: false,
    messageAttachmentsEnabled: false,
    channelCreateEnabled: false,
    channelDeleteEnabled: false,
    channelUpdateEnabled: false,
    roleCreateEnabled: false,
    roleDeleteEnabled: false,
    roleUpdateEnabled: false,
    voiceJoinEnabled: false,
    voiceLeaveEnabled: false,
    voiceMoveEnabled: false,
    voiceMuteDeafenEnabled: false,
    voiceStreamingEnabled: false,
    serverUpdateEnabled: false,
    emojiEnabled: false,
    stickerEnabled: false,
    webhookEnabled: false,
    inviteEnabled: false,
    integrationEnabled: false,
    ignoredChannels: [],
    ignoredRoles: [],
    ignoredUsers: [],
    includeBotActions: false,
    logMessageContent: true,
    logEmbedUrls: true,
    retentionPeriod: 30,
  });

  const [originalSettings, setOriginalSettings] = useState<LoggingSettings>({
    enabled: false,
    automodLogChannel: null,
    logAutomodViolations: true,
    logAutomodActions: true,
    logAutomodFilters: false,
    antiRaidChannel: null,
    logRaidDetections: true,
    logRaidActions: true,
    logJoinPatterns: false,
    verificationChannel: null,
    trackVerificationMetrics: false,
    logFailedVerificationAttempts: false,
    moderationChannel: null,
    memberChannel: null,
    messageChannel: null,
    channelLogsChannel: null,
    roleLogsChannel: null,
    voiceChannel: null,
    serverChannel: null,
    warnsEnabled: false,
    kicksEnabled: false,
    bansEnabled: false,
    unbansEnabled: false,
    timeoutsEnabled: false,
    untimeoutsEnabled: false,
    softbansEnabled: false,
    channelLocksEnabled: false,
    lockdownsEnabled: false,
    slowmodeEnabled: false,
    messagePurgeEnabled: false,
    automodActionsEnabled: false,
    memberJoinEnabled: false,
    memberLeaveEnabled: false,
    roleUpdatesEnabled: false,
    nicknameChangesEnabled: false,
    usernameChangesEnabled: false,
    messageDeleteEnabled: false,
    messageEditEnabled: false,
    bulkDeleteEnabled: false,
    messageAttachmentsEnabled: false,
    channelCreateEnabled: false,
    channelDeleteEnabled: false,
    channelUpdateEnabled: false,
    roleCreateEnabled: false,
    roleDeleteEnabled: false,
    roleUpdateEnabled: false,
    voiceJoinEnabled: false,
    voiceLeaveEnabled: false,
    voiceMoveEnabled: false,
    voiceMuteDeafenEnabled: false,
    voiceStreamingEnabled: false,
    serverUpdateEnabled: false,
    emojiEnabled: false,
    stickerEnabled: false,
    webhookEnabled: false,
    inviteEnabled: false,
    integrationEnabled: false,
    ignoredChannels: [],
    ignoredRoles: [],
    ignoredUsers: [],
    includeBotActions: false,
    logMessageContent: true,
    logEmbedUrls: true,
    retentionPeriod: 30,
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
          if (data.configuration?.logging) {
            const loadedSettings = { ...settings, ...data.configuration.logging };
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
          'configuration.logging': settings,
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

  const updateSetting = <K extends keyof LoggingSettings>(key: K, value: LoggingSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] flex overflow-x-hidden">
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
                  <Link href={`/servers/${gid}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Automod
                  </Link>
                  <Link href={`/servers/${gid}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
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
            <h1 className="text-4xl font-bold text-[#0f172a]">Logging</h1>
          </div>

          {/* Logging Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6">
            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Logging Configuration</h2>
                <p className="text-sm text-slate-500">Configure event logging for your server.</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
                className="scale-125"
              />
            </div>
          </div>

          {/* AutoMod Log Channel Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">AutoMod Logging Channel</h2>
                <p className="text-sm text-slate-500">Configure where automod violations and actions are logged. Leave empty to disable logging for AutoMod.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">AutoMod Log Channel</p>
                    <p className="text-sm text-slate-500">All automod actions and violations will be logged here</p>
                  </div>
                  <select 
                    value={settings.automodLogChannel || ''} 
                    onChange={(e) => updateSetting('automodLogChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logAutomodViolations} 
                    onCheckedChange={(checked) => updateSetting('logAutomodViolations', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log AutoMod Violations</p>
                    <p className="text-sm text-slate-500">Track when users trigger automod filters</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logAutomodActions} 
                    onCheckedChange={(checked) => updateSetting('logAutomodActions', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log AutoMod Actions</p>
                    <p className="text-sm text-slate-500">Track actions taken by automod (deletes, timeouts, etc.)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logAutomodFilters} 
                    onCheckedChange={(checked) => updateSetting('logAutomodFilters', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log Filter Triggers</p>
                    <p className="text-sm text-slate-500">Log which specific filters were triggered</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Anti-Raid Alert Channel Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Anti-Raid Alert Channel</h2>
                <p className="text-sm text-slate-500">Configure where anti-raid alerts and actions are logged. Leave empty to disable alerts for Anti-Raid.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Anti-Raid Alert Channel</p>
                    <p className="text-sm text-slate-500">All anti-raid detections and actions will be logged here</p>
                  </div>
                  <select 
                    value={settings.antiRaidChannel || ''} 
                    onChange={(e) => updateSetting('antiRaidChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logRaidDetections} 
                    onCheckedChange={(checked) => updateSetting('logRaidDetections', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log Raid Detections</p>
                    <p className="text-sm text-slate-500">Record when potential raids are detected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logRaidActions} 
                    onCheckedChange={(checked) => updateSetting('logRaidActions', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log Raid Actions</p>
                    <p className="text-sm text-slate-500">Log actions taken in response to raids</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Log Channel Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Verification Log Channel</h2>
                <p className="text-sm text-slate-500">Configure where verification events are logged. Leave empty to disable Verification logs.</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Verification Log Channel</p>
                    <p className="text-sm text-slate-500">User verification successes and failures will be logged here</p>
                  </div>
                  <select 
                    value={settings.verificationChannel || ''} 
                    onChange={(e) => updateSetting('verificationChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.trackVerificationMetrics} 
                    onCheckedChange={(checked) => updateSetting('trackVerificationMetrics', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Track Verification Metrics</p>
                    <p className="text-sm text-slate-500">Log statistics about verification success rates and timing</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logFailedVerificationAttempts} 
                    onCheckedChange={(checked) => updateSetting('logFailedVerificationAttempts', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log Failed Verification Attempts</p>
                    <p className="text-sm text-slate-500">Track users who fail verification (account age, rules agreement, etc.)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Moderation Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Moderation Logs</h2>
                <p className="text-sm text-slate-500">Actions by staff members</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Moderation Log Channel</p>
                    <p className="text-sm text-slate-500">All moderation actions will be logged here</p>
                  </div>
                  <select 
                    value={settings.moderationChannel || ''} 
                    onChange={(e) => updateSetting('moderationChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                {[
                  { key: 'warns', label: 'Warns', desc: 'User warnings issued' },
                  { key: 'kicks', label: 'Kicks', desc: 'User kicks' },
                  { key: 'bans', label: 'Bans', desc: 'User bans' },
                  { key: 'unbans', label: 'Unbans', desc: 'User unbans' },
                  { key: 'timeouts', label: 'Timeouts/Mutes', desc: 'Temporary mutes/timeouts' },
                  { key: 'untimeouts', label: 'Untimeouts/Unmutes', desc: 'Mute removals' },
                  { key: 'softbans', label: 'Softbans', desc: 'Softbans (kick + delete messages)' },
                  { key: 'channelLocks', label: 'Channel Locks', desc: 'Channel lock/unlock actions' },
                  { key: 'lockdowns', label: 'Lockdowns', desc: 'Server lockdown/unlockdown' },
                  { key: 'slowmode', label: 'Slowmode', desc: 'Slowmode changes' },
                  { key: 'messagePurge', label: 'Message Purge/Clear', desc: 'Bulk message deletions' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch 
                      checked={!!settings[`${item.key}Enabled` as keyof LoggingSettings]} 
                      onCheckedChange={(checked) => updateSetting(`${item.key}Enabled` as any, checked)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Member Logs</h2>
                <p className="text-sm text-slate-500">Member activity</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Member Log Channel</p>
                    <p className="text-sm text-slate-500">All member events will be logged here</p>
                  </div>
                  <select 
                    value={settings.memberChannel || ''} 
                    onChange={(e) => updateSetting('memberChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                {[
                  { key: 'memberJoin', label: 'Member Join', desc: 'New members joining' },
                  { key: 'memberLeave', label: 'Member Leave', desc: 'Members leaving/kicked/banned' },
                  { key: 'roleUpdates', label: 'Role Updates', desc: 'Role additions/removals to members' },
                  { key: 'nicknameChanges', label: 'Nickname Changes', desc: 'Nickname updates (by user or staff)' },
                  { key: 'usernameChanges', label: 'Username Changes', desc: 'Username changes (when Discord updates)' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch 
                      checked={!!settings[`${item.key}Enabled` as keyof LoggingSettings]} 
                      onCheckedChange={(checked) => updateSetting(`${item.key}Enabled` as any, checked)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Message Logs</h2>
                <p className="text-sm text-slate-500">Message activity</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Message Log Channel</p>
                    <p className="text-sm text-slate-500">All message events will be logged here</p>
                  </div>
                  <select 
                    value={settings.messageChannel || ''} 
                    onChange={(e) => updateSetting('messageChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                {[
                  { key: 'messageDelete', label: 'Message Delete', desc: 'Deleted messages (with content)' },
                  { key: 'messageEdit', label: 'Message Edit', desc: 'Edited messages (before/after)' },
                  { key: 'messageAttachments', label: 'Message Attachments', desc: 'Track image/file shares' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch 
                      checked={!!settings[`${item.key}Enabled` as keyof LoggingSettings]} 
                      onCheckedChange={(checked) => updateSetting(`${item.key}Enabled` as any, checked)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Channel Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Channel Logs</h2>
                <p className="text-sm text-slate-500">Server structure</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Channel Log Channel</p>
                    <p className="text-sm text-slate-500">All channel events will be logged here</p>
                  </div>
                  <select 
                    value={settings.channelLogsChannel || ''} 
                    onChange={(e) => updateSetting('channelLogsChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                {[
                  { key: 'channelCreate', label: 'Channel Create', desc: 'New channels created' },
                  { key: 'channelDelete', label: 'Channel Delete', desc: 'Channels deleted' },
                  { key: 'channelUpdate', label: 'Channel Update', desc: 'Channel name, topic, permissions changed' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch 
                      checked={!!settings[`${item.key}Enabled` as keyof LoggingSettings]} 
                      onCheckedChange={(checked) => updateSetting(`${item.key}Enabled` as any, checked)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Role Logs</h2>
                <p className="text-sm text-slate-500">Role management</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Role Log Channel</p>
                    <p className="text-sm text-slate-500">All role events will be logged here</p>
                  </div>
                  <select 
                    value={settings.roleLogsChannel || ''} 
                    onChange={(e) => updateSetting('roleLogsChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                {[
                  { key: 'roleCreate', label: 'Role Create', desc: 'New roles created' },
                  { key: 'roleRemove', label: 'Role Remove', desc: 'Roles deleted' },
                  { key: 'roleUpdate', label: 'Role Update', desc: 'Role permissions, color, name changed' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch 
                      checked={!!settings[`${item.key}Enabled` as keyof LoggingSettings]} 
                      onCheckedChange={(checked) => updateSetting(`${item.key}Enabled` as any, checked)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voice Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Voice Logs</h2>
                <p className="text-sm text-slate-500">Voice activity</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Voice Log Channel</p>
                    <p className="text-sm text-slate-500">All voice events will be logged here</p>
                  </div>
                  <select 
                    value={settings.voiceChannel || ''} 
                    onChange={(e) => updateSetting('voiceChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                {[
                  { key: 'voiceJoin', label: 'Voice Join', desc: 'User joins voice channel' },
                  { key: 'voiceLeave', label: 'Voice Leave', desc: 'User leaves voice channel' },
                  { key: 'voiceMove', label: 'Voice Move', desc: 'User moved between channels' },
                  { key: 'voiceMuteDeafen', label: 'Voice Mute/Deafen', desc: 'Server mute/deafen changes' },
                  { key: 'voiceStreaming', label: 'Voice Streaming/Video', desc: 'User starts streaming/video' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch 
                      checked={!!settings[`${item.key}Enabled` as keyof LoggingSettings]} 
                      onCheckedChange={(checked) => updateSetting(`${item.key}Enabled` as any, checked)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Server Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Server Logs</h2>
                <p className="text-sm text-slate-500">Server changes</p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Server Log Channel</p>
                    <p className="text-sm text-slate-500">All server events will be logged here</p>
                  </div>
                  <select 
                    value={settings.serverChannel || ''} 
                    onChange={(e) => updateSetting('serverChannel', e.target.value || null)}
                    className="w-full sm:w-48 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>#{ch.name}</option>
                    ))}
                  </select>
                </div>

                {[
                  { key: 'serverUpdate', label: 'Server Update', desc: 'Server name, icon, region changed' },
                  { key: 'emoji', label: 'Emoji Create/Delete/Update', desc: 'Emoji changes' },
                  { key: 'sticker', label: 'Sticker Create/Delete/Update', desc: 'Sticker changes' },
                  { key: 'webhook', label: 'Webhook Create/Delete/Update', desc: 'Webhook changes' },
                  { key: 'invite', label: 'Invite Create/Delete', desc: 'Invite link tracking' },
                  { key: 'integration', label: 'Integration Updates', desc: 'Bot integrations added/removed' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                    <Switch 
                      checked={!!settings[`${item.key}Enabled` as keyof LoggingSettings]} 
                      onCheckedChange={(checked) => updateSetting(`${item.key}Enabled` as any, checked)}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Advanced Options Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Advanced Logging Options</h2>
                <p className="text-sm text-slate-500">Configure advanced logging behavior</p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Log Ignored Channels</label>
                  <div className="space-y-2">
                    {settings.ignoredChannels.map((channelId, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select 
                          value={channelId} 
                          onChange={(e) => {
                            const newIgnored = [...settings.ignoredChannels];
                            newIgnored[idx] = e.target.value;
                            updateSetting('ignoredChannels', newIgnored);
                          }}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select channel...</option>
                          {channels.map(ch => (
                            <option key={ch.id} value={ch.id}>#{ch.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const newIgnored = settings.ignoredChannels.filter((_, i) => i !== idx);
                            updateSetting('ignoredChannels', newIgnored);
                          }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateSetting('ignoredChannels', [...settings.ignoredChannels, ''])}
                      className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-700 transition text-sm font-medium"
                    >
                      + Add Channel
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">Channels to exclude from logging</p>
                </div>

                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Log Ignored Roles</label>
                  <div className="space-y-2">
                    {settings.ignoredRoles.map((roleId, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <select 
                          value={roleId} 
                          onChange={(e) => {
                            const newIgnored = [...settings.ignoredRoles];
                            newIgnored[idx] = e.target.value;
                            updateSetting('ignoredRoles', newIgnored);
                          }}
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select role...</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>@{role.name}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const newIgnored = settings.ignoredRoles.filter((_, i) => i !== idx);
                            updateSetting('ignoredRoles', newIgnored);
                          }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateSetting('ignoredRoles', [...settings.ignoredRoles, ''])}
                      className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-700 transition text-sm font-medium"
                    >
                      + Add Role
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">Roles to exclude from logging (e.g., bots)</p>
                </div>

                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Log Ignored Users</label>
                  <div className="space-y-2">
                    {settings.ignoredUsers.map((userId, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input 
                          type="text"
                          value={userId} 
                          onChange={(e) => {
                            const newIgnored = [...settings.ignoredUsers];
                            newIgnored[idx] = e.target.value;
                            updateSetting('ignoredUsers', newIgnored);
                          }}
                          placeholder="Enter user ID or search..."
                          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newIgnored = settings.ignoredUsers.filter((_, i) => i !== idx);
                            updateSetting('ignoredUsers', newIgnored);
                          }}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => updateSetting('ignoredUsers', [...settings.ignoredUsers, ''])}
                      className="w-full px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-700 transition text-sm font-medium"
                    >
                      + Add User
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">Specific users to exclude (enter Discord user ID)</p>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.includeBotActions} 
                    onCheckedChange={(checked) => updateSetting('includeBotActions', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Include Bot Actions</p>
                    <p className="text-sm text-slate-500">Toggle logging bot actions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logMessageContent} 
                    onCheckedChange={(checked) => updateSetting('logMessageContent', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log Message Content</p>
                    <p className="text-sm text-slate-500">Toggle storing message content (privacy)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <Switch 
                    checked={settings.logEmbedUrls} 
                    onCheckedChange={(checked) => updateSetting('logEmbedUrls', checked)}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Log Embed/Attachment URLs</p>
                    <p className="text-sm text-slate-500">Store links from deleted messages</p>
                  </div>
                </div>

                <div className="p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <label className="block font-semibold text-slate-900">Retention Period</label>
                  <input 
                    type="number" 
                    value={settings.retentionPeriod} 
                    onChange={(e) => updateSetting('retentionPeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    min="1" 
                    max="365" 
                  />
                  <p className="text-sm text-slate-500">How long to keep logs (days)</p>
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
