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
              Commands
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
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Server Preferences</h2>
              <p className="text-slate-600">Adjust moderation, welcome flow, and bot prefix for this server.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#0f172a]">Bot Prefix</label>
              <input
                type="text"
                value={settings.prefix}
                onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-[#0f172a] shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="!"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#0f172a]">Moderation</h2>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                  <input
                    type="checkbox"
                    checked={settings.moderation.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      moderation: { ...settings.moderation, enabled: e.target.checked }
                    })}
                    className="h-4 w-4 rounded border-orange-200 accent-orange-500"
                  />
                  Enable
                </label>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0f172a]">Log Channel ID</label>
                <input
                  type="text"
                  value={settings.moderation.logChannel || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    moderation: { ...settings.moderation, logChannel: e.target.value || null }
                  })}
                  className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-[#0f172a] shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Channel ID for logs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#0f172a]">Welcome Messages</h2>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-[#0f172a]">
                  <input
                    type="checkbox"
                    checked={settings.welcome.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      welcome: { ...settings.welcome, enabled: e.target.checked }
                    })}
                    className="h-4 w-4 rounded border-orange-200 accent-orange-500"
                  />
                  Enable
                </label>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0f172a]">Welcome Message</label>
                <textarea
                  value={settings.welcome.message}
                  onChange={(e) => setSettings({
                    ...settings,
                    welcome: { ...settings.welcome, message: e.target.value }
                  })}
                  className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-[#0f172a] shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  rows={3}
                  placeholder="Welcome to the server!"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0f172a]">Welcome Channel ID</label>
                <input
                  type="text"
                  value={settings.welcome.channel || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    welcome: { ...settings.welcome, channel: e.target.value || null }
                  })}
                  className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-[#0f172a] shadow-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Channel ID for welcomes"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}