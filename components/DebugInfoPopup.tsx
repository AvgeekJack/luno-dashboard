'use client';

import { useState, useEffect } from 'react';

interface DebugStats {
  timestamp: string;
  userAgent: string;
  screenResolution: string;
  memoryUsage?: number;
  connectionType?: string;
  onlineStatus: boolean;
  pageLoadTime: number;
  pathname: string;
}

interface DebugInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DebugInfoPopup({ isOpen, onClose }: DebugInfoPopupProps) {
  const [debugStats, setDebugStats] = useState<DebugStats | null>(null);

  useEffect(() => {
    if (isOpen) {
      updateDebugStats();
      const interval = setInterval(updateDebugStats, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const updateDebugStats = () => {
    const stats: DebugStats = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      onlineStatus: navigator.onLine,
      pageLoadTime: performance.now(),
      pathname: window.location.pathname,
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 z-[100] animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-red-500 pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white">🐛 Developer Debug Console</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-sm uppercase tracking-wide">DEVELOPER ACCESS ONLY</span>
              </div>
              <p className="text-red-300 text-sm">
                This debug console is only visible when maintenance bypass is active. Updates every 2 seconds.
              </p>
            </div>

            {debugStats && (
              <div className="space-y-4">
                {/* System Status */}
                <div>
                  <h3 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    System Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="text-gray-400 text-xs mb-1">Connection Status</div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${debugStats.onlineStatus ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                        <span className="text-white font-mono text-sm">
                          {debugStats.onlineStatus ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="text-gray-400 text-xs mb-1">Current Page</div>
                      <div className="text-white font-mono text-xs truncate">
                        {debugStats.pathname}
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="text-gray-400 text-xs mb-1">Screen Resolution</div>
                      <div className="text-white font-mono text-sm">{debugStats.screenResolution}</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="text-gray-400 text-xs mb-1">Page Load Time</div>
                      <div className="text-white font-mono text-sm">{debugStats.pageLoadTime.toFixed(0)}ms</div>
                    </div>
                    {debugStats.memoryUsage && (
                      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <div className="text-gray-400 text-xs mb-1">Memory Usage</div>
                        <div className="text-white font-mono text-sm">{debugStats.memoryUsage} MB</div>
                      </div>
                    )}
                    {debugStats.connectionType && (
                      <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                        <div className="text-gray-400 text-xs mb-1">Network Type</div>
                        <div className="text-white font-mono text-sm uppercase">{debugStats.connectionType}</div>
                      </div>
                    )}
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <div className="text-gray-400 text-xs mb-1">Last Update</div>
                      <div className="text-white font-mono text-xs">
                        {new Date(debugStats.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Agent */}
                <div>
                  <h3 className="text-blue-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    User Agent
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                    <code className="text-gray-300 text-xs break-all">
                      {debugStats.userAgent}
                    </code>
                  </div>
                </div>

                {/* Auto-update indicator */}
                <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-updating every 2 seconds</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
