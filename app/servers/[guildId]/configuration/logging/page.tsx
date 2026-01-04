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
                  <Link href={`/servers/${gid}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    Automod
                  </Link>
                  <Link href={`/servers/${gid}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    Logging
                  </Link>
                  <Link href={`/servers/${gid}/configuration/anti-raid`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                    Anti-Raid
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
                    Welcome Messages
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
            <h1 className="text-3xl font-bold">Logging</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            {/* Master Toggle */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Logging Configuration</h2>
                <p className="text-slate-600">Configure event logging for your server.</p>
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
              className={`overflow-hidden transition-all duration-700 ${settings.enabled ? 'max-h-[50000px] opacity-100' : 'max-h-0 opacity-0'}`}
              style={{ transitionProperty: 'max-height, opacity' }}
            >
              <div className="space-y-8 border-t border-orange-100 pt-8">
                {/* AutoMod Log Channel */}
                <div className="space-y-4 bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-[#0f172a]">AutoMod Logging Channel</h2>
                    <p className="text-sm text-slate-600">Configure where automod violations and actions are logged. Leave empty to disable logging for AutoMod.</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-200 bg-white">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">AutoMod Log Channel</p>
                      <p className="text-xs text-slate-500">All automod actions and violations will be logged here</p>
                    </div>
                    <select 
                      value={settings.automodLogChannel || ''} 
                      onChange={(e) => updateSetting('automodLogChannel', e.target.value || null)}
                      className="w-48 px-3 py-2 border border-amber-300 rounded-lg text-sm bg-white"
                    >
                      <option value="">Select channel...</option>
                      {channels.map(ch => (
                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-100">
                      <button type="button" onClick={() => updateSetting('logAutomodViolations', !settings.logAutomodViolations)}
                        className={`${settings.logAutomodViolations ? 'bg-amber-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.logAutomodViolations ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Log AutoMod Violations</p>
                        <p className="text-xs text-slate-500">Track when users trigger automod filters</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-100">
                      <button type="button" onClick={() => updateSetting('logAutomodActions', !settings.logAutomodActions)}
                        className={`${settings.logAutomodActions ? 'bg-amber-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.logAutomodActions ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Log AutoMod Actions</p>
                        <p className="text-xs text-slate-500">Track actions taken by automod (deletes, timeouts, etc.)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg border border-amber-100">
                      <button type="button" onClick={() => updateSetting('logAutomodFilters', !settings.logAutomodFilters)}
                        className={`${settings.logAutomodFilters ? 'bg-amber-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.logAutomodFilters ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Log Filter Triggers</p>
                        <p className="text-xs text-slate-500">Log which specific filters were triggered</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Anti-Raid Log Channel */}
                <div className="space-y-4 bg-red-50 p-6 rounded-lg border border-red-200">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-[#0f172a]">Anti-Raid Alert Channel</h2>
                    <p className="text-sm text-slate-600">Configure where anti-raid alerts and actions are logged. Leave empty to disable alerts for Anti-Raid.</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-red-200 bg-white">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">Anti-Raid Alert Channel</p>
                      <p className="text-xs text-slate-500">All anti-raid detections and actions will be logged here</p>
                    </div>
                    <select 
                      value={settings.antiRaidChannel || ''} 
                      onChange={(e) => updateSetting('antiRaidChannel', e.target.value || null)}
                      className="w-48 px-3 py-2 border border-red-300 rounded-lg text-sm bg-white"
                    >
                      <option value="">Select channel...</option>
                      {channels.map(ch => (
                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-red-100">
                      <button type="button" onClick={() => updateSetting('logRaidDetections', !settings.logRaidDetections)}
                        className={`${settings.logRaidDetections ? 'bg-red-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.logRaidDetections ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Log Raid Detections</p>
                        <p className="text-xs text-slate-500">Track when potential raids are detected</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg border border-red-100">
                      <button type="button" onClick={() => updateSetting('logRaidActions', !settings.logRaidActions)}
                        className={`${settings.logRaidActions ? 'bg-red-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.logRaidActions ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Log Anti-Raid Actions</p>
                        <p className="text-xs text-slate-500">Track actions taken during raid mitigation (kicks, bans, lockdowns)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg border border-red-100">
                      <button type="button" onClick={() => updateSetting('logJoinPatterns', !settings.logJoinPatterns)}
                        className={`${settings.logJoinPatterns ? 'bg-red-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.logJoinPatterns ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Log Join Patterns</p>
                        <p className="text-xs text-slate-500">Monitor suspicious join patterns and member influx rates</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Logs Section */}
                <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-[#0f172a]">Verification Logging</h2>
                    <p className="text-sm text-slate-600">Configure where verification events and metrics are logged. Tracks successful verifications, failures, and security events. Configure the full <Link href={`/servers/${gid}/configuration/verification`} className="text-blue-600 hover:text-blue-700 underline">Verification System</Link> settings separately.</p>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-200 bg-white">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">Verification Log Channel</p>
                      <p className="text-xs text-slate-500">All verification events will be logged here</p>
                    </div>
                    <select 
                      value={settings.verificationChannel || ''} 
                      onChange={(e) => updateSetting('verificationChannel', e.target.value || null)}
                      className="w-48 px-3 py-2 border border-blue-300 rounded-lg text-sm bg-white"
                    >
                      <option value="">Select channel...</option>
                      {channels.map(ch => (
                        <option key={ch.id} value={ch.id}>#{ch.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-100">
                      <button type="button" onClick={() => updateSetting('trackVerificationMetrics', !settings.trackVerificationMetrics)}
                        className={`${settings.trackVerificationMetrics ? 'bg-blue-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.trackVerificationMetrics ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Track Verification Metrics</p>
                        <p className="text-xs text-slate-500">Log statistics about verification success rates and timing</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg border border-blue-100">
                      <button type="button" onClick={() => updateSetting('logFailedVerificationAttempts', !settings.logFailedVerificationAttempts)}
                        className={`${settings.logFailedVerificationAttempts ? 'bg-blue-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                        <span className={`${settings.logFailedVerificationAttempts ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">Log Failed Verification Attempts</p>
                        <p className="text-xs text-slate-500">Track users who fail verification (account age, rules agreement, etc.)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Moderation Logs Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-[#0f172a]">Moderation Logs</h2>
                      <p className="text-sm text-slate-600">Actions by staff members</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Log to:</span>
                      <select 
                        value={settings.moderationChannel || ''} 
                        onChange={(e) => updateSetting('moderationChannel', e.target.value || null)}
                        className="w-48 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3">
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
                      <div key={item.key} className="flex items-center gap-3 p-4 rounded-lg border border-orange-100">
                        <button type="button" onClick={() => updateSetting(`${item.key}Enabled` as any, !settings[`${item.key}Enabled` as keyof LoggingSettings])}
                          className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                          <span className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Member Logs Section */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-[#0f172a]">Member Logs</h2>
                      <p className="text-sm text-slate-600">Member activity</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Log to:</span>
                      <select 
                        value={settings.memberChannel || ''} 
                        onChange={(e) => updateSetting('memberChannel', e.target.value || null)}
                        className="w-48 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { key: 'memberJoin', label: 'Member Join', desc: 'New members joining' },
                      { key: 'memberLeave', label: 'Member Leave', desc: 'Members leaving/kicked/banned' },
                      { key: 'roleUpdates', label: 'Role Updates', desc: 'Role additions/removals to members' },
                      { key: 'nicknameChanges', label: 'Nickname Changes', desc: 'Nickname updates (by user or staff)' },
                      { key: 'usernameChanges', label: 'Username Changes', desc: 'Username changes (when Discord updates)' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center gap-3 p-4 rounded-lg border border-orange-100">
                        <button type="button" onClick={() => updateSetting(`${item.key}Enabled` as any, !settings[`${item.key}Enabled` as keyof LoggingSettings])}
                          className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                          <span className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Logs Section */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-[#0f172a]">Message Logs</h2>
                      <p className="text-sm text-slate-600">Message activity</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Log to:</span>
                      <select 
                        value={settings.messageChannel || ''} 
                        onChange={(e) => updateSetting('messageChannel', e.target.value || null)}
                        className="w-48 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { key: 'messageDelete', label: 'Message Delete', desc: 'Deleted messages (with content)' },
                      { key: 'messageEdit', label: 'Message Edit', desc: 'Edited messages (before/after)' },
                      { key: 'messageAttachments', label: 'Message Attachments', desc: 'Track image/file shares' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center gap-3 p-4 rounded-lg border border-orange-100">
                        <button type="button" onClick={() => updateSetting(`${item.key}Enabled` as any, !settings[`${item.key}Enabled` as keyof LoggingSettings])}
                          className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                          <span className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel Logs Section */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-[#0f172a]">Channel Logs</h2>
                      <p className="text-sm text-slate-600">Server structure</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Log to:</span>
                      <select 
                        value={settings.channelLogsChannel || ''} 
                        onChange={(e) => updateSetting('channelLogsChannel', e.target.value || null)}
                        className="w-48 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { key: 'channelCreate', label: 'Channel Create', desc: 'New channels created' },
                      { key: 'channelDelete', label: 'Channel Delete', desc: 'Channels deleted' },
                      { key: 'channelUpdate', label: 'Channel Update', desc: 'Channel name, topic, permissions changed' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center gap-3 p-4 rounded-lg border border-orange-100">
                        <button type="button" onClick={() => updateSetting(`${item.key}Enabled` as any, !settings[`${item.key}Enabled` as keyof LoggingSettings])}
                          className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                          <span className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Logs Section */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-[#0f172a]">Role Logs</h2>
                      <p className="text-sm text-slate-600">Role management</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Log to:</span>
                      <select 
                        value={settings.roleLogsChannel || ''} 
                        onChange={(e) => updateSetting('roleLogsChannel', e.target.value || null)}
                        className="w-48 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { key: 'roleCreate', label: 'Role Create', desc: 'New roles created' },
                      { key: 'roleDelete', label: 'Role Delete', desc: 'Roles deleted' },
                      { key: 'roleUpdate', label: 'Role Update', desc: 'Role permissions, color, name changed' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center gap-3 p-4 rounded-lg border border-orange-100">
                        <button type="button" onClick={() => updateSetting(`${item.key}Enabled` as any, !settings[`${item.key}Enabled` as keyof LoggingSettings])}
                          className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                          <span className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Voice Logs Section */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-[#0f172a]">Voice Logs</h2>
                      <p className="text-sm text-slate-600">Voice activity</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Log to:</span>
                      <select 
                        value={settings.voiceChannel || ''} 
                        onChange={(e) => updateSetting('voiceChannel', e.target.value || null)}
                        className="w-48 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { key: 'voiceJoin', label: 'Voice Join', desc: 'User joins voice channel' },
                      { key: 'voiceLeave', label: 'Voice Leave', desc: 'User leaves voice channel' },
                      { key: 'voiceMove', label: 'Voice Move', desc: 'User moved between channels' },
                      { key: 'voiceMuteDeafen', label: 'Voice Mute/Deafen', desc: 'Server mute/deafen changes' },
                      { key: 'voiceStreaming', label: 'Voice Streaming/Video', desc: 'User starts streaming/video' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center gap-3 p-4 rounded-lg border border-orange-100">
                        <button type="button" onClick={() => updateSetting(`${item.key}Enabled` as any, !settings[`${item.key}Enabled` as keyof LoggingSettings])}
                          className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                          <span className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Server Logs Section */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="text-xl font-semibold text-[#0f172a]">Server Logs</h2>
                      <p className="text-sm text-slate-600">Server changes</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Log to:</span>
                      <select 
                        value={settings.serverChannel || ''} 
                        onChange={(e) => updateSetting('serverChannel', e.target.value || null)}
                        className="w-48 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { key: 'serverUpdate', label: 'Server Update', desc: 'Server name, icon, region changed' },
                      { key: 'emoji', label: 'Emoji Create/Delete/Update', desc: 'Emoji changes' },
                      { key: 'sticker', label: 'Sticker Create/Delete/Update', desc: 'Sticker changes' },
                      { key: 'webhook', label: 'Webhook Create/Delete/Update', desc: 'Webhook changes' },
                      { key: 'invite', label: 'Invite Create/Delete', desc: 'Invite link tracking' },
                      { key: 'integration', label: 'Integration Updates', desc: 'Bot integrations added/removed' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center gap-3 p-4 rounded-lg border border-orange-100">
                        <button type="button" onClick={() => updateSetting(`${item.key}Enabled` as any, !settings[`${item.key}Enabled` as keyof LoggingSettings])}
                          className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}>
                          <span className={`${settings[`${item.key}Enabled` as keyof LoggingSettings] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                        </button>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Options Section */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-[#0f172a]">Advanced Logging Options</h2>
                    <p className="text-sm text-slate-600">Configure advanced logging behavior</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Log Ignored Channels</label>
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
                              className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
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
                          className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:text-orange-700 transition text-sm font-medium"
                        >
                          + Add Channel
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">Channels to exclude from logging</p>
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Log Ignored Roles</label>
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
                              className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
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
                          className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:text-orange-700 transition text-sm font-medium"
                        >
                          + Add Role
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">Roles to exclude from logging (e.g., bots)</p>
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Log Ignored Users</label>
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
                              className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm"
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
                          className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:text-orange-700 transition text-sm font-medium"
                        >
                          + Add User
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">Specific users to exclude (enter Discord user ID)</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Include Bot Actions</p>
                        <p className="text-xs text-slate-500">Toggle logging bot actions</p>
                      </div>
                      <button type="button" onClick={() => updateSetting('includeBotActions', !settings.includeBotActions)}
                        className={`${settings.includeBotActions ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                        <span className={`${settings.includeBotActions ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Log Message Content</p>
                        <p className="text-xs text-slate-500">Toggle storing message content (privacy)</p>
                      </div>
                      <button type="button" onClick={() => updateSetting('logMessageContent', !settings.logMessageContent)}
                        className={`${settings.logMessageContent ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                        <span className={`${settings.logMessageContent ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Log Embed/Attachment URLs</p>
                        <p className="text-xs text-slate-500">Store links from deleted messages</p>
                      </div>
                      <button type="button" onClick={() => updateSetting('logEmbedUrls', !settings.logEmbedUrls)}
                        className={`${settings.logEmbedUrls ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}>
                        <span className={`${settings.logEmbedUrls ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                      </button>
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Retention Period</label>
                      <input type="number" value={settings.retentionPeriod} onChange={(e) => updateSetting('retentionPeriod', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm" min="1" max="365" />
                      <p className="text-xs text-slate-500">How long to keep logs (days)</p>
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
