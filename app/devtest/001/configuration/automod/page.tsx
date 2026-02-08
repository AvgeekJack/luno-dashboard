'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AutomodDemo() {
  const [enabled, setEnabled] = useState(true);
  const [antiSpam, setAntiSpam] = useState(true);
  const [antiLinks, setAntiLinks] = useState(false);
  const [antiInvites, setAntiInvites] = useState(true);
  const [filterWords, setFilterWords] = useState(true);
  const [wordList, setWordList] = useState('badword1, badword2, badword3');
  const [maxMentions, setMaxMentions] = useState('5');
  const [saving, setSaving] = useState(false);

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
              <h1 className="text-2xl font-bold text-slate-900">Automod Configuration</h1>
              <p className="text-sm text-slate-600">Automated moderation settings for your server</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Enable/Disable Automod */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Enable Automod</h2>
              <p className="text-sm text-slate-600 mt-1">Turn automated moderation on or off</p>
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
        </div>

        {/* Automod Features */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Protection Features</h2>
          
          <div className="space-y-6">
            {/* Anti-Spam */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Anti-Spam Protection</h3>
                <p className="text-sm text-slate-600 mt-1">Prevent users from spamming messages</p>
              </div>
              <button
                onClick={() => setAntiSpam(!antiSpam)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  antiSpam ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    antiSpam ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Anti-Links */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Block External Links</h3>
                <p className="text-sm text-slate-600 mt-1">Prevent posting of external URLs</p>
              </div>
              <button
                onClick={() => setAntiLinks(!antiLinks)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  antiLinks ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    antiLinks ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Anti-Invites */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Block Server Invites</h3>
                <p className="text-sm text-slate-600 mt-1">Prevent posting of Discord invite links</p>
              </div>
              <button
                onClick={() => setAntiInvites(!antiInvites)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  antiInvites ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    antiInvites ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Word Filter */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Profanity Filter</h3>
                <p className="text-sm text-slate-600 mt-1">Block messages containing blacklisted words</p>
              </div>
              <button
                onClick={() => setFilterWords(!filterWords)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  filterWords ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    filterWords ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Advanced Settings</h2>
          
          <div className="space-y-6">
            {/* Word Blacklist */}
            {filterWords && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Blacklisted Words (comma-separated)
                </label>
                <textarea
                  value={wordList}
                  onChange={(e) => setWordList(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="word1, word2, word3"
                />
                <p className="text-xs text-slate-500 mt-2">Messages containing these words will be automatically deleted</p>
              </div>
            )}

            {/* Max Mentions */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Maximum Mentions Per Message
              </label>
              <input
                type="number"
                value={maxMentions}
                onChange={(e) => setMaxMentions(e.target.value)}
                className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="1"
                max="20"
              />
              <p className="text-xs text-slate-500 mt-2">Messages exceeding this limit will be deleted</p>
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
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
