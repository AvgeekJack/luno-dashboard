'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ANNOUNCEMENT_COMMANDS = [
  { name: '/announce', description: 'Send an announcement to a channel' },
  { name: '/creategiveaway', description: 'Create a new giveaway' },
  { name: '/giveawaydraw', description: 'Draw winners for a giveaway' },
  { name: '/poll', description: 'Create a poll for members to vote' },
];

export default function AnnouncementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [commandStates, setCommandStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    // Initialize all command states as enabled
    const initialStates: Record<string, boolean> = {};
    ANNOUNCEMENT_COMMANDS.forEach(cmd => {
      initialStates[cmd.name] = true;
    });
    setCommandStates(initialStates);
  }, [session, status, router]);

  const handleToggleCommand = (commandName: string) => {
    setCommandStates(prev => ({
      ...prev,
      [commandName]: !prev[commandName]
    }));
  };

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">L</div>
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
                  <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
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
                  <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                    <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
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
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Modules</p>
            <h1 className="text-3xl font-bold">Announcements</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-lg shadow-sm p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Announcement Commands</h2>
              <p className="text-slate-600">Configure and manage announcement commands for your server.</p>
            </div>

            <div className="space-y-6 border-t border-orange-100 pt-6">
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
                  {ANNOUNCEMENT_COMMANDS.map((command) => (
                    <div key={command.name} className="rounded-xl border border-orange-100 bg-slate-50 p-5 shadow-sm space-y-4 w-72">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#0f172a] capitalize">{command.name}</h3>
                          <p className="text-sm text-slate-600">{command.description}</p>
                        </div>
                        <button
                          onClick={() => handleToggleCommand(command.name)}
                          className={`relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0 ${
                            commandStates[command.name] ? 'bg-orange-500' : 'bg-slate-400'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              commandStates[command.name] ? 'translate-x-5' : 'translate-x-1'
                            }`}
                            style={{ marginTop: '2px' }}
                          />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 rounded-lg bg-orange-500 text-white px-3 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors">
                          Settings
                        </button>
                        <button className="flex-1 rounded-lg bg-orange-100 text-orange-700 px-3 py-2 text-sm font-semibold hover:bg-orange-200 transition-colors">
                          Help
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
