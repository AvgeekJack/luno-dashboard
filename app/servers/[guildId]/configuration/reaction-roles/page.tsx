'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface ReactionRolePanel {
  id: string;
  title: string;
  description: string;
  color: string;
  channelId: string;
  messageId?: string;
  panelType: 'single' | 'multiple' | 'remove-on-unreact';
  roleEmojiPairs: Array<{ roleId: string; emoji: string; }>;
}

interface ReactionRolesSettings {
  enabled: boolean;
  panels: ReactionRolePanel[];
  roleLimit: number;
  requiredRole: string | null;
  blacklistedRoles: string[];
  allowRoleStacking: boolean;
  autoDeleteReactions: boolean;
  dmOnRoleChange: boolean;
  dmMessage: string;
  rolePersistence: boolean;
  reactionCooldown: number;
}

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  color: string;
}

export default function ReactionRolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  
  // New panel form state
  const [newPanel, setNewPanel] = useState({
    title: '',
    description: '',
    color: '#5865F2',
    channelId: '',
    panelType: 'multiple' as 'single' | 'multiple' | 'remove-on-unreact',
    roleEmojiPairs: [] as Array<{ roleId: string; emoji: string; }>,
  });

  const [settings, setSettings] = useState<ReactionRolesSettings>({
    enabled: false,
    panels: [],
    roleLimit: 0,
    requiredRole: null,
    blacklistedRoles: [],
    allowRoleStacking: true,
    autoDeleteReactions: false,
    dmOnRoleChange: false,
    dmMessage: 'You have been given the {role} role!',
    rolePersistence: false,
    reactionCooldown: 5,
  });

  const [originalSettings, setOriginalSettings] = useState<ReactionRolesSettings>(settings);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch channels and roles
        const channelsRes = await fetch(`/api/servers/${gid}/channels-and-roles`);
        if (channelsRes.ok) {
          const data = await channelsRes.json();
          setChannels(data.channels || []);
          setRoles(data.roles || []);
        }

        // Fetch reaction roles settings
        const settingsRes = await fetch(`/api/servers/${gid}/general`);
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          const rrData = data.configuration?.reactionRoles;
          const mergedSettings: ReactionRolesSettings = {
            enabled: rrData?.enabled ?? false,
            panels: rrData?.panels ?? [],
            roleLimit: rrData?.roleLimit ?? 0,
            requiredRole: rrData?.requiredRole ?? null,
            blacklistedRoles: rrData?.blacklistedRoles ?? [],
            allowRoleStacking: rrData?.allowRoleStacking ?? true,
            autoDeleteReactions: rrData?.autoDeleteReactions ?? false,
            dmOnRoleChange: rrData?.dmOnRoleChange ?? false,
            dmMessage: rrData?.dmMessage ?? 'You have been given the {role} role!',
            rolePersistence: rrData?.rolePersistence ?? false,
            reactionCooldown: rrData?.reactionCooldown ?? 5,
          };
          setSettings(mergedSettings);
          setOriginalSettings(mergedSettings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router, gid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving settings:', settings);
      const response = await fetch(`/api/servers/${gid}/general`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'configuration.reactionRoles': settings,
        }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setOriginalSettings({ ...settings });
        setHasUnsavedChanges(false);
        alert('Settings saved successfully!');
      } else {
        console.error('Save failed:', responseData);
        alert(`Failed to save: ${responseData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Save error:', err);
      alert(`Error saving settings: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({ ...originalSettings });
    setHasUnsavedChanges(false);
  };

  const updateSetting = <K extends keyof ReactionRolesSettings>(key: K, value: ReactionRolesSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const getChannelName = (channelId: string) => {
    return channels.find(c => c.id === channelId)?.name || 'Unknown';
  };

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || 'Unknown';
  };

  const handleCreatePanel = () => {
    if (!newPanel.title.trim()) {
      alert('Please enter a panel title');
      return;
    }
    if (!newPanel.channelId) {
      alert('Please select a channel');
      return;
    }
    if (newPanel.roleEmojiPairs.length === 0) {
      alert('Please add at least one role-emoji pair');
      return;
    }

    const panel: ReactionRolePanel = {
      id: Date.now().toString(),
      title: newPanel.title,
      description: newPanel.description,
      color: newPanel.color,
      channelId: newPanel.channelId,
      panelType: newPanel.panelType,
      roleEmojiPairs: newPanel.roleEmojiPairs,
    };

    setSettings({
      ...settings,
      panels: [...settings.panels, panel],
    });
    setHasUnsavedChanges(true);

    // Reset form
    setNewPanel({
      title: '',
      description: '',
      color: '#5865F2',
      channelId: '',
      panelType: 'multiple',
      roleEmojiPairs: [],
    });

    setShowCreatePanel(false);
    alert('Panel created successfully! Remember to save your changes.');
  };

  const addRoleEmojiPair = () => {
    setNewPanel({
      ...newPanel,
      roleEmojiPairs: [...newPanel.roleEmojiPairs, { roleId: '', emoji: '' }],
    });
  };

  const updateRoleEmojiPair = (index: number, field: 'roleId' | 'emoji', value: string) => {
    const updated = [...newPanel.roleEmojiPairs];
    updated[index][field] = value;
    setNewPanel({ ...newPanel, roleEmojiPairs: updated });
  };

  const removeRoleEmojiPair = (index: number) => {
    const updated = newPanel.roleEmojiPairs.filter((_, i) => i !== index);
    setNewPanel({ ...newPanel, roleEmojiPairs: updated });
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showCreatePanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCreatePanel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a] flex">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[40] lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-orange-100 shadow-lg lg:shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="p-4 border-b border-orange-100 flex items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
            <div className="w-8 lg:hidden"></div>
          </div>
          
          <div className="px-4 py-4">
            <Link 
              href="/servers" 
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3"
              onClick={() => setMobileMenuOpen(false)}
            >
              ← Back to Servers
            </Link>
          </div>
          
          <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
            <Link 
              href={`/servers/${gid}`}
              className="flex items-center gap-3 px-3 py-6 transition-colors rounded-lg hover:bg-gray-100 text-slate-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/dashbaord.png" alt="" className="w-5 h-5" />
              Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/settings.png" alt="" className="w-5 h-5" />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-slate-200 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${gid}/settings/general`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    General
                  </Link>
                  <Link 
                    href={`/servers/${gid}/settings/setup`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Setup
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={configOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/configuration.png" alt="" className="w-5 h-5" />
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-slate-200 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${gid}/configuration/automod`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Automod
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/logging`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logging
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/anti-raid`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Anti-Raid
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/reaction-roles`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left bg-orange-50 text-orange-600 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reaction Roles
                  </Link>
                  <Link 
                    href={`/servers/${gid}/configuration/verification`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Verification
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
                <span className="flex items-center gap-3">
                  <img src="/modules.png" alt="" className="w-5 h-5" />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-slate-200 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${gid}/modules/moderation`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Moderation
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/role-management`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Role Management
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/member-management`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Member Management
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/announcements`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Announcements
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/welcome-messages`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Welcome Messages
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/fun`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '250ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fun
                  </Link>
                  <Link 
                    href={`/servers/${gid}/modules/utilities`}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '300ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>
        </aside>

        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-orange-100 z-30 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900">Reaction Roles</h1>
          <div className="w-8"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="lg:ml-64 pt-20 lg:pt-12 px-6 md:px-8 py-12 w-full">
            {/* Page Header */}
            <div className="space-y-1 mb-6">
              <p className="text-xs uppercase tracking-[0.15em] text-orange-500 font-semibold">CONFIGURATION</p>
              <h1 className="text-4xl font-bold text-[#0f172a]">Reaction Roles</h1>
            </div>

            {/* Master Toggle Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#0f172a]">Reaction Role System</h2>
                  <p className="text-sm text-slate-500">Allow users to assign roles by reacting to messages</p>
                </div>
                <Switch 
                  checked={settings.enabled} 
                  onCheckedChange={(checked) => updateSetting('enabled', checked)}
                  className="scale-125"
                />
              </div>
            </div>

            {settings.enabled && (
              <>
                {/* Panels List */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#0f172a]">Reaction Role Panels</h3>
                      <button
                        onClick={() => setShowCreatePanel(true)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition text-sm"
                      >
                        + Create Panel
                      </button>
                    </div>

                    {settings.panels.length === 0 ? (
                      <div className="text-center py-12 text-slate-500">
                        <p>No panels configured yet. Create one to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {settings.panels.map((panel) => (
                          <div key={panel.id} className="p-6 rounded-lg border-2 border-slate-200 hover:border-orange-300 transition">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div 
                                    className="w-4 h-4 rounded-full" 
                                    style={{ backgroundColor: panel.color }}
                                  ></div>
                                  <h4 className="text-lg font-bold text-slate-900">{panel.title}</h4>
                                </div>
                                <p className="text-sm text-slate-600 mb-3">{panel.description}</p>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                    # {getChannelName(panel.channelId)}
                                  </span>
                                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold capitalize">
                                    {panel.panelType.replace(/-/g, ' ')}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => alert('Panel editing coming soon!')}
                                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => alert('Panel deletion coming soon!')}
                                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
                              {panel.roleEmojiPairs.map((pair, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                                  <span className="text-lg">{pair.emoji}</span>
                                  <span className="text-sm font-semibold text-slate-700">
                                    {getRoleName(pair.roleId)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* General Settings */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#0f172a]">General Settings</h2>
                    <p className="text-sm text-slate-500">Configure global reaction role behavior</p>
                  </div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Role Limit</label>
                        <input
                          type="number"
                          value={settings.roleLimit}
                          onChange={(e) => updateSetting('roleLimit', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Maximum roles per user (0 = unlimited)</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Reaction Cooldown</label>
                        <input
                          type="number"
                          value={settings.reactionCooldown}
                          onChange={(e) => updateSetting('reactionCooldown', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Seconds between role changes</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Required Role</label>
                        <select
                          value={settings.requiredRole || ''}
                          onChange={(e) => updateSetting('requiredRole', e.target.value || null)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        >
                          <option value="">None</option>
                          {roles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500">Role required to use reaction roles</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Blacklisted Roles</label>
                        <div className="text-sm text-slate-700">
                          {settings.blacklistedRoles.length} role(s) blacklisted
                        </div>
                        <button
                          onClick={() => alert('Blacklist management coming soon!')}
                          className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                        >
                          Manage Blacklist
                        </button>
                        <p className="text-xs text-slate-500">Users with these roles cannot use reaction roles</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Allow Role Stacking</p>
                          <p className="text-xs text-slate-500 mt-1">Allow multiple roles from the same panel</p>
                        </div>
                        <Switch
                          checked={settings.allowRoleStacking}
                          onCheckedChange={(checked) => updateSetting('allowRoleStacking', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Auto Delete Reactions</p>
                          <p className="text-xs text-slate-500 mt-1">Remove reactions after user gets role</p>
                        </div>
                        <Switch
                          checked={settings.autoDeleteReactions}
                          onCheckedChange={(checked) => updateSetting('autoDeleteReactions', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Role Persistence</p>
                          <p className="text-xs text-slate-500 mt-1">Restore roles if user leaves and rejoins</p>
                        </div>
                        <Switch
                          checked={settings.rolePersistence}
                          onCheckedChange={(checked) => updateSetting('rolePersistence', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">DM on Role Change</p>
                          <p className="text-xs text-slate-500 mt-1">Send DM when user gets/loses a role</p>
                        </div>
                        <Switch
                          checked={settings.dmOnRoleChange}
                          onCheckedChange={(checked) => updateSetting('dmOnRoleChange', checked)}
                        />
                      </div>
                    </div>

                    {settings.dmOnRoleChange && (
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">DM Message</label>
                        <textarea
                          value={settings.dmMessage}
                          onChange={(e) => updateSetting('dmMessage', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                          placeholder="Use {role} for role name, {user} for username"
                        />
                        <p className="text-xs text-slate-500">Message sent when role is assigned (use {'{role}'} for role name)</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

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

      {/* Create Panel Modal */}
      {showCreatePanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white md:rounded-2xl shadow-2xl max-w-2xl w-full h-full md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Create Panel</h2>
              <button
                onClick={() => setShowCreatePanel(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto flex-1">
              {/* Panel Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Panel Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPanel.title}
                  onChange={(e) => setNewPanel({ ...newPanel, title: e.target.value })}
                  placeholder="e.g., Choose Your Roles"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Panel Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Description
                </label>
                <textarea
                  value={newPanel.description}
                  onChange={(e) => setNewPanel({ ...newPanel, description: e.target.value })}
                  placeholder="Brief description of this panel"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Color and Channel Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Panel Color */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-2">
                    Panel Color
                  </label>
                  <div className="flex items-center gap-2 md:gap-3">
                    <input
                      type="color"
                      value={newPanel.color}
                      onChange={(e) => setNewPanel({ ...newPanel, color: e.target.value })}
                      className="w-12 md:w-16 h-10 rounded border border-slate-300 cursor-pointer flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={newPanel.color}
                      onChange={(e) => setNewPanel({ ...newPanel, color: e.target.value })}
                      className="flex-1 px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Channel Selection */}
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-2">
                    Channel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPanel.channelId}
                    onChange={(e) => setNewPanel({ ...newPanel, channelId: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a channel</option>
                    {channels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Panel Type */}
              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-2">
                  Panel Type
                </label>
                <select
                  value={newPanel.panelType}
                  onChange={(e) => setNewPanel({ ...newPanel, panelType: e.target.value as any })}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="multiple">Multiple - Users can select multiple roles</option>
                  <option value="single">Single - Users can only select one role</option>
                  <option value="remove-on-unreact">Unique - Only one user per role</option>
                </select>
              </div>

              {/* Role-Emoji Pairs */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <label className="block text-xs md:text-sm font-semibold text-slate-800">
                    Role-Emoji Pairs <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={addRoleEmojiPair}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs md:text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <span className="text-lg leading-none">+</span>
                    Add Pair
                  </button>
                </div>

                {newPanel.roleEmojiPairs.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-500">
                    No role-emoji pairs added yet. Click "Add Pair" to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newPanel.roleEmojiPairs.map((pair, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                        <select
                          value={pair.roleId}
                          onChange={(e) => updateRoleEmojiPair(index, 'roleId', e.target.value)}
                          className="flex-1 px-3 md:px-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="">Select role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={pair.emoji}
                          onChange={(e) => updateRoleEmojiPair(index, 'emoji', e.target.value)}
                          placeholder="🎮"
                          className="w-full sm:w-20 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-lg"
                        />
                        <button
                          onClick={() => removeRoleEmojiPair(index)}
                          className="px-3 py-2 text-xs md:text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 md:px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowCreatePanel(false)}
                className="px-5 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePanel}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition shadow-sm"
              >
                Create Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
