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
  roleEmojiPairs: Array<{
    roleId: string;
    emoji: string;
  }>;
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
  premium?: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Role {
  id: string;
  name: string;
  color: number;
}

export default function ReactionRolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Panel creation state
  const [showPanelCreator, setShowPanelCreator] = useState(false);
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null);
  const [newPanel, setNewPanel] = useState<Partial<ReactionRolePanel>>({
    title: '',
    description: '',
    color: '#5865F2',
    channelId: '',
    panelType: 'multiple',
    roleEmojiPairs: []
  });

  // Dropdown states
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [showRequiredRoleDropdown, setShowRequiredRoleDropdown] = useState(false);
  const [showBlacklistDropdown, setShowBlacklistDropdown] = useState(false);
  const [showPanelChannelDropdown, setShowPanelChannelDropdown] = useState(false);
  const [showRoleEmojiDropdown, setShowRoleEmojiDropdown] = useState(false);
  const [tempRoleEmoji, setTempRoleEmoji] = useState({ roleId: '', emoji: '' });

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
    reactionCooldown: 0,
    premium: false,
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
        const [channelsRes, reactionRolesRes, settingsRes] = await Promise.all([
          fetch(`/api/servers/${gid}/channels-and-roles`),
          fetch(`/api/servers/${gid}/configuration/reaction-roles`),
          fetch(`/api/servers/${gid}/settings`)
        ]);

        if (channelsRes.ok) {
          const data = await channelsRes.json();
          setChannels(data.channels || []);
          setRoles(data.roles || []);
        }

        let premiumStatus = false;
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          premiumStatus = data.premium || false;
        }

        if (reactionRolesRes.ok) {
          const data = await reactionRolesRes.json();
          if (data.reactionRoles) {
            const loadedSettings = { ...settings, ...data.reactionRoles, premium: premiumStatus };
            setSettings(loadedSettings);
            setOriginalSettings(loadedSettings);
          }
        } else {
          setSettings(prev => ({ ...prev, premium: premiumStatus }));
          setOriginalSettings(prev => ({ ...prev, premium: premiumStatus }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, gid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/servers/${gid}/configuration/reaction-roles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setOriginalSettings({ ...settings });
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error(err);
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

  const addPanel = () => {
    if (!newPanel.title || !newPanel.channelId || !newPanel.roleEmojiPairs || newPanel.roleEmojiPairs.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const panel: ReactionRolePanel = {
      id: Date.now().toString(),
      title: newPanel.title!,
      description: newPanel.description || '',
      color: newPanel.color || '#5865F2',
      channelId: newPanel.channelId!,
      panelType: newPanel.panelType || 'multiple',
      roleEmojiPairs: newPanel.roleEmojiPairs!
    };

    updateSetting('panels', [...settings.panels, panel]);
    setShowPanelCreator(false);
    setNewPanel({
      title: '',
      description: '',
      color: '#5865F2',
      channelId: '',
      panelType: 'multiple',
      roleEmojiPairs: []
    });
  };

  const updatePanel = () => {
    if (!editingPanelId || !newPanel.title || !newPanel.channelId || !newPanel.roleEmojiPairs || newPanel.roleEmojiPairs.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedPanels = settings.panels.map(panel => 
      panel.id === editingPanelId 
        ? { ...panel, ...newPanel as ReactionRolePanel }
        : panel
    );

    updateSetting('panels', updatedPanels);
    setShowPanelCreator(false);
    setEditingPanelId(null);
    setNewPanel({
      title: '',
      description: '',
      color: '#5865F2',
      channelId: '',
      panelType: 'multiple',
      roleEmojiPairs: []
    });
  };

  const deletePanel = (panelId: string) => {
    if (confirm('Are you sure you want to delete this panel?')) {
      updateSetting('panels', settings.panels.filter(p => p.id !== panelId));
    }
  };

  const duplicatePanel = (panel: ReactionRolePanel) => {
    if (!settings.premium && settings.panels.length >= 1) {
      alert('Upgrade to premium to create more panels!');
      return;
    }
    const duplicated: ReactionRolePanel = {
      ...panel,
      id: Date.now().toString(),
      title: `${panel.title} (Copy)`,
      messageId: undefined
    };
    updateSetting('panels', [...settings.panels, duplicated]);
  };

  const editPanel = (panel: ReactionRolePanel) => {
    setNewPanel(panel);
    setEditingPanelId(panel.id);
    setShowPanelCreator(true);
  };

  const addRoleEmojiPair = () => {
    if (!tempRoleEmoji.roleId || !tempRoleEmoji.emoji) {
      alert('Please select a role and enter an emoji');
      return;
    }

    const pairs = newPanel.roleEmojiPairs || [];
    
    if (!settings.premium && pairs.length >= 3) {
      alert('Upgrade to premium to add more than 3 role-emoji pairs per panel!');
      return;
    }

    setNewPanel({
      ...newPanel,
      roleEmojiPairs: [...pairs, { ...tempRoleEmoji }]
    });
    setTempRoleEmoji({ roleId: '', emoji: '' });
    setShowRoleEmojiDropdown(false);
  };

  const removeRoleEmojiPair = (index: number) => {
    const pairs = newPanel.roleEmojiPairs || [];
    setNewPanel({
      ...newPanel,
      roleEmojiPairs: pairs.filter((_, i) => i !== index)
    });
  };

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || roleId;
  };

  const getChannelName = (channelId: string) => {
    return channels.find(c => c.id === channelId)?.name || channelId;
  };

  const textChannels = channels.filter(c => c.type === 0);

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Reaction Roles Page - Channels:', channels.length);
    console.log('Reaction Roles Page - Text Channels:', textChannels.length);
  }

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] flex flex-col md:flex-row">
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
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-200">
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
              <span className="flex items-center gap-3"><img src="/settings.png" alt="" className="w-5 h-5" />Settings</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/general`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  General
                </Link>
                <Link href={`/servers/${gid}/setup`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
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
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/configuration/automod`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Automod
                </Link>
                <Link href={`/servers/${gid}/configuration/logging`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Logging
                </Link>
                <Link href={`/servers/${gid}/configuration/anti-raid`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Anti-Raid
                </Link>
                <Link href={`/servers/${gid}/configuration/reaction-roles`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Reaction Roles
                </Link>
                <Link href={`/servers/${gid}/configuration/verification`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Verification
                </Link>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3"><img src="/modules.png" alt="" className="w-5 h-5" />Modules</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/modules/moderation`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Moderation
                </Link>
                <Link href={`/servers/${gid}/modules/role-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Role Management
                </Link>
                <Link href={`/servers/${gid}/modules/member-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Member Management
                </Link>
                <Link href={`/servers/${gid}/modules/announcements`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Announcements
                </Link>
                <Link href={`/servers/${gid}/modules/notifications`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Welcome Messages
                </Link>
                <Link href={`/servers/${gid}/modules/fun`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Fun
                </Link>
                <Link href={`/servers/${gid}/modules/utilities`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      <main className="flex-1 ml-0 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">CONFIGURATION</p>
            <h1 className="text-3xl font-bold">Reaction Roles</h1>
          </div>

          {/* Master Toggle Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Reaction Role System</h2>
                <p className="text-sm text-slate-500">Allow users to assign roles by reacting to messages</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
              />
            </div>
          </div>

          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="space-y-6">
                {/* Panels Management */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[#0f172a]">Reaction Role Panels</h3>
                    {!settings.premium && settings.panels.length >= 1 ? (
                      <button
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition text-sm flex items-center gap-2"
                      >
                        <img src="/premium-icon.svg" alt="Premium" className="w-4 h-4" />
                        Upgrade for More Panels
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowPanelCreator(true);
                          setEditingPanelId(null);
                          setNewPanel({
                            title: '',
                            description: '',
                            color: '#5865F2',
                            channelId: '',
                            panelType: 'multiple',
                            roleEmojiPairs: []
                          });
                        }}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition text-sm"
                      >
                        + Create Panel
                      </button>
                    )}
                  </div>

                  {/* Panel Creator/Editor Modal */}
                  {showPanelCreator && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                          <h3 className="text-xl font-bold text-[#0f172a]">
                            {editingPanelId ? 'Edit Panel' : 'Create Panel'}
                          </h3>
                          <button
                            onClick={() => {
                              setShowPanelCreator(false);
                              setEditingPanelId(null);
                              setNewPanel({
                                title: '',
                                description: '',
                                color: '#5865F2',
                                channelId: '',
                                panelType: 'multiple',
                                roleEmojiPairs: []
                              });
                            }}
                            className="text-slate-400 hover:text-slate-600 text-2xl"
                          >
                            ×
                          </button>
                        </div>

                        <div className="p-6 space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Panel Title <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={newPanel.title || ''}
                              onChange={(e) => setNewPanel({ ...newPanel, title: e.target.value })}
                              placeholder="e.g., Choose Your Roles"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
                            <textarea
                              value={newPanel.description || ''}
                              onChange={(e) => setNewPanel({ ...newPanel, description: e.target.value })}
                              placeholder="React with an emoji to get a role!"
                              rows={3}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Embed Color</label>
                            <div className="flex gap-3 items-center">
                              <input
                                type="text"
                                value={newPanel.color || '#5865F2'}
                                onChange={(e) => setNewPanel({ ...newPanel, color: e.target.value })}
                                placeholder="#5865F2"
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                              <input
                                type="color"
                                value={newPanel.color || '#5865F2'}
                                onChange={(e) => setNewPanel({ ...newPanel, color: e.target.value })}
                                className="w-24 h-11 border border-slate-200 rounded-lg cursor-pointer"
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Enter hex color code</p>
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Channel <span className="text-red-500">*</span></label>
                            <button
                              onClick={() => setShowPanelChannelDropdown(!showPanelChannelDropdown)}
                              className="w-full px-4 py-3 border-2 border-dashed border-orange-400 rounded-lg text-sm text-left hover:border-orange-500 transition bg-white text-orange-600 font-medium"
                            >
                              {newPanel.channelId ? `# ${getChannelName(newPanel.channelId)}` : '+ Select Channel'}
                            </button>
                            {showPanelChannelDropdown && (
                              <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {textChannels.map(channel => (
                                  <button
                                    key={channel.id}
                                    onClick={() => {
                                      setNewPanel({ ...newPanel, channelId: channel.id });
                                      setShowPanelChannelDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm transition"
                                  >
                                    # {channel.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Panel Type</label>
                            <select
                              value={newPanel.panelType || 'multiple'}
                              onChange={(e) => setNewPanel({ ...newPanel, panelType: e.target.value as any })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="single">Single Role (user can only have one role from this panel)</option>
                              <option value="multiple">Multiple Roles (user can have multiple roles)</option>
                              <option value="remove-on-unreact">Remove on Unreact (remove role when user unreacts)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Role-Emoji Pairs <span className="text-red-500">*</span></label>
                            <div className="space-y-2 mb-3">
                              {(newPanel.roleEmojiPairs || []).map((pair, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                  <span className="text-xl">{pair.emoji}</span>
                                  <span className="text-sm font-medium flex-1">{getRoleName(pair.roleId)}</span>
                                  <button
                                    onClick={() => removeRoleEmojiPair(index)}
                                    className="text-red-500 hover:text-red-600 text-sm font-semibold"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>

                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                              <div className="relative">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Role</label>
                                <button
                                  onClick={() => setShowRoleEmojiDropdown(!showRoleEmojiDropdown)}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-left hover:border-slate-300 transition"
                                >
                                  {tempRoleEmoji.roleId ? getRoleName(tempRoleEmoji.roleId) : 'Choose a role...'}
                                </button>
                                {showRoleEmojiDropdown && (
                                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {roles.map(role => (
                                      <button
                                        key={role.id}
                                        onClick={() => {
                                          setTempRoleEmoji({ ...tempRoleEmoji, roleId: role.id });
                                          setShowRoleEmojiDropdown(false);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm transition"
                                      >
                                        {role.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Emoji</label>
                                <input
                                  type="text"
                                  value={tempRoleEmoji.emoji}
                                  onChange={(e) => setTempRoleEmoji({ ...tempRoleEmoji, emoji: e.target.value })}
                                  placeholder="Enter emoji (e.g., 🎉)"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                              </div>

                              <button
                                onClick={addRoleEmojiPair}
                                disabled={!settings.premium && (newPanel.roleEmojiPairs || []).length >= 3}
                                className={`w-full px-4 py-2.5 font-semibold rounded-lg transition text-sm flex items-center justify-center gap-2 ${
                                  !settings.premium && (newPanel.roleEmojiPairs || []).length >= 3
                                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                              >
                                <span className="text-lg">+</span> {!settings.premium && (newPanel.roleEmojiPairs || []).length >= 3 ? 'Premium Required for More' : 'Add Pair'}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex items-center gap-3">
                          <button
                            onClick={() => {
                              setShowPanelCreator(false);
                              setEditingPanelId(null);
                              setNewPanel({
                                title: '',
                                description: '',
                                color: '#5865F2',
                                channelId: '',
                                panelType: 'multiple',
                                roleEmojiPairs: []
                              });
                            }}
                            className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={editingPanelId ? updatePanel : addPanel}
                            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                          >
                            {editingPanelId ? 'Update Panel' : 'Create Panel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Panels List */}
                  <div className="space-y-3">
                    {settings.panels.length === 0 ? (
                      <div className="p-8 text-center border-2 border-dashed border-orange-200 rounded-lg">
                        <p className="text-slate-500">No panels created yet. Create your first reaction role panel!</p>
                      </div>
                    ) : (
                      settings.panels.map(panel => (
                        <div key={panel.id} className="p-4 border border-orange-200 rounded-lg space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: panel.color }}
                                />
                                <h4 className="font-semibold text-slate-800">{panel.title}</h4>
                              </div>
                              {panel.description && (
                                <p className="text-sm text-slate-600 mt-1">{panel.description}</p>
                              )}
                              <p className="text-xs text-slate-500 mt-2">
                                Channel: <span className="font-medium"># {getChannelName(panel.channelId)}</span> | 
                                Type: <span className="font-medium">{panel.panelType}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => editPanel(panel)}
                                className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => duplicatePanel(panel)}
                                disabled={!settings.premium && settings.panels.length >= 1}
                                className={`px-3 py-1 text-sm font-medium rounded transition ${
                                  !settings.premium && settings.panels.length >= 1
                                    ? 'text-slate-400 bg-slate-100 cursor-not-allowed'
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                              >
                                Clone
                              </button>
                              <button
                                onClick={() => deletePanel(panel.id)}
                                className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {panel.roleEmojiPairs.map((pair, idx) => (
                              <div key={idx} className="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center gap-2">
                                <span>{pair.emoji}</span>
                                <span className="font-medium">{getRoleName(pair.roleId)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Role Assignment Settings */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Role Assignment Settings</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Role Limit Per User</label>
                      <input 
                        type="number" 
                        value={settings.roleLimit} 
                        onChange={(e) => updateSetting('roleLimit', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                        min="0"
                      />
                      <p className="text-xs text-slate-500">Maximum roles from a single panel (0 = unlimited)</p>
                    </div>

                    <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Required Role</label>
                      <button
                        onClick={() => setShowRequiredRoleDropdown(!showRequiredRoleDropdown)}
                        className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                      >
                        {settings.requiredRole ? getRoleName(settings.requiredRole) : '+ Select Role (Optional)'}
                      </button>
                      {showRequiredRoleDropdown && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <button
                            onClick={() => {
                              updateSetting('requiredRole', null);
                              setShowRequiredRoleDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition text-slate-500"
                          >
                            None
                          </button>
                          {roles.map(role => (
                            <button
                              key={role.id}
                              onClick={() => {
                                updateSetting('requiredRole', role.id);
                                setShowRequiredRoleDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                            >
                              {role.name}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-slate-500">Users need this role to access reaction roles</p>
                    </div>
                  </div>

                  <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Blacklisted Roles</label>
                    <div className="space-y-2">
                      {settings.blacklistedRoles.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          {settings.blacklistedRoles.map(roleId => (
                            <div key={roleId} className="px-3 py-1 bg-white border border-slate-300 rounded-full text-sm flex items-center gap-2">
                              <span className="font-medium">{getRoleName(roleId)}</span>
                              <button
                                onClick={() => updateSetting('blacklistedRoles', settings.blacklistedRoles.filter(r => r !== roleId))}
                                className="text-red-500 hover:text-red-600 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => setShowBlacklistDropdown(!showBlacklistDropdown)}
                        className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                      >
                        + Add Blacklisted Role
                      </button>
                      {showBlacklistDropdown && (
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {roles.filter(r => !settings.blacklistedRoles.includes(r.id)).map(role => (
                            <button
                              key={role.id}
                              onClick={() => {
                                updateSetting('blacklistedRoles', [...settings.blacklistedRoles, role.id]);
                                setShowBlacklistDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                            >
                              {role.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">Users with these roles cannot access reaction roles</p>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">Allow Role Stacking</p>
                      <p className="text-xs text-slate-500">Can user have multiple roles from same panel</p>
                    </div>
                    <Switch 
                      checked={settings.allowRoleStacking} 
                      onCheckedChange={(checked) => updateSetting('allowRoleStacking', checked)}
                    />
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Advanced Options</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Auto-delete Reactions</p>
                        <p className="text-xs text-slate-500">Remove user's reaction after role is assigned</p>
                      </div>
                      <Switch 
                        checked={settings.autoDeleteReactions} 
                        onCheckedChange={(checked) => updateSetting('autoDeleteReactions', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">DM on Role Change</p>
                        <p className="text-xs text-slate-500">Send user a DM when role is added/removed</p>
                      </div>
                      <Switch 
                        checked={settings.dmOnRoleChange} 
                        onCheckedChange={(checked) => updateSetting('dmOnRoleChange', checked)}
                      />
                    </div>

                    {settings.dmOnRoleChange && (
                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">DM Message</label>
                        <textarea
                          value={settings.dmMessage}
                          onChange={(e) => updateSetting('dmMessage', e.target.value)}
                          placeholder="You have been given the {role} role!"
                          rows={2}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                        />
                        <p className="text-xs text-slate-500">Use {'{role}'} as placeholder for role name</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Role Persistence</p>
                        <p className="text-xs text-slate-500">Re-add roles if user leaves and rejoins</p>
                      </div>
                      <Switch 
                        checked={settings.rolePersistence} 
                        onCheckedChange={(checked) => updateSetting('rolePersistence', checked)}
                      />
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Reaction Cooldown</label>
                      <input 
                        type="number" 
                        value={settings.reactionCooldown} 
                        onChange={(e) => updateSetting('reactionCooldown', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                        min="0"
                      />
                      <p className="text-xs text-slate-500">Seconds between reactions (0 = no cooldown)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
