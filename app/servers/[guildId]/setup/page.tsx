'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

export default function SetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  const [modLogChannel, setModLogChannel] = useState('');
  const [welcomeChannel, setWelcomeChannel] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome {user} to {server}!');
  const [goodbyeChannel, setGoodbyeChannel] = useState('');
  const [goodbyeMessage, setGoodbyeMessage] = useState('Goodbye {user}, thanks for being part of {server}!');
  const [defaultRoles, setDefaultRoles] = useState<string[]>([]);
  const [modRoles, setModRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);

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

    // Fetch existing setup configuration
    fetch(`/api/servers/${guildId}/setup`)
      .then(res => res.json())
      .then(data => {
        if (data.moderation?.logChannel) setModLogChannel(data.moderation.logChannel);
        if (data.welcome?.channel) setWelcomeChannel(data.welcome.channel);
        if (data.welcome?.message) setWelcomeMessage(data.welcome.message);
        if (data.goodbye?.channel) setGoodbyeChannel(data.goodbye.channel);
        if (data.goodbye?.message) setGoodbyeMessage(data.goodbye.message);
        if (data.roles?.defaultRoles) setDefaultRoles(data.roles.defaultRoles);
        if (data.roles?.modRoles) setModRoles(data.roles.modRoles);
      })
      .catch(err => console.error(err));
  }, [session, status, router, guildId]);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      const response = await fetch(`/api/servers/${guildId}/setup`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modLogChannel,
          welcomeChannel,
          welcomeMessage,
          goodbyeChannel,
          goodbyeMessage,
          defaultRoles,
          modRoles,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving setup:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <img src="/luno-logo.svg" alt="Luno Bot" className="h-10 w-10" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </div>
          </div>
          
          <div className="px-4 py-4">
            <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3">← Back to Servers</Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link href={`/servers/${guildId}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Dashboard
            </Link>
            <details className="border border-orange-100 bg-orange-50/60 text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`border-t border-orange-100 px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${guildId}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    General
                  </Link>
                  <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
                    Setup
                  </Link>
                  <Link href={`/servers/${guildId}/commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Commands
                  </Link>
                </div>
              )}
            </details>
            <details className="border border-orange-100 bg-orange-50/60 text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`border-t border-orange-100 px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${guildId}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Moderation
                  </Link>
                  <Link href={`/servers/${guildId}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Role Management
                  </Link>
                  <Link href={`/servers/${guildId}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Member Management
                  </Link>
                  <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Announcements
                  </Link>
                  <Link href={`/servers/${guildId}/modules/tickets`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Tickets
                  </Link>
                  <Link href={`/servers/${guildId}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Notifications
                  </Link>
                  <Link href={`/servers/${guildId}/modules/custom-commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Custom Commands
                  </Link>
                  <Link href={`/servers/${guildId}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '350ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Fun
                  </Link>
                  <Link href={`/servers/${guildId}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '400ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Utilities
                  </Link>
                  <Link href={`/servers/${guildId}/modules/security`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '450ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                    Security
                  </Link>
                </div>
              )}
            </details>
            <Link href={`/servers/${guildId}/logs`} className="flex w-full items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Logs
            </Link>
          </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="max-w-6xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-bold">Setup</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            {/* Section 1/4 - Moderation Log */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">1/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Moderation Log</h2>
                </div>
                <p className="text-slate-600">Configure where moderation actions will be logged.</p>
              </div>
              <div className="space-y-3 border-t border-orange-100 pt-4">
                <label className="block text-sm font-semibold text-[#0f172a]">Log Channel</label>
                <select
                  value={modLogChannel}
                  onChange={(e) => setModLogChannel(e.target.value)}
                  className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select a channel...</option>
                  {channels.map(ch => (
                    <option key={ch.id} value={ch.id}># {ch.name}</option>
                  ))}
                  <option value="create-new">+ Create New Channel</option>
                </select>
                <p className="text-xs text-slate-500">All moderation actions (warns, kicks, bans) will be logged here. Only visible to moderators.</p>
              </div>
            </div>

            {/* Section 2/4 - Welcome Messages */}
            <div className="space-y-4 border-t border-orange-100 pt-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">2/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Welcome Messages</h2>
                </div>
                <p className="text-slate-600">Configure welcome messages for new members.</p>
              </div>
              <div className="space-y-4 border-t border-orange-100 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Welcome Channel</label>
                  <select
                    value={welcomeChannel}
                    onChange={(e) => setWelcomeChannel(e.target.value)}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select a channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}># {ch.name}</option>
                    ))}
                    <option value="create-new">+ Create New Channel</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Welcome Message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none resize-none"
                    placeholder="Welcome {user} to {server}!"
                  />
                  <p className="text-xs text-slate-500">Use {'{user}'} for the member's name and {'{server}'} for the server name.</p>
                </div>
              </div>
            </div>

            {/* Section 3/4 - Goodbye Messages */}
            <div className="space-y-4 border-t border-orange-100 pt-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">3/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Goodbye Messages</h2>
                </div>
                <p className="text-slate-600">Configure goodbye messages when members leave.</p>
              </div>
              <div className="space-y-4 border-t border-orange-100 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Goodbye Channel</label>
                  <select
                    value={goodbyeChannel}
                    onChange={(e) => setGoodbyeChannel(e.target.value)}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select a channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}># {ch.name}</option>
                    ))}
                    <option value="create-new">+ Create New Channel</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Goodbye Message</label>
                  <textarea
                    value={goodbyeMessage}
                    onChange={(e) => setGoodbyeMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none resize-none"
                    placeholder="Goodbye {user}, thanks for being part of {server}!"
                  />
                  <p className="text-xs text-slate-500">Use {'{user}'} for the member's name and {'{server}'} for the server name.</p>
                </div>
              </div>
            </div>

            {/* Section 4/4 - Roles */}
            <div className="space-y-4 border-t border-orange-100 pt-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">4/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Roles</h2>
                </div>
                <p className="text-slate-600">Configure default and moderator roles.</p>
              </div>
              <div className="space-y-4 border-t border-orange-100 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Default Member Roles</label>
                  <select
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                    onChange={(e) => {
                      if (e.target.value && !defaultRoles.includes(e.target.value)) {
                        setDefaultRoles([...defaultRoles, e.target.value]);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Select roles to add...</option>
                    {roles.filter(r => !defaultRoles.includes(r.id)).map(r => (
                      <option key={r.id} value={r.id}>@ {r.name}</option>
                    ))}
                    <option value="create-new">+ Create New Role</option>
                  </select>
                  {defaultRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {defaultRoles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        return (
                          <span key={roleId} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={() => setDefaultRoles(defaultRoles.filter(r => r !== roleId))}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">These roles will be automatically assigned to new members when they join.</p>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Moderator Roles</label>
                  <select
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                    onChange={(e) => {
                      if (e.target.value && !modRoles.includes(e.target.value)) {
                        setModRoles([...modRoles, e.target.value]);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Select roles to add...</option>
                    {roles.filter(r => !modRoles.includes(r.id)).map(r => (
                      <option key={r.id} value={r.id}>@ {r.name}</option>
                    ))}
                    <option value="create-new">+ Create New Role</option>
                  </select>
                  {modRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {modRoles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        return (
                          <span key={roleId} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={() => setModRoles(modRoles.filter(r => r !== roleId))}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">Members with these roles will have access to moderation commands and features.</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-orange-100 pt-6">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : saved ? '✓ Saved Successfully!' : 'Save Setup Configuration'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
