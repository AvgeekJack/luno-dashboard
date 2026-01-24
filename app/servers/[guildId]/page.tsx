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
              Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-2 sm:px-3 py-4 sm:py-6 cursor-pointer select-none bg-white hover:bg-orange-50/30 transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-2 sm:gap-3">
                  <img src="/settings-icon.svg" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 bg-white ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
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
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
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
                  <img src="/modules-icon.svg" alt="" className="w-4 h-4 sm:w-5 sm:h-5" />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 bg-white ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
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

      <main className="flex-1 md:ml-64 py-8 sm:py-12 px-4 sm:px-6 md:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-6xl space-y-3 sm:space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Settings</p>
            <h1 className="text-2xl sm:text-3xl font-bold">{serverName ?? 'Server'}</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">Dashboard</h2>
                <p className="text-sm sm:text-base text-slate-600">At-a-glance view of your bot configuration.</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                {botOnline === null ? (
                  <span className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-slate-50 px-2 sm:px-3 py-1 border border-slate-200">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-400 animate-pulse" aria-hidden /> Checking...
                  </span>
                ) : botOnline ? (
                  <span className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-green-50 px-2 sm:px-3 py-1 border border-green-200">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500" aria-hidden /> Bot Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-red-50 px-2 sm:px-3 py-1 border border-red-200">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500" aria-hidden /> Bot Offline
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Prefix</p>
                <p className="text-xl sm:text-2xl font-bold text-[#0f172a]">{settings.prefix || '!'}</p>
                <p className="text-xs text-slate-600">Current command prefix</p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-white p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Bot Nickname</p>
                <p className="text-base sm:text-lg font-semibold text-[#0f172a]">{settings.configuration?.botNickname || 'Not set'}</p>
                <p className="text-xs text-slate-600">Custom bot nickname</p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-white p-3 sm:p-4 shadow-sm sm:col-span-2 md:col-span-1">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Timezone</p>
                <p className="text-base sm:text-lg font-semibold text-[#0f172a]">{settings.configuration?.timezone || 'UTC'}</p>
                <p className="text-xs text-slate-600">Server timezone</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-orange-100 bg-orange-50/60 p-4 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Server Info</p>
                <p className="text-xs sm:text-sm text-slate-700">Guild ID: {String(guildId)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm text-slate-700">
              <div className="rounded-lg bg-white border border-orange-100 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Members</p>
                <p className="text-lg sm:text-xl font-bold text-[#0f172a]">{stats?.members ?? '—'}</p>
                <p className="text-xs text-slate-600">Total members</p>
              </div>
              <div className="rounded-lg bg-white border border-orange-100 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Presences</p>
                <p className="text-lg sm:text-xl font-bold text-[#0f172a]">{stats?.presences ?? '—'}</p>
                <p className="text-xs text-slate-600">Online/active</p>
              </div>
              <div className="rounded-lg bg-white border border-orange-100 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Text Channels</p>
                <p className="text-lg sm:text-xl font-bold text-[#0f172a]">{stats?.textChannels ?? '—'}</p>
                <p className="text-xs text-slate-600">Channel count</p>
              </div>
              <div className="rounded-lg bg-white border border-orange-100 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Voice Channels</p>
                <p className="text-lg sm:text-xl font-bold text-[#0f172a]">{stats?.voiceChannels ?? '—'}</p>
                <p className="text-xs text-slate-600">Channel count</p>
              </div>
              <div className="rounded-lg bg-white border border-orange-100 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Categories</p>
                <p className="text-lg sm:text-xl font-bold text-[#0f172a]">{stats?.categories ?? '—'}</p>
                <p className="text-xs text-slate-600">Organizers</p>
              </div>
              <div className="rounded-lg bg-white border border-orange-100 p-3 sm:p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Roles</p>
                <p className="text-lg sm:text-xl font-bold text-[#0f172a]">{stats?.roles ?? '—'}</p>
                <p className="text-xs text-slate-600">Configured roles</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}