'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Settings {
  guildId: string;
  prefix: string;
  moderation: {
    enabled: boolean;
    logChannel: string | null;
  };
  welcome: {
    enabled: boolean;
    message: string;
    channel: string | null;
  };
}

export default function ServerSettings() {
  const { data: session, status } = useSession();
  const { guildId } = useParams();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverName, setServerName] = useState<string | null>(null);

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
  }, [session, status, guildId, router]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/servers/${guildId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Settings saved!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!settings) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Server not found</div>;
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
            <Link href={`/servers/${guildId}`} className="flex items-center gap-3 rounded-xl px-3 py-2 bg-orange-100 text-orange-700">
              <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
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
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  General
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Setup
                </button>
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Commands
                </button>
              </div>
            </details>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Modules
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Logs
            </button>
          </nav>
        </aside>

        <main className="flex-1 space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-bold">{serverName ?? 'Server'}</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Dashboard</h2>
                <p className="text-slate-600">At-a-glance view of your bot configuration.</p>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 border border-orange-100">
                  <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden /> Bot Online
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Prefix</p>
                <p className="text-2xl font-bold text-[#0f172a]">{settings.prefix || '!'}</p>
                <p className="text-xs text-slate-600">Current command prefix</p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Moderation</p>
                <p className="text-lg font-semibold text-[#0f172a]">{settings.moderation.enabled ? 'Enabled' : 'Disabled'}</p>
                <p className="text-xs text-slate-600">Log channel: {settings.moderation.logChannel || 'Not set'}</p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Welcome</p>
                <p className="text-lg font-semibold text-[#0f172a]">{settings.welcome.enabled ? 'Enabled' : 'Disabled'}</p>
                <p className="text-xs text-slate-600">Channel: {settings.welcome.channel || 'Not set'}</p>
              </div>
            </div>

            <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">Server Info</p>
                  <p className="text-sm text-slate-700">Guild ID: {String(guildId)}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-orange-700">
                  <span className="rounded-full bg-white px-3 py-1 border border-orange-100">Settings</span>
                  <span className="rounded-full bg-white px-3 py-1 border border-orange-100">Modules</span>
                  <span className="rounded-full bg-white px-3 py-1 border border-orange-100">Logs</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" aria-hidden />
                  Bot connected and responding.
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-400" aria-hidden />
                  Welcome messages {settings.welcome.enabled ? 'active' : 'inactive'}.
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" aria-hidden />
                  Moderation {settings.moderation.enabled ? 'enabled' : 'disabled'}.
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400" aria-hidden />
                  Log channel {settings.moderation.logChannel ? 'set' : 'not set'}.
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}