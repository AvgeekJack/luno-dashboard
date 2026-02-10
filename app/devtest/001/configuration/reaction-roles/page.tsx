'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import DebugInfoPopup from '@/components/DebugInfoPopup';
import DeveloperTools from '@/components/DeveloperTools';

interface ReactionRolePanel {
  id: string;
  title: string;
  description: string;
  color: string;
  channelId: string;
  panelType: 'single' | 'multiple' | 'remove-on-unreact';
  roleEmojiPairs: Array<{ roleId: string; emoji: string; }>;
}

export default function ReactionRolesDemo() {
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);
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

  // Demo channel and role data
  const demoChannels = [
    { id: '123456789', name: 'role-select' },
    { id: '987654321', name: 'self-roles' },
    { id: '456789123', name: 'general' },
  ];

  const demoRoles = [
    { id: 'role1', name: 'Member', color: '#5865F2' },
    { id: 'role2', name: 'Gamer', color: '#3BA55D' },
    { id: 'role3', name: 'Artist', color: '#FAA81A' },
    { id: 'role4', name: 'Developer', color: '#ED4245' },
    { id: 'role5', name: 'VIP', color: '#9B59B6' },
  ];

  const [settings, setSettings] = useState({
    enabled: true,
    panels: [
      {
        id: '1',
        title: 'Choose Your Gaming Roles',
        description: 'React to get notified about your favorite games!',
        color: '#5865F2',
        channelId: '123456789',
        panelType: 'multiple' as const,
        roleEmojiPairs: [
          { roleId: 'role2', emoji: '🎮' },
          { roleId: 'role3', emoji: '🎨' },
        ]
      },
      {
        id: '2',
        title: 'Community Roles',
        description: 'Select roles that describe you best',
        color: '#3BA55D',
        channelId: '987654321',
        panelType: 'multiple' as const,
        roleEmojiPairs: [
          { roleId: 'role4', emoji: '💻' },
          { roleId: 'role5', emoji: '⭐' },
        ]
      },
      {
        id: '3',
        title: 'Notification Preferences',
        description: 'Choose which updates you want to receive',
        color: '#FAA81A',
        channelId: '123456789',
        panelType: 'single' as const,
        roleEmojiPairs: [
          { roleId: 'role1', emoji: '🔔' },
        ]
      },
    ] as ReactionRolePanel[],
    roleLimit: 0,
    requiredRole: null as string | null,
    blacklistedRoles: [] as string[],
    allowRoleStacking: true,
    autoDeleteReactions: false,
    dmOnRoleChange: true,
    dmMessage: 'You have been given the {role} role!',
    rolePersistence: true,
    reactionCooldown: 5,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved (Demo mode)');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const getChannelName = (channelId: string) => {
    return demoChannels.find(c => c.id === channelId)?.name || 'Unknown';
  };

  const getRoleName = (roleId: string) => {
    return demoRoles.find(r => r.id === roleId)?.name || 'Unknown';
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
    alert('Panel created successfully!');
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
              href="/devtest/001" 
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
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => {alert('Demo mode: Settings pages not available'); setMobileMenuOpen(false);}}
                  >
                    General
                  </div>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => {alert('Demo mode: Settings pages not available'); setMobileMenuOpen(false);}}
                  >
                    Setup
                  </div>
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
                    href="/devtest/001/configuration/automod"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Automod
                  </Link>
                  <Link 
                    href="/devtest/001/configuration/logging"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logging
                  </Link>
                  <Link 
                    href="/devtest/001/configuration/anti-raid"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Anti-Raid
                  </Link>
                  <Link 
                    href="/devtest/001/configuration/reaction-roles"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left bg-orange-50 text-orange-600 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reaction Roles
                  </Link>
                  <Link 
                    href="/devtest/001/configuration/verification"
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
                    href="/devtest/001/modules/moderation"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Moderation
                  </Link>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => {alert('Demo mode: Role Management page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Role Management
                  </div>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => {alert('Demo mode: Member Management page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Member Management
                  </div>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => {alert('Demo mode: Announcements page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Announcements
                  </div>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => {alert('Demo mode: Welcome Messages page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Welcome Messages
                  </div>
                  <Link 
                    href="/devtest/001/modules/fun"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '250ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fun
                  </Link>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '300ms'}}
                    onClick={() => {alert('Demo mode: Utilities page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Utilities
                  </div>
                </div>
              )}
            </details>
          </nav>
          
          {/* Debug & Developer Tools - Desktop only */}
          <div className="px-4 py-4 mt-auto space-y-3 hidden lg:block">
            <button
              onClick={() => setShowDebugInfo(true)}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              🐛 Debug Info
              <span className="text-xs bg-orange-900 px-2 py-1 rounded">DEMO</span>
            </button>
            <button
              onClick={() => setShowDeveloperTools(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              ⚡ Developer Tools
            </button>
            <p className="text-center text-orange-600 text-xs font-semibold mt-2">
              🚀 DEMO MODE ACTIVE
            </p>
          </div>
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
          <div className="lg:ml-64 pt-20 lg:pt-12 px-4 md:px-6 lg:px-8 py-12 max-w-5xl mx-auto">
            {/* Demo Warning Banner */}
            <div className="mb-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded-lg">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold text-orange-800">Demo Mode Active</p>
                  <p className="text-sm text-orange-700">This is a demonstration page. No real data will be saved.</p>
                </div>
              </div>
            </div>

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
                                  onClick={() => alert('Demo mode: Editing not available')}
                                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => alert('Demo mode: Deletion not available')}
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
                          onChange={(e) => updateSetting('roleLimit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Maximum roles per user (0 = unlimited)</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Reaction Cooldown</label>
                        <input
                          type="number"
                          value={settings.reactionCooldown}
                          onChange={(e) => updateSetting('reactionCooldown', parseInt(e.target.value))}
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
                          {demoRoles.map(role => (
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
                          onClick={() => alert('Demo mode: Role selection not available')}
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

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition-colors shadow-lg"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>

            {/* Debug & Developer Tools - Mobile only */}
            <div className="lg:hidden mt-8 space-y-3">
              <button
                onClick={() => setShowDebugInfo(true)}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                🐛 Debug Info
                <span className="text-xs bg-orange-900 px-2 py-1 rounded">DEMO</span>
              </button>
              <button
                onClick={() => setShowDeveloperTools(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                ⚡ Developer Tools
              </button>
            </div>
          </div>
        </div>

      {/* Popups */}
      <DebugInfoPopup isOpen={showDebugInfo} onClose={() => setShowDebugInfo(false)} />
      <DeveloperTools isOpen={showDeveloperTools} onClose={() => setShowDeveloperTools(false)} />

      {/* Create Panel Modal */}
      {showCreatePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Create Panel</h2>
              <button
                onClick={() => setShowCreatePanel(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Color and Channel Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Panel Color */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Panel Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newPanel.color}
                      onChange={(e) => setNewPanel({ ...newPanel, color: e.target.value })}
                      className="w-16 h-10 rounded border border-slate-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newPanel.color}
                      onChange={(e) => setNewPanel({ ...newPanel, color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Channel Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Channel <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPanel.channelId}
                    onChange={(e) => setNewPanel({ ...newPanel, channelId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select a channel</option>
                    {demoChannels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        #{channel.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Panel Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Panel Type
                </label>
                <select
                  value={newPanel.panelType}
                  onChange={(e) => setNewPanel({ ...newPanel, panelType: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="single">Single - Users can only select one role</option>
                  <option value="multiple">Multiple - Users can select multiple roles</option>
                  <option value="remove-on-unreact">Remove on Unreact - Role removed when reaction is removed</option>
                </select>
              </div>

              {/* Role-Emoji Pairs */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-slate-800">
                    Role-Emoji Pairs <span className="text-red-500">*</span>
                  </label>
                  <button
                    onClick={addRoleEmojiPair}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded transition"
                  >
                    + Add Pair
                  </button>
                </div>

                {newPanel.roleEmojiPairs.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-500">
                    No role-emoji pairs added yet. Click "Add Pair" to get started.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {newPanel.roleEmojiPairs.map((pair, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <select
                            value={pair.roleId}
                            onChange={(e) => updateRoleEmojiPair(index, 'roleId', e.target.value)}
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select role</option>
                            {demoRoles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={pair.emoji}
                            onChange={(e) => updateRoleEmojiPair(index, 'emoji', e.target.value)}
                            placeholder="Emoji (e.g., 🎮)"
                            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <button
                          onClick={() => removeRoleEmojiPair(index)}
                          className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Demo Mode</p>
                    <p>This panel will be created in demo mode only. In production, the panel would be sent to Discord and persisted to the database.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreatePanel(false)}
                className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePanel}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
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
