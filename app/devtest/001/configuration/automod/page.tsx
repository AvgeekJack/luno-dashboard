'use client';

import { useState } from 'react';
import Link from 'next/link';
import DebugInfoPopup from '@/components/DebugInfoPopup';
import DeveloperTools from '@/components/DeveloperTools';

export default function AutomodDemo() {
  // State Management
  const [enabled, setEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);

  // All Automod Settings (47+ settings)
  const [antiLinkEnabled, setAntiLinkEnabled] = useState(false);
  const [antiInviteEnabled, setAntiInviteEnabled] = useState(true);
  const [antiSpamEnabled, setAntiSpamEnabled] = useState(true);
  const [antiMentionEnabled, setAntiMentionEnabled] = useState(true);
  const [antiFloodEnabled, setAntiFloodEnabled] = useState(true);
  const [antiZalgoEnabled, setAntiZalgoEnabled] = useState(false);
  const [antiSwearEnabled, setAntiSwearEnabled] = useState(true);
  const [capsFilterEnabled, setCapsFilterEnabled] = useState(false);

  // Threshold Settings
  const [spamMessageCount, setSpamMessageCount] = useState(5);
  const [spamTimeWindow, setSpamTimeWindow] = useState(5);
  const [mentionLimit, setMentionLimit] = useState(5);
  const [capsPercentage, setCapsPercentage] = useState(70);
  const [floodMessageCount, setFloodMessageCount] = useState(3);
  const [floodTimeWindow, setFloodTimeWindow] = useState(2);
  const [zalgoLimit, setZalgoLimit] = useState(10);

  // Whitelist Settings
  const [whitelistedChannels, setWhitelistedChannels] = useState<string[]>([]);
  const [whitelistedRoles, setWhitelistedRoles] = useState<string[]>([]);
  const [autoWhitelistModerators, setAutoWhitelistModerators] = useState(true);

  // Action Settings
  const [deleteMessage, setDeleteMessage] = useState(true);
  const [sendWarning, setSendWarning] = useState(true);
  const [warningDuration, setWarningDuration] = useState(5);
  const [dmUser, setDmUser] = useState(true);

  // Auto-Timeout Settings
  const [autoTimeoutEnabled, setAutoTimeoutEnabled] = useState(false);
  const [autoTimeoutViolations, setAutoTimeoutViolations] = useState(3);
  const [autoTimeoutWindow, setAutoTimeoutWindow] = useState(60);
  const [autoTimeoutDuration, setAutoTimeoutDuration] = useState(300);

  // Premium Setting
  const [escalatingPunishments, setEscalatingPunishments] = useState(false);
  const premium = false; // Demo mode is not premium

  // Demo Data
  const channels = [
    { id: '123456789', name: 'general' },
    { id: '987654321', name: 'announcements' },
    { id: '456789123', name: 'staff-chat' },
    { id: '789123456', name: 'bot-commands' }
  ];

  const roles = [
    { id: '111111111', name: 'Admin' },
    { id: '222222222', name: 'Moderator' },
    { id: '333333333', name: 'Member' },
    { id: '444444444', name: 'VIP' }
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved (Demo mode)');
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
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left bg-orange-50 text-orange-600 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
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
          <h1 className="text-lg font-bold text-slate-900">Automod Configuration</h1>
          <div className="w-8"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
        {/* Demo Mode Warning Banner */}
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                🚀 <strong>Demo Mode:</strong> Changes are not saved to a real server
              </p>
            </div>
          </div>
        </div>

        {/* Automod Configuration Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Automod Configuration</h2>
              <p className="text-sm text-slate-600 mt-1">Configure automatic moderation filters and rules for your server</p>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                enabled ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">AutoMod Log Channel</p>
                  <p className="text-sm text-blue-700 mt-1">
                    AutoMod logging is now configured on the <Link href="/devtest/001/configuration/logging" className="underline hover:text-blue-800">Logging page</Link> at the top of the configuration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Features Card */}
        {enabled && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Filter Features</h2>
              <p className="text-sm text-slate-600">Enable or disable specific filter types</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Anti-Link</p>
                  <p className="text-sm text-slate-500">Block all external URLs</p>
                </div>
                <button
                  onClick={() => setAntiLinkEnabled(!antiLinkEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    antiLinkEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiLinkEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Anti-Invite</p>
                  <p className="text-sm text-slate-500">Block Discord invite links</p>
                </div>
                <button
                  onClick={() => setAntiInviteEnabled(!antiInviteEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    antiInviteEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiInviteEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Anti-Spam</p>
                  <p className="text-sm text-slate-500">Prevent rapid message sending</p>
                </div>
                <button
                  onClick={() => setAntiSpamEnabled(!antiSpamEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    antiSpamEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiSpamEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Anti-Mention</p>
                  <p className="text-sm text-slate-500">Block excessive mentions</p>
                </div>
                <button
                  onClick={() => setAntiMentionEnabled(!antiMentionEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    antiMentionEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiMentionEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Anti-Flood/Duplicate</p>
                  <p className="text-sm text-slate-500">Stop repeated messages</p>
                </div>
                <button
                  onClick={() => setAntiFloodEnabled(!antiFloodEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    antiFloodEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiFloodEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Anti-Zalgo</p>
                  <p className="text-sm text-slate-500">Block corrupted text</p>
                </div>
                <button
                  onClick={() => setAntiZalgoEnabled(!antiZalgoEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    antiZalgoEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiZalgoEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Anti-Swear/Profanity</p>
                  <p className="text-sm text-slate-500">Block bad words</p>
                </div>
                <button
                  onClick={() => setAntiSwearEnabled(!antiSwearEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    antiSwearEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      antiSwearEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Caps Filter</p>
                  <p className="text-sm text-slate-500">Block excessive capitals</p>
                </div>
                <button
                  onClick={() => setCapsFilterEnabled(!capsFilterEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    capsFilterEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      capsFilterEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Thresholds & Limits Card */}
        {enabled && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Thresholds & Limits</h2>
              <p className="text-sm text-slate-600">Configure detection sensitivity</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Spam Threshold</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Messages</label>
                    <input 
                      type="number" 
                      value={spamMessageCount} 
                      onChange={(e) => setSpamMessageCount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      min="1" 
                      max="20" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Seconds</label>
                    <input 
                      type="number" 
                      value={spamTimeWindow} 
                      onChange={(e) => setSpamTimeWindow(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      min="1" 
                      max="60" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Mention Limit</label>
                <input 
                  type="number" 
                  value={mentionLimit} 
                  onChange={(e) => setMentionLimit(parseInt(e.target.value))}
                  className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  min="1" 
                  max="50" 
                />
                <p className="text-xs text-slate-500 mt-1">Max mentions per message</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Caps Percentage</label>
                <input 
                  type="number" 
                  value={capsPercentage} 
                  onChange={(e) => setCapsPercentage(parseInt(e.target.value))}
                  className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  min="0" 
                  max="100" 
                />
                <p className="text-xs text-slate-500 mt-1">% of caps allowed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Flood/Duplicate Threshold</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Messages</label>
                    <input 
                      type="number" 
                      value={floodMessageCount} 
                      onChange={(e) => setFloodMessageCount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      min="1" 
                      max="20" 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Seconds</label>
                    <input 
                      type="number" 
                      value={floodTimeWindow} 
                      onChange={(e) => setFloodTimeWindow(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                      min="1" 
                      max="60" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Zalgo Character Limit</label>
                <input 
                  type="number" 
                  value={zalgoLimit} 
                  onChange={(e) => setZalgoLimit(parseInt(e.target.value))}
                  className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  min="0" 
                  max="100" 
                />
                <p className="text-xs text-slate-500 mt-1">Combining characters allowed</p>
              </div>
            </div>
          </div>
        )}

        {/* Whitelist System Card */}
        {enabled && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Whitelist System</h2>
              <p className="text-sm text-slate-600">Exempt channels, roles, or users</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Whitelisted Channels</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  onChange={(e) => {
                    if (e.target.value && !whitelistedChannels.includes(e.target.value)) {
                      setWhitelistedChannels([...whitelistedChannels, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">Select a channel to add...</option>
                  {channels.filter(ch => !whitelistedChannels.includes(ch.id)).map(ch => (
                    <option key={ch.id} value={ch.id}>#{ch.name}</option>
                  ))}
                </select>
                {whitelistedChannels.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {whitelistedChannels.map(chId => {
                      const channel = channels.find(c => c.id === chId);
                      return (
                        <span key={chId} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          #{channel?.name || chId}
                          <button type="button" onClick={() => setWhitelistedChannels(whitelistedChannels.filter(id => id !== chId))}
                            className="hover:text-orange-600 font-bold">✕</button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">Channels exempt from AutoMod</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Whitelisted Roles</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  onChange={(e) => {
                    if (e.target.value && !whitelistedRoles.includes(e.target.value)) {
                      setWhitelistedRoles([...whitelistedRoles, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">Select a role to add...</option>
                  {roles.filter(r => !whitelistedRoles.includes(r.id)).map(r => (
                    <option key={r.id} value={r.id}>@{r.name}</option>
                  ))}
                </select>
                {whitelistedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {whitelistedRoles.map(roleId => {
                      const role = roles.find(r => r.id === roleId);
                      return (
                        <span key={roleId} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                          @{role?.name || roleId}
                          <button type="button" onClick={() => setWhitelistedRoles(whitelistedRoles.filter(id => id !== roleId))}
                            className="hover:text-orange-600 font-bold">✕</button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-1">Roles exempt from AutoMod</p>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Auto-whitelist Moderators</p>
                  <p className="text-sm text-slate-500">Automatically exempt users with Manage Messages/Admin</p>
                </div>
                <button
                  onClick={() => setAutoWhitelistModerators(!autoWhitelistModerators)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoWhitelistModerators ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoWhitelistModerators ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Settings Card */}
        {enabled && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Action Settings</h2>
              <p className="text-sm text-slate-600">Configure how AutoMod responds to violations</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Delete Message</p>
                  <p className="text-sm text-slate-500">Automatically delete violating messages</p>
                </div>
                <button
                  onClick={() => setDeleteMessage(!deleteMessage)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    deleteMessage ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      deleteMessage ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Send Warning</p>
                  <p className="text-sm text-slate-500">Post warning message in channel</p>
                </div>
                <button
                  onClick={() => setSendWarning(!sendWarning)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sendWarning ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sendWarning ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Warning Duration</label>
                <input 
                  type="number" 
                  value={warningDuration} 
                  onChange={(e) => setWarningDuration(parseInt(e.target.value))}
                  className="w-full max-w-md px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" 
                  min="1" 
                  max="60" 
                />
                <p className="text-xs text-slate-500 mt-1">Seconds warning stays visible</p>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">DM User</p>
                  <p className="text-sm text-slate-500">Send DM notification to user</p>
                </div>
                <button
                  onClick={() => setDmUser(!dmUser)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    dmUser ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      dmUser ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Auto-Timeout</p>
                  <p className="text-sm text-slate-500">Automatically timeout after violations</p>
                </div>
                <button
                  onClick={() => setAutoTimeoutEnabled(!autoTimeoutEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoTimeoutEnabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoTimeoutEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {autoTimeoutEnabled && (
                <div className="ml-4 grid md:grid-cols-3 gap-3 p-4 rounded-lg bg-orange-50/50 border border-orange-200">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Violations</label>
                    <input type="number" value={autoTimeoutViolations} onChange={(e) => setAutoTimeoutViolations(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm" min="1" max="20" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Within (seconds)</label>
                    <input type="number" value={autoTimeoutWindow} onChange={(e) => setAutoTimeoutWindow(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm" min="1" max="3600" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">Duration (seconds)</label>
                    <input type="number" value={autoTimeoutDuration} onChange={(e) => setAutoTimeoutDuration(parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-orange-200 rounded-lg text-sm" min="60" max="2419200" />
                  </div>
                </div>
              )}

              {/* Escalating Punishments Premium Banner */}
              {!premium ? (
                <div className="relative p-6 rounded-lg bg-orange-50 border border-orange-200 overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-1">Escalating Punishments</h3>
                      <p className="text-sm text-slate-600 mb-4">Automatically increase punishment severity based on violation history</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-slate-900">Warn → Timeout → Kick → Ban progression</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-slate-900">Configurable violation thresholds</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-slate-900">Time-based violation decay</span>
                        </div>
                      </div>
                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Upgrade to Premium
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-5 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-900">Escalating Punishments</p>
                    <p className="text-sm text-slate-500">Warn → Timeout → Kick → Ban based on violations</p>
                  </div>
                  <button
                    onClick={() => setEscalatingPunishments(!escalatingPunishments)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      escalatingPunishments ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        escalatingPunishments ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>

        {/* Debug Info Popup */}
        <DebugInfoPopup isOpen={showDebugInfo} onClose={() => setShowDebugInfo(false)} />
        <DeveloperTools isOpen={showDeveloperTools} onClose={() => setShowDeveloperTools(false)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
