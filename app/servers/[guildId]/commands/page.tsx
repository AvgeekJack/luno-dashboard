'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CATEGORIES = [
  'Moderation',
  'Logging',
  'Role Management',
  'Member Management',
  'Announcements',
  'Tickets',
  'Notifications',
  'Custom Commands',
  'Fun',
  'Music',
  'Server Info',
  'Utilities',
  'Settings/Config',
  'Audit & Compliance',
  'Security',
  'Scheduler',
  'Analytics',
  'Message Searching',
];

const COMMANDS: Record<string, { category: string; description: string }> = {
  // Moderation family
  warn: { category: 'Moderation', description: 'Warn a user with a message' },
  ban: { category: 'Moderation', description: 'Ban a user from the server' },
  clear: { category: 'Moderation', description: 'Delete bulk messages from a channel' },
  kick: { category: 'Moderation', description: 'Kick a user from the server' },
  lock: { category: 'Security', description: 'Lock a channel from posting' },
  modlog: { category: 'Logging', description: 'View or manage moderation logs' },
  mute: { category: 'Moderation', description: 'Mute a user in the server' },
  slowmode: { category: 'Moderation', description: 'Set slowmode for a channel' },
  softban: { category: 'Moderation', description: 'Ban and then unban a user' },
  tempmute: { category: 'Moderation', description: 'Temporarily mute a user' },
  timeout: { category: 'Moderation', description: 'Timeout a user for a duration' },
  unban: { category: 'Moderation', description: 'Unban a previously banned user' },
  unlock: { category: 'Security', description: 'Unlock a locked channel' },
  unmute: { category: 'Moderation', description: 'Unmute a muted user' },
  untimeout: { category: 'Moderation', description: 'Remove timeout from a user' },
  warnings: { category: 'Audit & Compliance', description: 'View warnings for a user' },
  // Info / Utility / Fun
  userinfo: { category: 'Server Info', description: 'Display information about a user' },
  eightball: { category: 'Fun', description: 'Ask the magic 8ball a question' },
  ping: { category: 'Utilities', description: "Check the bot's response time" },
};

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Role {
  id: string;
  name: string;
}

interface CommandState {
  [key: string]: boolean;
}

interface CommandConfig {
  enabled: boolean;
  allowedChannels: string[];
  ignoredChannels: string[];
  allowedRoles: string[];
  ignoredRoles: string[];
}

export default function CommandsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const [activeCategory, setActiveCategory] = useState('Moderation');
  const [commandStates, setCommandStates] = useState<CommandState>({});
  const [commandConfigs, setCommandConfigs] = useState<Record<string, CommandConfig>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [settings, setSettings] = useState({
    allowedChannels: [] as string[],
    ignoredChannels: [] as string[],
    allowedRoles: [] as string[],
    ignoredRoles: [] as string[],
  });
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCommand, setCurrentCommand] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);

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

    // Fetch existing command settings
    fetch(`/api/servers/${guildId}/settings`)
      .then(res => res.json())
      .then(data => {
        const existingCommands = data?.commands || {};
        const nextStates: CommandState = {};
        const nextConfigs: Record<string, CommandConfig> = {};
        Object.keys(COMMANDS).forEach(cmd => {
          const cfg = existingCommands[cmd] || {};
          nextStates[cmd] = cfg.enabled !== undefined ? cfg.enabled : true;
          nextConfigs[cmd] = {
            enabled: cfg.enabled !== undefined ? cfg.enabled : true,
            allowedChannels: cfg.allowedChannels || [],
            ignoredChannels: cfg.ignoredChannels || [],
            allowedRoles: cfg.allowedRoles || [],
            ignoredRoles: cfg.ignoredRoles || [],
          };
        });
        setCommandStates(nextStates);
        setCommandConfigs(nextConfigs);
      })
      .catch(err => console.error(err));
  }, [session, status, router, guildId]);

  const handleToggleCommand = (command: string) => {
    setCommandStates(prev => ({
      ...prev,
      [command]: !prev[command]
    }));
    setCommandConfigs(prev => ({
      ...prev,
      [command]: {
        enabled: !commandStates[command],
        allowedChannels: prev[command]?.allowedChannels || [],
        ignoredChannels: prev[command]?.ignoredChannels || [],
        allowedRoles: prev[command]?.allowedRoles || [],
        ignoredRoles: prev[command]?.ignoredRoles || [],
      }
    }));
    saveCommandToggle(command, !commandStates[command]);
  };

  const saveCommandToggle = async (command: string, enabled: boolean) => {
    try {
      await fetch(`/api/servers/${guildId}/commands/${command}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
    } catch (error) {
      console.error('Error saving command toggle:', error);
    }
  };

  const handleSaveCommandSettings = async () => {
    try {
      await fetch(`/api/servers/${guildId}/commands/${currentCommand}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: commandStates[currentCommand],
          ...settings,
        }),
      });

      setCommandConfigs(prev => ({
        ...prev,
        [currentCommand]: {
          enabled: commandStates[currentCommand],
          allowedChannels: settings.allowedChannels,
          ignoredChannels: settings.ignoredChannels,
          allowedRoles: settings.allowedRoles,
          ignoredRoles: settings.ignoredRoles,
        },
      }));
      setShowSettings(false);
    } catch (error) {
      console.error('Error saving command settings:', error);
    }
  };

  const openSettings = (command: string) => {
    setCurrentCommand(command);
    const cfg = commandConfigs[command];
    setSettings({
      allowedChannels: cfg?.allowedChannels || [],
      ignoredChannels: cfg?.ignoredChannels || [],
      allowedRoles: cfg?.allowedRoles || [],
      ignoredRoles: cfg?.ignoredRoles || [],
    });
    setShowSettings(true);
  };

  const filteredCommands = Object.entries(COMMANDS).filter(
    ([_, cmd]) => cmd.category === activeCategory
  );

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <span className="text-xl font-bold text-[#0f172a]">Luno</span>
          </div>
        </div>
        
        <div className="px-4 py-4">
          <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3">← Back to Servers</Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href={`/servers/${guildId}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors">
            <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
            Dashboard
          </Link>
          <details className="border border-orange-100 bg-orange-50/60 text-slate-800" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                Settings
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className={`border-t border-orange-100 px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  General
                </Link>
                <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Setup
                </Link>
                <Link href={`/servers/${guildId}/commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-100" aria-hidden />
                  Commands
                </Link>
              </div>
            )}
          </details>
          <details className="border border-orange-100 bg-orange-50/60 text-slate-800" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                Modules
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className={`border-t border-orange-100 px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Moderation
                </Link>
                <Link href={`/servers/${guildId}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Role Management
                </Link>
                <Link href={`/servers/${guildId}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Member Management
                </Link>
                <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Announcements
                </Link>
                <Link href={`/servers/${guildId}/modules/tickets`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Tickets
                </Link>
                <Link href={`/servers/${guildId}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Notifications
                </Link>
                <Link href={`/servers/${guildId}/modules/custom-commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Custom Commands
                </Link>
                <Link href={`/servers/${guildId}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '350ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Fun
                </Link>
                <Link href={`/servers/${guildId}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '400ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Utilities
                </Link>
                <Link href={`/servers/${guildId}/modules/security`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '450ms'}}>
                  <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
                  Security
                </Link>
              </div>
            )}
          </details>
          <Link href={`/servers/${guildId}/logs`} className="flex w-full items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors text-left">
            <span className="h-5 w-5 rounded-md bg-orange-50" aria-hidden />
            Logs
          </Link>
        </nav>
        </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="max-w-6xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Settings</p>
            <h1 className="text-3xl font-bold">Commands</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-[#0f172a]">Commands</h2>
              <p className="text-slate-600">Configure and manage commands for this server.</p>
            </div>

            <div className="space-y-6 border-t border-orange-100 pt-6">
              <div className="flex gap-2 pb-2 overflow-x-auto md:flex-wrap md:overflow-visible">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-50 text-slate-700 border border-orange-100 hover:bg-orange-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommands.map(([commandName, commandInfo]) => (
                  <div key={commandName} className="rounded-xl border border-orange-100 bg-slate-50 p-5 shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#0f172a]">{commandName}</h3>
                        <p className="text-sm text-slate-600">{commandInfo.description}</p>
                      </div>
                      <button
                        onClick={() => handleToggleCommand(commandName)}
                        className={`relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0 ${
                          commandStates[commandName] ? 'bg-orange-500' : 'bg-slate-400'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            commandStates[commandName] ? 'translate-x-5' : 'translate-x-1'
                          }`}
                          style={{ marginTop: '2px' }}
                        />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openSettings(commandName)} className="flex-1 rounded-lg bg-orange-500 text-white px-3 py-2 text-sm font-semibold hover:bg-orange-600 transition-colors">
                        Settings
                      </button>
                      <button className="flex-1 rounded-lg bg-orange-100 text-orange-700 px-3 py-2 text-sm font-semibold hover:bg-orange-200 transition-colors">
                        Help
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-orange-100" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-orange-100 flex items-center justify-between p-6">
              <h2 className="text-xl font-bold text-[#0f172a]">Additional Permissions ({currentCommand})</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-[#0f172a] transition-colors text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Allowed Channels */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Allowed Channels</label>
                <div className="relative">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === 'allowedChannels' ? null : 'allowedChannels');
                    }}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.allowedChannels.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select channels...</span>
                    ) : (
                      settings.allowedChannels.map(id => {
                        const channel = channels.find(c => c.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {channel?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  allowedChannels: settings.allowedChannels.filter(c => c !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'allowedChannels' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          placeholder="Search channels..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {channels
                          .filter(ch => !settings.allowedChannels.includes(ch.id) && ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  allowedChannels: [...settings.allowedChannels, ch.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              # {ch.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ignored Channels */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Ignored Channels</label>
                <div className="relative">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === 'ignoredChannels' ? null : 'ignoredChannels');
                    }}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.ignoredChannels.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select channels...</span>
                    ) : (
                      settings.ignoredChannels.map(id => {
                        const channel = channels.find(c => c.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {channel?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  ignoredChannels: settings.ignoredChannels.filter(c => c !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'ignoredChannels' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          placeholder="Search channels..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {channels
                          .filter(ch => !settings.ignoredChannels.includes(ch.id) && ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(ch => (
                            <button
                              key={ch.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  ignoredChannels: [...settings.ignoredChannels, ch.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              # {ch.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Allowed Roles */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Allowed Roles</label>
                <div className="relative">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === 'allowedRoles' ? null : 'allowedRoles');
                    }}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.allowedRoles.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select roles...</span>
                    ) : (
                      settings.allowedRoles.map(id => {
                        const role = roles.find(r => r.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  allowedRoles: settings.allowedRoles.filter(r => r !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'allowedRoles' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          placeholder="Search roles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {roles
                          .filter(r => !settings.allowedRoles.includes(r.id) && r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(r => (
                            <button
                              key={r.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  allowedRoles: [...settings.allowedRoles, r.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              @ {r.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ignored Roles */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#0f172a]">Ignored Roles</label>
                <div className="relative">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(dropdownOpen === 'ignoredRoles' ? null : 'ignoredRoles');
                    }}
                    className="w-full rounded-lg bg-orange-50 border border-orange-200 text-[#0f172a] px-3 py-3 focus:border-orange-500 focus:outline-none cursor-pointer flex flex-wrap gap-2 items-center min-h-12"
                  >
                    {settings.ignoredRoles.length === 0 ? (
                      <span className="text-slate-500 text-sm">Select roles...</span>
                    ) : (
                      settings.ignoredRoles.map(id => {
                        const role = roles.find(r => r.id === id);
                        return (
                          <span key={id} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                            {role?.name}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettings({
                                  ...settings,
                                  ignoredRoles: settings.ignoredRoles.filter(r => r !== id)
                                });
                              }}
                              className="hover:text-orange-200"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                  {dropdownOpen === 'ignoredRoles' && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                      <div className="sticky top-0 bg-white border-b border-orange-100 p-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          placeholder="Search roles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="p-2 space-y-1">
                        {roles
                          .filter(r => !settings.ignoredRoles.includes(r.id) && r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(r => (
                            <button
                              key={r.id}
                              onClick={() => {
                                setSettings({
                                  ...settings,
                                  ignoredRoles: [...settings.ignoredRoles, r.id]
                                });
                                setSearchQuery('');
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm text-[#0f172a]"
                            >
                              @ {r.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSaveCommandSettings}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
