'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface TicketSettings {
  enabled: boolean;
  categoryId: string | null;
  supportRoleIds: string[];
  ticketMessage: {
    title: string;
    description: string;
    color: string;
    footer: string;
    buttonText: string;
    buttonEmoji: string;
  };
  transcripts: {
    enabled: boolean;
    channelId: string | null;
  };
  maxTicketsPerUser: number;
  autoCloseAfterHours: number;
}

interface Channel {
  id: string;
  name: string;
  type?: number;
}

interface Role {
  id: string;
  name: string;
}

export default function TicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const [settings, setSettings] = useState<TicketSettings>({
    enabled: false,
    categoryId: null,
    supportRoleIds: [],
    ticketMessage: {
      title: '🎫 Support Ticket',
      description: 'Click the button below to create a support ticket. Our team will assist you shortly!',
      color: '#f97316',
      footer: 'Ticket System',
      buttonText: 'Create Ticket',
      buttonEmoji: '🎫',
    },
    transcripts: {
      enabled: false,
      channelId: null,
    },
    maxTicketsPerUser: 1,
    autoCloseAfterHours: 24,
  });

  const [originalSettings, setOriginalSettings] = useState<TicketSettings>(settings);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [channelsRes, settingsRes] = await Promise.all([
          fetch(`/api/servers/${gid}/channels-and-roles`),
          fetch(`/api/servers/${gid}/modules/tickets`)
        ]);

        if (channelsRes.ok) {
          const data = await channelsRes.json();
          setChannels(data.channels || []);
          setRoles(data.roles || []);
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.tickets) {
            const loadedSettings = { ...settings, ...data.tickets };
            setSettings(loadedSettings);
            setOriginalSettings(loadedSettings);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status, router, gid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/servers/${gid}/modules/tickets`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setOriginalSettings({ ...settings });
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings({ ...originalSettings });
    setHasUnsavedChanges(false);
  };

  const updateSetting = <K extends keyof TicketSettings>(key: K, value: TicketSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const updateMessage = <K extends keyof TicketSettings['ticketMessage']>(
    key: K, 
    value: TicketSettings['ticketMessage'][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      ticketMessage: { ...prev.ticketMessage, [key]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const categories = channels.filter(ch => ch.type === 4);

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col">
        <div className="p-6 border-b border-orange-100">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#0f172a]">Luno</span>
          </Link>
        </div>
        
        <div className="px-4 py-4">
          <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3">← Back to Servers</Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href={`/servers/${gid}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors">
            Dashboard
          </Link>
          <details className="text-slate-800" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span className="flex items-center gap-3">Settings</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className="px-2 py-1 space-y-1">
                <Link href={`/servers/${gid}/general`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  General
                </Link>
                <Link href={`/servers/${gid}/setup`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Setup
                </Link>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={configOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
              <span className="flex items-center gap-3">Configuration</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {configOpen && (
              <div className="px-2 py-1 space-y-1">
                <Link href={`/servers/${gid}/configuration/automod`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Automod
                </Link>
                <Link href={`/servers/${gid}/configuration/logging`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Logging
                </Link>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3">Modules</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className="px-2 py-1 space-y-1">
                <Link href={`/servers/${gid}/modules/moderation`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Moderation
                </Link>
                <Link href={`/servers/${gid}/modules/role-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Role Management
                </Link>
                <Link href={`/servers/${gid}/modules/member-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Member Management
                </Link>
                <Link href={`/servers/${gid}/modules/announcements`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Announcements
                </Link>
                <Link href={`/servers/${gid}/modules/tickets`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left">
                  Tickets
                </Link>
                <Link href={`/servers/${gid}/modules/notifications`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Notifications
                </Link>
                <Link href={`/servers/${gid}/modules/custom-commands`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Custom Commands
                </Link>
                <Link href={`/servers/${gid}/modules/fun`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Fun
                </Link>
                <Link href={`/servers/${gid}/modules/utilities`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="w-full max-w-6xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">MODULE</p>
            <h1 className="text-3xl font-bold">Tickets</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            {/* Master Toggle */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Ticket System</h2>
                <p className="text-slate-600">Enable support tickets for your server</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
                className="scale-150"
              />
            </div>

            <div 
              className={`overflow-hidden transition-all duration-700 ${settings.enabled ? 'max-h-[50000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <div className="space-y-8 border-t border-orange-100 pt-8">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Basic Settings</h3>
                  
                  <div className="grid gap-4">
                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Ticket Category</label>
                      <select 
                        value={settings.categoryId || ''} 
                        onChange={(e) => updateSetting('categoryId', e.target.value || null)}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select category...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500">Category where ticket channels will be created</p>
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Support Roles</label>
                      <div className="space-y-2">
                        {settings.supportRoleIds.map((roleId, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <select 
                              value={roleId} 
                              onChange={(e) => {
                                const newRoles = [...settings.supportRoleIds];
                                newRoles[idx] = e.target.value;
                                updateSetting('supportRoleIds', newRoles);
                              }}
                              className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                            >
                              <option value="">Select role...</option>
                              {roles.map(role => (
                                <option key={role.id} value={role.id}>@{role.name}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const newRoles = settings.supportRoleIds.filter((_, i) => i !== idx);
                                updateSetting('supportRoleIds', newRoles);
                              }}
                              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => updateSetting('supportRoleIds', [...settings.supportRoleIds, ''])}
                          className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:text-orange-700 transition text-sm font-medium"
                        >
                          + Add Support Role
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">Roles that can view and manage tickets</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Max Tickets Per User</label>
                        <input 
                          type="number" 
                          value={settings.maxTicketsPerUser} 
                          onChange={(e) => updateSetting('maxTicketsPerUser', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                          min="1"
                          max="10"
                        />
                        <p className="text-xs text-slate-500">Maximum open tickets per user</p>
                      </div>

                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Auto-Close After (Hours)</label>
                        <input 
                          type="number" 
                          value={settings.autoCloseAfterHours} 
                          onChange={(e) => updateSetting('autoCloseAfterHours', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                          min="0"
                          max="168"
                        />
                        <p className="text-xs text-slate-500">0 = never auto-close</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Builder */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Ticket Message Builder</h3>
                  
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Title</label>
                        <input 
                          type="text" 
                          value={settings.ticketMessage.title} 
                          onChange={(e) => updateMessage('title', e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                          placeholder="🎫 Support Ticket"
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Description</label>
                        <textarea 
                          value={settings.ticketMessage.description} 
                          onChange={(e) => updateMessage('description', e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                          rows={4}
                          placeholder="Click the button below to create a support ticket..."
                        />
                      </div>

                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Embed Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={settings.ticketMessage.color} 
                            onChange={(e) => updateMessage('color', e.target.value)}
                            className="w-16 h-10 rounded cursor-pointer"
                          />
                          <input 
                            type="text" 
                            value={settings.ticketMessage.color} 
                            onChange={(e) => updateMessage('color', e.target.value)}
                            className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm font-mono"
                            placeholder="#f97316"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Footer Text</label>
                        <input 
                          type="text" 
                          value={settings.ticketMessage.footer} 
                          onChange={(e) => updateMessage('footer', e.target.value)}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                          placeholder="Ticket System"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                          <label className="block text-sm font-semibold text-slate-800">Button Text</label>
                          <input 
                            type="text" 
                            value={settings.ticketMessage.buttonText} 
                            onChange={(e) => updateMessage('buttonText', e.target.value)}
                            className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                            placeholder="Create Ticket"
                          />
                        </div>

                        <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                          <label className="block text-sm font-semibold text-slate-800">Button Emoji</label>
                          <input 
                            type="text" 
                            value={settings.ticketMessage.buttonEmoji} 
                            onChange={(e) => updateMessage('buttonEmoji', e.target.value)}
                            className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                            placeholder="🎫"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Preview</label>
                      <div className="p-4 bg-slate-800 rounded-lg">
                        <div 
                          className="bg-slate-700 rounded-lg p-4 border-l-4"
                          style={{ borderLeftColor: settings.ticketMessage.color }}
                        >
                          <h4 className="text-white font-bold text-lg mb-2">{settings.ticketMessage.title}</h4>
                          <p className="text-slate-300 text-sm whitespace-pre-wrap mb-3">{settings.ticketMessage.description}</p>
                          {settings.ticketMessage.footer && (
                            <p className="text-slate-400 text-xs">{settings.ticketMessage.footer}</p>
                          )}
                        </div>
                        <button 
                          className="mt-3 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition flex items-center justify-center gap-2"
                          disabled
                        >
                          <span>{settings.ticketMessage.buttonEmoji}</span>
                          <span>{settings.ticketMessage.buttonText}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transcripts */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#0f172a]">Ticket Transcripts</h3>
                      <p className="text-sm text-slate-600">Save ticket logs when closed</p>
                    </div>
                    <Switch 
                      checked={settings.transcripts.enabled} 
                      onCheckedChange={(checked) => updateSetting('transcripts', { ...settings.transcripts, enabled: checked })}
                    />
                  </div>

                  {settings.transcripts.enabled && (
                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Transcript Channel</label>
                      <select 
                        value={settings.transcripts.channelId || ''} 
                        onChange={(e) => updateSetting('transcripts', { ...settings.transcripts, channelId: e.target.value || null })}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select channel...</option>
                        {channels.filter(ch => ch.type !== 4).map(ch => (
                          <option key={ch.id} value={ch.id}>#{ch.name}</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500">Channel where transcripts will be sent</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Changes Overlay */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl transition-transform duration-300 ease-out z-50 ${
          hasUnsavedChanges ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm">Careful — you have unsaved changes!</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-white hover:underline transition"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
