'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LoggingSettings {
  enabled: boolean;
  moderationChannel: string | null;
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
}

interface Channel {
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState<LoggingSettings>({
    enabled: false,
    moderationChannel: null,
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
  });

  const [originalSettings, setOriginalSettings] = useState<LoggingSettings>({
    enabled: false,
    moderationChannel: null,
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
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const fetchChannels = async () => {
      try {
        const res = await fetch(`/api/servers/${gid}/channels-and-roles`);
        if (res.ok) {
          const data = await res.json();
          setChannels(data.channels || []);
        }
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      }
    };

    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/servers/${gid}/general`);
        if (res.ok) {
          const data = await res.json();
          if (data.configuration?.logging) {
            const loggingData = data.configuration.logging;
            // Map MongoDB schema fields to frontend state
            const mergedSettings: LoggingSettings = {
              enabled: loggingData.enabled ?? false,
              moderationChannel: loggingData.moderationChannel ?? null,
              warnsEnabled: loggingData.warnsEnabled ?? false,
              kicksEnabled: loggingData.kicksEnabled ?? false,
              bansEnabled: loggingData.bansEnabled ?? false,
              unbansEnabled: loggingData.unbansEnabled ?? false,
              timeoutsEnabled: loggingData.timeoutsEnabled ?? false,
              untimeoutsEnabled: loggingData.untimeoutsEnabled ?? false,
              softbansEnabled: loggingData.softbansEnabled ?? false,
              channelLocksEnabled: loggingData.channelLocksEnabled ?? false,
              lockdownsEnabled: loggingData.lockdownsEnabled ?? false,
              slowmodeEnabled: loggingData.slowmodeEnabled ?? false,
              messagePurgeEnabled: loggingData.messagePurgeEnabled ?? false,
              automodActionsEnabled: loggingData.automodActionsEnabled ?? false,
              memberJoinEnabled: loggingData.memberJoinEnabled ?? false,
              memberLeaveEnabled: loggingData.memberLeaveEnabled ?? false,
              roleUpdatesEnabled: loggingData.roleUpdatesEnabled ?? false,
              nicknameChangesEnabled: loggingData.nicknameChangesEnabled ?? false,
              usernameChangesEnabled: loggingData.usernameChangesEnabled ?? false,
              messageDeleteEnabled: loggingData.messageDeleteEnabled ?? false,
              messageEditEnabled: loggingData.messageEditEnabled ?? false,
              bulkDeleteEnabled: loggingData.bulkDeleteEnabled ?? false,
              messageAttachmentsEnabled: loggingData.messageAttachmentsEnabled ?? false,
              channelCreateEnabled: loggingData.channelCreateEnabled ?? false,
              channelDeleteEnabled: loggingData.channelDeleteEnabled ?? false,
              channelUpdateEnabled: loggingData.channelUpdateEnabled ?? false,
              roleCreateEnabled: loggingData.roleCreateEnabled ?? false,
              roleDeleteEnabled: loggingData.roleDeleteEnabled ?? false,
              roleUpdateEnabled: loggingData.roleUpdateEnabled ?? false,
              voiceJoinEnabled: loggingData.voiceJoinEnabled ?? false,
              voiceLeaveEnabled: loggingData.voiceLeaveEnabled ?? false,
              voiceMoveEnabled: loggingData.voiceMoveEnabled ?? false,
              voiceMuteDeafenEnabled: loggingData.voiceMuteDeafenEnabled ?? false,
              voiceStreamingEnabled: loggingData.voiceStreamingEnabled ?? false,
              serverUpdateEnabled: loggingData.serverUpdateEnabled ?? false,
              emojiEnabled: loggingData.emojiEnabled ?? false,
              stickerEnabled: loggingData.stickerEnabled ?? false,
              webhookEnabled: loggingData.webhookEnabled ?? false,
              inviteEnabled: loggingData.inviteEnabled ?? false,
              integrationEnabled: loggingData.integrationEnabled ?? false,
            };
            setSettings(mergedSettings);
            setOriginalSettings(mergedSettings);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
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

  const toggleEvent = (key: keyof LoggingSettings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings({ ...settings, [key]: !settings[key] });
      setHasUnsavedChanges(true);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a] flex">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[40] lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-orange-100 shadow-lg lg:shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="p-4 border-b border-orange-100 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
            <div className="w-8 lg:hidden"></div>
          </div>
          
          <div className="px-4 py-4">
            <Link 
              href="/servers" 
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Back to Servers
            </Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link 
              href={`/servers/${gid}`}
              className="flex items-center gap-3 px-3 py-6 transition-colors rounded-lg hover:bg-gray-100 text-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/dashbaord.png" alt="" className="w-5 h-5" />
              Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/settings.png" alt="" className="w-5 h-5" />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-slate-200 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${gid}/settings/general`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    General
                  </Link>
                  <Link 
                    href={`/servers/${gid}/settings/setup`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Setup
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={configOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/configuration.png" alt="" className="w-5 h-5" />
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-slate-200 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${gid}/configuration/automod`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Automod
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/logging`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left bg-orange-50 text-orange-600 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logging
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/anti-raid`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Anti-Raid
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/reaction-roles`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reaction Roles
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/verification`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Verification
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/modules.png" alt="" className="w-5 h-5" />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-slate-200 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${gid}/modules/moderation`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Moderation
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/role-management`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Role Management
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/member-management`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Member Management
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/announcements`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Announcements
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/welcome-messages`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Welcome Messages
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/fun`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '250ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fun
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/utilities`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '300ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>
          

        </aside>

        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-orange-100 z-30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900">Logging Configuration</h1>
          <div className="w-8"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
        {/* Enable/Disable Logging */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Enable Logging</h2>
              <p className="text-sm text-slate-600 mt-1">Turn server event logging on or off</p>
            </div>
            <button
              onClick={() => updateSetting('enabled', !settings.enabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Log Channel Selection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Log Channel</h2>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Select the channel where logs will be posted
          </label>
          <select
            value={settings.moderationChannel || ''}
            onChange={(e) => updateSetting('moderationChannel', e.target.value || null)}
            className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="">Select a channel...</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))}
          </select>
        </div>

        {/* Logged Events */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Logged Events</h2>
          
          <div className="space-y-4">
            {/* Moderation Events */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Moderation Events</h3>
              <div className="space-y-3">
                {[
                  { key: 'warnsEnabled', label: 'Warns', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
                  { key: 'kicksEnabled', label: 'Kicks', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
                  { key: 'bansEnabled', label: 'Bans', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
                  { key: 'unbansEnabled', label: 'Unbans', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { key: 'timeoutsEnabled', label: 'Timeouts', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { key: 'untimeoutsEnabled', label: 'Untimeouts', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { key: 'softbansEnabled', label: 'Softbans', icon: 'M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6' },
                  { key: 'channelLocksEnabled', label: 'Channel Locks', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                  { key: 'lockdownsEnabled', label: 'Server Lockdowns', icon: 'M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z' },
                  { key: 'slowmodeEnabled', label: 'Slowmode Changes', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { key: 'messagePurgeEnabled', label: 'Message Purges', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                  { key: 'automodActionsEnabled', label: 'Automod Actions', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                      <span className="text-slate-900">{event.label}</span>
                    </div>
                    <button
                      onClick={() => toggleEvent(event.key as keyof LoggingSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[event.key as keyof LoggingSettings] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[event.key as keyof LoggingSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Events */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Member Events</h3>
              <div className="space-y-3">
                {[
                  { key: 'memberJoinEnabled', label: 'Member Joins', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
                  { key: 'memberLeaveEnabled', label: 'Member Leaves', icon: 'M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6' },
                  { key: 'roleUpdatesEnabled', label: 'Role Updates', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
                  { key: 'nicknameChangesEnabled', label: 'Nickname Changes', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                  { key: 'usernameChangesEnabled', label: 'Username Changes', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                      <span className="text-slate-900">{event.label}</span>
                    </div>
                    <button
                      onClick={() => toggleEvent(event.key as keyof LoggingSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[event.key as keyof LoggingSettings] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[event.key as keyof LoggingSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Events */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Message Events</h3>
              <div className="space-y-3">
                {[
                  { key: 'messageDeleteEnabled', label: 'Message Deletes', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                  { key: 'messageEditEnabled', label: 'Message Edits', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                  { key: 'bulkDeleteEnabled', label: 'Bulk Deletes', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                  { key: 'messageAttachmentsEnabled', label: 'Message Attachments', icon: 'M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                      <span className="text-slate-900">{event.label}</span>
                    </div>
                    <button
                      onClick={() => toggleEvent(event.key as keyof LoggingSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[event.key as keyof LoggingSettings] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[event.key as keyof LoggingSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Events */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Channel Events</h3>
              <div className="space-y-3">
                {[
                  { key: 'channelCreateEnabled', label: 'Channel Created', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
                  { key: 'channelDeleteEnabled', label: 'Channel Deleted', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                  { key: 'channelUpdateEnabled', label: 'Channel Updated', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                      <span className="text-slate-900">{event.label}</span>
                    </div>
                    <button
                      onClick={() => toggleEvent(event.key as keyof LoggingSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[event.key as keyof LoggingSettings] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[event.key as keyof LoggingSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Role Events */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Role Events</h3>
              <div className="space-y-3">
                {[
                  { key: 'roleCreateEnabled', label: 'Role Created', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
                  { key: 'roleDeleteEnabled', label: 'Role Deleted', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
                  { key: 'roleUpdateEnabled', label: 'Role Updated', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                      <span className="text-slate-900">{event.label}</span>
                    </div>
                    <button
                      onClick={() => toggleEvent(event.key as keyof LoggingSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[event.key as keyof LoggingSettings] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[event.key as keyof LoggingSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice Events */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Voice Events</h3>
              <div className="space-y-3">
                {[
                  { key: 'voiceJoinEnabled', label: 'Voice Join', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
                  { key: 'voiceLeaveEnabled', label: 'Voice Leave', icon: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
                  { key: 'voiceMoveEnabled', label: 'Voice Move', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
                  { key: 'voiceMuteDeafenEnabled', label: 'Mute/Deafen', icon: 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
                  { key: 'voiceStreamingEnabled', label: 'Voice Streaming', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                      <span className="text-slate-900">{event.label}</span>
                    </div>
                    <button
                      onClick={() => toggleEvent(event.key as keyof LoggingSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[event.key as keyof LoggingSettings] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[event.key as keyof LoggingSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Server Events */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wide">Server Events</h3>
              <div className="space-y-3">
                {[
                  { key: 'serverUpdateEnabled', label: 'Server Updates', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
                  { key: 'emojiEnabled', label: 'Emoji Changes', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { key: 'stickerEnabled', label: 'Sticker Changes', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
                  { key: 'webhookEnabled', label: 'Webhook Changes', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
                  { key: 'inviteEnabled', label: 'Invite Tracking', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { key: 'integrationEnabled', label: 'Integration Changes', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
                ].map(event => (
                  <div key={event.key} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                      <span className="text-slate-900">{event.label}</span>
                    </div>
                    <button
                      onClick={() => toggleEvent(event.key as keyof LoggingSettings)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[event.key as keyof LoggingSettings] ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[event.key as keyof LoggingSettings] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

            </div>
          </div>
        </div>

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
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
      </div>
    );
  }

