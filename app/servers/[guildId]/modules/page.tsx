'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ModulesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [moderation, setModeration] = useState({
    enabled: true,
    warnEnabled: true,
    kickEnabled: true,
    banEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'saved' | 'error'>('idle');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const loadModules = async () => {
      try {
        const res = await fetch(`/api/servers/${gid}/modules`);
        if (!res.ok) throw new Error('Failed to load modules');
        const data = await res.json();
        setModeration(data.moderation);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [session, status, router, gid]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback('idle');
    try {
      const res = await fetch(`/api/servers/${gid}/modules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moderationEnabled: moderation.enabled,
          warnEnabled: moderation.warnEnabled,
          kickEnabled: moderation.kickEnabled,
          banEnabled: moderation.banEnabled,
        }),
      });

      if (!res.ok) {
        setFeedback('error');
        setSaving(false);
        return;
      }

      const data = await res.json();
      setModeration(data.moderation);
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
            <details className="rounded-xl border border-orange-100 bg-orange-50/60 text-slate-800">
              <summary className="flex items-center justify-between px-3 py-2 cursor-pointer select-none rounded-xl">
                <span className="flex items-center gap-3">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              <div className="border-t border-orange-100 px-2 py-1 space-y-1">
                <Link href={`/servers/${gid}/general`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
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
            <Link href={`/servers/${gid}/modules`} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left">
              <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
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
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Modules</p>
            <h1 className="text-3xl font-bold">Modules</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Modules</h2>
              <p className="text-slate-600">Enable or disable bot modules for this server.</p>
            </div>

            <div className="space-y-6 border-t border-orange-100 pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50/50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-800">Moderation Module</p>
                    <p className="text-sm text-slate-600">Enable or disable all moderation features.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModeration(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`${moderation.enabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
                  >
                    <span
                      className={`${moderation.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </button>
                </div>

                {moderation.enabled && (
                  <div className="space-y-3 pl-4 border-l-2 border-orange-200">
                    <div className="flex items-center justify-between rounded-lg border border-orange-100 bg-white px-3 py-2">
                      <div>
                        <p className="font-semibold text-slate-800">Warn Command</p>
                        <p className="text-xs text-slate-600">Enable users to warn others.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModeration(prev => ({ ...prev, warnEnabled: !prev.warnEnabled }))}
                        className={`${moderation.warnEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                      >
                        <span
                          className={`${moderation.warnEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-orange-100 bg-white px-3 py-2">
                      <div>
                        <p className="font-semibold text-slate-800">Kick Command</p>
                        <p className="text-xs text-slate-600">Enable users to kick members.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModeration(prev => ({ ...prev, kickEnabled: !prev.kickEnabled }))}
                        className={`${moderation.kickEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                      >
                        <span
                          className={`${moderation.kickEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-orange-100 bg-white px-3 py-2">
                      <div>
                        <p className="font-semibold text-slate-800">Ban Command</p>
                        <p className="text-xs text-slate-600">Enable users to ban members.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModeration(prev => ({ ...prev, banEnabled: !prev.banEnabled }))}
                        className={`${moderation.banEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                      >
                        <span
                          className={`${moderation.banEnabled ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`}
                        />
                      </button>
                    </div>
                  </div>
                )}
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
                {feedback === 'error' && <span className="text-sm text-red-600">Could not save.</span>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
