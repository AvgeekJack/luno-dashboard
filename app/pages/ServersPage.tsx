"use client";

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

export default function ServersPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);

  useEffect(() => {
    if (session) {
      fetch('/api/servers')
        .then(res => res.json())
        .then(data => setGuilds(data))
        .catch(err => console.error(err));
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

  return (
    <div className="min-h-screen bg-white text-[#0f172a] pt-36 pb-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Servers</p>
          <h1 className="text-4xl font-bold">Your connected Discord servers</h1>
          <p className="text-slate-600">Select a server to manage settings and automation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map(guild => (
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

        {guilds.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            No servers found. Make sure Luno is added to your Discord servers.
          </div>
        )}
      </div>
    </div>
  );
}
