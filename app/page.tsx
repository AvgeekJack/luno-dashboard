'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Guild {
  id: string;
  name: string;
  icon: string | null;
}

export default function Home() {
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-4">Luno Bot Dashboard</h1>
          <p className="mb-6">Login with Discord to manage your servers.</p>
          <button
            onClick={() => signIn('discord')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login with Discord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold">Your Servers</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map(guild => (
            <Link key={guild.id} href={`/servers/${guild.id}`}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
                {guild.icon ? (
                  <img
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                    alt={guild.name}
                    className="w-16 h-16 rounded-full mx-auto mb-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {guild.name.charAt(0)}
                  </div>
                )}
                <h2 className="text-xl font-medium text-center">{guild.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
