'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CATEGORIES = ['Moderator', 'Info', 'Fun', 'Utility', 'Admin'];

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Role {
  id: string;
  name: string;
}

export default function CommandsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const [activeCategory, setActiveCategory] = useState('Moderator');
  const [botOnline, setBotOnline] = useState(true);
  const [warnEnabled, setWarnEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [settings, setSettings] = useState({
    allowedChannels: [] as string[],
    ignoredChannels: [] as string[],
    allowedRoles: [] as string[],
    ignoredRoles: [] as string[],
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    // Fetch channels and roles
    fetch(`/api/servers/${guildId}/channels-and-roles`)
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels || []);
        setRoles(data.roles || []);
      })
      .catch(err => console.error(err));
  }, [session, status, router, guildId]);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex gap-6">
        <aside className="w-64 bg-white/90 border border-orange-100 rounded-2xl shadow-sm p-4 h-fit sticky top-6">
          <div className="mb-6 space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Server</p>
            <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm">← Back to Servers</Link>
          </div>
          <nav className="space-y-1 text-sm font-semibold text-slate-700">
            <Link href={`/servers/${guildId}`} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Dashboard
            </Link>
            <details className="rounded-xl border border-orange-100 bg-orange-50/60 text-slate-800" open>
              <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none rounded-xl">
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              <div className="border-t border-orange-100 px-2 py-1 space-y-1">
                <Link href={`/servers/${guildId}/general`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  General
                </Link>
                <Link href={`/servers/${guildId}/setup`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Setup
                </Link>
                <Link href={`/servers/${guildId}/commands`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
                  Commands
                </Link>
              </div>
            </details>
            <Link href={`/servers/${guildId}/modules`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Modules
            </Link>
            <Link href={`/servers/${guildId}/logs`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Logs
            </Link>
          </nav>
        </aside>

        <main className="flex-1 space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-bold">Commands</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Commands</h2>
              <p className="text-slate-600">Configure and manage commands for this server.</p>
            </div>

            <div className="flex items-center justify-between border-t border-orange-100 pt-6">
              <span className="text-sm font-semibold text-slate-700">Bot Status</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBotOnline(!botOnline)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    botOnline ? 'bg-orange-500' : 'bg-slate-400'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      botOnline ? 'translate-x-5' : 'translate-x-1'
                    }`}
                    style={{ marginTop: '2px' }}
                  />
                </button>
                <span className="text-sm font-semibold text-slate-700">{botOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-50 text-slate-700 border border-orange-100 hover:bg-orange-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-orange-100 bg-slate-50 p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#0f172a]">warn</h3>
                      <p className="text-sm text-slate-600">Warn a user with a message</p>
                    </div>
                    <button
                      onClick={() => setWarnEnabled(!warnEnabled)}
                      className={`relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0 ${
                        warnEnabled ? 'bg-orange-500' : 'bg-slate-400'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          warnEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                        style={{ marginTop: '2px' }}
                      />
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowSettings(true)} className="flex-1 rounded-lg bg-orange-500 text-white px-3 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors">
                      Settings
                    </button>
                    <button className="flex-1 rounded-lg bg-orange-100 text-orange-700 px-3 py-2 text-sm font-semibold hover:bg-orange-200 transition-colors">
                      Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-100" onClick={() => setDropdownOpen(null)}>
            <div className="sticky top-0 bg-white border-b border-orange-100 flex items-center justify-between p-6">
              <h2 className="text-xl font-bold text-[#0f172a]">Additional Permissions (warn)</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-[#0f172a] transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Allowed Channels */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Allowed Channels</label>
                <div className="relative">
                  <div
                    onClick={() => setDropdownOpen(dropdownOpen === 'allowedChannels' ? null : 'allowedChannels')}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.allowedChannels.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select channels...</span>
                    ) : (
                      settings.allowedChannels.map(id => {
                        const channel = channels.find(c => c.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {channel?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  allowedChannels: settings.allowedChannels.filter(c => c !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'allowedChannels' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2">
                        <input
                          type="text"
                          placeholder="Search channels..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {channels
                          .filter(ch => !settings.allowedChannels.includes(ch.id) && ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  allowedChannels: [...settings.allowedChannels, ch.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              # {ch.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ignored Channels */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Ignored Channels</label>
                <div className="relative">
                  <div
                    onClick={() => setDropdownOpen(dropdownOpen === 'ignoredChannels' ? null : 'ignoredChannels')}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.ignoredChannels.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select channels...</span>
                    ) : (
                      settings.ignoredChannels.map(id => {
                        const channel = channels.find(c => c.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {channel?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  ignoredChannels: settings.ignoredChannels.filter(c => c !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'ignoredChannels' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2">
                        <input
                          type="text"
                          placeholder="Search channels..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {channels
                          .filter(ch => !settings.ignoredChannels.includes(ch.id) && ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  ignoredChannels: [...settings.ignoredChannels, ch.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              # {ch.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Allowed Roles */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Allowed Roles</label>
                <div className="relative">
                  <div
                    onClick={() => setDropdownOpen(dropdownOpen === 'allowedRoles' ? null : 'allowedRoles')}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.allowedRoles.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select roles...</span>
                    ) : (
                      settings.allowedRoles.map(id => {
                        const role = roles.find(r => r.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  allowedRoles: settings.allowedRoles.filter(r => r !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'allowedRoles' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2">
                        <input
                          type="text"
                          placeholder="Search roles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {roles
                          .filter(r => !settings.allowedRoles.includes(r.id) && r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(r => (
                            <button
                              key={r.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  allowedRoles: [...settings.allowedRoles, r.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              @ {r.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ignored Roles */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Ignored Roles</label>
                <div className="relative">
                  <div
                    onClick={() => setDropdownOpen(dropdownOpen === 'ignoredRoles' ? null : 'ignoredRoles')}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.ignoredRoles.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select roles...</span>
                    ) : (
                      settings.ignoredRoles.map(id => {
                        const role = roles.find(r => r.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  ignoredRoles: settings.ignoredRoles.filter(r => r !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'ignoredRoles' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2">
                        <input
                          type="text"
                          placeholder="Search roles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {roles
                          .filter(r => !settings.ignoredRoles.includes(r.id) && r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(r => (
                            <button
                              key={r.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  ignoredRoles: [...settings.ignoredRoles, r.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              @ {r.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowSettings(false)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
