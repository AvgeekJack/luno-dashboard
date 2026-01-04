'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ServerHeader from '@/components/ServerHeader';

interface MemberVerificationSettings {
  enabled: boolean;
  method: 'button' | 'captcha' | 'email';
  channelId: string | null;
  verifiedRoleId: string | null;
  unverifiedRoleId: string | null;
  additionalRoles: string[];
  bypassRoles: string[];
  kickUnverified: boolean;
  kickTimeout: number;
  sendDM: boolean;
  dmMessage: string;
  verifyMessage: string;
  buttonLabel: string;
  buttonColor: string;
  requireAccountAge: boolean;
  minimumAccountAge: number;
  requireServerTime: boolean;
  minimumServerTime: number;
  logChannel: string | null;
  captchaProvider: string;
  captchaDifficulty: 'easy' | 'medium' | 'hard';
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

export default function MemberVerificationPage() {
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

  const [settings, setSettings] = useState<MemberVerificationSettings>({
    enabled: false,
    method: 'button',
    channelId: '',
    verifiedRoleId: '',
    unverifiedRoleId: '',
    customMessage: 'Click the button below to verify yourself and gain access to the server!',
    rulesText: '',
    requireAccountAge: false,
    accountAgeMinimum: 7,
    requireServerAgreement: false,
    multipleSteps: false,
    stepCount: 2,
    welcomeDmEnabled: false,
    welcomeDmMessage: 'Welcome to {server}! You are now verified and have full access.',
    additionalRoles: [],
    redirectChannel: '',
    autoCleanupEnabled: false,
    cleanupDelay: 60,
    antiAltEnabled: false,
    kickUnverifiedEnabled: false,
    kickUnverifiedAfter: 600,
    bypassRoles: [],
    verificationCooldown: 0,
  });

  const [originalSettings, setOriginalSettings] = useState<MemberVerificationSettings>({
    enabled: false,
    method: 'button',
    channelId: '',
    verifiedRoleId: '',
    unverifiedRoleId: '',
    customMessage: 'Click the button below to verify yourself and gain access to the server!',
    rulesText: '',
    requireAccountAge: false,
    accountAgeMinimum: 7,
    requireServerAgreement: false,
    multipleSteps: false,
    stepCount: 2,
    welcomeDmEnabled: false,
    welcomeDmMessage: 'Welcome to {server}! You are now verified and have full access.',
    additionalRoles: [],
    redirectChannel: '',
    autoCleanupEnabled: false,
    cleanupDelay: 60,
    antiAltEnabled: false,
    kickUnverifiedEnabled: false,
    kickUnverifiedAfter: 600,
    bypassRoles: [],
    verificationCooldown: 0,
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

    // Fetch member verification settings
    fetch(`/api/servers/${gid}/member-verification`)
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
      const res = await fetch(`/api/servers/${gid}/member-verification`, {
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

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-orange-50 text-[#0f172a] flex">
      {/* Sidebar */}
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
                <Link href={`/servers/${gid}/configuration/reaction-roles`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors">
                  Reaction Roles
                </Link>
                <Link href={`/servers/${gid}/configuration/member-verification`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 font-bold">
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
              <h1 className="text-3xl font-bold">Member Verification</h1>
              <p className="text-slate-600 mt-1">Configure member verification process and security settings</p>
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
              <div>
                <label className="block text-sm font-medium mb-2">Verification Method</label>
                <select
                  value={settings.method}
                  onChange={(e) => setSettings((prev) => ({ ...prev, method: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="reaction">Reaction-Based (click emoji to verify)</option>
                  <option value="button">Button-Based (click button to verify)</option>
                  <option value="captcha">Captcha (solve captcha to verify)</option>
                  <option value="manual">Manual Approval (staff must approve)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Verification Channel</label>
                <select
                  value={settings.channelId}
                  onChange={(e) => setSettings((prev) => ({ ...prev, channelId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Select a channel</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>#{channel.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Channel where verification message will be posted</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Verified Role</label>
                <select
                  value={settings.verifiedRoleId}
                  onChange={(e) => setSettings((prev) => ({ ...prev, verifiedRoleId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Role given to users after successful verification</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Unverified Role (Optional)</label>
                <select
                  value={settings.unverifiedRoleId}
                  onChange={(e) => setSettings((prev) => ({ ...prev, unverifiedRoleId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">None</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Role assigned to unverified members (removed after verification)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Verification Message</label>
                <textarea
                  value={settings.customMessage}
                  onChange={(e) => setSettings((prev) => ({ ...prev, customMessage: e.target.value }))}
                  placeholder="Click the button below to verify yourself..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Message displayed in verification channel</p>
              </div>
            </div>
          </div>

          {/* Verification Rules */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Verification Rules</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Custom Rules Text (Optional)</label>
                <textarea
                  value={settings.rulesText}
                  onChange={(e) => setSettings((prev) => ({ ...prev, rulesText: e.target.value }))}
                  placeholder="1. Be respectful&#10;2. No spam&#10;3. Follow Discord TOS"
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Rules displayed to users during verification</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Account Age</p>
                  <p className="text-sm text-slate-600">Account must be older than specified days</p>
                </div>
                <Switch
                  checked={settings.requireAccountAge}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, requireAccountAge: checked }))}
                />
              </div>

              {settings.requireAccountAge && (
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Account Age (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.accountAgeMinimum}
                    onChange={(e) => setSettings((prev) => ({ ...prev, accountAgeMinimum: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Require Server Agreement</p>
                  <p className="text-sm text-slate-600">Users must agree to server rules</p>
                </div>
                <Switch
                  checked={settings.requireServerAgreement}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, requireServerAgreement: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Multiple Verification Steps</p>
                  <p className="text-sm text-slate-600">Require users to complete multiple steps</p>
                </div>
                <Switch
                  checked={settings.multipleSteps}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, multipleSteps: checked }))}
                />
              </div>

              {settings.multipleSteps && (
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Steps</label>
                  <input
                    type="number"
                    min="2"
                    max="5"
                    value={settings.stepCount}
                    onChange={(e) => setSettings((prev) => ({ ...prev, stepCount: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Post-Verification Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Post-Verification Actions</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Send Welcome DM</p>
                  <p className="text-sm text-slate-600">Send a DM to verified members</p>
                </div>
                <Switch
                  checked={settings.welcomeDmEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, welcomeDmEnabled: checked }))}
                />
              </div>

              {settings.welcomeDmEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">Welcome DM Message</label>
                  <textarea
                    value={settings.welcomeDmMessage}
                    onChange={(e) => setSettings((prev) => ({ ...prev, welcomeDmMessage: e.target.value }))}
                    placeholder="Welcome to {server}! You are now verified..."
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Use {'{server}'} placeholder for server name</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Additional Roles (Optional)</label>
                <select
                  multiple
                  value={settings.additionalRoles}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSettings((prev) => ({ ...prev, additionalRoles: selected }));
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg h-32"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple. Additional roles given after verification</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Redirect Channel (Optional)</label>
                <select
                  value={settings.redirectChannel}
                  onChange={(e) => setSettings((prev) => ({ ...prev, redirectChannel: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">None</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>#{channel.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Notify user to check this channel after verification</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Cleanup Verification Messages</p>
                  <p className="text-sm text-slate-600">Delete verification messages after successful verification</p>
                </div>
                <Switch
                  checked={settings.autoCleanupEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoCleanupEnabled: checked }))}
                />
              </div>

              {settings.autoCleanupEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">Cleanup Delay (seconds)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={settings.cleanupDelay}
                    onChange={(e) => setSettings((prev) => ({ ...prev, cleanupDelay: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Anti-Alt Detection</p>
                  <p className="text-sm text-slate-600">Detect and flag potential alternate accounts</p>
                </div>
                <Switch
                  checked={settings.antiAltEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, antiAltEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kick Unverified Members</p>
                  <p className="text-sm text-slate-600">Automatically kick members who don't verify</p>
                </div>
                <Switch
                  checked={settings.kickUnverifiedEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, kickUnverifiedEnabled: checked }))}
                />
              </div>

              {settings.kickUnverifiedEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">Kick After (seconds)</label>
                  <input
                    type="number"
                    min="60"
                    max="86400"
                    value={settings.kickUnverifiedAfter}
                    onChange={(e) => setSettings((prev) => ({ ...prev, kickUnverifiedAfter: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                  <p className="text-xs text-slate-500 mt-1">Time before unverified members are kicked (60 = 1 min, 600 = 10 min)</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Bypass Roles</label>
                <select
                  multiple
                  value={settings.bypassRoles}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setSettings((prev) => ({ ...prev, bypassRoles: selected }));
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg h-32"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Hold Ctrl/Cmd to select multiple. Users with these roles bypass verification</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Verification Cooldown (seconds)</label>
                <input
                  type="number"
                  min="0"
                  max="3600"
                  value={settings.verificationCooldown}
                  onChange={(e) => setSettings((prev) => ({ ...prev, verificationCooldown: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Cooldown between verification attempts (0 = no cooldown)</p>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Verification logging is handled in the Logging configuration page. This page only configures the verification process itself.
            </p>
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
    </div>
  );
}
