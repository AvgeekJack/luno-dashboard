'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

export default function SetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();

  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  const [modLogChannel, setModLogChannel] = useState('');
  const [welcomeChannel, setWelcomeChannel] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome {user} to {server}!');
  const [goodbyeChannel, setGoodbyeChannel] = useState('');
  const [goodbyeMessage, setGoodbyeMessage] = useState('Goodbye {user}, thanks for being part of {server}!');
  const [defaultRoles, setDefaultRoles] = useState<string[]>([]);
  const [modRoles, setModRoles] = useState<string[]>([]);

  const [originalModLogChannel, setOriginalModLogChannel] = useState('');
  const [originalWelcomeChannel, setOriginalWelcomeChannel] = useState('');
  const [originalWelcomeMessage, setOriginalWelcomeMessage] = useState('Welcome {user} to {server}!');
  const [originalGoodbyeChannel, setOriginalGoodbyeChannel] = useState('');
  const [originalGoodbyeMessage, setOriginalGoodbyeMessage] = useState('Goodbye {user}, thanks for being part of {server}!');
  const [originalDefaultRoles, setOriginalDefaultRoles] = useState<string[]>([]);
  const [originalModRoles, setOriginalModRoles] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  const handleNext = () => {
    if (currentStep < 4) {
      setSlideDirection('left');
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setSlideDirection(null);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setSlideDirection('right');
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setSlideDirection(null);
      }, 300);
    }
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    // Fetch channels and roles
    fetch(`/api/servers/${guildId}/channels-and-roles`)
      .then(res => res.json())
      .then(data => {
        setChannels(data.channels || []);
        setRoles(data.roles || []);
      })
      .catch(err => console.error(err));

    // Fetch existing setup configuration
    fetch(`/api/servers/${guildId}/setup`)
      .then(res => res.json())
      .then(data => {
        const modLog = data.moderation?.logChannel || '';
        const welcomeCh = data.welcome?.channel || '';
        const welcomeMsg = data.welcome?.message || 'Welcome {user} to {server}!';
        const goodbyeCh = data.goodbye?.channel || '';
        const goodbyeMsg = data.goodbye?.message || 'Goodbye {user}, thanks for being part of {server}!';
        const defRoles = data.roles?.defaultRoles || [];
        const modRs = data.roles?.modRoles || [];

        setModLogChannel(modLog);
        setWelcomeChannel(welcomeCh);
        setWelcomeMessage(welcomeMsg);
        setGoodbyeChannel(goodbyeCh);
        setGoodbyeMessage(goodbyeMsg);
        setDefaultRoles(defRoles);
        setModRoles(modRs);

        setOriginalModLogChannel(modLog);
        setOriginalWelcomeChannel(welcomeCh);
        setOriginalWelcomeMessage(welcomeMsg);
        setOriginalGoodbyeChannel(goodbyeCh);
        setOriginalGoodbyeMessage(goodbyeMsg);
        setOriginalDefaultRoles(defRoles);
        setOriginalModRoles(modRs);
      })
      .catch(err => console.error(err));
  }, [session, status, router, guildId]);

  useEffect(() => {
    const hasChanges = 
      modLogChannel !== originalModLogChannel ||
      welcomeChannel !== originalWelcomeChannel ||
      welcomeMessage !== originalWelcomeMessage ||
      goodbyeChannel !== originalGoodbyeChannel ||
      goodbyeMessage !== originalGoodbyeMessage ||
      JSON.stringify(defaultRoles) !== JSON.stringify(originalDefaultRoles) ||
      JSON.stringify(modRoles) !== JSON.stringify(originalModRoles);
    setHasUnsavedChanges(hasChanges);
  }, [modLogChannel, welcomeChannel, welcomeMessage, goodbyeChannel, goodbyeMessage, defaultRoles, modRoles, originalModLogChannel, originalWelcomeChannel, originalWelcomeMessage, originalGoodbyeChannel, originalGoodbyeMessage, originalDefaultRoles, originalModRoles]);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/servers/${guildId}/setup`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modLogChannel,
          welcomeChannel,
          welcomeMessage,
          goodbyeChannel,
          goodbyeMessage,
          defaultRoles,
          modRoles,
        }),
      });

      if (response.ok) {
        setOriginalModLogChannel(modLogChannel);
        setOriginalWelcomeChannel(welcomeChannel);
        setOriginalWelcomeMessage(welcomeMessage);
        setOriginalGoodbyeChannel(goodbyeChannel);
        setOriginalGoodbyeMessage(goodbyeMessage);
        setOriginalDefaultRoles([...defaultRoles]);
        setOriginalModRoles([...modRoles]);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error saving setup:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setModLogChannel(originalModLogChannel);
    setWelcomeChannel(originalWelcomeChannel);
    setWelcomeMessage(originalWelcomeMessage);
    setGoodbyeChannel(originalGoodbyeChannel);
    setGoodbyeMessage(originalGoodbyeMessage);
    setDefaultRoles([...originalDefaultRoles]);
    setModRoles([...originalModRoles]);
    setHasUnsavedChanges(false);
  };

  if (status === 'loading') {
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
            <Link href={`/servers/${guildId}`} className="flex items-center gap-3 px-3 py-6 bg-white hover:bg-orange-50/30 text-slate-700 hover:text-orange-700 transition-colors" onClick={() => setMobileMenuOpen(false)}>
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
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${guildId}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    General
                  </Link>
                  <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
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
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link href={`/servers/${guildId}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Automod
                  </Link>
                  <Link href={`/servers/${guildId}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Logging
                  </Link>
                  <Link href={`/servers/${guildId}/configuration/anti-raid`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Anti-Raid
                  </Link>
                  <Link href={`/servers/${guildId}/configuration/reaction-roles`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Reaction Roles
                  </Link>
                  <Link href={`/servers/${guildId}/configuration/verification`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
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
                  <Link href={`/servers/${guildId}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Moderation
                  </Link>
                  <Link href={`/servers/${guildId}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Role Management
                  </Link>
                  <Link href={`/servers/${guildId}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Member Management
                  </Link>
                  <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Announcements
                  </Link>
                  <Link href={`/servers/${guildId}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Welcome Messages
                  </Link>
                  <Link href={`/servers/${guildId}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Fun
                  </Link>
                  <Link href={`/servers/${guildId}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>
      </aside>

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-5xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-bold">Setup</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 overflow-hidden relative">
            <div className={slideDirection === 'left' ? 'animate-slide-left' : slideDirection === 'right' ? 'animate-slide-right' : slideDirection === null && currentStep ? 'animate-slide-in-from-right' : ''}>
            {/* Section 1/4 - Moderation Log */}
            {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">1/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Moderation Log</h2>
                </div>
                <p className="text-slate-600">Configure where moderation actions will be logged.</p>
              </div>
              <div className="space-y-3 border-t border-orange-100 pt-4">
                <label className="block text-sm font-semibold text-[#0f172a]">Log Channel</label>
                <select
                  value={modLogChannel}
                  onChange={(e) => setModLogChannel(e.target.value)}
                  className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                >
                  <option value="">Select a channel...</option>
                  {channels.map(ch => (
                    <option key={ch.id} value={ch.id}># {ch.name}</option>
                  ))}
                  <option value="create-new">+ Create New Channel</option>
                </select>
                <p className="text-xs text-slate-500">All moderation actions (warns, kicks, bans) will be logged here. Only visible to moderators.</p>
              </div>
            </div>
            )}

            {/* Section 2/4 - Welcome Messages */}
            {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">2/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Welcome Messages</h2>
                </div>
                <p className="text-slate-600">Configure welcome messages for new members.</p>
              </div>
              <div className="space-y-4 border-t border-orange-100 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Welcome Channel</label>
                  <select
                    value={welcomeChannel}
                    onChange={(e) => setWelcomeChannel(e.target.value)}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select a channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}># {ch.name}</option>
                    ))}
                    <option value="create-new">+ Create New Channel</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Welcome Message</label>
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none resize-none"
                    placeholder="Welcome {user} to {server}!"
                  />
                  <p className="text-xs text-slate-500">Use {'{user}'} for the member's name and {'{server}'} for the server name.</p>
                </div>
              </div>
            </div>
            )}

            {/* Section 3/4 - Goodbye Messages */}
            {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">3/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Goodbye Messages</h2>
                </div>
                <p className="text-slate-600">Configure goodbye messages when members leave.</p>
              </div>
              <div className="space-y-4 border-t border-orange-100 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Goodbye Channel</label>
                  <select
                    value={goodbyeChannel}
                    onChange={(e) => setGoodbyeChannel(e.target.value)}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                  >
                    <option value="">Select a channel...</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}># {ch.name}</option>
                    ))}
                    <option value="create-new">+ Create New Channel</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Goodbye Message</label>
                  <textarea
                    value={goodbyeMessage}
                    onChange={(e) => setGoodbyeMessage(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none resize-none"
                    placeholder="Goodbye {user}, thanks for being part of {server}!"
                  />
                  <p className="text-xs text-slate-500">Use {'{user}'} for the member's name and {'{server}'} for the server name.</p>
                </div>
              </div>
            </div>
            )}

            {/* Section 4/4 - Roles */}
            {currentStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">4/4</span>
                  <h2 className="text-xl font-semibold text-[#0f172a]">Roles</h2>
                </div>
                <p className="text-slate-600">Configure default and moderator roles.</p>
              </div>
              <div className="space-y-4 border-t border-orange-100 pt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Default Member Roles</label>
                  <select
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                    onChange={(e) => {
                      if (e.target.value && !defaultRoles.includes(e.target.value)) {
                        setDefaultRoles([...defaultRoles, e.target.value]);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Select roles to add...</option>
                    {roles.filter(r => !defaultRoles.includes(r.id)).map(r => (
                      <option key={r.id} value={r.id}>@ {r.name}</option>
                    ))}
                    <option value="create-new">+ Create New Role</option>
                  </select>
                  {defaultRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {defaultRoles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        return (
                          <span key={roleId} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={() => setDefaultRoles(defaultRoles.filter(r => r !== roleId))}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">These roles will be automatically assigned to new members when they join.</p>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-[#0f172a]">Moderator Roles</label>
                  <select
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-4 py-3 focus:border-orange-500 focus:outline-none"
                    onChange={(e) => {
                      if (e.target.value && !modRoles.includes(e.target.value)) {
                        setModRoles([...modRoles, e.target.value]);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">Select roles to add...</option>
                    {roles.filter(r => !modRoles.includes(r.id)).map(r => (
                      <option key={r.id} value={r.id}>@ {r.name}</option>
                    ))}
                    <option value="create-new">+ Create New Role</option>
                  </select>
                  {modRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {modRoles.map(roleId => {
                        const role = roles.find(r => r.id === roleId);
                        return (
                          <span key={roleId} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={() => setModRoles(modRoles.filter(r => r !== roleId))}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-500">Members with these roles will have access to moderation commands and features.</p>
                </div>
              </div>
            </div>
            )}
            </div>

            {/* Navigation Buttons */}
            <div className="border-t border-orange-100 pt-6 mt-8">
              <div className="flex items-center justify-between gap-4">
                <button 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-6 py-3 rounded-lg font-semibold transition-colors border border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  ← Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        step === currentStep ? 'bg-orange-500' : 'bg-orange-200'
                      }`}
                    />
                  ))}
                </div>

                {currentStep < 4 ? (
                  <button 
                    onClick={handleNext}
                    className="px-6 py-3 rounded-lg font-semibold transition-colors bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Next →
                  </button>
                ) : (
                  <button 
                    onClick={handleNext}
                    className="px-6 py-3 rounded-lg font-semibold transition-colors bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Next →
                  </button>
                )}
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
