'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ModerationDemo() {
  const [muteEnabled, setMuteEnabled] = useState(true);
  const [kickEnabled, setKickEnabled] = useState(true);
  const [banEnabled, setBanEnabled] = useState(true);
  const [warnEnabled, setWarnEnabled] = useState(true);
  const [muteRole, setMuteRole] = useState('123456789');
  const [maxWarnings, setMaxWarnings] = useState('3');
  const [autoMod, setAutoMod] = useState(false);
  const [saving, setSaving] = useState(false);

  const roles = [
    { id: '123456789', name: 'Muted' },
    { id: '987654321', name: 'Timeout' },
    { id: '456789123', name: 'Silenced' }
  ];

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
              <h1 className="text-2xl font-bold text-slate-900">Moderation Module</h1>
              <p className="text-sm text-slate-600">Configure moderation commands and settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Commands Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Commands */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Moderation Commands</h2>
              
              <div className="space-y-4">
                {/* Mute Command */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">!mute</h3>
                        <p className="text-sm text-slate-600">Mute a user in the server</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMuteEnabled(!muteEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        muteEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          muteEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="ml-13 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    Usage: <code className="text-orange-600">!mute @user [duration] [reason]</code>
                  </div>
                </div>

                {/* Kick Command */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">!kick</h3>
                        <p className="text-sm text-slate-600">Kick a user from the server</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setKickEnabled(!kickEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        kickEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          kickEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="ml-13 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    Usage: <code className="text-orange-600">!kick @user [reason]</code>
                  </div>
                </div>

                {/* Ban Command */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">!ban</h3>
                        <p className="text-sm text-slate-600">Ban a user from the server</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setBanEnabled(!banEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        banEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          banEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="ml-13 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    Usage: <code className="text-orange-600">!ban @user [reason]</code>
                  </div>
                </div>

                {/* Warn Command */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">!warn</h3>
                        <p className="text-sm text-slate-600">Issue a warning to a user</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setWarnEnabled(!warnEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        warnEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          warnEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="ml-13 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                    Usage: <code className="text-orange-600">!warn @user [reason]</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Commands */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Other Commands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  <code className="text-orange-600 font-mono">!unmute</code>
                  <span className="text-slate-500">-</span>
                  <span>Unmute a user</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  <code className="text-orange-600 font-mono">!unban</code>
                  <span className="text-slate-500">-</span>
                  <span>Unban a user</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  <code className="text-orange-600 font-mono">!warnings</code>
                  <span className="text-slate-500">-</span>
                  <span>View user warnings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  <code className="text-orange-600 font-mono">!clearwarns</code>
                  <span className="text-slate-500">-</span>
                  <span>Clear warnings</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  <code className="text-orange-600 font-mono">!purge</code>
                  <span className="text-slate-500">-</span>
                  <span>Bulk delete messages</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                  <code className="text-orange-600 font-mono">!slowmode</code>
                  <span className="text-slate-500">-</span>
                  <span>Set channel slowmode</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Configuration */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Configuration</h2>
              
              <div className="space-y-6">
                {/* Mute Role */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Muted Role
                  </label>
                  <select
                    value={muteRole}
                    onChange={(e) => setMuteRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        @{role.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Role assigned to muted users</p>
                </div>

                {/* Max Warnings */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Auto-ban Threshold
                  </label>
                  <input
                    type="number"
                    value={maxWarnings}
                    onChange={(e) => setMaxWarnings(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-slate-500 mt-1">Warnings before auto-ban</p>
                </div>

                {/* Auto-mod Integration */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Auto-mod Actions</p>
                      <p className="text-xs text-slate-500 mt-1">Enable automatic moderation</p>
                    </div>
                    <button
                      onClick={() => setAutoMod(!autoMod)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        autoMod ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoMod ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Stats (24h)</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Warnings Issued</span>
                  <span className="text-lg font-bold text-orange-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Users Kicked</span>
                  <span className="text-lg font-bold text-yellow-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Users Banned</span>
                  <span className="text-lg font-bold text-red-600">1</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Messages Deleted</span>
                  <span className="text-lg font-bold text-slate-600">47</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
