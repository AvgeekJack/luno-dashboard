'use client';

import { useState } from 'react';
import Link from 'next/link';
import DebugInfoPopup from '@/components/DebugInfoPopup';
import DeveloperTools from '@/components/DeveloperTools';

export default function FunDemo() {
  const [commands, setCommands] = useState({
    meme: true,
    joke: true,
    roll: true,
    flip: true,
    eightball: true,
    quote: false,
    gif: true,
    cat: true,
    dog: true,
  });

  const [saving, setSaving] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);

  const toggleCommand = (key: keyof typeof commands) => {
    setCommands({ ...commands, [key]: !commands[key] });
  };

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
      <aside className={`fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-orange-100 shadow-lg lg:shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => {alert('Demo mode: Anti-Raid page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Anti-Raid
                  </div>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => {alert('Demo mode: Reaction Roles page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Reaction Roles
                  </div>
                  <div 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left cursor-pointer hover:bg-gray-100 ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => {alert('Demo mode: Verification page not available yet'); setMobileMenuOpen(false);}}
                  >
                    Verification
                  </div>
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
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left bg-orange-50 text-orange-600 ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
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
          <h1 className="text-lg font-bold text-slate-900">Fun Module</h1>
          <div className="w-8"></div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
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

        {/* Fun Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Meme Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">😂</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!meme</h3>
                  <p className="text-xs text-slate-500">Random memes</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('meme')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.meme ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.meme ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Gets a random meme from popular subreddits</p>
          </div>

          {/* Joke Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤣</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!joke</h3>
                  <p className="text-xs text-slate-500">Random jokes</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('joke')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.joke ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.joke ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Tells a random joke to lighten the mood</p>
          </div>

          {/* Roll Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎲</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!roll</h3>
                  <p className="text-xs text-slate-500">Dice roller</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('roll')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.roll ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.roll ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Roll dice with custom sides (1-100)</p>
          </div>

          {/* Flip Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🪙</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!flip</h3>
                  <p className="text-xs text-slate-500">Coin flip</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('flip')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.flip ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.flip ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Flip a coin - heads or tails</p>
          </div>

          {/* 8ball Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!8ball</h3>
                  <p className="text-xs text-slate-500">Magic 8-ball</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('eightball')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.eightball ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.eightball ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Ask the magic 8-ball a question</p>
          </div>

          {/* Quote Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💭</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!quote</h3>
                  <p className="text-xs text-slate-500">Inspirational quotes</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('quote')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.quote ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.quote ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Get an inspirational quote</p>
          </div>

          {/* GIF Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!gif</h3>
                  <p className="text-xs text-slate-500">Search GIFs</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('gif')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.gif ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.gif ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Search and post GIFs from Tenor</p>
          </div>

          {/* Cat Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🐱</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!cat</h3>
                  <p className="text-xs text-slate-500">Random cat pics</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('cat')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  commands.cat ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.cat ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Get random cat pictures</p>
          </div>

          {/* Dog Command */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🐶</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">!dog</h3>
                  <p className="text-xs text-slate-500">Random dog pics</p>
                </div>
              </div>
              <button
                onClick={() => toggleCommand('dog')}
                className={`relative inline-flex h-6 w-11 items-centers rounded-full transition-colors ${
                  commands.dog ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    commands.dog ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-slate-600">Get random dog pictures</p>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Command Usage (Last 7 Days)</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Most Used Command</span>
              <span className="text-sm font-semibold text-slate-900">!meme (342 uses)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Total Fun Commands</span>
              <span className="text-sm font-semibold text-slate-900">1,247 uses</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Most Active Hour</span>
              <span className="text-sm font-semibold text-slate-900">8:00 PM - 9:00 PM</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
            </div>
          </div>
        </div>

        {/* Debug Info Popup */}
        <DebugInfoPopup isOpen={showDebugInfo} onClose={() => setShowDebugInfo(false)} />
        <DeveloperTools isOpen={showDeveloperTools} onClose={() => setShowDeveloperTools(false)} />
      </div>
    );
  }
