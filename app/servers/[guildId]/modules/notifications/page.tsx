'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ServerHeader from '@/components/ServerHeader';

interface MessageConfig {
  enabled: boolean;
  channel: string;
  title: string;
  description: string;
  color: string;
  footer: string;
}

interface NotificationsSettings {
  welcomeMessage: MessageConfig;
  leaveMessage: MessageConfig;
}

export default function NotificationsPage() {
  const params = useParams();
  const router = useRouter();
  const guildId = params.guildId as string;

  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [channels, setChannels] = useState<Array<{ id: string; name: string }>>([]);

  const [welcomeMessage, setWelcomeMessage] = useState<MessageConfig>({
    enabled: false,
    channel: '',
    title: 'Welcome to {server}!',
    description: 'Hey {user}, welcome to **{server}**! You are member #{memberCount}.',
    color: '#f97316',
    footer: 'Enjoy your stay!'
  });

  const [leaveMessage, setLeaveMessage] = useState<MessageConfig>({
    enabled: false,
    channel: '',
    title: 'Member Left',
    description: '{user} has left the server. We now have {memberCount} members.',
    color: '#f97316',
    footer: 'Goodbye!'
  });

  const [initialSettings, setInitialSettings] = useState<NotificationsSettings>({
    welcomeMessage,
    leaveMessage
  });

  useEffect(() => {
    fetchSettings();
    fetchChannels();
  }, [guildId]);

  useEffect(() => {
    const changed = JSON.stringify({ welcomeMessage, leaveMessage }) !== JSON.stringify(initialSettings);
    setHasChanges(changed);
  }, [welcomeMessage, leaveMessage, initialSettings]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/servers/${guildId}/modules/notifications`);
      if (res.ok) {
        const data = await res.json();
        if (data.welcomeMessage) setWelcomeMessage(data.welcomeMessage);
        if (data.leaveMessage) setLeaveMessage(data.leaveMessage);
        setInitialSettings({
          welcomeMessage: data.welcomeMessage || welcomeMessage,
          leaveMessage: data.leaveMessage || leaveMessage
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const res = await fetch(`/api/servers/${guildId}/channels-and-roles`);
      if (res.ok) {
        const data = await res.json();
        setChannels(data.channels || []);
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/servers/${guildId}/modules/notifications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ welcomeMessage, leaveMessage })
      });

      if (res.ok) {
        setInitialSettings({ welcomeMessage, leaveMessage });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = () => {
    setWelcomeMessage(initialSettings.welcomeMessage);
    setLeaveMessage(initialSettings.leaveMessage);
    setHasChanges(false);
  };

  const replaceVariables = (text: string) => {
    return text
      .replace(/{user}/g, '<span class="text-orange-500 font-semibold">@Username</span>')
      .replace(/{server}/g, '<span class="font-semibold">Example Server</span>')
      .replace(/{memberCount}/g, '<span class="font-semibold">1,234</span>');
  };

  const renderPreview = (config: MessageConfig, title: string) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      {config.enabled ? (
        <div className="bg-gray-700 rounded p-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-white font-semibold">Luno</span>
                <span className="text-xs text-gray-400">Today at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="bg-gray-800 rounded border-l-4 p-3 mt-2" style={{ borderLeftColor: config.color }}>
                {config.title && (
                  <div className="text-white font-semibold mb-2" dangerouslySetInnerHTML={{ __html: replaceVariables(config.title) }} />
                )}
                {config.description && (
                  <div className="text-gray-300 text-sm mb-2" dangerouslySetInnerHTML={{ __html: replaceVariables(config.description) }} />
                )}
                {config.footer && (
                  <div className="text-xs text-gray-400 mt-2" dangerouslySetInnerHTML={{ __html: replaceVariables(config.footer) }} />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-700 rounded p-8 text-center text-gray-400">
          Preview disabled
        </div>
      )}
    </div>
  );

  const renderMessageSection = (
    config: MessageConfig,
    setConfig: React.Dispatch<React.SetStateAction<MessageConfig>>,
    sectionTitle: string
  ) => (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{sectionTitle}</h2>
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
            />
            <div className={`block w-14 h-8 rounded-full ${config.enabled ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${config.enabled ? 'transform translate-x-6' : ''}`}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            {config.enabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Channel
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={config.channel}
              onChange={(e) => setConfig({ ...config, channel: e.target.value })}
              disabled={!config.enabled}
            >
              <option value="">Select a channel</option>
              {channels.map(ch => (
                <option key={ch.id} value={ch.id}>#{ch.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              disabled={!config.enabled}
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              rows={4}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              disabled={!config.enabled}
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={config.footer}
              onChange={(e) => setConfig({ ...config, footer: e.target.value })}
              disabled={!config.enabled}
              placeholder="Enter footer text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Embed Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
                value={config.color}
                onChange={(e) => setConfig({ ...config, color: e.target.value })}
                disabled={!config.enabled}
              />
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={config.color}
                onChange={(e) => setConfig({ ...config, color: e.target.value })}
                disabled={!config.enabled}
                placeholder="#f97316"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-900 font-medium mb-1">Available Variables:</p>
            <div className="text-sm text-blue-800 space-y-1">
              <div><code className="bg-blue-100 px-1 rounded">{'{user}'}</code> - Mentions the user</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{server}'}</code> - Server name</div>
              <div><code className="bg-blue-100 px-1 rounded">{'{memberCount}'}</code> - Total member count</div>
            </div>
          </div>
        </div>

        <div>
          {renderPreview(config, 'Live Preview')}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-[#0f172a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ServerHeader guildId={guildId} />
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <nav className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Navigation</div>
            <a
              href={`/servers/${guildId}`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Dashboard
            </a>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">Settings</div>
            <a
              href={`/servers/${guildId}/general`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              General
            </a>
            <a
              href={`/servers/${guildId}/setup`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Setup
            </a>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">Configuration</div>
            <a
              href={`/servers/${guildId}/configuration/logging`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Logging
            </a>
            <a
              href={`/servers/${guildId}/configuration/anti-raid`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Anti-Raid
            </a>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">Modules</div>
            <a
              href={`/servers/${guildId}/modules/moderation`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Moderation
            </a>
            <a
              href={`/servers/${guildId}/modules/role-management`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Role Management
            </a>
            <a
              href={`/servers/${guildId}/modules/member-management`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Member Management
            </a>
            <a
              href={`/servers/${guildId}/modules/announcements`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Announcements
            </a>
            <a
              href={`/servers/${guildId}/modules/notifications`}
              className="flex items-center px-3 py-2 text-sm font-medium bg-orange-100 text-orange-700 rounded-md"
            >
              Welcome Messages
            </a>
            <a
              href={`/servers/${guildId}/modules/tickets`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Tickets
            </a>
            <a
              href={`/servers/${guildId}/modules/custom-commands`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Custom Commands
            </a>
            <a
              href={`/servers/${guildId}/modules/fun`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Fun
            </a>
            <a
              href={`/servers/${guildId}/modules/utilities`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Utilities
            </a>

            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4">Management</div>
            <a
              href={`/servers/${guildId}/commands`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Commands
            </a>
            <a
              href={`/servers/${guildId}/logs`}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
            >
              Logs
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Messages</h1>
              <p className="text-gray-600 mt-2">Configure welcome and leave messages for your server</p>
            </div>

            {renderMessageSection(welcomeMessage, setWelcomeMessage, 'Welcome Messages')}
            {renderMessageSection(leaveMessage, setLeaveMessage, 'Leave Messages')}
          </div>
        </main>
      </div>

      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm font-medium text-gray-700">You have unsaved changes</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
