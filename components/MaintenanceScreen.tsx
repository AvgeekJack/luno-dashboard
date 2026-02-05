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
  onBypass?: () => void;
}

export default function MaintenanceScreen({ userId, onBypass }: MaintenanceScreenProps) {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [debugStats, setDebugStats] = useState<DebugStats | null>(null);
  const [maintenanceETA, setMaintenanceETA] = useState('');
  
  const isDeveloper = userId === DEVELOPER_USER_ID;
  const [showBypass, setShowBypass] = useState(false);

  useEffect(() => {
    // Fetch maintenance ETA
    fetchMaintenanceETA();
    
    if (isDeveloper) {
      // Initialize debug stats
      updateDebugStats();
      
      // Update debug stats every 2 seconds
      const interval = setInterval(updateDebugStats, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isDeveloper]);

  const fetchMaintenanceETA = async () => {
    try {
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceETA(data.maintenanceETA || '');
      }
    } catch (error) {
      console.error('Error fetching maintenance ETA:', error);
    }
  };

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

      // Successfully verified - set local bypass state
      setShowBypass(false);
      setPin('');
      
      // Call the parent component's bypass handler
      if (onBypass) {
        onBypass();
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      setError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 p-4">
      <div className="max-w-2xl w-full">
        {/* Main Maintenance Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border-2 border-orange-500">
          <div className="text-center mb-8">
            <div className="text-orange-500 text-6xl mb-6 animate-pulse">
              🔧
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Maintenance in Progress
            </h1>
            <p className="text-gray-700 text-lg mb-2">
              We're currently performing scheduled maintenance to improve your experience.
            </p>
            <p className="text-gray-600">
              We'll be back shortly. Thank you for your patience!
            </p>
          </div>

          {/* Animated progress bar */}
          <div className="w-full bg-orange-100 rounded-full h-2 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full animate-pulse" 
                 style={{ width: '70%' }}></div>
          </div>

          <div className="space-y-4 text-center">
            {maintenanceETA ? (
              <p className="text-gray-600 text-sm">
                Expected completion: {new Date(maintenanceETA).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Expected completion time: Soon
              </p>
            )}
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-md"
            >
              ← Return to Home
            </button>
          </div>
        </div>

        {/* Developer Bypass Section */}
        {isDeveloper && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-orange-600 font-semibold text-sm">Developer Mode</span>
              </div>
              <button
                onClick={() => setShowBypass(!showBypass)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                {showBypass ? 'Hide' : 'Show'} Bypass
              </button>
            </div>

            {showBypass && (
              <div className="space-y-4">
                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-3 font-medium">
                    Enter PIN to bypass maintenance mode:
                  </p>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleBypassAttempt()}
                    placeholder="Enter PIN"
                    className="w-full px-4 py-2 bg-white text-gray-900 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 mb-2"
                    autoComplete="off"
                  />
                  {error && (
                    <p className="text-orange-600 text-sm mb-2 font-medium">{error}</p>
                  )}
                  <button
                    onClick={handleBypassAttempt}
                    disabled={isVerifying}
                    className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
                  >
                    {isVerifying ? 'Verifying...' : 'Bypass Maintenance'}
                  </button>
                </div>
              </div>
            )}

            {/* Debug Stats - Always Visible for Developer */}
            {debugStats && (
              <div className="mt-4 bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-orange-600 font-semibold text-sm">
                    🐛 Live Debug Stats
                  </h3>
                  <span className="text-xs text-gray-600">
                    Updates every 2s
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white border border-orange-200 rounded p-2">
                    <div className="text-gray-600 mb-1">Status</div>
                    <div className="text-gray-900 font-mono flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${debugStats.onlineStatus ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {debugStats.onlineStatus ? 'Online' : 'Offline'}
                    </div>
                  </div>
                  <div className="bg-white border border-orange-200 rounded p-2">
                    <div className="text-gray-600 mb-1">Screen</div>
                    <div className="text-gray-900 font-mono">{debugStats.screenResolution}</div>
                  </div>
                  {debugStats.memoryUsage && (
                    <div className="bg-white border border-orange-200 rounded p-2">
                      <div className="text-gray-600 mb-1">Memory</div>
                      <div className="text-gray-900 font-mono">{debugStats.memoryUsage} MB</div>
                    </div>
                  )}
                  {debugStats.connectionType && (
                    <div className="bg-white border border-orange-200 rounded p-2">
                      <div className="text-gray-600 mb-1">Connection</div>
                      <div className="text-gray-900 font-mono uppercase">{debugStats.connectionType}</div>
                    </div>
                  )}
                  <div className="bg-white border border-orange-200 rounded p-2">
                    <div className="text-gray-600 mb-1">Load Time</div>
                    <div className="text-gray-900 font-mono">{debugStats.pageLoadTime.toFixed(0)}ms</div>
                  </div>
                  <div className="bg-white border border-orange-200 rounded p-2">
                    <div className="text-gray-600 mb-1">Timestamp</div>
                    <div className="text-gray-900 font-mono text-[10px]">
                      {new Date(debugStats.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className="text-gray-700 text-xs cursor-pointer hover:text-gray-900 font-medium">
                    User Agent
                  </summary>
                  <p className="text-gray-600 text-[10px] font-mono mt-2 break-all">
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
