'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface MessageConfig {
  enabled: boolean;
  channel: string;
  title: string;
  description: string;
  color: string;
  footer: string;
}

interface NotificationsSettings {
  welcomeMessage: MessageConfig;
  leaveMessage: MessageConfig;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { guildId } = useParams();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [channels, setChannels] = useState<Array<{ id: string; name: string }>>([]);

  const [welcomeMessage, setWelcomeMessage] = useState<MessageConfig>({
    enabled: false,
    channel: '',
    title: 'Welcome to {server}!',
    description: 'Hey {user}, welcome to **{server}**! You are member #{memberCount}.',
    color: '#f97316',
    footer: 'Enjoy your stay!'
  });

  const [leaveMessage, setLeaveMessage] = useState<MessageConfig>({
    enabled: false,
    channel: '',
    title: 'Member Left',
    description: '{user} has left the server. We now have {memberCount} members.',
    color: '#f97316',
    footer: 'Goodbye!'
  });

  const [initialSettings, setInitialSettings] = useState<NotificationsSettings>({
    welcomeMessage,
    leaveMessage
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchSettings();
    fetchChannels();
  }, [guildId]);

  useEffect(() => {
    const changed = JSON.stringify({ welcomeMessage, leaveMessage }) !== JSON.stringify(initialSettings);
    setHasChanges(changed);
  }, [welcomeMessage, leaveMessage, initialSettings]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/servers/${guildId}/modules/notifications`);
      if (res.ok) {
        const data = await res.json();
        if (data.welcomeMessage) setWelcomeMessage(data.welcomeMessage);
        if (data.leaveMessage) setLeaveMessage(data.leaveMessage);
        setInitialSettings({
          welcomeMessage: data.welcomeMessage || welcomeMessage,
          leaveMessage: data.leaveMessage || leaveMessage
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch(`/api/servers/${guildId}/channels-and-roles`);
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels || []);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/servers/${guildId}/modules/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ welcomeMessage, leaveMessage })
      });

      if (res.ok) {
        setInitialSettings({ welcomeMessage, leaveMessage });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = () => {
    setWelcomeMessage(initialSettings.welcomeMessage);
    setLeaveMessage(initialSettings.leaveMessage);
    setHasChanges(false);
  };

  const replaceVariables = (text: string) => {
    return text
      .replace(/{user}/g, '<span class="text-orange-500 font-semibold">@Username</span>')
      .replace(/{server}/g, '<span class="font-semibold">Example Server</span>')
      .replace(/{memberCount}/g, '<span class="font-semibold">1,234</span>');
  };

  const renderPreview = (config: MessageConfig, title: string) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      {config.enabled ? (
        <div className="bg-gray-700 rounded p-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-white font-semibold">Luno</span>
                <span className="text-xs text-gray-400">Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="bg-gray-800 rounded border-l-4 p-3 mt-2" style={{ borderLeftColor: config.color }}>
                {config.title && (
                  <div className="text-white font-semibold mb-2" dangerouslySetInnerHTML={{ __html: replaceVariables(config.title) }} />
                )}
                {config.description && (
                  <div className="text-gray-300 text-sm mb-2" dangerouslySetInnerHTML={{ __html: replaceVariables(config.description) }} />
                )}
                {config.footer && (
                  <div className="text-xs text-gray-400 mt-2" dangerouslySetInnerHTML={{ __html: replaceVariables(config.footer) }} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-700 rounded p-8 text-center text-gray-400">
          Preview disabled
        </div>
      )}
    </div>
  );

  const renderMessageSection = (
    config: MessageConfig,
    setConfig: React.Dispatch<React.SetStateAction<MessageConfig>>,
    sectionTitle: string
  ) => (
    <div className="space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0f172a]">{sectionTitle}</h3>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            />
            <div className={`block w-14 h-8 rounded-full ${config.enabled ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config.enabled ? 'transform translate-x-6' : ''}`}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {config.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      <div 
        className={`overflow-hidden transition-all duration-700 ${config.enabled ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        <div className="space-y-4 border-t border-orange-100 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={config.channel}
                  onChange={(e) => setConfig({ ...config, channel: e.target.value })}
                  disabled={!config.enabled}
                >
                  <option value="">Select a channel</option>
                  {channels.map(ch => (
                    <option key={ch.id} value={ch.id}>#{ch.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  disabled={!config.enabled}
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={4}
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  disabled={!config.enabled}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={config.footer}
                  onChange={(e) => setConfig({ ...config, footer: e.target.value })}
                  disabled={!config.enabled}
                  placeholder="Enter footer text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Embed Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                    value={config.color}
                    onChange={(e) => setConfig({ ...config, color: e.target.value })}
                    disabled={!config.enabled}
                  />
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={config.color}
                    onChange={(e) => setConfig({ ...config, color: e.target.value })}
                    disabled={!config.enabled}
                    placeholder="#f97316"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-900 font-medium mb-1">Available Variables:</p>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><code className="bg-blue-100 px-1 rounded">{'{user}'}</code> - Mentions the user</div>
                  <div><code className="bg-blue-100 px-1 rounded">{'{server}'}</code> - Server name</div>
                  <div><code className="bg-blue-100 px-1 rounded">{'{memberCount}'}</code> - Total member count</div>
                </div>
              </div>
            </div>

            <div>
              {renderPreview(config, 'Live Preview')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex flex-col md:flex-row">
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
        <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12 md:ml-0">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#0f172a]">Luno</span>
          </Link>
        </div>
        
        <div className="px-4 py-4">
          <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>
            ← Back to Servers
          </Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href={`/servers/${guildId}`} className="flex items-center gap-3 px-3 py-6 bg-white hover:bg-orange-50/30 text-slate-700 hover:text-orange-700 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          
          <details className="text-slate-700" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span className="flex items-center gap-3"><img src="/settings-icon.svg" alt="" className="w-5 h-5" />Settings</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className={`px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  General
                </Link>
                <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Setup
                </Link>
              </div>
            )}
          </details>

          <details className="text-slate-700" open={configOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
              <span className="flex items-center gap-3">Configuration</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {configOpen && (
              <div className={`px-2 py-1 space-y-1 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Automod
                </Link>
                <Link href={`/servers/${guildId}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Logging
                </Link>
                <Link href={`/servers/${guildId}/configuration/anti-raid`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Anti-Raid
                </Link>
                <Link href={`/servers/${guildId}/configuration/reaction-roles`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Reaction Roles
                </Link>
                <Link href={`/servers/${guildId}/configuration/verification`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Verification
                </Link>
              </div>
            )}
          </details>

          <details className="text-slate-700" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3"><img src="/modules-icon.svg" alt="" className="w-5 h-5" />Modules</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className={`px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/moderation') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Moderation
                </Link>
                <Link href={`/servers/${guildId}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/role-management') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Role Management
                </Link>
                <Link href={`/servers/${guildId}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/member-management') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Member Management
                </Link>
                <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/announcements') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Announcements
                </Link>
                <Link href={`/servers/${guildId}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/notifications') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Welcome Messages
                </Link>
                <Link href={`/servers/${guildId}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/fun') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Fun
                </Link>
                <Link href={`/servers/${guildId}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/utilities') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12">
        <div className="w-full space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Modules</p>
            <h1 className="text-3xl font-bold">Welcome Messages</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-lg shadow-sm p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Welcome & Leave Messages</h2>
              <p className="text-slate-600">Configure welcome and leave messages for your server.</p>
            </div>

            <div className="space-y-6 border-t border-orange-100 pt-6">
              {renderMessageSection(welcomeMessage, setWelcomeMessage, 'Welcome Messages')}
              {renderMessageSection(leaveMessage, setLeaveMessage, 'Leave Messages')}
            </div>
          </div>
        </div>
      </main>

      {/* Save Changes Overlay */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl transition-transform duration-300 ease-out z-50 ${
          hasChanges ? 'translate-y-0' : 'translate-y-full'
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
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
