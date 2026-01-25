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
  removeVerificationMessages: boolean;
  antiAltProtection: boolean;
  kickUnverifiedAfter: number;
  verificationBypassRoles: string[];
  verificationCooldown: number;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Dropdown states
  const [showVerificationChannelDropdown, setShowVerificationChannelDropdown] = useState(false);
  const [showVerifiedRoleDropdown, setShowVerifiedRoleDropdown] = useState(false);
  const [showUnverifiedRoleDropdown, setShowUnverifiedRoleDropdown] = useState(false);
  const [showAdditionalRolesDropdown, setShowAdditionalRolesDropdown] = useState(false);
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
    removeVerificationMessages: true,
    antiAltProtection: false,
    kickUnverifiedAfter: 0,
    verificationBypassRoles: [],
    verificationCooldown: 0,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, gid]);

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

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log('Verification Page - Channels:', channels.length);
    console.log('Verification Page - Text Channels:', textChannels.length);
    console.log('Verification Page - Text Channels Data:', textChannels);
  }

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0f172a] flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-[60] bg-white p-2 rounded-lg shadow-lg border border-orange-100"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static left-0 top-0 h-screen w-64 bg-white border-r border-orange-100 shadow-lg md:shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-orange-100">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12 md:ml-0">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#0f172a]">Luno</span>
          </Link>
        </div>
        
        <div className="px-4 py-4">
          <Link href="/servers" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>← Back to Servers</Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href={`/servers/${gid}`} className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <img src="/dashbaord.png" alt="" className="w-5 h-5" />
            Dashboard
          </Link>
          <details className="text-slate-800" open={settingsOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setSettingsOpen(!settingsOpen); }}>
              <span className="flex items-center gap-3">
                <img src="/settings.png" alt="" className="w-5 h-5" />
                Settings
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {settingsOpen && (
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/general`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  General
                </Link>
                <Link href={`/servers/${gid}/setup`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Setup
                </Link>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={configOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setConfigOpen(!configOpen); }}>
              <span className="flex items-center gap-3">
                <img src="/configuration.png" alt="" className="w-5 h-5" />
                Configuration
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {configOpen && (
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/configuration/automod`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Automod
                </Link>
                <Link href={`/servers/${gid}/configuration/logging`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Logging
                </Link>
                <Link href={`/servers/${gid}/configuration/anti-raid`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Anti-Raid
                </Link>
                <Link href={`/servers/${gid}/configuration/reaction-roles`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Reaction Roles
                </Link>
                <Link href={`/servers/${gid}/configuration/verification`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Verification
                </Link>
              </div>
            )}
          </details>
          <details className="text-slate-800" open={modulesOpen}>
            <summary className="flex items-center justify-between px-3 py-6 cursor-pointer select-none" onClick={(e) => { e.preventDefault(); setModulesOpen(!modulesOpen); }}>
              <span className="flex items-center gap-3">
                <img src="/modules.png" alt="" className="w-5 h-5" />
                Modules
              </span>
              <span className="text-xs text-orange-600">▾</span>
            </summary>
            {modulesOpen && (
              <div className="px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3">
                <Link href={`/servers/${gid}/modules/moderation`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Moderation
                </Link>
                <Link href={`/servers/${gid}/modules/role-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Role Management
                </Link>
                <Link href={`/servers/${gid}/modules/member-management`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Member Management
                </Link>
                <Link href={`/servers/${gid}/modules/announcements`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Announcements
                </Link>
                <Link href={`/servers/${gid}/modules/notifications`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Welcome Messages
                </Link>
                <Link href={`/servers/${gid}/modules/fun`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Fun
                </Link>
                <Link href={`/servers/${gid}/modules/utilities`} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left" onClick={() => setMobileMenuOpen(false)}>
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-6xl space-y-4 md:space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">CONFIGURATION</p>
            <h1 className="text-3xl font-bold">Verification</h1>
          </div>

          {/* Master Toggle Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0f172a]">Verification System</h2>
                <p className="text-sm text-slate-500">Require users to verify before accessing your server</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(checked) => updateSetting('enabled', checked)}
              />
            </div>
          </div>

          {settings.enabled && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
              <div className="space-y-6">
                {/* Info Box about Verification Logs */}
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 space-y-2">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900">Verification Logging</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Verification logs are now configured on the <Link href={`/servers/${gid}/configuration/logging`} className="font-semibold underline">Logging</Link> page under the configuration section.
                  </p>
                </div>
              </div>
            </div>

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
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {textChannels.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-slate-500">No text channels found</div>
                          ) : (
                            textChannels.map(channel => (
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
                            ))
                          )}
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
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {roles.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-slate-500">No roles found</div>
                          ) : (
                            roles.map(role => (
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
                            ))
                          )}
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
                        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                          <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                          <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
              </div>
            </div>
          )}
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
