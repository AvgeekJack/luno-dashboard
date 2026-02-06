'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

const DEVELOPER_USER_ID = '922940896322940929';

interface LoggingSettings {
  enabled: boolean;
  logAutomodViolations: boolean;
  logAutomodActions: boolean;
  logAutomodFilters: boolean;
  logRaidDetections: boolean;
  logRaidActions: boolean;
  logJoinPatterns: boolean;
  trackVerificationMetrics: boolean;
  logFailedVerificationAttempts: boolean;
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
  memberJoinEnabled: boolean;
  memberLeaveEnabled: boolean;
  roleUpdatesEnabled: boolean;
  nicknameChangesEnabled: boolean;
  usernameChangesEnabled: boolean;
  messageDeleteEnabled: boolean;
  messageEditEnabled: boolean;
  bulkDeleteEnabled: boolean;
  messageAttachmentsEnabled: boolean;
  channelCreateEnabled: boolean;
  channelDeleteEnabled: boolean;
  channelUpdateEnabled: boolean;
  roleCreateEnabled: boolean;
  roleDeleteEnabled: boolean;
  roleUpdateEnabled: boolean;
  voiceJoinEnabled: boolean;
  voiceLeaveEnabled: boolean;
  voiceMoveEnabled: boolean;
  voiceMuteDeafenEnabled: boolean;
  voiceStreamingEnabled: boolean;
  serverUpdateEnabled: boolean;
  emojiEnabled: boolean;
  stickerEnabled: boolean;
  webhookEnabled: boolean;
  inviteEnabled: boolean;
  integrationEnabled: boolean;
  includeBotActions: boolean;
  logMessageContent: boolean;
  logEmbedUrls: boolean;
  retentionPeriod: number;
}

export default function DefaultsLoggingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [settings, setSettings] = useState<LoggingSettings>({
    enabled: false,
    logAutomodViolations: true,
    logAutomodActions: true,
    logAutomodFilters: false,
    logRaidDetections: true,
    logRaidActions: true,
    logJoinPatterns: false,
    trackVerificationMetrics: false,
    logFailedVerificationAttempts: false,
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
    includeBotActions: false,
    logMessageContent: true,
    logEmbedUrls: true,
    retentionPeriod: 30,
  });

  const [originalSettings, setOriginalSettings] = useState<LoggingSettings>(settings);

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

    fetchSettings();
  }, [session, status, router, isDeveloper]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/developer/defaults/settings', {
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

  if (!isDeveloper) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Access Denied</div>;
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
                  <Link href="/developer/defaults/logging" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Logging
                  </Link>
                  <Link href="/developer/defaults/antiraid" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
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
                  <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed text-left" style={{animationDelay: '0ms'}}>
                    Moderation (Coming Soon)
                  </span>
                  <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed text-left" style={{animationDelay: '50ms'}}>
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

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-7xl space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-500 font-semibold">DEFAULT CONFIGURATION</p>
            <h1 className="text-4xl font-bold text-[#0f172a]">Logging Defaults</h1>
          </div>

          {/* Warning Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-orange-900 mb-1">⚠️ These are default settings applied to new servers</p>
                <p className="text-sm text-orange-800">Any changes made here will only affect newly added servers. Existing servers will retain their current settings. Log channels must be configured per-server.</p>
              </div>
            </div>
          </div>

          {/* Logging Configuration Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6">
            {/* Master Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Logging Configuration</h2>
                <p className="text-sm text-slate-500">Configure event logging defaults for new servers.</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
                className="scale-125"
              />
            </div>
          </div>

          {/* Grid Container for Logging Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AutoMod Logging Card */}
            {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">AutoMod Logging</h2>
                <p className="text-sm text-slate-500">Default toggles for automod logging</p>
              </div>

              <div className="space-y-4">
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

          {/* Moderation Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Moderation Logs</h2>
                <p className="text-sm text-slate-500">Actions by staff members</p>
              </div>

              <div className="space-y-4">
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

      
          {/* Message Logs Card */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Message Logs</h2>
                <p className="text-sm text-slate-500">Message activity</p>
              </div>

              <div className="space-y-4">
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
                {[
                  { key: 'roleCreate', label: 'Role Create', desc: 'New roles created' },
                  { key: 'roleDelete', label: 'Role Delete', desc: 'Roles deleted' },
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
          </div>

          {/* Advanced Options Card - Full Width */}
          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#0f172a]">Advanced Logging Options</h2>
                <p className="text-sm text-slate-500">Configure default logging behavior</p>
              </div>

              <div className="space-y-4">
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
                  <label className="block font-semibold text-slate-900">Default Retention Period</label>
                  <input 
                    type="number" 
                    value={settings.retentionPeriod} 
                    onChange={(e) => updateSetting('retentionPeriod', parseInt(e.target.value))}
                    className="w-full max-w-md px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                    min="1" 
                    max="365" 
                  />
                  <p className="text-sm text-slate-500">How long to keep logs (days)</p>
                </div>

                <p className="text-xs text-slate-500 px-2">Note: Specific ignored channels, roles, and users must be configured per-server, not in defaults.</p>
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
