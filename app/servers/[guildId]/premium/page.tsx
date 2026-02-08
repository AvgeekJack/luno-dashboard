'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ServerPageWrapper from '@/components/ServerPageWrapper';

export default function PremiumPage() {
  const { data: session, status } = useSession();
  const { guildId } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState(false);
  const [serverName, setServerName] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('monthly');
  const [premiumPurchaseEnabled, setPremiumPurchaseEnabled] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serverRes, siteSettingsRes] = await Promise.all([
          fetch(`/api/servers/${guildId}/settings`),
          fetch('/api/site-settings')
        ]);
        
        if (serverRes.ok) {
          const data = await serverRes.json();
          setPremium(data.premium || false);
          setServerName(data.serverName || 'Server');
          
          // Trigger confetti if premium
          if (data.premium) {
            triggerConfetti();
          }
        }

        if (siteSettingsRes.ok) {
          const siteData = await siteSettingsRes.json();
          setPremiumPurchaseEnabled(siteData.premiumPurchaseEnabled ?? true);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (guildId) {
      fetchData();
    }
  }, [guildId]);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff6b35', '#f7931e', '#fbb034', '#ffcc00', '#fff'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff6b35', '#f7931e', '#fbb034', '#ffcc00', '#fff'],
      });
    }, 250);
  };

  const handleCheckout = async () => {
    if (!guildId || checkoutLoading) return;
    
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverId: guildId, billingType }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData.details || errorData.message || errorData.error || 'Failed to create checkout session';
        throw new Error(errorMessage);
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start checkout. Please try again.';
      alert(errorMessage);
      setCheckoutLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <ServerPageWrapper>
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-20 left-4 z-[60] bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg shadow-lg transition-colors"
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
          className="md:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12 md:ml-0">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#0f172a]">Luno</span>
          </Link>
        </div>
        
        <div className="px-4 py-4">
          <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>
            ← Back to Servers
          </Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href={`/servers/${guildId}`} className="flex items-center gap-3 px-3 py-6 bg-white text-slate-700 hover:text-orange-700 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <img src="/dashbaord.png" alt="" className="w-5 h-5" />
            Dashboard
          </Link>
          
          <details className="text-slate-700" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span className="flex items-center gap-3"><img src="/settings.png" alt="" className="w-5 h-5" />Settings</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  General
                </Link>
                <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Setup
                </Link>
              </div>
            )}
          </details>

          <details className="text-slate-700" open={configOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
              <span className="flex items-center gap-3">
                <img src="/configuration.png" alt="" className="w-5 h-5" />
                Configuration
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {configOpen && (
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Automod
                </Link>
                <Link href={`/servers/${guildId}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Logging
                </Link>
                <Link href={`/servers/${guildId}/configuration/anti-raid`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Anti-Raid
                </Link>
                <Link href={`/servers/${guildId}/configuration/reaction-roles`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Reaction Roles
                </Link>
                <Link href={`/servers/${guildId}/configuration/verification`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Verification
                </Link>
              </div>
            )}
          </details>

          <details className="text-slate-700" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none transition-colors" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3"><img src="/modules.png" alt="" className="w-5 h-5" />Modules</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/moderation') ? 'bg-orange-100 text-orange-700' : ''} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Moderation
                </Link>
                <Link href={`/servers/${guildId}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/role-management') ? 'bg-orange-100 text-orange-700' : ''} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Role Management
                </Link>
                <Link href={`/servers/${guildId}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/member-management') ? 'bg-orange-100 text-orange-700' : ''} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Member Management
                </Link>
                <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/announcements') ? 'bg-orange-100 text-orange-700' : ''} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Announcements
                </Link>
                <Link href={`/servers/${guildId}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/notifications') ? 'bg-orange-100 text-orange-700' : ''} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Welcome Messages
                </Link>
                <Link href={`/servers/${guildId}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/fun') ? 'bg-orange-100 text-orange-700' : ''} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Fun
                </Link>
                <Link href={`/servers/${guildId}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/utilities') ? 'bg-orange-100 text-orange-700' : ''} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      <main className="flex-1 ml-0 md:ml-64 py-12 px-4 md:px-6 lg:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">PREMIUM</p>
            <h1 className="text-3xl font-bold">Upgrade to Premium</h1>
          </div>

          {premium ? (
            <>
              {/* Welcome Hero Section */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-12 text-center text-white">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <img src="/premium-icon.svg" alt="Premium" className="w-16 h-16" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Welcome to Luno Premium! 🎉</h1>
                <p className="text-xl text-orange-50 mb-8 max-w-2xl mx-auto">
                  Thank you for supporting Luno! Your server now has access to all premium features and exclusive perks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/servers/${guildId}/premium/manage`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-lg transition shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Subscription
                  </Link>
                  <Link
                    href={`/servers/${guildId}`}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-lg transition shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Back to Dashboard
                  </Link>
                </div>
              </div>

              {/* Premium Features Unlocked */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Premium Features Unlocked</h2>
                </div>
                <p className="text-slate-600 mb-8">Your server now has access to these exclusive features:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">Custom Welcome Messages</h3>
                      <p className="text-sm text-slate-600">Fully customize welcome embed titles, descriptions, colors, and footers</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">Advanced Verification</h3>
                      <p className="text-sm text-slate-600">Create custom verification messages and advanced verification rules</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">Advanced Logging Options</h3>
                      <p className="text-sm text-slate-600">Ignore specific channels, roles, users, and apply custom filters</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">Unlimited Reaction Roles</h3>
                      <p className="text-sm text-slate-600">Create unlimited reaction role panels with advanced customization</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">Priority Support</h3>
                      <p className="text-sm text-slate-600">Get faster response times with priority support tickets</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">Early Access to Features</h3>
                      <p className="text-sm text-slate-600">Be the first to test and use new features before public release</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link
                    href={`/servers/${guildId}/configuration/verification`}
                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-orange-500 transition group"
                  >
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center transition">
                      <svg className="w-6 h-6 text-slate-600 group-hover:text-orange-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Setup Verification</p>
                      <p className="text-xs text-slate-600">Configure custom verification</p>
                    </div>
                  </Link>

                  <Link
                    href={`/servers/${guildId}/configuration/reaction-roles`}
                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-orange-500 transition group"
                  >
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center transition">
                      <svg className="w-6 h-6 text-slate-600 group-hover:text-orange-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Reaction Roles</p>
                      <p className="text-xs text-slate-600">Create unlimited panels</p>
                    </div>
                  </Link>

                  <Link
                    href={`/servers/${guildId}/general`}
                    className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-orange-500 transition group"
                  >
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center transition">
                      <svg className="w-6 h-6 text-slate-600 group-hover:text-orange-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">Welcome Messages</p>
                      <p className="text-xs text-slate-600">Customize welcomes</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Support Section */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl shadow-sm p-8 text-center">
                <h2 className="text-xl font-bold text-slate-900 mb-3">Need Help?</h2>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  As a premium member, you have access to priority support. If you have any questions or need assistance with premium features, our team is here to help!
                </p>
                <a
                  href="https://discord.gg/luno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-lg transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                  Join Support Server
                </a>
              </div>
            </>
          ) : (
            <>
              {/* Premium Benefits Card */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center">
                    <img src="/premium-icon.svg" alt="Premium" className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Luno Premium</h2>
                    <p className="text-slate-600">Unlock advanced features for your server</p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Premium Features Include:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-900">Custom Welcome Messages</p>
                        <p className="text-sm text-slate-600">Personalize titles, descriptions, colors, and footers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-900">Advanced Verification</p>
                        <p className="text-sm text-slate-600">Custom verification messages and rules</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-900">Advanced Logging Options</p>
                        <p className="text-sm text-slate-600">Ignored channels, roles, users, and more filters</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-900">Unlimited Reaction Roles</p>
                        <p className="text-sm text-slate-600">Create unlimited panels with advanced options</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-900">Priority Support</p>
                        <p className="text-sm text-slate-600">Get help faster with priority support tickets</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <p className="font-medium text-slate-900">Early Access to Features</p>
                        <p className="text-sm text-slate-600">Be the first to try new features</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl shadow-sm p-8 relative">
                {!premiumPurchaseEnabled && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-orange-500/20 rounded-xl flex flex-col items-center justify-center z-10">
                    <div className="bg-white/90 rounded-xl p-8 shadow-xl text-center">
                      <div className="text-6xl mb-4">🚀</div>
                      <h3 className="text-3xl font-bold text-orange-600 mb-2">Coming Soon</h3>
                      <p className="text-slate-600">Premium subscriptions will be available soon!</p>
                    </div>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Choose Your Plan</h3>
                  
                  {/* Billing Type Toggle */}
                  <div className="inline-flex items-center gap-2 p-1 bg-white rounded-lg shadow-sm mb-6">
                    <button
                      onClick={() => setBillingType('monthly')}
                      className={`px-6 py-3 rounded-md font-semibold transition ${
                        billingType === 'monthly'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingType('yearly')}
                      className={`px-6 py-3 rounded-md font-semibold transition relative ${
                        billingType === 'yearly'
                          ? 'bg-orange-500 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Yearly
                      <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        SAVE 17%
                      </span>
                    </button>
                  </div>

                  <div className="flex items-baseline justify-center gap-2">
                    {billingType === 'monthly' ? (
                      <>
                        <span className="text-5xl font-bold text-orange-600">£3.99</span>
                        <span className="text-slate-600">/month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-orange-600">£29.99</span>
                        <span className="text-slate-600">/year</span>
                      </>
                    )}
                  </div>
                  
                  {billingType === 'yearly' && (
                    <p className="text-sm text-green-700 font-semibold mt-2">
                      Save £17.89 compared to monthly billing!
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-center text-slate-700">
                    Unlock all premium features for your server and support Luno's development!
                  </p>
                  {billingType === 'yearly' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 font-semibold text-center">
                        ✨ Best Value - Save over £17 with yearly billing!
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={checkoutLoading || !premiumPurchaseEnabled}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white text-lg font-bold rounded-lg transition flex items-center justify-center gap-3 shadow-lg"
                >
                  <img src="/premium-icon.svg" alt="" className="w-6 h-6" />
                  {checkoutLoading ? 'Loading...' : `Subscribe ${billingType === 'monthly' ? 'Monthly' : 'Yearly'}`}
                  {!checkoutLoading && <span>→</span>}
                </button>

                <p className="text-center text-sm text-slate-600 mt-4">
                  Cancel anytime • Instant activation • Secure payment
                </p>
              </div>

              {/* FAQ Section */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">How does billing work?</h4>
                    <p className="text-slate-600 text-sm">
                      Premium is billed monthly. You'll be charged $4.99 per month and can cancel anytime.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Can I cancel anytime?</h4>
                    <p className="text-slate-600 text-sm">
                      Yes! You can cancel your subscription at any time. You'll continue to have premium access until the end of your billing period.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Is premium per server or per account?</h4>
                    <p className="text-slate-600 text-sm">
                      Premium is per server. Each server requires its own premium subscription.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">What payment methods do you accept?</h4>
                    <p className="text-slate-600 text-sm">
                      We accept all major credit cards, debit cards, and PayPal through our secure payment processor.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
    </ServerPageWrapper>
  );
}
