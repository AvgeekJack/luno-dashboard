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

  const [modules, setModules] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'saved' | 'error'>('idle');

  const moduleList = [
    { key: 'moderation', label: 'Moderation', desc: 'Warn, kick, and ban members.' },
    { key: 'automod', label: 'Automod', desc: 'Auto-filter spam and profanity.' },
    { key: 'antiRaid', label: 'Anti-Raid', desc: 'Protect against server raids.' },
    { key: 'logging', label: 'Logging', desc: 'Log member and message activity.' },
    { key: 'roleManagement', label: 'Role Management', desc: 'Auto-assign and manage roles.' },
    { key: 'memberManagement', label: 'Member Management', desc: 'Welcome and goodbye messages.' },
    { key: 'announcements', label: 'Announcements', desc: 'Send and manage announcements.' },
    { key: 'tickets', label: 'Tickets', desc: 'Create support ticket system.' },
    { key: 'notifications', label: 'Notifications', desc: 'Send event notifications.' },
    { key: 'customCommands', label: 'Custom Commands', desc: 'Create custom bot commands.' },
    { key: 'fun', label: 'Fun', desc: 'Fun and meme commands.' },
    { key: 'music', label: 'Music', desc: 'Play music in voice channels.' },
    { key: 'serverInfo', label: 'Server Info', desc: 'Display server info commands.' },
    { key: 'utilities', label: 'Utilities', desc: 'Utility and helper commands.' },
    { key: 'settingsConfig', label: 'Settings / Config', desc: 'Configure bot settings.' },
    { key: 'auditCompliance', label: 'Audit & Compliance', desc: 'Track audit logs and compliance.' },
    { key: 'security', label: 'Security', desc: 'Advanced security features.' },
    { key: 'scheduler', label: 'Scheduler Module', desc: 'Schedule messages and tasks.' },
    { key: 'analytics', label: 'Analytics', desc: 'View server analytics and stats.' },
    { key: 'messageSearching', label: 'Message Searching', desc: 'Search through server messages.' },
  ];

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
        setModules(data.modules);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [session, status, router, gid]);

  const handleToggle = (moduleKey: string) => {
    setModules(prev => ({ ...prev, [moduleKey]: !prev[moduleKey] }));
  };

  const handleSave = async () => {
    setSaving(true);
    setFeedback('idle');
    try {
      const res = await fetch(`/api/servers/${gid}/modules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modules),
      });

      if (!res.ok) {
        setFeedback('error');
        setSaving(false);
        return;
      }

      const data = await res.json();
      setModules(data.modules);
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
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {moduleList.map(module => (
                  <div key={module.key} className="flex items-start justify-between rounded-lg border border-orange-100 bg-white px-3 py-2 gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">{module.label}</p>
                      <p className="text-xs text-slate-500">{module.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggle(module.key)}
                      className={`${modules[module.key] ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition flex-shrink-0`}
                    >
                      <span
                        className={`${modules[module.key] ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`}
                      />
                    </button>
                  </div>
                ))}
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
