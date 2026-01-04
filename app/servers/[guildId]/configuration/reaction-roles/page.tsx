'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  
  const [showPanelModal, setShowPanelModal] = useState(false);
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null);
  const [panelForm, setPanelForm] = useState({
    title: '',
    description: '',
    color: '#FF6B35',
    channelId: '',
    panelType: 'multiple' as 'single' | 'multiple' | 'remove-on-unreact',
    roleEmojiPairs: [] as ReactionRole[],
  });

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

  const [originalSettings, setOriginalSettings] = useState<ReactionRoleSettings>({
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (!session || !gid) return;

    // Fetch channels and roles
    fetch(`/api/servers/${gid}/channels-and-roles`)
      .then((res) => res.json())
      .then((data) => {
        setChannels(data.channels ?? []);
        setRoles(data.roles ?? []);
      })
      .catch((err) => console.error(err));

    // Fetch reaction role settings
    fetch(`/api/servers/${gid}/reaction-roles`)
      .then((res) => res.json())
      .then((data) => {
        const loadedSettings = data.settings || settings;
        setSettings(loadedSettings);
        setOriginalSettings(loadedSettings);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [session, status, gid, router]);

  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasUnsavedChanges(hasChanges);
  }, [settings, originalSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/servers/${gid}/reaction-roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setOriginalSettings(settings);
        setHasUnsavedChanges(false);
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddPanel = () => {
    setPanelForm({
      title: '',
      description: '',
      color: '#FF6B35',
      channelId: '',
      panelType: 'multiple',
      roleEmojiPairs: [],
    });
    setEditingPanelId(null);
    setShowPanelModal(true);
  };

  const handleEditPanel = (panel: ReactionPanel) => {
    setPanelForm({
      title: panel.title,
      description: panel.description,
      color: panel.color,
      channelId: panel.channelId,
      panelType: panel.panelType,
      roleEmojiPairs: [...panel.roleEmojiPairs],
    });
    setEditingPanelId(panel.id);
    setShowPanelModal(true);
  };

  const handleDeletePanel = (panelId: string) => {
    if (confirm('Are you sure you want to delete this panel?')) {
      setSettings((prev) => ({
        ...prev,
        panels: prev.panels.filter((p) => p.id !== panelId),
      }));
    }
  };

  const handleClonePanel = (panel: ReactionPanel) => {
    const newPanel = {
      ...panel,
      id: `panel_${Date.now()}`,
      title: `${panel.title} (Copy)`,
      messageId: undefined,
    };
    setSettings((prev) => ({
      ...prev,
      panels: [...prev.panels, newPanel],
    }));
  };

  const handleSavePanel = () => {
    if (!panelForm.title || !panelForm.channelId || panelForm.roleEmojiPairs.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingPanelId) {
      setSettings((prev) => ({
        ...prev,
        panels: prev.panels.map((p) =>
          p.id === editingPanelId
            ? { ...p, ...panelForm }
            : p
        ),
      }));
    } else {
      const newPanel: ReactionPanel = {
        id: `panel_${Date.now()}`,
        ...panelForm,
      };
      setSettings((prev) => ({
        ...prev,
        panels: [...prev.panels, newPanel],
      }));
    }

    setShowPanelModal(false);
  };

  const handleAddRoleEmoji = () => {
    setPanelForm((prev) => ({
      ...prev,
      roleEmojiPairs: [...prev.roleEmojiPairs, { emoji: '', roleId: '' }],
    }));
  };

  const handleRemoveRoleEmoji = (index: number) => {
    setPanelForm((prev) => ({
      ...prev,
      roleEmojiPairs: prev.roleEmojiPairs.filter((_, i) => i !== index),
    }));
  };

  const handleRoleEmojiChange = (index: number, field: 'emoji' | 'roleId', value: string) => {
    setPanelForm((prev) => ({
      ...prev,
      roleEmojiPairs: prev.roleEmojiPairs.map((pair, i) =>
        i === index ? { ...pair, [field]: value } : pair
      ),
    }));
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      {/* Sidebar - Copy from other configuration pages */}
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
          <Link href={`/servers/${gid}`} className="flex items-center gap-3 px-3 py-6 bg-white hover:bg-orange-50/30 transition-colors">
            Dashboard
          </Link>
          <details className="text-slate-800" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none bg-white hover:bg-orange-50/30 transition-colors" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span>Settings</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
          </details>
          <details className="text-slate-800" open={configOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
              <span>Configuration</span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {configOpen && (
              <div className="px-2 py-1 space-y-1">
                <Link href={`/servers/${gid}/configuration/automod`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors">
                  Automod
                </Link>
                <Link href={`/servers/${gid}/configuration/logging`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors">
                  Logging
                </Link>
                <Link href={`/servers/${gid}/configuration/anti-raid`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors">
                  Anti-Raid
                </Link>
                <Link href={`/servers/${gid}/configuration/reaction-roles`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 font-bold">
                  Reaction Roles
                </Link>
                <Link href={`/servers/${gid}/configuration/member-verification`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors">
                  Member Verification
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Reaction Roles</h1>
              <p className="text-slate-600 mt-1">Configure reaction role panels and settings</p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enabled: checked }))}
            />
          </div>

          {/* Core Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Core Configuration</h2>
            
            <div className="space-y-6">
              {/* Role Assignment Settings */}
              <div>
                <label className="block text-sm font-medium mb-2">Role Limit Per User</label>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={settings.roleLimit}
                  onChange={(e) => setSettings((prev) => ({ ...prev, roleLimit: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Maximum roles a user can have from a single panel</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Required Role</label>
                <select
                  value={settings.requiredRole || ''}
                  onChange={(e) => setSettings((prev) => ({ ...prev, requiredRole: e.target.value || null }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">None</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Users must have this role to access reaction roles</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Blacklisted Roles</label>
                <select
                  multiple
                  value={settings.blacklistedRoles}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSettings((prev) => ({ ...prev, blacklistedRoles: selected }));
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg h-32"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple. Users with these roles cannot access reaction roles</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Role Stacking</p>
                  <p className="text-sm text-slate-600">Users can have multiple roles from the same panel</p>
                </div>
                <Switch
                  checked={settings.allowRoleStacking}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allowRoleStacking: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Advanced Options</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Delete Reactions</p>
                  <p className="text-sm text-slate-600">Delete reaction after role is assigned</p>
                </div>
                <Switch
                  checked={settings.autoDeleteReactions}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoDeleteReactions: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">DM on Role Add</p>
                  <p className="text-sm text-slate-600">Send DM when role is added</p>
                </div>
                <Switch
                  checked={settings.dmOnRoleAdd}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, dmOnRoleAdd: checked }))}
                />
              </div>

              {settings.dmOnRoleAdd && (
                <div>
                  <label className="block text-sm font-medium mb-2">Role Add DM Message</label>
                  <input
                    type="text"
                    value={settings.dmMessageAdd}
                    onChange={(e) => setSettings((prev) => ({ ...prev, dmMessageAdd: e.target.value }))}
                    placeholder="You have been given the {role} role!"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use {'{role}'} placeholder for role name</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">DM on Role Remove</p>
                  <p className="text-sm text-slate-600">Send DM when role is removed</p>
                </div>
                <Switch
                  checked={settings.dmOnRoleRemove}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, dmOnRoleRemove: checked }))}
                />
              </div>

              {settings.dmOnRoleRemove && (
                <div>
                  <label className="block text-sm font-medium mb-2">Role Remove DM Message</label>
                  <input
                    type="text"
                    value={settings.dmMessageRemove}
                    onChange={(e) => setSettings((prev) => ({ ...prev, dmMessageRemove: e.target.value }))}
                    placeholder="The {role} role has been removed from you."
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use {'{role}'} placeholder for role name</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Role Persistence</p>
                  <p className="text-sm text-slate-600">Re-add roles if user leaves and rejoins</p>
                </div>
                <Switch
                  checked={settings.rolePersistence}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, rolePersistence: checked }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reaction Cooldown (seconds)</label>
                <input
                  type="number"
                  min="0"
                  max="3600"
                  value={settings.reactionCooldown}
                  onChange={(e) => setSettings((prev) => ({ ...prev, reactionCooldown: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Cooldown between reactions (0 = no cooldown)</p>
              </div>
            </div>
          </div>

          {/* Panel Management */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Reaction Role Panels</h2>
              <button
                onClick={handleAddPanel}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Create Panel
              </button>
            </div>

            {settings.panels.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No panels created yet. Click "Create Panel" to get started!</p>
            ) : (
              <div className="space-y-4">
                {settings.panels.map((panel) => (
                  <div key={panel.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{panel.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{panel.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>Channel: {channels.find(c => c.id === panel.channelId)?.name || 'Unknown'}</span>
                          <span>Type: {panel.panelType}</span>
                          <span>Roles: {panel.roleEmojiPairs.length}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPanel(panel)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleClonePanel(panel)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          Clone
                        </button>
                        <button
                          onClick={() => handleDeletePanel(panel.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          {hasUnsavedChanges && (
            <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-orange-100 p-4 shadow-lg z-40">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <p className="text-sm text-slate-600">You have unsaved changes</p>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Panel Modal */}
      {showPanelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold">{editingPanelId ? 'Edit Panel' : 'Create Panel'}</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Panel Title *</label>
                <input
                  type="text"
                  value={panelForm.title}
                  onChange={(e) => setPanelForm((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Select your roles"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={panelForm.description}
                  onChange={(e) => setPanelForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="React to get your desired roles!"
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Embed Color</label>
                <input
                  type="color"
                  value={panelForm.color}
                  onChange={(e) => setPanelForm((prev) => ({ ...prev, color: e.target.value }))}
                  className="w-full h-12 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Channel *</label>
                <select
                  value={panelForm.channelId}
                  onChange={(e) => setPanelForm((prev) => ({ ...prev, channelId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Select a channel</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>#{channel.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Panel Type</label>
                <select
                  value={panelForm.panelType}
                  onChange={(e) => setPanelForm((prev) => ({ ...prev, panelType: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="single">Single Role (user can only have 1 role)</option>
                  <option value="multiple">Multiple Roles (user can have multiple roles)</option>
                  <option value="remove-on-unreact">Remove on Unreact (remove role when reaction removed)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">Role-Emoji Pairs *</label>
                  <button
                    onClick={handleAddRoleEmoji}
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                  >
                    Add Pair
                  </button>
                </div>
                
                {panelForm.roleEmojiPairs.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-300 rounded">
                    No role-emoji pairs added yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {panelForm.roleEmojiPairs.map((pair, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={pair.emoji}
                          onChange={(e) => handleRoleEmojiChange(index, 'emoji', e.target.value)}
                          placeholder="Emoji (e.g., 🎮)"
                          className="w-24 px-3 py-2 border border-slate-300 rounded-lg"
                        />
                        <select
                          value={pair.roleId}
                          onChange={(e) => handleRoleEmojiChange(index, 'roleId', e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg"
                        >
                          <option value="">Select a role</option>
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveRoleEmoji(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowPanelModal(false)}
                className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePanel}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                {editingPanelId ? 'Update Panel' : 'Create Panel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
