"use client";

import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import UserDropdown from '@/components/UserDropdown';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface BotStats {
  serverCount: number;
  memberCount: number;
  commandCount: number;
  lastUpdate: number | null;
}

interface ActivityItem {
  id: string;
  type: 'ban' | 'members' | 'automod' | 'activity' | 'role';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  iconColor: string;
}

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [botStats, setBotStats] = useState<BotStats>({ serverCount: 0, memberCount: 0, commandCount: 0, lastUpdate: null });
  const [botOnline, setBotOnline] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Fetch bot stats and status
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, statusRes] = await Promise.all([
          fetch('/api/bot-stats'),
          fetch('/api/bot-status')
        ]);
        const statsData = await statsRes.json();
        const statusData = await statusRes.json();
        
        setBotStats(statsData);
        setBotOnline(statusData.online);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch bot data:', error);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Mock activity data - in production, this would come from your backend
  const recentActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'ban',
      title: 'User Banned',
      description: '@ModTeam banned @SpamUser123 for spam',
      timestamp: '5 minutes ago',
      icon: '🚫',
      iconColor: 'bg-red-100 text-red-600'
    },
    {
      id: '2',
      type: 'members',
      title: 'New Members',
      description: '15 new members joined the server',
      timestamp: '23 minutes ago',
      icon: '✅',
      iconColor: 'bg-green-100 text-green-600'
    },
    {
      id: '3',
      type: 'automod',
      title: 'Automod Alert',
      description: 'Deleted 8 spam messages in #general',
      timestamp: '1 hour ago',
      icon: '⚠️',
      iconColor: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: '4',
      type: 'activity',
      title: 'Server Activity Peak',
      description: 'Reached 420 active users simultaneously',
      timestamp: '2 hours ago',
      icon: '📊',
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: '5',
      type: 'role',
      title: 'Role Update',
      description: '@Admin updated moderator permissions',
      timestamp: '3 hours ago',
      icon: '🛡️',
      iconColor: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10" />
            <div className="text-left">
              <span className="block text-xl font-bold tracking-tight">LUNO</span>
              <span className="text-sm text-slate-500">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="hidden md:inline text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Features</Link>
            <Link href="#commands" className="hidden md:inline text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Commands</Link>
            <Link href="#about" className="hidden md:inline text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">About</Link>
            <a href="https://discord.gg/shGCTRhwez" target="_blank" rel="noopener noreferrer" className="hidden sm:inline text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Support</a>
            {session ? (
              <>
                <Link href="/servers" className="hidden sm:inline bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-orange-600 transition-colors whitespace-nowrap">
                  My Servers
                </Link>
                {session.user && (
                  <UserDropdown 
                    userName={session.user.name || 'User'}
                    userImage={session.user.image ?? undefined}
                  />
                )}
              </>
            ) : (
              <button
                onClick={() => signIn('discord')}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      {session ? (
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12">
          {/* Dashboard Header */}
          <div className="mb-8 mt-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Overview of your server's activity and statistics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Members Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-green-600 text-sm font-semibold">+12.5%</span>
              </div>
              <div className="text-sm text-slate-500 mb-1">Total Members</div>
              <div className="text-3xl font-bold text-slate-900">
                {loading ? '...' : botStats.memberCount.toLocaleString()}
              </div>
            </div>

            {/* Messages Today Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-green-600 text-sm font-semibold">+8.3%</span>
              </div>
              <div className="text-sm text-slate-500 mb-1">Messages Today</div>
              <div className="text-3xl font-bold text-slate-900">12,453</div>
            </div>

            {/* Mod Actions Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">Today</span>
              </div>
              <div className="text-sm text-slate-500 mb-1">Mod Actions</div>
              <div className="text-3xl font-bold text-slate-900">23</div>
            </div>

            {/* Active Now Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">Online</span>
              </div>
              <div className="text-sm text-slate-500 mb-1">Active Now</div>
              <div className="text-3xl font-bold text-slate-900">342</div>
            </div>
          </div>

          {/* Two Column Layout for Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity - Takes 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 ${activity.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-lg">{activity.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 mb-1">{activity.title}</h3>
                      <p className="text-sm text-slate-600 mb-1">{activity.description}</p>
                      <p className="text-xs text-slate-400">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions and Server Status - Takes 1 column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/servers" className="flex items-center gap-3 w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Moderation</span>
                  </Link>
                  <Link href="/servers" className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Manage Roles</span>
                  </Link>
                  <Link href="/servers" className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>View Logs</span>
                  </Link>
                  <Link href="/servers" className="flex items-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Analytics</span>
                  </Link>
                </div>
              </div>

              {/* Server Status */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Server Status</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Automod</span>
                    <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Logging</span>
                    <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Anti-Raid</span>
                    <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        // Landing page for non-logged-in users
        <main className="w-full flex flex-col items-center flex-1">
          {/* Hero Section */}
          <section className="w-full min-h-[90vh] pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 bg-gradient-to-b from-orange-50 via-white to-white flex items-center justify-center">
          <div className="w-full max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-[#0f172a] leading-tight">
                The Discord Bot that does it all. <span className="text-orange-500">Automatically</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 mb-6 sm:mb-10 leading-relaxed px-2">
                A fully customizable server moderation Discord bot for your Discord server that features a simple and intuitive web dashboard. Server management just got a whole lot easier.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
                {session ? (
                  <Link href="/servers" className="bg-orange-500 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all inline-block text-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => signIn('discord')}
                      className="bg-white text-slate-900 px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold border-2 border-slate-200 shadow-md hover:border-orange-500 hover:shadow-lg transition-all"
                    >
                      Login with Discord
                    </button>
                  </>
                )}
              </div>
              
              {/* Key Features Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto px-2">
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">⚡</div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 mb-1">Lightning Fast</div>
                  <div className="text-xs sm:text-sm text-slate-600">Instant responses & minimal latency</div>
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">🛡️</div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 mb-1">24/7 Uptime</div>
                  <div className="text-xs sm:text-sm text-slate-600">Always online & reliable</div>
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">🎨</div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 mb-1">Fully Custom</div>
                  <div className="text-xs sm:text-sm text-slate-600">Tailor every feature to your needs</div>
                </div>
                <div className="bg-white rounded-2xl p-4 sm:p-6 border border-orange-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-2">🔒</div>
                  <div className="text-base sm:text-lg font-bold text-slate-800 mb-1">Secure</div>
                  <div className="text-xs sm:text-sm text-slate-600">Your data privacy is our priority</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 sm:py-24 px-4 sm:px-6 bg-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-[#0f172a]">Why Luno?</h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-4">
                Everything you need to manage, moderate, and engage your Discord community in one powerful bot.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20">
              <div className="bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#0f172a]">Powerful Moderation</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Keep your server safe with comprehensive moderation tools including warns, kicks, bans, and timeouts. Track all mod actions with detailed logs showing who did what and when.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#0f172a]">Advanced AutoMod</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Automatically filter spam, bad links, attachments, mentions, and inappropriate content. Set custom rules with configurable punishments, rate limits, and whitelisted roles or channels.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#0f172a]">Advanced Configuration</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Fine-tune your server settings with advanced configuration options. Control permissions, channels, roles, and automate responses to create the perfect Discord environment for your community.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#0f172a]">Comprehensive Logging</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Track deleted messages, edited messages, member updates, role changes, joins, leaves, bans, channel updates, and more. Split logging into separate channels to stay organized.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#0f172a]">Welcome Messages</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Greet new members with customizable welcome messages, farewell messages, and ban announcements. Send DMs upon joining and use embeds with variables for a personal touch.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-white p-6 sm:p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-4 sm:mb-5">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-[#0f172a]">Granular Permissions</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Fine-tune command permissions with role and channel restrictions. Manage commands in bulk from the dashboard, redirect outputs, and apply global rules across all commands effortlessly.
                </p>
              </div>
            </div>

            {/* Detailed Feature Showcases */}
            <div className="space-y-16 sm:space-y-24 mt-16 sm:mt-24">
              {/* AutoMod Showcase */}
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#0f172a]">AutoMod</h3>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-600">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Punish bad links, spam, attachment spam, and mention spam automatically</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Select custom punishments per-rule being broken</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Delete dangerous file formats and filter inappropriate content</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Mark channels as media-only to require links or attachments</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Whitelist roles and channels to bypass rules</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Custom rate limits for fine-tuned control</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-700">
                  <div className="space-y-2 sm:space-y-3 font-mono text-xs sm:text-sm">
                    <div className="text-green-400">✓ Spam filter active</div>
                    <div className="text-green-400">✓ Link filter enabled</div>
                    <div className="text-green-400">✓ Mention spam protection on</div>
                    <div className="text-orange-400 mt-4 sm:mt-6">⚠ User @Spammer violated spam rule</div>
                    <div className="text-slate-400 pl-3 sm:pl-4">→ Action: 10 minute timeout</div>
                    <div className="text-slate-400 pl-3 sm:pl-4">→ Deleted 5 messages</div>
                    <div className="text-slate-400 pl-3 sm:pl-4">→ Logged to #mod-logs</div>
                  </div>
                </div>
              </div>

              {/* Moderation Showcase */}
              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="order-2 md:order-1 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-slate-700">
                  <div className="space-y-2 sm:space-y-3 font-mono text-xs sm:text-sm">
                    <div className="text-orange-400">/warn @User Rule Violation</div>
                    <div className="text-slate-400 pl-3 sm:pl-4">→ Warning issued to @User</div>
                    <div className="text-orange-400 mt-3 sm:mt-4">/ban @BadActor Raiding</div>
                    <div className="text-slate-400 pl-3 sm:pl-4">→ User banned permanently</div>
                    <div className="text-slate-400 pl-3 sm:pl-4">→ Reason: Raiding</div>
                    <div className="text-slate-400 pl-3 sm:pl-4">→ Moderator: @Admin</div>
                    <div className="text-green-400 mt-3 sm:mt-4">✓ All actions logged to modlog</div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-[#0f172a]">Powerful Moderation</h3>
                  <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-slate-600">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Moderation logs let your mods take responsibility for their actions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">All mod commands: warns, kicks, bans, timeouts (timed or permanent)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Drama channel for easy overview of rules being broken</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Sticky roles persist even when users rejoin the server</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">View past infractions with reasons and responsible moderators</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Bulk role management and member highlighting</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Granular Permissions Showcase */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-4xl font-bold mb-6 text-[#0f172a]">Granular Permission System</h3>
                  <ul className="space-y-4 text-slate-600">
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Give each command its own set of permission rules</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Manage commands in bulk directly from the web dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Add global rules that apply across all commands</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Redirect output or mute spammy commands</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Keep bot commands in designated channels without annoying anyone</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="leading-relaxed">Allow/ignore specific channels and roles per command</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700">
                  <div className="space-y-3 font-mono text-sm">
                    <div className="text-blue-400">Command: /meme</div>
                    <div className="text-slate-400 pl-4">→ Allowed: #bot-commands, #general</div>
                    <div className="text-slate-400 pl-4">→ Ignored: #serious-chat</div>
                    <div className="text-blue-400 mt-4">Command: /ban</div>
                    <div className="text-slate-400 pl-4">→ Allowed roles: @Moderator, @Admin</div>
                    <div className="text-slate-400 pl-4">→ All channels enabled</div>
                    <div className="text-green-400 mt-4">✓ Global rules applied</div>
                    <div className="text-slate-400 pl-4">→ Output in #bot-spam only</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="w-full py-24 px-6 bg-gradient-to-b from-orange-50 to-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">Logging Everything</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Message events: deleted, edited, and purged messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Member updates: roles, names, avatars, bans, unbans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Server updates: channels, roles, and emojis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Track Discord invite links and member joins/leaves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Ignore specific channels, members, or bots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Split logging across multiple channels</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">Welcome & Farewell</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Send welcome messages when members join</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Farewell messages when members leave</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Ban announcement messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Send DMs to new members upon joining</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Full embed support with custom colors and images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Variables: member name, count, server name, and more</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">User Engagement</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Starboard for highlighting great messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Scheduled announcements with role pings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Fast Twitch/YouTube stream notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Role feeds for mentioning roles safely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Post count tracking and leaderboards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Fun commands: cats, dogs, memes, and more</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-orange-100 shadow-sm">
                <h3 className="text-2xl font-bold mb-4 text-[#0f172a]">Advanced Features</h3>
                <ul className="space-y-3 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Reaction roles for self-assignable roles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Auto-moderation with configurable filters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Verification system with captcha support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Anti-raid protection with smart detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Temporary channels and voice management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    <span>Server statistics and analytics dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Commands Section */}
        <section id="commands" className="w-full py-24 px-6 bg-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-[#0f172a]">Powerful Commands</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Over 150 commands across multiple modules to manage every aspect of your Discord server.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3">Moderation</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <p>/ban • /kick • /warn</p>
                  <p>/timeout • /clear • /slowmode</p>
                  <p>/lock • /unlock</p>
                </div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Utility Commands</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>/userinfo • /serverinfo</p>
                  <p>/avatar • /roleinfo</p>
                  <p>/poll • /remind • /stats</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3">Security</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <p>/antiraid • /antispam</p>
                  <p>/antilink • /verification</p>
                  <p>/captcha • /lockdown</p>
                </div>
              </div>

              {/* Row 2 */}
              <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Fun Commands</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>/meme • /joke • /8ball</p>
                  <p>/cat • /dog • /gif</p>
                  <p>/roll • /flip • /choose</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-3">Role Management</h3>
                <div className="space-y-2 text-sm opacity-90">
                  <p>/role • /autorole • /massrole</p>
                  <p>/reactionrole • /selfrole</p>
                  <p>/roleall • /removerole</p>
                </div>
              </div>
              <div className="bg-white border-2 border-slate-200 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-3 text-[#0f172a]">Announcements</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>/announce • /embed</p>
                  <p>/schedule • /edit</p>
                  <p>/ping • /say</p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/servers" className="inline-block bg-orange-500 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all">
                View All Commands
              </Link>
            </div>
          </div>
        </section>

        {/* About/Trust Section */}
        <section id="about" className="w-full py-24 px-6 bg-gradient-to-b from-orange-50 to-white flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 text-[#0f172a]">Trusted by Everyone</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Luno is trusted by Discord communities worldwide to keep their servers safe, organized, and engaging.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">Lightning Fast</h3>
                <p className="text-slate-600">Optimized for speed with minimal latency and instant responses.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">99.9% Uptime</h3>
                <p className="text-slate-600">Reliable infrastructure ensures Luno is always available when you need it.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-[#0f172a]">24/7 Support</h3>
                <p className="text-slate-600">Our dedicated support team is always ready to help you.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h3 className="text-4xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-xl mb-8 opacity-90">
                Join other Discord users and start managing your server like a pro!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {session ? (
                  <Link href="/servers" className="bg-white text-orange-500 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-orange-50 transition-all inline-block">
                    Open Dashboard
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => signIn('discord')}
                      className="bg-slate-900 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-slate-800 hover:shadow-xl transition-all"
                    >
                      Login with Discord
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 px-6 bg-slate-900 text-white flex justify-center">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/luno-logo.png" alt="Luno Bot" className="w-12 h-12" />
                  <span className="text-2xl font-bold">LUNO</span>
                </div>
                <p className="text-slate-400 mb-6 max-w-sm">
                  The most powerful and customizable Discord bot for server management, moderation, and engagement.
                </p>
                <div className="flex gap-3">
                  <a href="https://discord.gg/shGCTRhwez" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00-.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </a>
                  <a href="https://x.com/lunobotdiscord" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/lunobotdiscord" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://www.tiktok.com/@lunobotdiscord" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-lg mb-4">LUNO</h4>
                <ul className="space-y-3 text-slate-400">
                  <li><Link href="#features" className="hover:text-orange-400 transition-colors">Features</Link></li>
                  <li><Link href="#commands" className="hover:text-orange-400 transition-colors">Commands</Link></li>
                  <li><Link href="/servers" className="hover:text-orange-400 transition-colors">Dashboard</Link></li>
                  <li><a href="https://docs.lunobot.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">SUPPORT</h4>
                <ul className="space-y-3 text-slate-400">
                  <li><a href="https://discord.gg/shGCTRhwez" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Discord Server</a></li>
                  <li><a href="https://docs.lunobot.xyz/faq" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">FAQ</a></li>
                  <li><a href="https://docs.lunobot.xyz/guides" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Guides</a></li>
                  <li><a href="https://docs.lunobot.xyz/contact" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">LEGAL</h4>
                <ul className="space-y-3 text-slate-400">
                  <li><Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/cookies" className="hover:text-orange-400 transition-colors">Cookie Policy</Link></li>
                  <li><Link href="/gdpr" className="hover:text-orange-400 transition-colors">GDPR Notice</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-slate-400 text-sm">
                  © 2026 Luno Bot. All rights reserved.
                </p>
                <p className="text-slate-400 text-sm">
                  Made with <span className="text-orange-500">❤</span> for the Discord community
                </p>
              </div>
            </div>
          </div>
        </footer>
        </main>
      )}
    </div>
  );
}
