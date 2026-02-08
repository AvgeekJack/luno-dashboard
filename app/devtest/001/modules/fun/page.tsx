'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50 text-[#0f172a]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/devtest/001" className="text-orange-600 hover:text-orange-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Fun Module</h1>
              <p className="text-sm text-slate-600">Entertainment commands for your server</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
  );
}
