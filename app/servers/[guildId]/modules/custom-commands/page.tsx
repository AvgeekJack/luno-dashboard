'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface CustomCommand {
  trigger: string;
  title: string;
  description: string;
  color: string;
  footer: string;
  thumbnailUrl: string;
  imageUrl: string;
  fields: EmbedField[];
}

export default function CustomCommandsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { guildId } = useParams();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [command, setCommand] = useState<CustomCommand>({
    trigger: '',
    title: '',
    description: '',
    color: '#f97316',
    footer: '',
    thumbnailUrl: '',
    imageUrl: '',
    fields: [],
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [initialState, setInitialState] = useState<{ enabled: boolean; command: CustomCommand } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchSettings();
  }, [guildId]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/servers/${guildId}/modules/custom-commands`);
      if (response.ok) {
        const data = await response.json();
        const newEnabled = data.enabled || false;
        const newCommand = data.command || {
          trigger: '',
          title: '',
          description: '',
          color: '#f97316',
          footer: '',
          thumbnailUrl: '',
          imageUrl: '',
          fields: [],
        };
        setEnabled(newEnabled);
        setCommand(newCommand);
        setInitialState({ enabled: newEnabled, command: newCommand });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/servers/${guildId}/modules/custom-commands`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, command }),
      });

      if (response.ok) {
        setHasChanges(false);
        setInitialState({ enabled, command });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (initialState) {
      setEnabled(initialState.enabled);
      setCommand(initialState.command);
      setHasChanges(false);
    }
  };

  const updateCommand = (updates: Partial<CustomCommand>) => {
    setCommand((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const addField = () => {
    setCommand((prev) => ({
      ...prev,
      fields: [...prev.fields, { name: '', value: '', inline: false }],
    }));
    setHasChanges(true);
  };

  const removeField = (index: number) => {
    setCommand((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  };

  const updateField = (index: number, updates: Partial<EmbedField>) => {
    setCommand((prev) => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      ),
    }));
    setHasChanges(true);
  };

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
          <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3">
            ← Back to Servers
          </Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href={`/servers/${guildId}`} className="flex items-center gap-3 px-3 py-6 bg-white hover:bg-orange-50/30 text-slate-700 hover:text-orange-700 transition-colors">
            Dashboard
          </Link>
          
          <details className="text-slate-700" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span className="flex items-center gap-3">Settings</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className={`px-2 py-1 space-y-1 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/general`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                  General
                </Link>
                <Link href={`/servers/${guildId}/setup`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${settingsOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                  Setup
                </Link>
              </div>
            )}
          </details>

          <details className="text-slate-700" open={configOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
              <span className="flex items-center gap-3">Configuration</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {configOpen && (
              <div className={`px-2 py-1 space-y-1 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/configuration/automod`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                  Automod
                </Link>
                <Link href={`/servers/${guildId}/configuration/logging`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                  Logging
                </Link>
                <Link href={`/servers/${guildId}/configuration/anti-raid`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                  Anti-Raid
                </Link>
                <Link href={`/servers/${guildId}/configuration/reaction-roles`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                  Reaction Roles
                </Link>
                <Link href={`/servers/${guildId}/configuration/verification`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}}>
                  Verification
                </Link>
              </div>
            )}
          </details>

          <details className="text-slate-700" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none hover:bg-orange-50 transition-colors" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3">Modules</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className={`px-2 py-1 space-y-1 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href={`/servers/${guildId}/modules/moderation`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/moderation') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}}>
                  Moderation
                </Link>
                <Link href={`/servers/${guildId}/modules/role-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/role-management') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}}>
                  Role Management
                </Link>
                <Link href={`/servers/${guildId}/modules/member-management`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/member-management') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}}>
                  Member Management
                </Link>
                <Link href={`/servers/${guildId}/modules/announcements`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/announcements') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}}>
                  Announcements
                </Link>
                <Link href={`/servers/${guildId}/modules/tickets`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/tickets') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}}>
                  Tickets
                </Link>
                <Link href={`/servers/${guildId}/modules/notifications`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/notifications') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}}>
                  Welcome Messages
                </Link>
                <Link href={`/servers/${guildId}/modules/custom-commands`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/custom-commands') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}}>
                  Custom Commands
                </Link>
                <Link href={`/servers/${guildId}/modules/fun`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/fun') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '350ms'}}>
                  Fun
                </Link>
                <Link href={`/servers/${guildId}/modules/utilities`} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 ${pathname?.includes('/modules/utilities') ? 'bg-orange-100 text-orange-700' : 'hover:bg-orange-50'} transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '400ms'}}>
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8">
        <div className="w-full space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Modules</p>
            <h1 className="text-3xl font-bold">Custom Commands</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Custom Embed Commands</h2>
                <p className="text-slate-600">Create custom embed commands for your server.</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={enabled} 
                  onCheckedChange={(checked) => {
                    setEnabled(checked);
                    setHasChanges(true);
                  }}
                  className="scale-150"
                />
              </div>
            </div>

            <div 
              className={`overflow-hidden transition-all duration-700 ${enabled ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}
              style={{ transitionProperty: 'max-height, opacity' }}
            >
              <div className="space-y-6 border-t border-orange-100 pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0f172a]">Embed Builder</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Command Trigger
                      </label>
                      <input
                        type="text"
                        value={command.trigger}
                        onChange={(e) => updateCommand({ trigger: e.target.value })}
                        placeholder="e.g., !rules"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={command.title}
                        onChange={(e) => updateCommand({ title: e.target.value })}
                        placeholder="Embed title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={command.description}
                        onChange={(e) => updateCommand({ description: e.target.value })}
                        placeholder="Embed description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={command.color}
                          onChange={(e) => updateCommand({ color: e.target.value })}
                          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={command.color}
                          onChange={(e) => updateCommand({ color: e.target.value })}
                          placeholder="#f97316"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Footer
                      </label>
                      <input
                        type="text"
                        value={command.footer}
                        onChange={(e) => updateCommand({ footer: e.target.value })}
                        placeholder="Footer text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail URL
                      </label>
                      <input
                        type="text"
                        value={command.thumbnailUrl}
                        onChange={(e) => updateCommand({ thumbnailUrl: e.target.value })}
                        placeholder="https://example.com/thumbnail.png"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={command.imageUrl}
                        onChange={(e) => updateCommand({ imageUrl: e.target.value })}
                        placeholder="https://example.com/image.png"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Embed Fields
                        </label>
                        <button
                          onClick={addField}
                          className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
                        >
                          Add Field
                        </button>
                      </div>

                      <div className="space-y-3">
                        {command.fields.map((field, index) => (
                          <div
                            key={index}
                            className="p-3 border border-gray-200 rounded-md space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Field {index + 1}
                              </span>
                              <button
                                onClick={() => removeField(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateField(index, { name: e.target.value })}
                              placeholder="Field name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <input
                              type="text"
                              value={field.value}
                              onChange={(e) => updateField(index, { value: e.target.value })}
                              placeholder="Field value"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.inline}
                                onChange={(e) => updateField(index, { inline: e.target.checked })}
                                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-700">Inline</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0f172a]">Preview</h3>
                    <div className="bg-gray-800 rounded-lg p-4">
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
                            {command.trigger && (
                              <div className="text-gray-300 text-sm mb-2">
                                {command.trigger}
                              </div>
                            )}
                            <div className="bg-gray-800 rounded border-l-4 p-3 mt-2" style={{ borderLeftColor: command.color }}>
                              {command.thumbnailUrl && (
                                <div className="absolute top-3 right-3">
                                  <img src={command.thumbnailUrl} alt="Thumbnail" className="w-16 h-16 rounded object-cover" />
                                </div>
                              )}
                              {command.title && (
                                <div className="text-white font-semibold mb-2">{command.title}</div>
                              )}
                              {command.description && (
                                <div className="text-gray-300 text-sm mb-2">{command.description}</div>
                              )}
                              {command.fields.length > 0 && (
                                <div className="space-y-2 mt-2">
                                  {command.fields.map((field, index) => (
                                    <div key={index} className={field.inline ? 'inline-block w-1/2 pr-2' : 'block'}>
                                      <div className="text-white font-semibold text-sm">{field.name}</div>
                                      <div className="text-gray-300 text-sm">{field.value}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {command.imageUrl && (
                                <div className="mt-2">
                                  <img src={command.imageUrl} alt="Embed" className="rounded max-h-64 object-contain" />
                                </div>
                              )}
                              {command.footer && (
                                <div className="text-xs text-gray-400 mt-2">{command.footer}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Changes Overlay */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl transition-transform duration-300 ease-out z-50 ${
          hasChanges ? 'translate-y-0' : 'translate-y-full'
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
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
