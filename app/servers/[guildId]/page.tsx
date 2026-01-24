'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Settings {
  guildId: string;
  prefix: string;
  configuration?: {
    botNickname: string;
    timezone: string;
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

interface ServerStats {
  members: number | null;
  presences: number | null;
  textChannels: number | null;
  voiceChannels: number | null;
  categories: number | null;
  roles: number | null;
}

export default function ServerSettings() {
  const { data: session, status } = useSession();
  const { guildId } = useParams();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverName, setServerName] = useState<string | null>(null);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [botOnline, setBotOnline] = useState<boolean | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Poll bot status every 10 seconds
  useEffect(() => {
    const checkBotStatus = async () => {
      try {
        const res = await fetch('/api/bot-status');
        const data = await res.json();
        setBotOnline(data.online);
      } catch (error) {
        console.error('Failed to check bot status:', error);
        setBotOnline(false);
      }
    };

    checkBotStatus();
    const interval = setInterval(checkBotStatus, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    fetch(`/api/servers/${guildId}/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    fetch('/api/servers')
      .then(res => res.json())
      .then((data) => {
        const match = Array.isArray(data) ? data.find((g: any) => String(g.id) === String(guildId)) : null;
        setServerName(match?.name ?? null);
      })
      .catch((err) => {
        console.error(err);
      });

    fetch(`/api/servers/${guildId}/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setStats({
          members: data.members ?? null,
          presences: data.presences ?? null,
          textChannels: data.textChannels ?? null,
          voiceChannels: data.voiceChannels ?? null,
          categories: data.categories ?? null,
          roles: data.roles ?? null,
        });
      })
      .catch((err) => {
        console.error(err);
      });

    // Fetch channels for dropdowns
    fetch(`/api/servers/${guildId}/channels-and-roles`)
      .then((res) => res.json())
      .then((data) => {
        setChannels(data.channels ?? []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session, status, guildId, router]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!settings) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Server not found</div>;
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
              href="/servers" 
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-xs sm:text-sm px-2 sm:px-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Back to Servers
            </Link>
          </div>
          
          <nav className="px-3 sm:px-4 space-y-2 text-xs sm:text-sm font-semibold text-slate-700">
            <Link 
              href={`/servers/${guildId}`} 
              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-4 sm:py-6 bg-white hover:bg-orange-50/30 text-slate-700 hover:text-orange-700 transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/dashbaord.png" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
              Dashboard
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
                  <Link 
                    href={`/servers/${guildId}/general`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    General
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/setup`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Setup
                  </Link>
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
                  <Link 
                    href={`/servers/${guildId}/configuration/automod`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Automod
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/logging`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logging
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/anti-raid`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Anti-Raid
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/reaction-roles`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reaction Roles
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/verification`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
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
                  <Link 
                    href={`/servers/${guildId}/modules/moderation`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Moderation
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/role-management`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Role Management
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/member-management`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Member Management
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/announcements`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Announcements
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/notifications`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Welcome Messages
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/fun`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '250ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fun
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/utilities`} 
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
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

      <main className="flex-1 md:ml-0 py-8 sm:py-12 px-4 sm:px-6 md:px-8 pt-20 md:pt-8 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Overview of your server's activity and statistics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Members Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-1">Total Members</div>
              <div className="text-3xl font-bold text-slate-900">
                {stats?.members?.toLocaleString() ?? '—'}
              </div>
            </div>

            {/* Messages Today Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-1">Messages Today</div>
              <div className="text-3xl font-bold text-slate-900">12,453</div>
            </div>

            {/* Mod Actions Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-1">Mod Actions</div>
              <div className="text-3xl font-bold text-slate-900">23</div>
            </div>

            {/* Active Now Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-1">Active Now</div>
              <div className="text-3xl font-bold text-slate-900">{stats?.presences ?? '—'}</div>
            </div>
          </div>

          {/* Two Column Layout for Bot Settings and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bot Settings - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">BOT SETTINGS</h2>
              
              <div className="space-y-6">
                {/* Disable Warnings Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="disableWarnings"
                    className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="disableWarnings" className="text-sm text-slate-600 cursor-pointer">
                    Disable warnings for disabled commands/modules
                  </label>
                </div>

                {/* Two Column Grid for Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Command Prefix */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Command Prefix
                    </label>
                    <input
                      type="text"
                      value={settings?.prefix || '!'}
                      onChange={(e) => {
                        if (settings) {
                          setSettings({ ...settings, prefix: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="!"
                    />
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nickname
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
                      className="w-full px-4 py-2.5 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter bot nickname"
                    />
                  </div>

                  {/* Updates Channel */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Updates Channel
                    </label>
                    <select className="w-full px-4 py-2.5 bg-slate-700 text-slate-400 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer">
                      <option>Select...</option>
                      {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          #{channel.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Manager Roles */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Manager Roles (Owner/Administrator Only)
                    </label>
                    <select className="w-full px-4 py-2.5 bg-slate-700 text-slate-400 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer">
                      <option>Select...</option>
                    </select>
                  </div>

                  {/* Timezone with Detect Button */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Timezone
                    </label>
                    <div className="flex gap-3">
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
                        className="flex-1 px-4 py-2.5 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
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
                      <button
                        onClick={() => {
                          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                          if (settings) {
                            setSettings({
                              ...settings,
                              configuration: {
                                ...settings.configuration,
                                timezone: timezone,
                                botNickname: settings.configuration?.botNickname || ''
                              }
                            });
                          }
                        }}
                        className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Detect
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    onClick={async () => {
                      if (!settings) return;
                      setSaving(true);
                      try {
                        const res = await fetch(`/api/servers/${guildId}/settings`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            prefix: settings.prefix,
                            configuration: {
                              botNickname: settings.configuration?.botNickname,
                              timezone: settings.configuration?.timezone
                            }
                          })
                        });
                        if (res.ok) {
                          alert('Settings saved successfully!');
                        }
                      } catch (error) {
                        console.error('Failed to save settings:', error);
                        alert('Failed to save settings');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions and Server Status - Takes 1 column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href={`/servers/${guildId}/modules/moderation`} className="flex items-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Moderation</span>
                  </Link>
                  <Link href={`/servers/${guildId}/modules/role-management`} className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Manage Roles</span>
                  </Link>
                  <Link href={`/servers/${guildId}/commands`} className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Commands</span>
                  </Link>
                  <Link href={`/servers/${guildId}/setup`} className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Setup</span>
                  </Link>
                </div>
              </div>

              {/* Server Status */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Server Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Automod</span>
                    {settings?.configuration?.automod?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Disabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Logging</span>
                    {settings?.configuration?.logging?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Disabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Anti-Raid</span>
                    {settings?.configuration?.antiraid?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}