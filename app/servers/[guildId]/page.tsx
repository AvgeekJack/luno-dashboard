'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MaintenanceScreen from '@/components/MaintenanceScreen';
import DebugInfoPopup from '@/components/DebugInfoPopup';
import DeveloperTools from '@/components/DeveloperTools';
import SystemAnnouncement from '@/components/SystemAnnouncement';
import WelcomeSetupModal from '@/components/WelcomeSetupModal';
import SetupWizard from '@/components/SetupWizard';
import SetupCompleteModal from '@/components/SetupCompleteModal';

interface Settings {
  guildId: string;
  prefix: string;
  premium?: boolean;
  setupCompleted?: boolean;
  configuration?: {
    botNickname: string;
    timezone: string;
    updatesChannel?: string;
    automod?: {
      enabled: boolean;
    };
    logging?: {
      enabled: boolean;
    };
    antiraid?: {
      enabled: boolean;
    };
  };
}

interface Channel {
  id: string;
  name: string;
}

interface ServerStats {
  members: number | null;
  presences: number | null;
  textChannels: number | null;
  voiceChannels: number | null;
  categories: number | null;
  roles: number | null;
}

export default function ServerSettings() {
  const { data: session, status } = useSession();
  const { guildId } = useParams();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [serverName, setServerName] = useState<string | null>(null);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [botOnline, setBotOnline] = useState<boolean | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [saving, setSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [showDeveloperTools, setShowDeveloperTools] = useState(false);
  const [bypassMaintenance, setBypassMaintenance] = useState(false);
  const [premiumPurchaseEnabled, setPremiumPurchaseEnabled] = useState(true);
  const [premiumManagementEnabled, setPremiumManagementEnabled] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [hasCheckedSetup, setHasCheckedSetup] = useState(false);

  // Check maintenance mode and premium purchase status
  useEffect(() => {
    const checkSettings = async () => {
      try {
        const [maintenanceRes, siteSettingsRes] = await Promise.all([
          fetch('/api/maintenance-status'),
          fetch('/api/site-settings')
        ]);
        
        if (maintenanceRes.ok) {
          const data = await maintenanceRes.json();
          setMaintenanceMode(data.maintenanceMode);
        }
        
        if (siteSettingsRes.ok) {
          const siteData = await siteSettingsRes.json();
          setPremiumPurchaseEnabled(siteData.premiumPurchaseEnabled ?? true);
          setPremiumManagementEnabled(siteData.premiumManagementEnabled ?? true);
        }
      } catch (error) {
        console.error('Failed to check settings:', error);
      }
    };
    
    checkSettings();
  }, []);

  const handleBypass = () => {
    setBypassMaintenance(true);
  };

  // Poll bot status every 5 seconds for more responsive updates
  useEffect(() => {
    const checkBotStatus = async () => {
      try {
        const res = await fetch('/api/bot-status');
        if (!res.ok) {
          throw new Error('Failed to fetch bot status');
        }
        const data = await res.json();
        console.log('[Dashboard] Bot status:', data);
        setBotOnline(data.online);
      } catch (error) {
        console.error('[Dashboard] Failed to check bot status:', error);
        setBotOnline(false);
      }
    };

    // Check immediately on mount
    checkBotStatus();
    // Then check every 5 seconds
    const interval = setInterval(checkBotStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    fetch(`/api/servers/${guildId}/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    fetch('/api/servers')
      .then(res => res.json())
      .then((data) => {
        const match = Array.isArray(data) ? data.find((g: any) => String(g.id) === String(guildId)) : null;
        const name = match?.name ?? null;
        setServerName(name);
        // Update document title with server name
        if (name) {
          document.title = `Dashboard - ${name}`;
        }
      })
      .catch((err) => {
        console.error(err);
      });

    fetch(`/api/servers/${guildId}/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setStats({
          members: data.members ?? null,
          presences: data.presences ?? null,
          textChannels: data.textChannels ?? null,
          voiceChannels: data.voiceChannels ?? null,
          categories: data.categories ?? null,
          roles: data.roles ?? null,
        });
      })
      .catch((err) => {
        console.error(err);
      });

    // Fetch channels for dropdowns
    fetch(`/api/servers/${guildId}/channels-and-roles`)
      .then((res) => res.json())
      .then((data) => {
        setChannels(data.channels ?? []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [session, status, guildId, router]);

  // Check if we need to show welcome modal for first-time setup
  useEffect(() => {
    if (!hasCheckedSetup && settings && !settings.setupCompleted) {
      // Small delay to let the page load first
      setTimeout(() => {
        setShowWelcomeModal(true);
        setHasCheckedSetup(true);
      }, 800);
    }
  }, [settings, hasCheckedSetup]);

  const handleStartSetup = () => {
    setShowWelcomeModal(false);
    setShowSetupWizard(true);
  };

  const handleSkipSetup = async () => {
    setShowWelcomeModal(false);
    
    // Mark setup as completed even though they skipped
    try {
      await fetch(`/api/servers/${guildId}/complete-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skipSetup: true }),
      });
      
      // Update local settings
      if (settings) {
        setSettings({ ...settings, setupCompleted: true });
      }
    } catch (error) {
      console.error('Failed to mark setup as completed:', error);
    }
  };

  const handleCompleteSetup = async (config: any) => {
    try {
      const response = await fetch(`/api/servers/${guildId}/complete-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config }),
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        setShowSetupWizard(false);
        
        // Show completion modal instead of immediately reloading
        setShowCompleteModal(true);
      } else {
        console.error('Setup completion failed');
      }
    } catch (error) {
      console.error('Failed to complete setup:', error);
    }
  };

  const handleStartTour = () => {
    setShowCompleteModal(false);
    // Dispatch event to start tour in layout
    window.dispatchEvent(new Event('start-dashboard-tour'));
  };

  const handleSkipTour = () => {
    setShowCompleteModal(false);
    // Refresh the page to load new settings
    window.location.reload();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!settings) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Server not found</div>;
  }

  // Show maintenance screen if maintenance mode is enabled and developer hasn't bypassed
  if (maintenanceMode && !bypassMaintenance) {
    return <MaintenanceScreen userId={session?.user?.id} onBypass={handleBypass} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-[60] bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-lg shadow-lg transition-colors"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-orange-100 shadow-lg lg:shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain ml-12 lg:ml-0" />
              <span className="text-xl font-bold text-[#0f172a]">Luno</span>
            </Link>
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
              href={`/servers/${guildId}`} 
              className="flex items-center gap-3 px-3 py-6 bg-orange-100 text-orange-700 transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/dashbaord.png" alt="" className="w-5 h-5" />
              Dashboard
            </Link>
            <details className="text-slate-800" open={settingsOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }} data-tour="settings-link">
                <span className="flex items-center gap-3">
                  <img src="/settings.png" alt="" className="w-5 h-5" />
                  Settings
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {settingsOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${guildId}/general`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    General
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/setup`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Setup
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={configOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }} data-tour="commands-link">
                <span className="flex items-center gap-3">
                  <img src="/configuration.png" alt="" className="w-5 h-5" />
                  Configuration
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {configOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${guildId}/configuration/automod`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Automod
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/logging`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Logging
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/anti-raid`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Anti-Raid
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/reaction-roles`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Reaction Roles
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/configuration/verification`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Verification
                  </Link>
                </div>
              )}
            </details>
            <details className="text-slate-800" open={modulesOpen}>
              <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors rounded-lg" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }} data-tour="modules-link">
                <span className="flex items-center gap-3">
                  <img src="/modules.png" alt="" className="w-5 h-5" />
                  Modules
                </span>
                <span className="text-xs text-orange-600">▾</span>
              </summary>
              {modulesOpen && (
                <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                  <Link 
                    href={`/servers/${guildId}/modules/moderation`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '0ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Moderation
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/role-management`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '50ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Role Management
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/member-management`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '100ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Member Management
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/announcements`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '150ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Announcements
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/notifications`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '200ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Welcome Messages
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/fun`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '250ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Fun
                  </Link>
                  <Link 
                    href={`/servers/${guildId}/modules/utilities`} 
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} 
                    style={{animationDelay: '300ms'}}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Utilities
                  </Link>
                </div>
              )}
            </details>
          </nav>
          
          {/* Developer Debug Button - Only show when bypassed */}
          {bypassMaintenance && (
          <div className="mt-auto p-4 border-t-2 border-red-500 space-y-2">
            <button
              onClick={() => setShowDebugInfo(true)}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 animate-pulse"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              🐛 Debug Info
              <span className="text-xs bg-red-900 px-2 py-1 rounded">DEV ONLY</span>
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
            <p className="text-center text-red-600 text-xs font-semibold mt-2">
              ⚠️ DEVELOPER MODE ACTIVE
            </p>
          </div>
        )}
      </aside>

      {/* Debug Info Popup */}
      <DebugInfoPopup isOpen={showDebugInfo} onClose={() => setShowDebugInfo(false)} />
      <DeveloperTools isOpen={showDeveloperTools} onClose={() => setShowDeveloperTools(false)} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* System Announcement - positioned at top */}
        <div className="w-full">
          <SystemAnnouncement />
        </div>
        
        <main className="flex-1 py-12 px-4 md:px-6 lg:px-8 pt-20 lg:pt-12">
        <div className="w-full max-w-full md:max-w-3xl lg:max-w-7xl mx-auto space-y-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              {serverName ? `Dashboard - ${serverName}` : 'Dashboard'}
            </h1>
            <p className="text-slate-600">Overview of your server's activity and statistics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-tour="server-stats">

            {/* Total Members Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-1">Total Members</div>
              <div className="text-3xl font-bold text-slate-900">
                {stats?.members?.toLocaleString() ?? '—'}
              </div>
            </div>

            {/* Active Now Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-slate-500 mb-1">Active Now</div>
              <div className="text-3xl font-bold text-slate-900">{stats?.presences ?? '—'}</div>
            </div>

            {/* Premium Status Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative" data-tour="quick-actions">
              {((!premiumPurchaseEnabled && !settings?.premium) || (!premiumManagementEnabled && settings?.premium)) && (
                <div className="absolute inset-0 backdrop-blur-sm bg-orange-500/20 rounded-2xl flex items-center justify-center z-10">
                  <div className="bg-white/90 rounded-xl p-6 shadow-xl text-center">
                    <div className="text-4xl mb-3">🚀</div>
                    <h3 className="text-2xl font-bold text-orange-600 mb-1">Coming Soon</h3>
                    <p className="text-sm text-slate-600">Premium subscriptions will be available soon!</p>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <img src="/premium-icon.svg" alt="Premium" className="w-7 h-7 text-white" />
                </div>
                {settings?.premium ? (
                  <Link href={`/servers/${guildId}/premium/manage`}>
                    <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Manage
                    </button>
                  </Link>
                ) : (
                  <Link href={`/servers/${guildId}/premium`}>
                    <button disabled={!premiumPurchaseEnabled} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition text-sm flex items-center gap-2">
                      <img src="/premium-icon.svg" alt="" className="w-4 h-4" />
                      Enroll Now
                    </button>
                  </Link>
                )}
              </div>
              <div className="text-sm text-slate-500 mb-1">Premium Status</div>
              <div className="text-3xl font-bold text-slate-900">
                {settings?.premium ? 'Server Enrolled' : 'Not Enrolled'}
              </div>
            </div>

            
          </div>

          {/* Two Column Layout for Bot Settings and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bot Settings - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Bot Settings</h2>
              
              <div className="space-y-6">
                {/* Two Column Grid for Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Command Prefix */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Command Prefix
                    </label>
                    <input
                      type="text"
                      value={settings?.prefix || ''}
                      onChange={(e) => {
                        if (settings) {
                          setSettings({ ...settings, prefix: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="!"
                    />
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nickname
                    </label>
                    <input
                      type="text"
                      value={settings?.configuration?.botNickname || ''}
                      onChange={(e) => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            configuration: {
                              ...settings.configuration,
                              botNickname: e.target.value,
                              timezone: settings.configuration?.timezone || 'UTC'
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter bot nickname"
                    />
                  </div>

                  {/* Updates Channel */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Updates Channel
                    </label>
                    <select
                      value={settings?.configuration?.updatesChannel || ''}
                      onChange={(e) => {
                        if (settings) {
                          setSettings({
                            ...settings,
                            configuration: {
                              ...settings.configuration,
                              updatesChannel: e.target.value,
                              botNickname: settings.configuration?.botNickname || '',
                              timezone: settings.configuration?.timezone || 'UTC'
                            }
                          });
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                      <option value="">Select...</option>
                      {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          #{channel.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Timezone with Detect Button */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Timezone
                    </label>
                    <div className="flex gap-3">
                      <select
                        value={settings?.configuration?.timezone || 'UTC'}
                        onChange={(e) => {
                          if (settings) {
                            setSettings({
                              ...settings,
                              configuration: {
                                ...settings.configuration,
                                timezone: e.target.value,
                                botNickname: settings.configuration?.botNickname || '',
                                updatesChannel: settings.configuration?.updatesChannel || ''
                              }
                            });
                          }
                        }}
                        className="flex-1 px-4 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                        <option value="America/Chicago">America/Chicago</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="Europe/Paris">Europe/Paris</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                        <option value="Australia/Sydney">Australia/Sydney</option>
                      </select>
                      <button
                        onClick={() => {
                          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                          if (settings) {
                            setSettings({
                              ...settings,
                              configuration: {
                                ...settings.configuration,
                                timezone: timezone,
                                botNickname: settings.configuration?.botNickname || '',
                                updatesChannel: settings.configuration?.updatesChannel || ''
                              }
                            });
                          }
                        }}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Detect
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <button
                    onClick={async () => {
                      if (!settings) return;
                      setSaving(true);
                      try {
                        const res = await fetch(`/api/servers/${guildId}/settings`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            prefix: settings.prefix,
                            configuration: {
                              botNickname: settings.configuration?.botNickname,
                              timezone: settings.configuration?.timezone,
                              updatesChannel: settings.configuration?.updatesChannel
                            }
                          })
                        });
                        if (res.ok) {
                          alert('Settings saved successfully!');
                        }
                      } catch (error) {
                        console.error('Failed to save settings:', error);
                        alert('Failed to save settings');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions and Server Status - Takes 1 column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href={`/servers/${guildId}/modules/moderation`} className="flex items-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Moderation</span>
                  </Link>
                  <Link href={`/servers/${guildId}/modules/role-management`} className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Manage Roles</span>
                  </Link>
                  <Link href={`/servers/${guildId}/configuration/logging`} className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Logging</span>
                  </Link>
                  <Link href={`/servers/${guildId}/setup`} className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Setup</span>
                  </Link>
                </div>
              </div>

              {/* Server Status */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm" data-tour="bot-status">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Server Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Automod</span>
                    {settings?.configuration?.automod?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Disabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Logging</span>
                    {settings?.configuration?.logging?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Disabled
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Anti-Raid</span>
                    {settings?.configuration?.antiraid?.enabled ? (
                      <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600 font-medium text-sm">
                        <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                        Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>

      {/* Welcome Setup Modal */}
      <WelcomeSetupModal
        isOpen={showWelcomeModal}
        onClose={handleSkipSetup}
        onStartSetup={handleStartSetup}
        serverName={serverName || 'Your Server'}
      />

      {/* Setup Wizard */}
      <SetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        onComplete={handleCompleteSetup}
        serverName={serverName || 'Your Server'}
        initialPrefix={settings?.prefix}
      />

      {/* Setup Complete Modal */}
      <SetupCompleteModal
        isOpen={showCompleteModal}
        onClose={handleSkipTour}
        onStartTour={handleStartTour}
        serverName={serverName || 'Your Server'}
      />
    </div>
  );
}