'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AutomodPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'saved' | 'error'>('idle');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);

  const [automodEnabled, setAutomodEnabled] = useState(false);
  const [filterProfanity, setFilterProfanity] = useState(false);
  const [filterSpam, setFilterSpam] = useState(false);
  const [filterInvites, setFilterInvites] = useState(false);
  const [filterLinks, setFilterLinks] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const fetchSettings = async () => {
      try {
        // For now, just set to false - in production, fetch from API
        setAutomodEnabled(false);
        setFilterProfanity(false);
        setFilterSpam(false);
        setFilterInvites(false);
        setFilterLinks(false);
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
      // In production, this would save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFeedback('saved');
      setTimeout(() => setFeedback('idle'), 3000);
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
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
          </div>
          
          <div className="px-4 py-4">
            <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3">← Back to Servers</Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link href={`/servers/${gid}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors">
              Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-3">
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    General
                  </Link>
                  <Link href={`/servers/${gid}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    Setup
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={configOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
                <span className="flex items-center gap-3">
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    Automod
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-3">
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    Moderation
                  </Link>
                  <Link href={`/servers/${gid}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    Role Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                    Member Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                    Announcements
                  </Link>
                  <Link href={`/servers/${gid}/modules/tickets`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}}>
                    Tickets
                  </Link>
                  <Link href={`/servers/${gid}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}}>
                    Notifications
                  </Link>
                  <Link href={`/servers/${gid}/modules/custom-commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}}>
                    Custom Commands
                  </Link>
                  <Link href={`/servers/${gid}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '350ms'}}>
                    Fun
                  </Link>
                  <Link href={`/servers/${gid}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '400ms'}}>
                    Utilities
                  </Link>
                  <Link href={`/servers/${gid}/modules/security`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '450ms'}}>
                    Security
                  </Link>
                </div>
              )}
            </details>
          </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="w-full max-w-6xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Configuration</p>
            <h1 className="text-3xl font-bold">Automod</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Automatic Moderation</h2>
              <p className="text-slate-600">Configure automatic moderation filters and rules for your server.</p>
            </div>

            <div className="space-y-6 border-t border-orange-100 pt-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100 bg-orange-50/30">
                <div>
                  <p className="font-semibold text-slate-800">Enable Automod</p>
                  <p className="text-xs text-slate-500">Master switch for automatic moderation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutomodEnabled(!automodEnabled)}
                  className={`${automodEnabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
                >
                  <span className={`${automodEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800">Filter Options</h3>
                
                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Filter Profanity</p>
                    <p className="text-xs text-slate-500">Automatically delete messages containing profanity</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterProfanity(!filterProfanity)}
                    className={`${filterProfanity ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                  >
                    <span className={`${filterProfanity ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Filter Spam</p>
                    <p className="text-xs text-slate-500">Detect and remove spam messages</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterSpam(!filterSpam)}
                    className={`${filterSpam ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                  >
                    <span className={`${filterSpam ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Filter Discord Invites</p>
                    <p className="text-xs text-slate-500">Block messages containing Discord invite links</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterInvites(!filterInvites)}
                    className={`${filterInvites ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                  >
                    <span className={`${filterInvites ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Filter Links</p>
                    <p className="text-xs text-slate-500">Automatically remove messages with external links</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilterLinks(!filterLinks)}
                    className={`${filterLinks ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                  >
                    <span className={`${filterLinks ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                  </button>
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
                {feedback === 'error' && <span className="text-sm text-red-600">Could not save.</span>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
