'use client';

import { useState } from 'react';

interface DeveloperToolsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperTools({ isOpen, onClose }: DeveloperToolsProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);

  if (!isOpen) return null;

  const handleClearCache = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Simulate cache clear
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('✅ Cache cleared successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchStats = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/bot-stats');
      const data = await response.json();
      setStats(data);
      setMessage('✅ Stats loaded');
    } catch (error) {
      setMessage('❌ Failed to fetch stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRestartServices = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Simulate service restart
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('✅ Services restarted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to restart services');
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Simulate force sync
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('✅ Force sync completed');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to sync');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto border-4 border-red-500">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center border-b-2 border-red-400">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-2xl font-bold text-white">Developer Tools</h2>
              <p className="text-red-200 text-xs">Advanced system controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition-colors text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-800"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message Banner */}
          {message && (
            <div className={`p-4 rounded-lg font-semibold text-center ${
              message.includes('✅') ? 'bg-green-500/20 text-green-300 border border-green-500' : 'bg-red-500/20 text-red-300 border border-red-500'
            }`}>
              {message}
            </div>
          )}

          {/* Action Buttons Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Clear Cache */}
            <button
              onClick={handleClearCache}
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Clear Cache</span>
            </button>

            {/* Fetch Stats */}
            <button
              onClick={handleFetchStats}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <span>Fetch Bot Stats</span>
            </button>

            {/* Restart Services */}
            <button
              onClick={handleRestartServices}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span>Restart Services</span>
            </button>

            {/* Force Sync */}
            <button
              onClick={handleForceSync}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>Force Database Sync</span>
            </button>
          </div>

          {/* Stats Display */}
          {stats && (
            <div className="bg-slate-800/50 border-2 border-red-500/30 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                System Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-400 text-sm">Server Count</p>
                  <p className="text-white text-2xl font-bold">{stats.serverCount || 'N/A'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-white text-2xl font-bold">{stats.userCount || 'N/A'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-400 text-sm">Commands Used</p>
                  <p className="text-white text-2xl font-bold">{stats.commandsUsed || 'N/A'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-400 text-sm">Uptime</p>
                  <p className="text-white text-2xl font-bold">{stats.uptime || 'N/A'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-400 text-sm">Memory</p>
                  <p className="text-white text-2xl font-bold">{stats.memoryUsage || 'N/A'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-400 text-sm">Bot Status</p>
                  <p className={`text-2xl font-bold ${stats.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.status || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Developer Info */}
          <div className="bg-red-950/30 border-2 border-red-500/50 rounded-xl p-4">
            <p className="text-red-300 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              ⚠️ These tools are for authorized developers only. Use with caution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
