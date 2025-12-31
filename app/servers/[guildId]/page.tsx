'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Settings {
  guildId: string;
  prefix: string;
  moderation: {
    enabled: boolean;
    logChannel: string | null;
  };
  welcome: {
    enabled: boolean;
    message: string;
    channel: string | null;
  };
}

export default function ServerSettings() {
  const { data: session, status } = useSession();
  const { guildId } = useParams();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
  }, [session, status, guildId, router]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/servers/${guildId}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Settings saved!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!settings) {
    return <div className="flex min-h-screen items-center justify-center">Server not found</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Servers</Link>
          <h1 className="text-3xl font-semibold mt-4">Server Settings</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Bot Prefix</label>
            <input
              type="text"
              value={settings.prefix}
              onChange={(e) => setSettings({ ...settings, prefix: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">Moderation</h2>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.moderation.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  moderation: { ...settings.moderation, enabled: e.target.checked }
                })}
                className="mr-2"
              />
              Enable Moderation
            </label>
            <label className="block text-sm font-medium mb-2">Log Channel ID</label>
            <input
              type="text"
              value={settings.moderation.logChannel || ''}
              onChange={(e) => setSettings({
                ...settings,
                moderation: { ...settings.moderation, logChannel: e.target.value || null }
              })}
              className="w-full p-2 border rounded"
              placeholder="Channel ID for logs"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">Welcome Messages</h2>
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={settings.welcome.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  welcome: { ...settings.welcome, enabled: e.target.checked }
                })}
                className="mr-2"
              />
              Enable Welcome Messages
            </label>
            <label className="block text-sm font-medium mb-2">Welcome Message</label>
            <textarea
              value={settings.welcome.message}
              onChange={(e) => setSettings({
                ...settings,
                welcome: { ...settings.welcome, message: e.target.value }
              })}
              className="w-full p-2 border rounded"
              rows={3}
            />
            <label className="block text-sm font-medium mb-2 mt-2">Welcome Channel ID</label>
            <input
              type="text"
              value={settings.welcome.channel || ''}
              onChange={(e) => setSettings({
                ...settings,
                welcome: { ...settings.welcome, channel: e.target.value || null }
              })}
              className="w-full p-2 border rounded"
              placeholder="Channel ID for welcomes"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}