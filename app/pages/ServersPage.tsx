"use client";

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ServerHeader from '@/components/ServerHeader';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  inBot?: boolean;
}

export default function ServersPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inviteBase = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || '#';

  const inviteUrl = (guildId: string) => {
    if (inviteBase === '#') return '#';
    const joiner = inviteBase.includes('?') ? '&' : '?';
    return `${inviteBase}${joiner}guild_id=${guildId}`;
  };

  useEffect(() => {
    if (session) {
      // Check if token is expired
      if ((session as any).error === 'TokenExpired') {
        console.log('Token expired, forcing re-authentication');
        setError('Your session has expired. Redirecting to login...');
        setTimeout(() => signIn('discord'), 1000);
        return;
      }
      
      console.log('Fetching servers with session');
      setLoading(true);
      setError(null);
      fetch('/api/servers')
        .then(res => {
          console.log('API response status:', res.status);
          if (!res.ok) {
            return res.json().then(errData => {
              console.error('API Error:', errData);
              const errorMsg = errData.error || 'Failed to fetch servers';
              
              // If unauthorized (expired token), force re-authentication
              if (res.status === 401) {
                setError('Authentication expired. Redirecting to login...');
                setLoading(false);
                setTimeout(() => signIn('discord'), 2000);
                return [];
              } else {
                setError(`${errorMsg} (Status: ${res.status})`);
                setLoading(false);
                return [];
              }
            }).catch(() => {
              // If we can't even parse the error, it's definitely a problem
              setError('Server error occurred');
              setLoading(false);
              return [];
            });
          }
          return res.json();
        })
        .then(data => {
          console.log('Received data from API:', data);
          // Ensure data is an array before setting it
          if (Array.isArray(data)) {
            console.log('Setting guilds:', data.length, 'guilds');
            setGuilds(data);
            setError(null);
          } else if (data && typeof data === 'object' && 'error' in data) {
            console.error('Received error from API:', data);
            setError(data.error as string);
            setGuilds([]);
          } else {
            console.error('Received non-array data from /api/servers:', data);
            setError('Received invalid data format from server');
            setGuilds([]);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching servers:', err);
          setError(`Network error: ${err.message}`);
          setGuilds([]);
          setLoading(false);
        });
    } else {
      console.log('No session available yet');
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

  const botGuilds = guilds.filter(g => g.inBot);
  const notInBot = guilds.filter(g => g.inBot === false || g.inBot === undefined);

  const renderInBot = (title: string, items: Guild[], emptyText: string) => (
    <div className="space-y-4 w-full px-2">
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">{title}</h2>
      </div>
      {items.length === 0 ? (
        <div className="text-slate-500 text-xs sm:text-sm">{emptyText}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center">
          {items.map(guild => (
            <Link key={guild.id} href={`/servers/${guild.id}`}>
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-orange-100 hover:border-orange-300 transition-colors shadow-sm hover:shadow cursor-pointer text-center">
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt={guild.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                    {guild.name.charAt(0)}
                  </div>
                )}
                <h3 className="text-base sm:text-lg font-semibold text-slate-800">{guild.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  const renderNotInBot = (title: string, items: Guild[], emptyText: string) => (
    <div className="space-y-4 w-full px-2">
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a]">{title}</h2>
      </div>
      {items.length === 0 ? (
        <div className="text-slate-500 text-xs sm:text-sm">{emptyText}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-center">
          {items.map(guild => (
            <div key={guild.id} className="bg-white p-5 sm:p-6 rounded-xl border border-orange-100 hover:border-orange-300 transition-colors shadow-sm hover:shadow text-center space-y-2 sm:space-y-3">
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt={guild.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto"
                />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full mx-auto flex items-center justify-center text-xl sm:text-2xl font-bold text-white">
                  {guild.name.charAt(0)}
                </div>
              )}
              <h3 className="text-base sm:text-lg font-semibold text-slate-800">{guild.name}</h3>
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
                className="inline-flex items-center justify-center w-full bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-semibold shadow hover:bg-orange-600 transition-colors disabled:opacity-60"
              >
                Add to Server
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#0f172a] pt-24 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 md:px-10 flex justify-center">
      <ServerHeader />
      <div className="w-full max-w-6xl space-y-8 sm:space-y-12 flex flex-col items-center">
        <div className="text-center space-y-2 sm:space-y-3 px-2">
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Servers</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Your connected Discord servers</h1>
          <p className="text-sm sm:text-base text-slate-600">Select a server to manage settings and automation.</p>
        </div>

        {/* Error and Loading States */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800">Error Loading Servers</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <button 
                  onClick={() => signIn('discord')}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Re-authenticate with Discord
                </button>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-blue-700 mt-2">Loading your servers...</p>
          </div>
        )}

        {/* Debug info - remove this later */}
        <div className="w-full bg-slate-100 p-4 rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Session status: {status}</p>
          <p>Session exists: {session ? 'Yes' : 'No'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Total guilds: {guilds.length}</p>
          <p>Guilds with bot: {botGuilds.length}</p>
          <p>Guilds without bot: {notInBot.length}</p>
        </div>

        {renderInBot('Servers Luno is In', botGuilds, 'Luno is not in any of your manageable servers yet.')}
        <div className="w-full py-[7.5px]">
          <div className="w-full border-t-[2.5px] border-orange-200" />
        </div>
        {renderNotInBot('Servers Luno is Not In', notInBot, 'Invite Luno to these servers to manage them here.')}
      </div>
    </div>
  );
}
