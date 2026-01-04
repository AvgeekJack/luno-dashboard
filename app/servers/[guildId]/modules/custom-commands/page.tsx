'use client';

import { useParams, useRouter } from 'next/navigation';
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

interface ModuleState {
  enabled: boolean;
  command: CustomCommand;
}

export default function CustomCommandsPage() {
  const params = useParams();
  const router = useRouter();
  const guildId = params.guildId as string;

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
  const [initialState, setInitialState] = useState<ModuleState | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [guildId]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/servers/${guildId}/modules/custom-commands`);
      if (response.ok) {
        const data = await response.json();
        setEnabled(data.enabled || false);
        setCommand(data.command || {
          trigger: '',
          title: '',
          description: '',
          color: '#f97316',
          footer: '',
          thumbnailUrl: '',
          imageUrl: '',
          fields: [],
        });
        setInitialState({
          enabled: data.enabled || false,
          command: data.command || {
            trigger: '',
            title: '',
            description: '',
            color: '#f97316',
            footer: '',
            thumbnailUrl: '',
            imageUrl: '',
            fields: [],
          },
        });
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
        const newState = { enabled, command };
        setInitialState(newState);
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

  const navigate = (path: string) => {
    router.push(`/servers/${guildId}${path}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Server Settings</h2>
          <nav className="space-y-1">
            <button
              onClick={() => navigate('')}
              className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </button>

            <div className="pt-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
                Settings
              </h3>
              <button
                onClick={() => navigate('/general')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                General
              </button>
              <button
                onClick={() => navigate('/setup')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Setup
              </button>
            </div>

            <div className="pt-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
                Configuration
              </h3>
              <button
                onClick={() => navigate('/configuration/logging')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Logging
              </button>
              <button
                onClick={() => navigate('/configuration/anti-raid')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Anti-Raid
              </button>
            </div>

            <div className="pt-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-2">
                Modules
              </h3>
              <button
                onClick={() => navigate('/modules/moderation')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Moderation
              </button>
              <button
                onClick={() => navigate('/modules/role-management')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Role Management
              </button>
              <button
                onClick={() => navigate('/modules/member-management')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Member Management
              </button>
              <button
                onClick={() => navigate('/modules/announcements')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Announcements
              </button>
              <button
                onClick={() => navigate('/modules/member-management')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Welcome Messages
              </button>
              <button
                onClick={() => navigate('/modules/tickets')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Tickets
              </button>
              <button
                onClick={() => navigate('/modules/custom-commands')}
                className="w-full text-left px-3 py-2 rounded text-sm bg-orange-100 text-orange-700"
              >
                Custom Commands
              </button>
              <button
                onClick={() => navigate('/modules/fun')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Fun
              </button>
              <button
                onClick={() => navigate('/modules/utilities')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Utilities
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate('/commands')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Commands
              </button>
              <button
                onClick={() => navigate('/logs')}
                className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100"
              >
                Logs
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Custom Commands</h1>
            <p className="text-gray-600 mt-2">
              Create custom embed commands for your server
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Enable Custom Commands</h2>
                <p className="text-sm text-gray-600">Allow custom embed commands in your server</p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => {
                  setEnabled(checked);
                  setHasChanges(true);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Embed Builder */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Embed Builder</h2>

              <div className="space-y-4">
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
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <textarea
                          value={field.value}
                          onChange={(e) => updateField(index, { value: e.target.value })}
                          placeholder="Field value"
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <label className="flex items-center text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={field.inline}
                            onChange={(e) => updateField(index, { inline: e.target.checked })}
                            className="mr-2"
                          />
                          Inline
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    L
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">Luno</span>
                      <span className="text-xs text-gray-400">
                        {new Date().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className="rounded overflow-hidden"
                      style={{
                        backgroundColor: '#2f3136',
                        borderLeft: `4px solid ${command.color || '#f97316'}`,
                      }}
                    >
                      <div className="p-3 relative">
                        {command.thumbnailUrl && (
                          <img
                            src={command.thumbnailUrl}
                            alt="Thumbnail"
                            className="absolute top-3 right-3 w-20 h-20 rounded object-cover"
                          />
                        )}

                        {command.title && (
                          <div className="font-semibold text-white mb-2 pr-24">
                            {command.title}
                          </div>
                        )}

                        {command.description && (
                          <div className="text-sm text-gray-300 mb-3 whitespace-pre-wrap">
                            {command.description}
                          </div>
                        )}

                        {command.fields.length > 0 && (
                          <div
                            className={
                              command.fields.some((f) => f.inline)
                                ? 'grid grid-cols-2 gap-3'
                                : 'space-y-3'
                            }
                          >
                            {command.fields.map((field, index) => (
                              <div
                                key={index}
                                className={field.inline ? '' : 'col-span-2'}
                              >
                                {field.name && (
                                  <div className="text-sm font-semibold text-white mb-1">
                                    {field.name}
                                  </div>
                                )}
                                {field.value && (
                                  <div className="text-sm text-gray-300 whitespace-pre-wrap">
                                    {field.value}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {command.imageUrl && (
                          <img
                            src={command.imageUrl}
                            alt="Embed"
                            className="mt-3 rounded max-w-full"
                          />
                        )}

                        {command.footer && (
                          <div className="text-xs text-gray-400 mt-3">
                            {command.footer}
                          </div>
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

      {/* Save/Reset Overlay */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-white font-medium">You have unsaved changes</span>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                disabled={saving}
                className="px-4 py-2 text-white hover:text-gray-300 disabled:opacity-50"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
