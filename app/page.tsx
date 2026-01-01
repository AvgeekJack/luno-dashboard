'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

export default function Home() {
  const { data: session } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);

  useEffect(() => {
    if (session) {
      fetch('/api/servers')
        .then(res => res.json())
        .then(data => setGuilds(data))
        .catch(err => console.error(err));
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-white text-[#0f172a]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur border-b border-orange-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl shadow-md"></div>
            <div className="text-left">
              <span className="block text-xl font-bold tracking-tight">LUNO</span>
              <span className="block text-sm text-slate-500">Discord Bot</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Features</Link>
            <Link href="#commands" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Commands</Link>
            <Link href="#premium" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">Premium</Link>
            {session ? (
              <Link href="/servers" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-orange-600 transition-colors">
                Dashboard
              </Link>
            ) : (
              <button
                onClick={() => signIn('discord')}
                className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-slate-800 transition-colors"
              >
                Login with Discord
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 bg-gradient-to-b from-orange-50 via-white to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-14">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#0f172a] leading-tight">
              The Discord Bot that does it all. Automatically
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              A fully customizable server moderation bot with a clean dashboard. Server management just got a whole lot easier.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold shadow hover:bg-orange-600 transition-colors">
                Add To Server
              </button>
              <button
                onClick={() => signIn('discord')}
                className="bg-white text-slate-900 px-8 py-3 rounded-full text-lg font-semibold border border-orange-100 shadow-sm hover:border-orange-300 hover:shadow transition-colors"
              >
                Login with Discord
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              Luno powers millions of servers—join in and make moderation effortless.
            </p>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-300 rounded-3xl blur-3xl opacity-25"></div>
            <div className="relative bg-white rounded-2xl border border-orange-100 p-8 shadow-2xl">
              <div className="bg-slate-50 rounded-xl overflow-hidden border border-orange-100">
                <div className="flex items-center space-x-2 bg-white px-4 py-3 border-b border-orange-100">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-8 min-h-[380px] flex items-center justify-center">
                  {session && guilds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                      {guilds.slice(0, 6).map(guild => (
                        <Link key={guild.id} href={`/servers/${guild.id}`}>
                          <div className="bg-white p-6 rounded-xl border border-orange-100 hover:border-orange-300 transition-colors shadow-sm hover:shadow cursor-pointer text-center">
                            {guild.icon ? (
                              <img
                                src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                alt={guild.name}
                                className="w-16 h-16 rounded-full mx-auto mb-4"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                                {guild.name.charAt(0)}
                              </div>
                            )}
                            <h3 className="text-lg font-semibold text-slate-800">{guild.name}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-800 mb-2">Dashboard Preview</h3>
                      <p className="text-slate-500">Login to view your servers</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-18 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-14 text-[#0f172a]">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow transition-shadow text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0f172a]">Auto Moderation</h3>
              <p className="text-slate-600">Keep your server safe with automatic moderation tools and custom filters.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow transition-shadow text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0f172a]">Custom Commands</h3>
              <p className="text-slate-600">Create custom commands and responses tailored to your community.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-orange-100 shadow-sm hover:shadow transition-shadow text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#0f172a]">Advanced Analytics</h3>
              <p className="text-slate-600">Track server activity, member growth, and engagement metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-white border-t border-orange-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl shadow-md"></div>
                <span className="text-xl font-bold text-[#0f172a]">LUNO</span>
              </div>
              <p className="text-sm text-slate-600">The Discord bot that does it all.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#0f172a]">LUNO</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-orange-600 transition-colors">Luno Bot</Link></li>
                <li><Link href="#" className="hover:text-orange-600 transition-colors">Bot Commands</Link></li>
                <li><Link href="#" className="hover:text-orange-600 transition-colors">Get Premium</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#0f172a]">LEGAL</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link href="#" className="hover:text-orange-600 transition-colors">Terms and Conditions</Link></li>
                <li><Link href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#0f172a]">GET IN TOUCH</h4>
              <div className="flex justify-center md:justify-start gap-3">
                <a href="#" className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-orange-100 text-center text-sm text-slate-500">
            <p>© 2026 Luno Bot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
