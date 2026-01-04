'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface CommandSettings {
  enabled: boolean;
  allowedChannels: string[];
  ignoredChannels: string[];
  allowedRoles: string[];
  ignoredRoles: string[];
}

interface CommandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  commandName: string;
  module: string;
  guildId: string;
}

export function CommandSettingsModal({
  isOpen,
  onClose,
  commandName,
  module,
  guildId,
}: CommandSettingsModalProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [settings, setSettings] = useState<CommandSettings>({
    enabled: true,
    allowedChannels: [],
    ignoredChannels: [],
    allowedRoles: [],
    ignoredRoles: [],
  });
  const [originalSettings, setOriginalSettings] = useState<CommandSettings>({
    enabled: true,
    allowedChannels: [],
    ignoredChannels: [],
    allowedRoles: [],
    ignoredRoles: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load channels, roles, and command settings
  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch channels and roles
        const channelsRolesRes = await fetch(`/api/servers/${guildId}/channels-and-roles`);
        if (channelsRolesRes.ok) {
          const data = await channelsRolesRes.json();
          setChannels(data.channels || []);
          setRoles(data.roles || []);
        }

        // Fetch command settings directly
        const commandKey = commandName.replace('/', '').replace(/ /g, '');
        const settingsRes = await fetch(`/api/servers/${guildId}/commands/${commandKey}`);
        if (settingsRes.ok) {
          const commandData = await settingsRes.json();
          
          const loadedSettings = {
            enabled: commandData.enabled ?? true,
            allowedChannels: commandData.allowedChannels || [],
            ignoredChannels: commandData.ignoredChannels || [],
            allowedRoles: commandData.allowedRoles || [],
            ignoredRoles: commandData.ignoredRoles || [],
          };
          setSettings(loadedSettings);
          setOriginalSettings(loadedSettings);
        }
      } catch (error) {
        console.error('Failed to load command settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, guildId, commandName]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges =
      JSON.stringify(settings.allowedChannels) !== JSON.stringify(originalSettings.allowedChannels) ||
      JSON.stringify(settings.ignoredChannels) !== JSON.stringify(originalSettings.ignoredChannels) ||
      JSON.stringify(settings.allowedRoles) !== JSON.stringify(originalSettings.allowedRoles) ||
      JSON.stringify(settings.ignoredRoles) !== JSON.stringify(originalSettings.ignoredRoles);
    
    setHasUnsavedChanges(hasChanges);
  }, [settings, originalSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const commandKey = commandName.replace('/', '').replace(/ /g, '');
      const res = await fetch(`/api/servers/${guildId}/commands/${commandKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: settings.enabled,
          allowedChannels: settings.allowedChannels,
          ignoredChannels: settings.ignoredChannels,
          allowedRoles: settings.allowedRoles,
          ignoredRoles: settings.ignoredRoles,
        }),
      });

      if (res.ok) {
        setOriginalSettings({ ...settings });
        setHasUnsavedChanges(false);
        onClose();
      }
    } catch (error) {
      console.error('Failed to save command settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        setSettings({ ...originalSettings });
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  const toggleChannel = (type: 'allowed' | 'ignored', channelId: string) => {
    const field = type === 'allowed' ? 'allowedChannels' : 'ignoredChannels';
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].includes(channelId)
        ? prev[field].filter(id => id !== channelId)
        : [...prev[field], channelId],
    }));
  };

  const toggleRole = (type: 'allowed' | 'ignored', roleId: string) => {
    const field = type === 'allowed' ? 'allowedRoles' : 'ignoredRoles';
    setSettings(prev => ({
      ...prev,
      [field]: prev[field].includes(roleId)
        ? prev[field].filter(id => id !== roleId)
        : [...prev[field], roleId],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Command Settings: {commandName}</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-orange-100 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-600">Loading settings...</div>
            ) : (
              <div className="space-y-6">
                {/* Allowed Channels */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Allowed Channels</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Select channels where this command can be used. Leave empty to allow in all channels.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {channels.length === 0 ? (
                      <p className="text-sm text-gray-500 col-span-2">No channels available</p>
                    ) : (
                      channels.map((channel) => (
                        <label
                          key={channel.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={settings.allowedChannels.includes(channel.id)}
                            onChange={() => toggleChannel('allowed', channel.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700"># {channel.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Ignored Channels */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ignored Channels</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Select channels where this command should be disabled.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {channels.length === 0 ? (
                      <p className="text-sm text-gray-500 col-span-2">No channels available</p>
                    ) : (
                      channels.map((channel) => (
                        <label
                          key={channel.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={settings.ignoredChannels.includes(channel.id)}
                            onChange={() => toggleChannel('ignored', channel.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700"># {channel.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Allowed Roles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Allowed Roles</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Select roles that can use this command. Leave empty to allow all roles.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {roles.length === 0 ? (
                      <p className="text-sm text-gray-500 col-span-2">No roles available</p>
                    ) : (
                      roles.map((role) => (
                        <label
                          key={role.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={settings.allowedRoles.includes(role.id)}
                            onChange={() => toggleRole('allowed', role.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">@ {role.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Ignored Roles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Ignored Roles</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Select roles that cannot use this command.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                    {roles.length === 0 ? (
                      <p className="text-sm text-gray-500 col-span-2">No roles available</p>
                    ) : (
                      roles.map((role) => (
                        <label
                          key={role.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={settings.ignoredRoles.includes(role.id)}
                            onChange={() => toggleRole('ignored', role.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">@ {role.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div>
              {hasUnsavedChanges && (
                <span className="text-sm text-orange-600 font-medium">Unsaved changes</span>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleClose}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saving}
                className="bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
