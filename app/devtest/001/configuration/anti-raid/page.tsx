'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import DebugInfoPopup from '@/components/DebugInfoPopup';
import DeveloperTools from '@/components/DeveloperTools';

export default function AntiRaidDemo() {
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);

  const [settings, setSettings] = useState({
    enabled: true,
    protectionLevel: 'medium' as 'low' | 'medium' | 'high' | 'extreme' | 'custom',
    accountAge: 600000, // 10 minutes
    joinRateLimit: 5,
    joinRateWindow: 60000, // 1 minute
    verificationLevel: 1,
    autoKickNewAccounts: true,
    kickOnRateExceeded: true,
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

  const formatAccountAge = (ms: number) => {
    const minutes = ms / 60000;
    const hours = minutes / 60;
    const days = hours / 24;
    if (days >= 1) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours >= 1) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  const PROTECTION_LEVELS = {
    low: { accountAge: 300000, joinRateLimit: 10, description: '5 min account age, 10 joins/min' },
    medium: { accountAge: 600000, joinRateLimit: 5, description: '10 min account age, 5 joins/min' },
    high: { accountAge: 1800000, joinRateLimit: 3, description: '30 min account age, 3 joins/min' },
    extreme: { accountAge: 86400000, joinRateLimit: 2, description: '24 hour account age, 2 joins/min' },
  };

  const applyProtectionLevel = (level: 'low' | 'medium' | 'high' | 'extreme') => {
    const preset = PROTECTION_LEVELS[level];
    setSettings({
      ...settings,
      protectionLevel: level,
      accountAge: preset.accountAge,
      joinRateLimit: preset.joinRateLimit,
    });
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
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left bg-orange-50 text-orange-600 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
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
          <h1 className="text-lg font-bold text-slate-900">Anti-Raid Configuration</h1>
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
              <h1 className="text-4xl font-bold text-[#0f172a]">Anti-Raid Protection</h1>
            </div>

            {/* Master Toggle Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 space-y-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0f172a]">Anti-Raid System</h2>
                  <p className="text-sm text-slate-500">Protect your server from raid attacks</p>
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
                {/* Info Box about Alert Channel */}
                <div className="p-5 rounded-lg border border-blue-200 bg-blue-50 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-900">Anti-Raid Alert Channel</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Anti-raid alerts are configured on the Logging page under the configuration section.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Display Card */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#0f172a]">Current Status</h2>
                    <p className="text-sm text-slate-500">Monitor your anti-raid system status</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Protection Level</p>
                      <p className="text-2xl font-bold text-orange-600 mt-1 capitalize">{settings.protectionLevel}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Account Age</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{formatAccountAge(settings.accountAge)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Join Rate Limit</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{settings.joinRateLimit}/min</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Status</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">Active</p>
                    </div>
                  </div>
                </div>

                {/* Protection Level */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#0f172a]">Protection Level</h2>
                    <p className="text-sm text-slate-500">Choose a preset or customize your own settings</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {(['low', 'medium', 'high', 'extreme', 'custom'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => level !== 'custom' && applyProtectionLevel(level)}
                        disabled={level === 'custom'}
                        className={`p-4 rounded-lg border-2 transition text-left ${
                          settings.protectionLevel === level
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-slate-200 hover:border-slate-300'
                        } ${level === 'custom' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <p className="font-bold text-sm text-slate-800 capitalize">{level}</p>
                        {level !== 'custom' && (
                          <p className="text-xs text-slate-600 mt-1">{PROTECTION_LEVELS[level].description}</p>
                        )}
                        {level === 'custom' && (
                          <p className="text-xs text-slate-600 mt-1">Manual settings</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anti-Raid Settings */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 mb-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-[#0f172a]">Anti-Raid Settings</h2>
                    <p className="text-sm text-slate-500">Configure detection thresholds</p>
                  </div>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Minimum Account Age</label>
                        <input
                          type="number"
                          value={settings.accountAge / 60000}
                          onChange={(e) => updateSetting('accountAge', parseInt(e.target.value) * 60000)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Minutes - Accounts younger than this will be flagged</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Join Rate Limit</label>
                        <input
                          type="number"
                          value={settings.joinRateLimit}
                          onChange={(e) => updateSetting('joinRateLimit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Maximum joins per minute before triggering protection</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Join Rate Window</label>
                        <input
                          type="number"
                          value={settings.joinRateWindow / 1000}
                          onChange={(e) => updateSetting('joinRateWindow', parseInt(e.target.value) * 1000)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        />
                        <p className="text-xs text-slate-500">Seconds - Time window to check join rate</p>
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Verification Level</label>
                        <select
                          value={settings.verificationLevel}
                          onChange={(e) => updateSetting('verificationLevel', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                        >
                          <option value={0}>None</option>
                          <option value={1}>Low</option>
                          <option value={2}>Medium</option>
                          <option value={3}>High</option>
                          <option value={4}>Highest</option>
                        </select>
                        <p className="text-xs text-slate-500">Discord verification level requirement</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Auto-Kick New Accounts</p>
                          <p className="text-xs text-slate-500 mt-1">Automatically kick accounts below minimum age</p>
                        </div>
                        <Switch
                          checked={settings.autoKickNewAccounts}
                          onCheckedChange={(checked) => updateSetting('autoKickNewAccounts', checked)}
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Kick on Rate Exceeded</p>
                          <p className="text-xs text-slate-500 mt-1">Kick new members when join rate is exceeded</p>
                        </div>
                        <Switch
                          checked={settings.kickOnRateExceeded}
                          onCheckedChange={(checked) => updateSetting('kickOnRateExceeded', checked)}
                        />
                      </div>
                    </div>
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
