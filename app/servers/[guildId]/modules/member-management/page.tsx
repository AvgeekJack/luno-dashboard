'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommandGrid } from '@/components/CommandGrid';
import { Switch } from '@/components/ui/switch';

const MEMBER_MANAGEMENT_COMMANDS = [
  { name: '/user info', description: 'Display user information', enabled: true },
  { name: '/user avatar', description: 'Show user avatar', enabled: true },
  { name: '/user banner', description: 'Show user banner', enabled: true },
  { name: '/user roles', description: 'List user roles', enabled: true },
  { name: '/prune users', description: 'Prune inactive users', enabled: true },
];

export default function MemberManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [originalModuleEnabled, setOriginalModuleEnabled] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleModuleToggle = (checked: boolean) => {
    setModuleEnabled(checked);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/servers/${guildId}/modules/member-management`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: moduleEnabled }),
      });
      if (res.ok) {
        setOriginalModuleEnabled(moduleEnabled);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setModuleEnabled(originalModuleEnabled);
    setHasUnsavedChanges(false);
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </div>
          </div>
          
          <div className="px-4 py-4">
            <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3">← Back to Servers</Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link href={`/servers/${guildId}`} className="flex items-center gap-3 px-3 py-6 bg-white hover:bg-orange-50/30 text-slate-700 hover:text-orange-700 transition-colors">
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
                  <Link href={`/servers/${guildId}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    General
                  </Link>
                  <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    Setup
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
                  <Link href={`/servers/${guildId}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                    Moderation
                  </Link>
                  <Link href={`/servers/${guildId}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                    Role Management
                  </Link>
                  <Link href={`/servers/${guildId}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                    Member Management
                  </Link>
                  <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                    Announcements
                  </Link>
                  <Link href={`/servers/${guildId}/modules/tickets`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}}>
                    Tickets
                  </Link>
                  <Link href={`/servers/${guildId}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}}>
                    Notifications
                  </Link>
                  <Link href={`/servers/${guildId}/modules/custom-commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}}>
                    Custom Commands
                  </Link>
                  <Link href={`/servers/${guildId}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '350ms'}}>
                    Fun
                  </Link>
                  <Link href={`/servers/${guildId}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '400ms'}}>
                    Utilities
                  </Link>
                  <Link href={`/servers/${guildId}/modules/security`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '450ms'}}>
                    Security
                  </Link>
                </div>
              )}
            </details>
            <Link href={`/servers/${guildId}/logs`} className="flex w-full items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors text-left">
              Logs
            </Link>
          </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8">
        <div className="w-full space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Modules</p>
            <h1 className="text-3xl font-bold">Member Management</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Member Management Commands</h2>
                <p className="text-slate-600">Configure and manage member commands for your server.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Module {moduleEnabled ? 'Enabled' : 'Disabled'}</span>
                <Switch 
                  checked={moduleEnabled} 
                  onCheckedChange={handleModuleToggle}
                  className="scale-150"
                />
              </div>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-700 ${moduleEnabled ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}
              style={{ transitionProperty: 'max-height, opacity' }}
            >
              <div className="space-y-6 border-t border-orange-100 pt-6">
                <CommandGrid commands={MEMBER_MANAGEMENT_COMMANDS.map(cmd => ({ ...cmd, enabled: moduleEnabled ? cmd.enabled : false }))} />
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
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
