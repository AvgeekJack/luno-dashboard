"use client";

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ServerHeader from '@/components/ServerHeader';
import SystemAnnouncement from '@/components/SystemAnnouncement';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  inBot?: boolean;
  memberCount?: number | null;
}

export default function ServersPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const inviteBase = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || '#';

  const inviteUrl = (guildId: string) => {
    if (inviteBase === '#') return '#';
    const joiner = inviteBase.includes('?') ? '&' : '?';
    return `${inviteBase}${joiner}guild_id=${guildId}`;
  };

  useEffect(() => {
    if (session) {
      fetch('/api/servers', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (!res.ok) {
            console.error('Failed to fetch servers:', res.status);
            return [];
          }
          return res.json();
        })
        .then(data => {
          // Ensure data is an array before setting it
          if (Array.isArray(data)) {
            setGuilds(data);
          } else {
            console.error('Received non-array data from /api/servers:', data);
            setGuilds([]);
          }
        })
        .catch(err => {
          console.error('Error fetching servers:', err);
          setGuilds([]);
        });
    }
  }, [session]);

  if (status === 'loading') {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white text-[#0f172a] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Login to view your servers</h1>
          <p className="text-slate-600">Sign in with Discord to see and manage your connected servers.</p>
          <button
            onClick={() => signIn('discord')}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-slate-800 transition-colors"
          >
            Login with Discord
          </button>
        </div>
      </div>
    );
  }

  const botGuilds = guilds.filter(g => g.inBot && g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const notInBot = guilds.filter(g => (g.inBot === false || g.inBot === undefined) && g.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 text-[#0f172a]">
      <ServerHeader />
      <SystemAnnouncement />
      
      <main className="pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold mb-2">SERVERS</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">Your connected Discord servers</h1>
            <p className="text-base sm:text-lg text-slate-600">Select a server to manage settings and automation.</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Servers Luno is In */}
          <div className="mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Servers Luno is In</h2>
            {botGuilds.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-slate-500">
                  {searchQuery ? 'No servers found matching your search.' : 'Luno is not in any of your manageable servers yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {botGuilds.map(guild => (
                  <Link key={guild.id} href={`/servers/${guild.id}`}>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer group">
                      <div className="flex flex-col items-center text-center">
                        {guild.icon ? (
                          <img
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                            alt={guild.name}
                            className="w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-orange-500 rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                            {guild.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">{guild.name}</h3>
                        {guild.memberCount && (
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{guild.memberCount.toLocaleString()} members</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mb-12 sm:mb-16">
            <div className="text-center">
              <span className="inline-block bg-gray-200 text-slate-600 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full uppercase tracking-wider">
                Available to Add
              </span>
            </div>
          </div>

          {/* Servers Luno is Not In */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Servers Luno is Not In</h2>
            {notInBot.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-slate-500">
                  {searchQuery ? 'No servers found matching your search.' : 'Luno is already in all your manageable servers!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notInBot.map(guild => (
                  <div key={guild.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all">
                    <div className="flex flex-col items-center text-center">
                      {guild.icon ? (
                        <img
                          src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`}
                          alt={guild.name}
                          className="w-16 h-16 rounded-2xl mb-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-orange-500 rounded-2xl mb-4 flex items-center justify-center text-2xl font-bold text-white">
                          {guild.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-slate-900 mb-3">{guild.name}</h3>
                      {guild.memberCount && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{guild.memberCount.toLocaleString()} members</span>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const url = inviteUrl(guild.id);
                          if (url !== '#') {
                            window.open(url, '_blank', 'noopener,noreferrer');
                          }
                          setTimeout(() => {
                            router.push(`/servers/${guild.id}`);
                          }, 300);
                        }}
                        className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add to Server
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
