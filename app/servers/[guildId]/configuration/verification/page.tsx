'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

interface VerificationSettings {
  enabled: boolean;
  verificationMethod: 'reaction' | 'button' | 'captcha' | 'manual';
  verificationChannel: string | null;
  messageTitle: string;
  messageDescription: string;
  messageColor: string;
  verifiedRole: string | null;
  unverifiedRole: string | null;
  rulesText: string;
  accountAgeRequirement: number;
  requireServerAgreement: boolean;
  multipleSteps: boolean;
  welcomeDM: boolean;
  welcomeDMMessage: string;
  additionalRoles: string[];
  redirectChannel: string | null;
  removeVerificationMessages: boolean;
  logChannel: string | null;
  antiAltProtection: boolean;
  kickUnverifiedAfter: number;
  verificationBypassRoles: string[];
  verificationCooldown: number;
  trackVerificationMetrics: boolean;
  logFailedAttempts: boolean;
}

interface Channel {
  id: string;
  name: string;
  type: number;
}

interface Role {
  id: string;
  name: string;
  color: number;
}

export default function VerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { guildId } = useParams();
  const gid = Array.isArray(guildId) ? guildId[0] : guildId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Dropdown states
  const [showVerificationChannelDropdown, setShowVerificationChannelDropdown] = useState(false);
  const [showVerifiedRoleDropdown, setShowVerifiedRoleDropdown] = useState(false);
  const [showUnverifiedRoleDropdown, setShowUnverifiedRoleDropdown] = useState(false);
  const [showAdditionalRolesDropdown, setShowAdditionalRolesDropdown] = useState(false);
  const [showRedirectChannelDropdown, setShowRedirectChannelDropdown] = useState(false);
  const [showLogChannelDropdown, setShowLogChannelDropdown] = useState(false);
  const [showBypassRolesDropdown, setShowBypassRolesDropdown] = useState(false);

  const [settings, setSettings] = useState<VerificationSettings>({
    enabled: false,
    verificationMethod: 'button',
    verificationChannel: null,
    messageTitle: 'Server Verification',
    messageDescription: 'Click the button below to verify and gain access to the server!',
    messageColor: '#5865F2',
    verifiedRole: null,
    unverifiedRole: null,
    rulesText: 'By verifying, you agree to follow our server rules.',
    accountAgeRequirement: 0,
    requireServerAgreement: true,
    multipleSteps: false,
    welcomeDM: false,
    welcomeDMMessage: 'Welcome to the server! You have been verified.',
    additionalRoles: [],
    redirectChannel: null,
    removeVerificationMessages: true,
    logChannel: null,
    antiAltProtection: false,
    kickUnverifiedAfter: 0,
    verificationBypassRoles: [],
    verificationCooldown: 0,
    trackVerificationMetrics: true,
    logFailedAttempts: true,
  });

  const [originalSettings, setOriginalSettings] = useState<VerificationSettings>(settings);

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
          fetch(`/api/servers/${gid}/configuration/verification`)
        ]);

        if (channelsRes.ok) {
          const data = await channelsRes.json();
          setChannels(data.channels || []);
          setRoles(data.roles || []);
        }

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.verification) {
            const loadedSettings = { ...settings, ...data.verification };
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
      const response = await fetch(`/api/servers/${gid}/configuration/verification`, {
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

  const updateSetting = <K extends keyof VerificationSettings>(key: K, value: VerificationSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || roleId;
  };

  const getChannelName = (channelId: string) => {
    return channels.find(c => c.id === channelId)?.name || channelId;
  };

  const textChannels = channels.filter(c => c.type === 0);

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
                <Link href={`/servers/${gid}/configuration/anti-raid`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Anti-Raid
                </Link>
                <Link href={`/servers/${gid}/configuration/reaction-roles`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Reaction Roles
                </Link>
                <Link href={`/servers/${gid}/configuration/verification`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left">
                  Verification
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
                <Link href={`/servers/${gid}/modules/tickets`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Tickets
                </Link>
                <Link href={`/servers/${gid}/modules/notifications`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left">
                  Welcome Messages
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
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">CONFIGURATION</p>
            <h1 className="text-3xl font-bold">Verification</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            {/* Master Toggle */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-[#0f172a]">Verification System</h2>
                <p className="text-slate-600">Require users to verify before accessing your server</p>
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
                {/* Verification Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Verification Method</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: 'reaction', label: 'Reaction', desc: 'React to verify' },
                      { value: 'button', label: 'Button', desc: 'Click button to verify' },
                      { value: 'captcha', label: 'Captcha', desc: 'Solve captcha' },
                      { value: 'manual', label: 'Manual', desc: 'Staff approval' }
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => updateSetting('verificationMethod', method.value as any)}
                        className={`p-4 rounded-lg border-2 transition text-left ${
                          settings.verificationMethod === method.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-orange-200 hover:border-orange-300'
                        }`}
                      >
                        <p className="font-bold text-sm text-slate-800">{method.label}</p>
                        <p className="text-xs text-slate-600 mt-1">{method.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verification Configuration */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Verification Configuration</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Verification Channel *</label>
                      <button
                        onClick={() => setShowVerificationChannelDropdown(!showVerificationChannelDropdown)}
                        className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                      >
                        {settings.verificationChannel ? `# ${getChannelName(settings.verificationChannel)}` : '+ Select Channel'}
                      </button>
                      {showVerificationChannelDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {textChannels.map(channel => (
                            <button
                              key={channel.id}
                              onClick={() => {
                                updateSetting('verificationChannel', channel.id);
                                setShowVerificationChannelDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                            >
                              # {channel.name}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-slate-500">Channel where verification message appears</p>
                    </div>

                    <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Verified Role *</label>
                      <button
                        onClick={() => setShowVerifiedRoleDropdown(!showVerifiedRoleDropdown)}
                        className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                      >
                        {settings.verifiedRole ? getRoleName(settings.verifiedRole) : '+ Select Role'}
                      </button>
                      {showVerifiedRoleDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {roles.map(role => (
                            <button
                              key={role.id}
                              onClick={() => {
                                updateSetting('verifiedRole', role.id);
                                setShowVerifiedRoleDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                            >
                              {role.name}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-slate-500">Role given upon verification</p>
                    </div>

                    <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Unverified Role</label>
                      <button
                        onClick={() => setShowUnverifiedRoleDropdown(!showUnverifiedRoleDropdown)}
                        className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                      >
                        {settings.unverifiedRole ? getRoleName(settings.unverifiedRole) : '+ Select Role (Optional)'}
                      </button>
                      {showUnverifiedRoleDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <button
                            onClick={() => {
                              updateSetting('unverifiedRole', null);
                              setShowUnverifiedRoleDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition text-slate-500"
                          >
                            None
                          </button>
                          {roles.map(role => (
                            <button
                              key={role.id}
                              onClick={() => {
                                updateSetting('unverifiedRole', role.id);
                                setShowUnverifiedRoleDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                            >
                              {role.name}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-slate-500">Role before verification (optional)</p>
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Embed Color</label>
                      <input
                        type="color"
                        value={settings.messageColor}
                        onChange={(e) => updateSetting('messageColor', e.target.value)}
                        className="w-full h-10 border border-orange-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Message Title</label>
                    <input
                      type="text"
                      value={settings.messageTitle}
                      onChange={(e) => updateSetting('messageTitle', e.target.value)}
                      placeholder="Server Verification"
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Message Description</label>
                    <textarea
                      value={settings.messageDescription}
                      onChange={(e) => updateSetting('messageDescription', e.target.value)}
                      placeholder="Click the button below to verify and gain access to the server!"
                      rows={3}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Rules & Requirements */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Rules & Requirements</h3>
                  
                  <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Custom Rules Text</label>
                    <textarea
                      value={settings.rulesText}
                      onChange={(e) => updateSetting('rulesText', e.target.value)}
                      placeholder="By verifying, you agree to follow our server rules."
                      rows={4}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                    />
                    <p className="text-xs text-slate-500">Displayed in verification embed</p>
                  </div>

                  <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Account Age Requirement</label>
                    <input 
                      type="number" 
                      value={settings.accountAgeRequirement} 
                      onChange={(e) => updateSetting('accountAgeRequirement', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                      min="0"
                    />
                    <p className="text-xs text-slate-500">Minimum account age in days (0 = no requirement)</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Require Server Agreement</p>
                        <p className="text-xs text-slate-500">User must agree to rules checkbox</p>
                      </div>
                      <Switch 
                        checked={settings.requireServerAgreement} 
                        onCheckedChange={(checked) => updateSetting('requireServerAgreement', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Multiple Verification Steps</p>
                        <p className="text-xs text-slate-500">Optional multi-step verification process</p>
                      </div>
                      <Switch 
                        checked={settings.multipleSteps} 
                        onCheckedChange={(checked) => updateSetting('multipleSteps', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Post-Verification Actions */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Post-Verification Actions</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Send Welcome DM</p>
                        <p className="text-xs text-slate-500">DM user after successful verification</p>
                      </div>
                      <Switch 
                        checked={settings.welcomeDM} 
                        onCheckedChange={(checked) => updateSetting('welcomeDM', checked)}
                      />
                    </div>

                    {settings.welcomeDM && (
                      <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Welcome DM Message</label>
                        <textarea
                          value={settings.welcomeDMMessage}
                          onChange={(e) => updateSetting('welcomeDMMessage', e.target.value)}
                          placeholder="Welcome to the server! You have been verified."
                          rows={3}
                          className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                        />
                      </div>
                    )}

                    <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Additional Roles</label>
                      <div className="space-y-2">
                        {settings.additionalRoles.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            {settings.additionalRoles.map(roleId => (
                              <div key={roleId} className="px-3 py-1 bg-white border border-slate-300 rounded-full text-sm flex items-center gap-2">
                                <span className="font-medium">{getRoleName(roleId)}</span>
                                <button
                                  onClick={() => updateSetting('additionalRoles', settings.additionalRoles.filter(r => r !== roleId))}
                                  className="text-red-500 hover:text-red-600 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => setShowAdditionalRolesDropdown(!showAdditionalRolesDropdown)}
                          className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                        >
                          + Add Role
                        </button>
                        {showAdditionalRolesDropdown && (
                          <div className="absolute z-10 w-full mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {roles.filter(r => !settings.additionalRoles.includes(r.id) && r.id !== settings.verifiedRole).map(role => (
                              <button
                                key={role.id}
                                onClick={() => {
                                  updateSetting('additionalRoles', [...settings.additionalRoles, role.id]);
                                  setShowAdditionalRolesDropdown(false);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                              >
                                {role.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Auto-assign additional roles beyond verified role</p>
                    </div>

                    <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Redirect Channel</label>
                      <button
                        onClick={() => setShowRedirectChannelDropdown(!showRedirectChannelDropdown)}
                        className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                      >
                        {settings.redirectChannel ? `# ${getChannelName(settings.redirectChannel)}` : '+ Select Channel (Optional)'}
                      </button>
                      {showRedirectChannelDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <button
                            onClick={() => {
                              updateSetting('redirectChannel', null);
                              setShowRedirectChannelDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition text-slate-500"
                          >
                            None
                          </button>
                          {textChannels.map(channel => (
                            <button
                              key={channel.id}
                              onClick={() => {
                                updateSetting('redirectChannel', channel.id);
                                setShowRedirectChannelDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                            >
                              # {channel.name}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-slate-500">Send welcome message to this channel</p>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Remove Verification Messages</p>
                        <p className="text-xs text-slate-500">Delete verification messages after completion</p>
                      </div>
                      <Switch 
                        checked={settings.removeVerificationMessages} 
                        onCheckedChange={(checked) => updateSetting('removeVerificationMessages', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Security Settings</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Anti-Alt Protection</p>
                        <p className="text-xs text-slate-500">Detect potential alternate accounts</p>
                      </div>
                      <Switch 
                        checked={settings.antiAltProtection} 
                        onCheckedChange={(checked) => updateSetting('antiAltProtection', checked)}
                      />
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Kick Unverified After</label>
                      <input 
                        type="number" 
                        value={settings.kickUnverifiedAfter} 
                        onChange={(e) => updateSetting('kickUnverifiedAfter', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                        min="0"
                      />
                      <p className="text-xs text-slate-500">Kick unverified users after X hours (0 = disabled)</p>
                    </div>

                    <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Verification Bypass Roles</label>
                      <div className="space-y-2">
                        {settings.verificationBypassRoles.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            {settings.verificationBypassRoles.map(roleId => (
                              <div key={roleId} className="px-3 py-1 bg-white border border-slate-300 rounded-full text-sm flex items-center gap-2">
                                <span className="font-medium">{getRoleName(roleId)}</span>
                                <button
                                  onClick={() => updateSetting('verificationBypassRoles', settings.verificationBypassRoles.filter(r => r !== roleId))}
                                  className="text-red-500 hover:text-red-600 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => setShowBypassRolesDropdown(!showBypassRolesDropdown)}
                          className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                        >
                          + Add Bypass Role
                        </button>
                        {showBypassRolesDropdown && (
                          <div className="absolute z-10 w-full mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {roles.filter(r => !settings.verificationBypassRoles.includes(r.id)).map(role => (
                              <button
                                key={role.id}
                                onClick={() => {
                                  updateSetting('verificationBypassRoles', [...settings.verificationBypassRoles, role.id]);
                                  setShowBypassRolesDropdown(false);
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                              >
                                {role.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">Roles that bypass verification (moderators, bots)</p>
                    </div>

                    <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Verification Cooldown</label>
                      <input 
                        type="number" 
                        value={settings.verificationCooldown} 
                        onChange={(e) => updateSetting('verificationCooldown', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm"
                        min="0"
                      />
                      <p className="text-xs text-slate-500">Seconds between verification attempts (0 = no cooldown)</p>
                    </div>
                  </div>
                </div>

                {/* Logging */}
                <div className="space-y-4 border-t border-orange-100 pt-8">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Logging</h3>
                  
                  <div className="relative p-4 rounded-lg border border-orange-100 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Verification Log Channel</label>
                    <button
                      onClick={() => setShowLogChannelDropdown(!showLogChannelDropdown)}
                      className="w-full px-3 py-2 border-2 border-dashed border-orange-300 rounded-lg text-sm text-left hover:border-orange-400 transition bg-orange-50/50"
                    >
                      {settings.logChannel ? `# ${getChannelName(settings.logChannel)}` : '+ Select Channel (Optional)'}
                    </button>
                    {showLogChannelDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <button
                          onClick={() => {
                            updateSetting('logChannel', null);
                            setShowLogChannelDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition text-slate-500"
                        >
                          None
                        </button>
                        {textChannels.map(channel => (
                          <button
                            key={channel.id}
                            onClick={() => {
                              updateSetting('logChannel', channel.id);
                              setShowLogChannelDropdown(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-orange-50 text-sm transition"
                          >
                            # {channel.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-slate-500">Staff monitoring channel for verifications</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Track Verification Metrics</p>
                        <p className="text-xs text-slate-500">Time to verify, success rate</p>
                      </div>
                      <Switch 
                        checked={settings.trackVerificationMetrics} 
                        onCheckedChange={(checked) => updateSetting('trackVerificationMetrics', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-orange-100">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Log Failed Attempts</p>
                        <p className="text-xs text-slate-500">Track failed verification attempts</p>
                      </div>
                      <Switch 
                        checked={settings.logFailedAttempts} 
                        onCheckedChange={(checked) => updateSetting('logFailedAttempts', checked)}
                      />
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
