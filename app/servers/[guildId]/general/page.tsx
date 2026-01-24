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
  const [botNickname, setBotNickname] = useState('');
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  });

  const [originalPrefix, setOriginalPrefix] = useState('!');
  const [originalBotNickname, setOriginalBotNickname] = useState('');
  const [originalTimezone, setOriginalTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        const loadedPrefix = data.prefix || '!';
        const loadedNickname = data.botNickname || '';
        const loadedTimezone = data.timezone || timezone;

        setPrefix(loadedPrefix);
        setBotNickname(loadedNickname);
        setTimezone(loadedTimezone);

        setOriginalPrefix(loadedPrefix);
        setOriginalBotNickname(loadedNickname);
        setOriginalTimezone(loadedTimezone);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [session, status, router, gid]);

  useEffect(() => {
    const hasChanges = 
      prefix !== originalPrefix ||
      botNickname !== originalBotNickname ||
      timezone !== originalTimezone;
    setHasUnsavedChanges(hasChanges);
  }, [prefix, botNickname, timezone, originalPrefix, originalBotNickname, originalTimezone]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const trimmed = prefix.trim();
      if (!trimmed || trimmed.length > 5) {
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/servers/${gid}/general`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prefix: trimmed,
          botNickname: botNickname.trim(),
          timezone: timezone,
        }),
      });

      if (res.ok) {
        setOriginalPrefix(trimmed);
        setOriginalBotNickname(botNickname.trim());
        setOriginalTimezone(timezone);
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPrefix(originalPrefix);
    setBotNickname(originalBotNickname);
    setTimezone(originalTimezone);
    setHasUnsavedChanges(false);
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded-lg shadow-lg border border-orange-100"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static left-0 top-0 h-screen w-64 bg-white border-r border-orange-100 shadow-lg md:shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12 md:ml-0">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
          </div>
          
          <div className="px-4 py-4">
            <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>← Back to Servers</Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link href={`/servers/${gid}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <img src="/dashbaord.png" alt="" className="w-5 h-5" />
              Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/settings.png" alt="" className="w-5 h-5" />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    General
                  </Link>
                  <Link href={`/servers/${gid}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Setup
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={configOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/configuration.png" alt="" className="w-5 h-5" />
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Automod
                  </Link>
                  <Link href={`/servers/${gid}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Logging
                  </Link>
                  <Link href={`/servers/${gid}/configuration/anti-raid`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Anti-Raid
                  </Link>
                  <Link href={`/servers/${gid}/configuration/reaction-roles`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Reaction Roles
                  </Link>
                  <Link href={`/servers/${gid}/configuration/verification`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Verification
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/modules.png" alt="" className="w-5 h-5" />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${gid}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Moderation
                  </Link>
                  <Link href={`/servers/${gid}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Role Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Member Management
                  </Link>
                  <Link href={`/servers/${gid}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Announcements
                  </Link>
                  <Link href={`/servers/${gid}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Welcome Messages
                  </Link>
                  <Link href={`/servers/${gid}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Fun
                  </Link>
                  <Link href={`/servers/${gid}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>
      </aside>

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12">
        <div className="w-full space-y-4 md:space-y-6">
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
              <div className="grid gap-4 md:grid-cols-2">
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
                    <li>Custom nicknames help personalize the bot for your server.</li>
                    <li>Leave nickname empty to use the bot's default name.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Bot Nickname</label>
                  <div className="flex flex-col gap-2">
                    <input
                      value={botNickname}
                      onChange={(e) => setBotNickname(e.target.value)}
                      maxLength={32}
                      className="w-full rounded-xl border border-orange-100 bg-white px-3 py-2 text-slate-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
                      placeholder="Custom nickname (optional)"
                    />
                    <p className="text-xs text-slate-500">Set a custom nickname for the bot in this server (max 32 characters).</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">Server Timezone</label>
                  <div className="flex flex-col gap-2">
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-xl border border-orange-100 bg-white px-3 py-2 text-slate-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New York (EST/EDT)</option>
                      <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                      <option value="America/Denver">America/Denver (MST/MDT)</option>
                      <option value="America/Los_Angeles">America/Los Angeles (PST/PDT)</option>
                      <option value="America/Anchorage">America/Anchorage (AKST/AKDT)</option>
                      <option value="Pacific/Honolulu">Pacific/Honolulu (HST)</option>
                      <option value="Europe/London">Europe/London (GMT/BST)</option>
                      <option value="Europe/Paris">Europe/Paris (CET/CEST)</option>
                      <option value="Europe/Berlin">Europe/Berlin (CET/CEST)</option>
                      <option value="Europe/Rome">Europe/Rome (CET/CEST)</option>
                      <option value="Europe/Madrid">Europe/Madrid (CET/CEST)</option>
                      <option value="Europe/Moscow">Europe/Moscow (MSK)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                      <option value="Asia/Shanghai">Asia/Shanghai (CST)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                      <option value="Asia/Seoul">Asia/Seoul (KST)</option>
                      <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                      <option value="Australia/Sydney">Australia/Sydney (AEDT/AEST)</option>
                      <option value="Australia/Melbourne">Australia/Melbourne (AEDT/AEST)</option>
                      <option value="Pacific/Auckland">Pacific/Auckland (NZDT/NZST)</option>
                    </select>
                    <p className="text-xs text-slate-500">Set the timezone for scheduled events and timestamps.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Changes Overlay */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl transition-transform duration-300 ease-out z-50 ${
          hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm">Careful — you have unsaved changes!</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-white hover:underline transition"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
