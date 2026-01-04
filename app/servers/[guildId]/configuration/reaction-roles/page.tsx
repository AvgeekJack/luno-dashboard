'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ServerHeader from '@/components/ServerHeader';

interface ReactionRole {
  emoji: string;
  roleId: string;
}

interface ReactionPanel {
  id: string;
  title: string;
  description: string;
  color: string;
  channelId: string;
  messageId?: string;
  panelType: 'single' | 'multiple' | 'remove-on-unreact';
  roleEmojiPairs: ReactionRole[];
}

interface ReactionRoleSettings {
  enabled: boolean;
  panels: ReactionPanel[];
  roleLimit: number;
  requiredRole: string | null;
  blacklistedRoles: string[];
  allowRoleStacking: boolean;
  autoDeleteReactions: boolean;
  dmOnRoleAdd: boolean;
  dmOnRoleRemove: boolean;
  dmMessageAdd: string;
  dmMessageRemove: string;
  rolePersistence: boolean;
  reactionCooldown: number;
}

interface Channel {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
  color: string;
}

export default function ReactionRolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [settings, setSettings] = useState<ReactionRoleSettings>({
    enabled: false,
    panels: [],
    roleLimit: 5,
    requiredRole: null,
    blacklistedRoles: [],
    allowRoleStacking: true,
    autoDeleteReactions: false,
    dmOnRoleAdd: false,
    dmOnRoleRemove: false,
    dmMessageAdd: 'You have been given the {role} role!',
    dmMessageRemove: 'The {role} role has been removed from you.',
    rolePersistence: true,
    reactionCooldown: 0,
  });

  const [originalSettings, setOriginalSettings] = useState<ReactionRoleSettings>(settings);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (gid) {
      fetchSettings();
    }
  }, [gid]);

  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/servers/${gid}/general`);
      const data = await res.json();

      if (data.configuration?.reactionRoles) {
        setSettings(data.configuration.reactionRoles);
        setOriginalSettings(data.configuration.reactionRoles);
      }

      setChannels(data.channels || []);
      setRoles(data.roles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const updateSetting = <K extends keyof ReactionRoleSettings>(
    key: K,
    value: ReactionRoleSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/servers/${gid}/general`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'configuration.reactionRoles': settings }),
      });

      if (res.ok) {
        setOriginalSettings(settings);
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-orange-100 flex items-center px-8 z-40">
        <Link href="/servers" className="text-2xl font-bold text-orange-500 hover:text-orange-600 transition">
          Luno
        </Link>
      </nav>

      <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-orange-100 overflow-y-auto z-30 p-6">
        <nav className="space-y-2">
          <Link href={`/servers/${gid}`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">
            ← Back to Server
          </Link>
          <div className="pt-4 border-t border-orange-100">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 px-4">Configuration</p>
            <Link href={`/servers/${gid}/configuration/logging`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">
              Logging
            </Link>
            <Link href={`/servers/${gid}/configuration/automod`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">
              AutoMod
            </Link>
            <Link href={`/servers/${gid}/configuration/anti-raid`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">
              Anti-Raid
            </Link>
            <Link href={`/servers/${gid}/configuration/reaction-roles`} className="block px-4 py-2 rounded-lg bg-orange-100 text-orange-600 transition">
              Reaction Roles
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="w-full max-w-4xl space-y-4 md:space-y-6">
          <ServerHeader guildId={gid} />

          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Configuration</p>
            <h1 className="text-3xl font-bold">Reaction Roles</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between pb-6 border-b border-orange-100">
              <div>
                <h2 className="text-xl font-semibold text-[#0f172a]">Reaction Roles System</h2>
                <p className="text-slate-600 text-sm mt-1">Allow users to self-assign roles via reactions</p>
              </div>
              <button 
                type="button" 
                onClick={() => updateSetting('enabled', !settings.enabled)}
                className={`${settings.enabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}
              >
                <span className={`${settings.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0f172a]">Core Settings</h3>

              <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Role Limit Per User</label>
                <input
                  type="number"
                  value={settings.roleLimit}
                  onChange={(e) => updateSetting('roleLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                  min="1"
                  max="25"
                />
                <p className="text-xs text-slate-500">Maximum roles a user can have from panels (0 = unlimited)</p>
              </div>

              <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Required Role</label>
                <select
                  value={settings.requiredRole || ''}
                  onChange={(e) => updateSetting('requiredRole', e.target.value || null)}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                >
                  <option value="">None (Everyone can use)</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>@{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">Users need this role to interact with reaction roles</p>
              </div>

              <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Blacklisted Roles</label>
                <div className="space-y-2">
                  {settings.blacklistedRoles.map((roleId, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <select
                        value={roleId}
                        onChange={(e) => {
                          const newRoles = [...settings.blacklistedRoles];
                          newRoles[idx] = e.target.value;
                          updateSetting('blacklistedRoles', newRoles);
                        }}
                        className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white"
                      >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>@{role.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const newRoles = settings.blacklistedRoles.filter((_, i) => i !== idx);
                          updateSetting('blacklistedRoles', newRoles);
                        }}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateSetting('blacklistedRoles', [...settings.blacklistedRoles, ''])}
                    className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-orange-600 hover:border-orange-400 hover:text-orange-700 transition text-sm font-medium"
                  >
                    + Add Role
                  </button>
                </div>
                <p className="text-xs text-slate-500">Users with these roles cannot use reaction roles</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0f172a]">Behavior Settings</h3>

              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Allow Role Stacking</p>
                  <p className="text-xs text-slate-500">Users can have multiple roles from same panel</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => updateSetting('allowRoleStacking', !settings.allowRoleStacking)}
                  className={`${settings.allowRoleStacking ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                >
                  <span className={`${settings.allowRoleStacking ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Auto Delete Reactions</p>
                  <p className="text-xs text-slate-500">Remove reactions after processing</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => updateSetting('autoDeleteReactions', !settings.autoDeleteReactions)}
                  className={`${settings.autoDeleteReactions ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                >
                  <span className={`${settings.autoDeleteReactions ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Role Persistence</p>
                  <p className="text-xs text-slate-500">Remember roles if user leaves and rejoins</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => updateSetting('rolePersistence', !settings.rolePersistence)}
                  className={`${settings.rolePersistence ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                >
                  <span className={`${settings.rolePersistence ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                </button>
              </div>

              <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Reaction Cooldown (seconds)</label>
                <input
                  type="number"
                  value={settings.reactionCooldown}
                  onChange={(e) => updateSetting('reactionCooldown', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                  min="0"
                  max="3600"
                />
                <p className="text-xs text-slate-500">Delay between role changes (0 = no cooldown)</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0f172a]">DM Notifications</h3>

              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">DM on Role Add</p>
                  <p className="text-xs text-slate-500">Send DM when role is added</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => updateSetting('dmOnRoleAdd', !settings.dmOnRoleAdd)}
                  className={`${settings.dmOnRoleAdd ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                >
                  <span className={`${settings.dmOnRoleAdd ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                </button>
              </div>

              {settings.dmOnRoleAdd && (
                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">DM Message (Role Added)</label>
                  <textarea
                    value={settings.dmMessageAdd}
                    onChange={(e) => updateSetting('dmMessageAdd', e.target.value)}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    rows={2}
                  />
                  <p className="text-xs text-slate-500">Use {'{role}'} for role name</p>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">DM on Role Remove</p>
                  <p className="text-xs text-slate-500">Send DM when role is removed</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => updateSetting('dmOnRoleRemove', !settings.dmOnRoleRemove)}
                  className={`${settings.dmOnRoleRemove ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-5 w-9 items-center rounded-full transition`}
                >
                  <span className={`${settings.dmOnRoleRemove ? 'translate-x-4' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                </button>
              </div>

              {settings.dmOnRoleRemove && (
                <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                  <label className="block text-sm font-semibold text-slate-800">DM Message (Role Removed)</label>
                  <textarea
                    value={settings.dmMessageRemove}
                    onChange={(e) => updateSetting('dmMessageRemove', e.target.value)}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    rows={2}
                  />
                  <p className="text-xs text-slate-500">Use {'{role}'} for role name</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-64 right-0 bg-orange-500 text-white px-8 py-4 flex items-center justify-between z-50">
          <p className="font-semibold">You have unsaved changes</p>
          <div className="flex gap-3">
            <button
              onClick={() => setSettings(originalSettings)}
              className="px-4 py-2 bg-white text-orange-500 rounded-lg hover:bg-orange-50 transition font-medium"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
