"use client";

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  inBot?: boolean;
}

export default function ServersPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const router = useRouter();
  const inviteBase = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || '#';

  const inviteUrl = (guildId: string) => {
    if (inviteBase === '#') return '#';
    const joiner = inviteBase.includes('?') ? '&' : '?';
    return `${inviteBase}${joiner}guild_id=${guildId}`;
  };

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

  const botGuilds = guilds.filter(g => g.inBot);
  const notInBot = guilds.filter(g => g.inBot === false || g.inBot === undefined);

  const renderInBot = (title: string, items: Guild[], emptyText: string) => (
    <div className="space-y-4">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
      </div>
      {items.length === 0 ? (
        <div className="text-slate-500 text-sm">{emptyText}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(guild => (
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
      )}
    </div>
  );

  const renderNotInBot = (title: string, items: Guild[], emptyText: string) => (
    <div className="space-y-4">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-[#0f172a]">{title}</h2>
      </div>
      {items.length === 0 ? (
        <div className="text-slate-500 text-sm">{emptyText}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(guild => (
            <div key={guild.id} className="bg-white p-6 rounded-xl border border-orange-100 hover:border-orange-300 transition-colors shadow-sm hover:shadow text-center space-y-3">
              {guild.icon ? (
                <img
                  src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                  alt={guild.name}
                  className="w-16 h-16 rounded-full mx-auto"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white">
                  {guild.name.charAt(0)}
                </div>
              )}
              <h3 className="text-lg font-semibold text-slate-800">{guild.name}</h3>
              <button
                onClick={() => {
                  window.open(inviteUrl(guild.id), '_blank', 'noopener,noreferrer');
                  router.push(`/servers/${guild.id}`);
                }}
                className="inline-flex items-center justify-center w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition-colors disabled:opacity-60"
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
    <div className="min-h-screen bg-white text-[#0f172a] pt-36 pb-16 px-6 md:px-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Servers</p>
          <h1 className="text-4xl font-bold">Your connected Discord servers</h1>
          <p className="text-slate-600">Select a server to manage settings and automation.</p>
        </div>

        {renderInBot('Servers Luno is In', botGuilds, 'Luno is not in any of your manageable servers yet.')}
        {renderNotInBot('Servers Luno is Not In', notInBot, 'Invite Luno to these servers to manage them here.')}
      </div>
    </div>
  );
}
