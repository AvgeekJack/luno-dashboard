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
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm p-4 overflow-y-auto">
          <div className="mb-6 space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Server</p>
            <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm">← Back to Servers</Link>
          </div>
          <nav className="space-y-1 text-sm font-semibold text-slate-700">
            <Link href={`/servers/${guildId}`} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Dashboard
            </Link>
            <details className="rounded-xl border border-orange-100 bg-orange-50/60 text-slate-800">
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
                <Link href={`/servers/${guildId}/commands`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Commands
                </Link>
              </div>
            </details>
            <Link href={`/servers/${guildId}/modules`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Modules
            </Link>
            <Link href={`/servers/${guildId}/logs`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left">
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

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Audit Log</h2>
              <p className="text-slate-600">See who changed what on this server.</p>
            </div>

            <div className="space-y-4 border-t border-orange-100 pt-6">
              {logs.length === 0 ? (
                <p className="text-slate-600">No changes yet.</p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-orange-100 bg-orange-50/50">
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
