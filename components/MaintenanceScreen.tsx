'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DEVELOPER_USER_ID = '922940896322940929';

interface DebugStats {
  timestamp: string;
  userAgent: string;
  screenResolution: string;
  memoryUsage?: number;
  connectionType?: string;
  onlineStatus: boolean;
  pageLoadTime: number;
}

interface MaintenanceScreenProps {
  userId?: string;
}

export default function MaintenanceScreen({ userId }: MaintenanceScreenProps) {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [debugStats, setDebugStats] = useState<DebugStats | null>(null);
  
  const isDeveloper = userId === DEVELOPER_USER_ID;
  const [showBypass, setShowBypass] = useState(false);

  useEffect(() => {
    if (isDeveloper) {
      // Initialize debug stats
      updateDebugStats();
      
      // Update debug stats every 2 seconds
      const interval = setInterval(updateDebugStats, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isDeveloper]);

  const updateDebugStats = () => {
    const stats: DebugStats = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      onlineStatus: navigator.onLine,
      pageLoadTime: performance.now(),
    };

    // @ts-ignore - Performance memory API (Chrome only)
    if (performance.memory) {
      // @ts-ignore
      stats.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
    }

    // @ts-ignore - Network Information API
    if (navigator.connection) {
      // @ts-ignore
      stats.connectionType = navigator.connection.effectiveType;
    }

    setDebugStats(stats);
  };

  const handleBypassAttempt = async () => {
    if (!pin.trim()) {
      setError('Please enter PIN');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await fetch('/api/developer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Invalid PIN');
        setIsVerifying(false);
        return;
      }

      // Store bypass token in sessionStorage
      sessionStorage.setItem('maintenanceBypass', 'true');
      
      // Reload the page to bypass maintenance
      window.location.reload();
    } catch (error) {
      console.error('PIN verification error:', error);
      setError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-2xl w-full">
        {/* Main Maintenance Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6 border border-gray-700">
          <div className="text-center mb-8">
            <div className="text-yellow-500 text-6xl mb-6 animate-pulse">
              🔧
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Maintenance in Progress
            </h1>
            <p className="text-gray-300 text-lg mb-2">
              We're currently performing scheduled maintenance to improve your experience.
            </p>
            <p className="text-gray-400">
              We'll be back shortly. Thank you for your patience!
            </p>
          </div>

          {/* Animated progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse" 
                 style={{ width: '70%' }}></div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-gray-400 text-sm">
              Expected completion time: Soon
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              ← Return to Home
            </button>
          </div>
        </div>

        {/* Developer Bypass Section */}
        {isDeveloper && (
          <div className="bg-gray-800/50 rounded-2xl shadow-xl p-6 border border-gray-700 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-400 font-semibold text-sm">Developer Mode</span>
              </div>
              <button
                onClick={() => setShowBypass(!showBypass)}
                className="text-gray-400 hover:text-white text-sm"
              >
                {showBypass ? 'Hide' : 'Show'} Bypass
              </button>
            </div>

            {showBypass && (
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-3">
                    Enter PIN to bypass maintenance mode:
                  </p>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleBypassAttempt()}
                    placeholder="Enter PIN"
                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 mb-2"
                    autoComplete="off"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                  )}
                  <button
                    onClick={handleBypassAttempt}
                    disabled={isVerifying}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? 'Verifying...' : 'Bypass Maintenance'}
                  </button>
                </div>
              </div>
            )}

            {/* Debug Stats - Always Visible for Developer */}
            {debugStats && (
              <div className="mt-4 bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-green-400 font-semibold text-sm">
                    🐛 Live Debug Stats
                  </h3>
                  <span className="text-xs text-gray-500">
                    Updates every 2s
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400 mb-1">Status</div>
                    <div className="text-white font-mono flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${debugStats.onlineStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {debugStats.onlineStatus ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400 mb-1">Screen</div>
                    <div className="text-white font-mono">{debugStats.screenResolution}</div>
                  </div>
                  {debugStats.memoryUsage && (
                    <div className="bg-gray-800 rounded p-2">
                      <div className="text-gray-400 mb-1">Memory</div>
                      <div className="text-white font-mono">{debugStats.memoryUsage} MB</div>
                    </div>
                  )}
                  {debugStats.connectionType && (
                    <div className="bg-gray-800 rounded p-2">
                      <div className="text-gray-400 mb-1">Connection</div>
                      <div className="text-white font-mono uppercase">{debugStats.connectionType}</div>
                    </div>
                  )}
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400 mb-1">Load Time</div>
                    <div className="text-white font-mono">{debugStats.pageLoadTime.toFixed(0)}ms</div>
                  </div>
                  <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400 mb-1">Timestamp</div>
                    <div className="text-white font-mono text-[10px]">
                      {new Date(debugStats.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="text-gray-400 text-xs cursor-pointer hover:text-white">
                    User Agent
                  </summary>
                  <p className="text-gray-500 text-[10px] font-mono mt-2 break-all">
                    {debugStats.userAgent}
                  </p>
                </details>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
