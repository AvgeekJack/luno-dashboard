'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import DebugInfoPopup from '@/components/DebugInfoPopup';
import DeveloperTools from '@/components/DeveloperTools';

export default function VerificationDemo() {
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);

  // Demo channel and role data
  const demoChannels = [
    { id: '123456789', name: 'verification' },
    { id: '987654321', name: 'welcome' },
    { id: '456789123', name: 'rules' },
  ];

  const demoRoles = [
    { id: 'role1', name: 'Verified', color: '#5865F2' },
    { id: 'role2', name: 'Member', color: '#3BA55D' },
    { id: 'role3', name: 'Unverified', color: '#99AAB5' },
    { id: 'role4', name: 'New Member', color: '#FAA81A' },
    { id: 'role5', name: 'Moderator', color: '#ED4245' },
  ];

  const [settings, setSettings] = useState({
    enabled: true,
    verificationMethod: 'button' as 'reaction' | 'button' | 'captcha' | 'manual',
    verificationChannel: '123456789',
    messageTitle: 'Server Verification',
    messageDescription: 'Click the button below to verify and gain access to the server!',
    messageColor: '#5865F2',
    verifiedRole: 'role1',
    unverifiedRole: 'role3',
    rulesText: 'By verifying, you agree to follow our server rules and Discord ToS.',
    accountAgeRequirement: 0,
    requireServerAgreement: true,
    multipleSteps: false,
    welcomeDM: true,
    welcomeDMMessage: 'Welcome to the server! You have been verified.',
    additionalRoles: ['role2'] as string[],
    removeVerificationMessages: true,
    antiAltProtection: true,
    kickUnverifiedAfter: 3600,
    verificationBypassRoles: ['role5'] as string[],
    verificationCooldown: 30,
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
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reaction Roles
                  </Link>
                  <Link 
                    href="/devtest/001/configuration/verification"
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left bg-orange-50 text-orange-600 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
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
          <h1 className="text-lg font-bold text-slate-900">Verification</h1>
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
              <h1 className="text-4xl font-bold text-[#0f172a]">Verification</h1>
            </div>

            {/* Master Toggle Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#0f172a]">Verification System</h2>
                  <p className="text-sm text-slate-500">Require users to verify before accessing your server</p>
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
                {/* Info Box about Verification Logs */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Verification Logging</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Verification logs are configured on the Logging page under the configuration section.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Method */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0f172a]">Verification Method</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { value: 'reaction', label: 'Reaction', desc: 'React to verify' },
                        { value: 'button', label: 'Button', desc: 'Click button to verify' },
                        { value: 'captcha', label: 'Captcha', desc: 'Solve captcha' },
                        { value: 'manual', label: 'Manual', desc: 'Staff approval' }
                      ].map((method) => (
                        <button
                          key={method.value}
                          onClick={() => updateSetting('verificationMethod', method.value)}
                          className={`p-4 rounded-lg border-2 transition text-left ${
                            settings.verificationMethod === method.value
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p className="font-bold text-sm text-slate-800">{method.label}</p>
                          <p className="text-xs text-slate-600 mt-1">{method.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Verification Configuration */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0f172a]">Verification Configuration</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Verification Channel *</label>
                        <select
                          value={settings.verificationChannel || ''}
                          onChange={(e) => updateSetting('verificationChannel', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        >
                          <option value="">Select Channel</option>
                          {demoChannels.map(channel => (
                            <option key={channel.id} value={channel.id}>#{channel.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500">Channel where verification message appears</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Verified Role *</label>
                        <select
                          value={settings.verifiedRole || ''}
                          onChange={(e) => updateSetting('verifiedRole', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        >
                          <option value="">Select Role</option>
                          {demoRoles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500">Role given upon verification</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Unverified Role</label>
                        <select
                          value={settings.unverifiedRole || ''}
                          onChange={(e) => updateSetting('unverifiedRole', e.target.value || null)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        >
                          <option value="">None (Optional)</option>
                          {demoRoles.map(role => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500">Role before verification (optional)</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Embed Color</label>
                        <input
                          type="color"
                          value={settings.messageColor}
                          onChange={(e) => updateSetting('messageColor', e.target.value)}
                          className="w-full h-10 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Message Title</label>
                      <input
                        type="text"
                        value={settings.messageTitle}
                        onChange={(e) => updateSetting('messageTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        placeholder="Server Verification"
                      />
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Message Description</label>
                      <textarea
                        value={settings.messageDescription}
                        onChange={(e) => updateSetting('messageDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        placeholder="Click the button below to verify..."
                      />
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Rules Text</label>
                      <textarea
                        value={settings.rulesText}
                        onChange={(e) => updateSetting('rulesText', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        placeholder="By verifying, you agree to..."
                      />
                      <p className="text-xs text-slate-500">Rules users must acknowledge</p>
                    </div>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#0f172a]">Advanced Settings</h2>
                    <p className="text-sm text-slate-500">Additional verification options</p>
                  </div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Account Age Requirement</label>
                        <input
                          type="number"
                          value={settings.accountAgeRequirement}
                          onChange={(e) => updateSetting('accountAgeRequirement', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Days - Minimum Discord account age (0 = disabled)</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Kick Unverified After</label>
                        <input
                          type="number"
                          value={settings.kickUnverifiedAfter}
                          onChange={(e) => updateSetting('kickUnverifiedAfter', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Seconds - Auto-kick if not verified (0 = disabled)</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Verification Cooldown</label>
                        <input
                          type="number"
                          value={settings.verificationCooldown}
                          onChange={(e) => updateSetting('verificationCooldown', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Seconds - Time between verification attempts</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Additional Roles</label>
                        <div className="text-sm text-slate-700">
                          {settings.additionalRoles.length} role(s) selected
                        </div>
                        <button
                          onClick={() => alert('Demo mode: Role selection not available')}
                          className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                        >
                          Manage Roles
                        </button>
                        <p className="text-xs text-slate-500">Extra roles given upon verification</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Verification Bypass Roles</label>
                        <div className="text-sm text-slate-700">
                          {settings.verificationBypassRoles.length} role(s) set
                        </div>
                        <button
                          onClick={() => alert('Demo mode: Role selection not available')}
                          className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                        >
                          Manage Bypass Roles
                        </button>
                        <p className="text-xs text-slate-500">Roles that skip verification</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Require Server Agreement</p>
                          <p className="text-xs text-slate-500 mt-1">Users must agree to server rules</p>
                        </div>
                        <Switch
                          checked={settings.requireServerAgreement}
                          onCheckedChange={(checked) => updateSetting('requireServerAgreement', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Multiple Steps</p>
                          <p className="text-xs text-slate-500 mt-1">Enable multi-step verification process</p>
                        </div>
                        <Switch
                          checked={settings.multipleSteps}
                          onCheckedChange={(checked) => updateSetting('multipleSteps', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Remove Verification Messages</p>
                          <p className="text-xs text-slate-500 mt-1">Delete messages after verification</p>
                        </div>
                        <Switch
                          checked={settings.removeVerificationMessages}
                          onCheckedChange={(checked) => updateSetting('removeVerificationMessages', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Anti-Alt Protection</p>
                          <p className="text-xs text-slate-500 mt-1">Detect and prevent alt accounts</p>
                        </div>
                        <Switch
                          checked={settings.antiAltProtection}
                          onCheckedChange={(checked) => updateSetting('antiAltProtection', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Welcome DM</p>
                          <p className="text-xs text-slate-500 mt-1">Send welcome message after verification</p>
                        </div>
                        <Switch
                          checked={settings.welcomeDM}
                          onCheckedChange={(checked) => updateSetting('welcomeDM', checked)}
                        />
                      </div>
                    </div>

                    {settings.welcomeDM && (
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Welcome DM Message</label>
                        <textarea
                          value={settings.welcomeDMMessage}
                          onChange={(e) => updateSetting('welcomeDMMessage', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                          placeholder="Welcome message sent to user..."
                        />
                        <p className="text-xs text-slate-500">Message sent to verified users</p>
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
    </div>
  );
}
