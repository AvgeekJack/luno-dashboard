'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function GeneralPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [prefix, setPrefix] = useState('!');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/servers/${gid}/general`);
        if (!res.ok) throw new Error('Failed to load settings');
        const data = await res.json();
        setPrefix(data.prefix || '!');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [session, status, router, gid]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback('idle');
    try {
      const trimmed = prefix.trim();
      if (!trimmed || trimmed.length > 5) {
        setFeedback('error');
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/servers/${gid}/general`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prefix: trimmed,
          moderationEnabled: true,
        }),
      });

      if (!res.ok) {
        setFeedback('error');
        setSaving(false);
        return;
      }

      setFeedback('saved');
    } catch (err) {
      console.error(err);
      setFeedback('error');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
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
            <Link href={`/servers/${gid}`} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors">
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
                <Link href={`/servers/${gid}/general`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
                  General
                </Link>
                <Link href={`/servers/${gid}/setup`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Setup
                </Link>
                <Link href={`/servers/${gid}/commands`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Commands
                </Link>
              </div>
            </details>
            <Link href={`/servers/${gid}/modules`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Modules
            </Link>
            <Link href={`/servers/${gid}/logs`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:bg-orange-50 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
              Logs
            </Link>
          </nav>
        </aside>

        <main className="flex-1 space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-bold">General</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">General Settings</h2>
              <p className="text-slate-600">Configure general bot behavior for this server.</p>
            </div>

            <div className="space-y-6 border-t border-orange-100 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Command Prefix</label>
                  <div className="flex flex-col gap-2">
                    <input
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value)}
                      maxLength={5}
                      className="w-full rounded-xl border border-orange-100 bg-white px-3 py-2 text-slate-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
                      placeholder="!"
                    />
                    <p className="text-xs text-slate-500">1-5 characters. Users type this before commands (e.g., !help).</p>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-800">Tips</p>
                  <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                    <li>Keep the prefix short and easy to remember.</li>
                    <li>Update Commands/Setup pages for channel/role rules.</li>
                    <li>Bot picks up changes immediately—no restart needed.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-xl bg-orange-500 px-4 py-2 text-white font-semibold shadow-sm hover:bg-orange-600 transition disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                {feedback === 'saved' && <span className="text-sm text-green-600">Saved!</span>}
                {feedback === 'error' && <span className="text-sm text-red-600">Could not save. Check prefix length.</span>}
              </div>

              <div className="rounded-xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-800">Notes</p>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>Prefix changes apply immediately; the bot reads live from MongoDB.</li>
                  <li>Use the sidebar to jump to Commands, Modules, or Setup for deeper config.</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
