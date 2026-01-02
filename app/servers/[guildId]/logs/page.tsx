'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [logs, setLogs] = useState<Array<{ _id: string; userName: string; userId: string; action: string; createdAt: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const loadLogs = async () => {
      try {
        const res = await fetch(`/api/servers/${gid}/logs`);
        if (!res.ok) throw new Error('Failed to load logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [session, status, router, gid]);

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <img src="/luno-logo.svg" alt="Luno Bot" className="w-10 h-10 object-contain" />
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
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
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
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
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
            <Link href={`/servers/${guildId}/logs`} className="flex w-full items-center gap-3 px-3 py-6 bg-orange-100 text-orange-700 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
              Logs
            </Link>
          </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="max-w-6xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Logs</p>
            <h1 className="text-3xl font-bold">Audit Log</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-lg shadow-sm p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Audit Log</h2>
              <p className="text-slate-600">See who changed what on this server.</p>
            </div>

            <div className="space-y-4 border-t border-orange-100 pt-6 px-6">
              {logs.length === 0 ? (
                <p className="text-slate-600">No changes yet.</p>
              ) : (
                <div className="overflow-hidden border border-orange-100 bg-orange-50/50">
                  <div className="grid grid-cols-12 bg-orange-100/60 px-4 py-2 text-xs font-semibold text-orange-700 uppercase tracking-wide">
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">User ID</div>
                    <div className="col-span-4">Action</div>
                    <div className="col-span-2 text-right">Time</div>
                  </div>
                  <div className="divide-y divide-orange-100 bg-white">
                    {logs.map((log) => (
                      <div key={log._id} className="grid grid-cols-12 px-4 py-3 text-sm text-slate-800">
                        <div className="col-span-4 truncate" title={log.userName}>{log.userName}</div>
                        <div className="col-span-2 truncate text-slate-500" title={log.userId}>{log.userId}</div>
                        <div className="col-span-4 text-slate-700" title={log.action}>{log.action}</div>
                        <div className="col-span-2 text-right text-slate-500" title={new Date(log.createdAt).toLocaleString()}>
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
