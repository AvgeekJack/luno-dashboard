'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CommandGrid } from '@/components/CommandGrid';
import { CommandHelpModal } from '@/components/CommandHelpModal';
import { Switch } from '@/components/ui/switch';

const DEVELOPER_USER_ID = '922940896322940929';

const MODERATION_COMMANDS = [
  { name: '/ban', description: 'Ban a user from the server', enabled: true },
  { name: '/softban', description: 'Ban and then unban a user', enabled: true },
  { name: '/unban', description: 'Unban a previously banned user', enabled: true },
  { name: '/kick', description: 'Kick a user from the server', enabled: true },
  { name: '/timeout', description: 'Timeout a user for a duration', enabled: true },
  { name: '/untimeout', description: 'Remove timeout from a user', enabled: true },
  { name: '/warn', description: 'Warn a user with a message', enabled: true },
  { name: '/clear', description: 'Delete bulk messages from a channel', enabled: true },
  { name: '/slowmode', description: 'Set slowmode for a channel', enabled: true },
  { name: '/lock', description: 'Lock a channel from posting', enabled: true },
  { name: '/unlock', description: 'Unlock a locked channel', enabled: true },
  { name: '/lockdown', description: 'Lockdown the server', enabled: true },
  { name: '/unlockdown', description: 'End server lockdown', enabled: true },
];

export default function DefaultsModerationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moduleEnabled, setModuleEnabled] = useState(true);
  const [originalModuleEnabled, setOriginalModuleEnabled] = useState(true);
  const [commands, setCommands] = useState(MODERATION_COMMANDS);
  const [originalCommands, setOriginalCommands] = useState(MODERATION_COMMANDS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpCommand, setHelpCommand] = useState<{ name: string; description: string } | null>(null);

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
          if (data.modules?.moderation) {
            setModuleEnabled(data.modules.moderation.enabled ?? true);
            setOriginalModuleEnabled(data.modules.moderation.enabled ?? true);
            
            if (data.modules.moderation.commands) {
              const updatedCommands = MODERATION_COMMANDS.map(cmd => {
                const commandKey = cmd.name.replace('/', '').replace(/ /g, '');
                const commandData = data.modules.moderation.commands[commandKey];
                return {
                  ...cmd,
                  enabled: commandData?.enabled ?? true
                };
              });
              setCommands(updatedCommands);
              setOriginalCommands(updatedCommands);
            }
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

  const handleVerifyPin = async () => {
    if (!pin.trim()) {
      setVerifyError('Please enter PIN');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');

    try {
      const response = await fetch('/api/developer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        const data = await response.json();
        setVerifyError(data.error || 'Invalid PIN');
        setIsVerifying(false);
        return;
      }

      setIsVerified(true);
      setPin('');
    } catch (error) {
      setVerifyError('Error verifying PIN');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleModuleToggle = (checked: boolean) => {
    setModuleEnabled(checked);
    setHasUnsavedChanges(true);
  };

  const handleCommandToggle = (commandName: string, enabled: boolean) => {
    setCommands(prev => prev.map(cmd => 
      cmd.name === commandName ? { ...cmd, enabled } : cmd
    ));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const commandsObj: Record<string, { enabled: boolean }> = {};
      commands.forEach(cmd => {
        const commandKey = cmd.name.replace('/', '').replace(/ /g, '');
        commandsObj[commandKey] = { enabled: cmd.enabled };
      });

      const res = await fetch('/api/developer/defaults/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'modules.moderation': {
            enabled: moduleEnabled,
            commands: commandsObj
          }
        }),
      });

      if (res.ok) {
        setOriginalModuleEnabled(moduleEnabled);
        setOriginalCommands([...commands]);
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
    setCommands([...originalCommands]);
    setHasUnsavedChanges(false);
  };

  const handleCommandHelp = (commandName: string, description: string) => {
    setHelpCommand({ name: commandName, description });
    setHelpModalOpen(true);
  };

  const handleCloseHelpModal = () => {
    setHelpModalOpen(false);
    setHelpCommand(null);
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!isDeveloper) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Access Denied</div>;
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Developer Verification</h2>
            <p className="text-gray-600 text-center mb-6">Enter your PIN to access module settings</p>
            
            <div className="space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyPin()}
                placeholder="Enter Developer PIN"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isVerifying}
              />
              
              {verifyError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{verifyError}</span>
                </div>
              )}
              
              <button
                onClick={handleVerifyPin}
                disabled={isVerifying || !pin.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify PIN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
                  <Link href="/developer/defaults/moderation" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
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
                  <Link href="/developer/defaults/welcome-messages" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
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
            <h1 className="text-4xl font-bold text-[#0f172a]">Moderation Defaults</h1>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-orange-900 mb-1">⚠️ These are default command/module states applied to new servers</p>
                <p className="text-sm text-orange-800">Any changes made here will only affect newly added servers. Existing servers will retain their current settings.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[#0f172a]">Moderation Commands</h2>
                <p className="text-sm text-slate-500">Configure and manage moderation commands for your server</p>
              </div>
              <div className="pt-1">
                <Switch 
                  checked={moduleEnabled} 
                  onCheckedChange={handleModuleToggle}
                />
              </div>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-700 ${moduleEnabled ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}
              style={{ transitionProperty: 'max-height, opacity' }}
            >
              <div className="space-y-6 border-t border-slate-200 pt-6 mt-6">
                <CommandGrid 
                  commands={commands}
                  onCommandToggle={handleCommandToggle}
                  onCommandHelp={handleCommandHelp}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {helpCommand && (
        <CommandHelpModal
          isOpen={helpModalOpen}
          onClose={handleCloseHelpModal}
          commandName={helpCommand.name}
          description={helpCommand.description}
        />
      )}

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
