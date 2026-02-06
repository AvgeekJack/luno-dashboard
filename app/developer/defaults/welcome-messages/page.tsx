'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

const DEVELOPER_USER_ID = '922940896322940929';

export default function DefaultsWelcomeMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [welcomeEnabled, setWelcomeEnabled] = useState(false);
  const [leaveEnabled, setLeaveEnabled] = useState(false);
  const [originalWelcomeEnabled, setOriginalWelcomeEnabled] = useState(false);
  const [originalLeaveEnabled, setOriginalLeaveEnabled] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const isDeveloper = session?.user?.id === DEVELOPER_USER_ID;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }
    if (!isDeveloper) {
      router.push('/');
      return;
    }

    const loadSettings = async () => {
      try {
        const res = await fetch('/api/developer/defaults/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.modules?.notifications) {
            setWelcomeEnabled(data.modules.notifications.welcomeEnabled ?? false);
            setLeaveEnabled(data.modules.notifications.leaveEnabled ?? false);
            setOriginalWelcomeEnabled(data.modules.notifications.welcomeEnabled ?? false);
            setOriginalLeaveEnabled(data.modules.notifications.leaveEnabled ?? false);
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [session, status, router, isDeveloper]);

  const handleWelcomeToggle = (checked: boolean) => {
    setWelcomeEnabled(checked);
    setHasUnsavedChanges(true);
  };

  const handleLeaveToggle = (checked: boolean) => {
    setLeaveEnabled(checked);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/developer/defaults/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'modules.notifications': {
            welcomeEnabled,
            leaveEnabled
          }
        }),
      });

      if (res.ok) {
        setOriginalWelcomeEnabled(welcomeEnabled);
        setOriginalLeaveEnabled(leaveEnabled);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setWelcomeEnabled(originalWelcomeEnabled);
    setLeaveEnabled(originalLeaveEnabled);
    setHasUnsavedChanges(false);
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!isDeveloper) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] flex">
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

      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12 md:ml-0">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
          </div>
          
          <div className="px-4 py-4">
            <Link href="/developer" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>← Back to Developer Panel</Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link href="/developer/defaults" className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <img src="/dashbaord.png" alt="" className="w-5 h-5" />
              Default Settings Dashboard
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
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '0ms'}}>
                    General (N/A for Defaults)
                  </span>
                  <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '50ms'}}>
                    Setup (N/A for Defaults)
                  </span>
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
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href="/developer/defaults/automod" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Automod
                  </Link>
                  <Link href="/developer/defaults/logging" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Logging
                  </Link>
                  <Link href="/developer/defaults/antiraid" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Anti-Raid
                  </Link>
                  <Link href="/developer/defaults/reaction-roles" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Reaction Roles
                  </Link>
                  <Link href="/developer/defaults/verification" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
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
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href="/developer/defaults/moderation" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Moderation
                  </Link>
                  <Link href="/developer/defaults/role-management" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Role Management
                  </Link>
                  <Link href="/developer/defaults/member-management" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Member Management
                  </Link>
                  <Link href="/developer/defaults/announcements" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Announcements
                  </Link>
                  <Link href="/developer/defaults/welcome-messages" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Welcome Messages
                  </Link>
                  <Link href="/developer/defaults/fun" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Fun
                  </Link>
                  <Link href="/developer/defaults/utilities" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>

          <div className="mt-auto p-4 border-t border-orange-200">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-orange-900 mb-1">⚙️ Default Settings Mode</p>
              <p className="text-xs text-orange-700">Changes here will apply to all new servers.</p>
            </div>
          </div>
      </aside>

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center bg-[#f8f9fa]">
        <div className="w-full max-w-6xl space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.15em] text-orange-500 font-semibold">DEFAULT MODULES</p>
            <h1 className="text-4xl font-bold text-[#0f172a]">Welcome Messages Defaults</h1>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-orange-900 mb-1">⚠️ These are default command/module states applied to new servers</p>
                <p className="text-sm text-orange-800">Any changes made here will only affect newly added servers. Existing servers will retain their current settings. Channel selection and message customization must be configured per-server.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="space-y-1 mb-6">
              <h2 className="text-lg font-semibold text-[#0f172a]">Welcome Messages</h2>
              <p className="text-sm text-slate-500">Set whether welcome messages are enabled by default for new servers</p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Enable Welcome Messages</p>
                  <p className="text-sm text-slate-500">Send a message when users join the server</p>
                </div>
                <Switch 
                  checked={welcomeEnabled} 
                  onCheckedChange={handleWelcomeToggle}
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="space-y-1 mb-6">
              <h2 className="text-lg font-semibold text-[#0f172a]">Leave Messages</h2>
              <p className="text-sm text-slate-500">Set whether leave messages are enabled by default for new servers</p>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Enable Leave Messages</p>
                  <p className="text-sm text-slate-500">Send a message when users leave the server</p>
                </div>
                <Switch 
                  checked={leaveEnabled} 
                  onCheckedChange={handleLeaveToggle}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

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
