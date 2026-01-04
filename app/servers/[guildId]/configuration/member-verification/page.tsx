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

  const [settings, setSettings] = useState<MemberVerificationSettings>({
    enabled: false,
    method: 'button',
    channelId: null,
    verifiedRoleId: null,
    unverifiedRoleId: null,
    additionalRoles: [],
    bypassRoles: [],
    kickUnverified: false,
    kickTimeout: 600,
    sendDM: true,
    dmMessage: 'Welcome! Please verify yourself in the verification channel.',
    verifyMessage: 'Click the button below to verify yourself as a human.',
    buttonLabel: 'Verify',
    buttonColor: '#22c55e',
    requireAccountAge: false,
    minimumAccountAge: 7,
    requireServerTime: false,
    minimumServerTime: 5,
    logChannel: null,
    captchaProvider: 'hcaptcha',
    captchaDifficulty: 'medium',
  });

  const [originalSettings, setOriginalSettings] = useState<MemberVerificationSettings>(settings);
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

      if (data.configuration?.memberVerification) {
        setSettings(data.configuration.memberVerification);
        setOriginalSettings(data.configuration.memberVerification);
      }

      setChannels(data.channels || []);
      setRoles(data.roles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
    }
  };

  const updateSetting = <K extends keyof MemberVerificationSettings>(
    key: K,
    value: MemberVerificationSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/servers/${gid}/general`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'configuration.memberVerification': settings }),
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
          <Link
            href={`/servers/${gid}`}
            className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition"
          >
            ← Back to Server
          </Link>
          <div className="pt-4 border-t border-orange-100">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2 px-4">Configuration</p>
            <Link href={`/servers/${gid}/configuration/logging`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">Logging</Link>
            <Link href={`/servers/${gid}/configuration/automod`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">AutoMod</Link>
            <Link href={`/servers/${gid}/configuration/anti-raid`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">Anti-Raid</Link>
            <Link href={`/servers/${gid}/configuration/reaction-roles`} className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-orange-50 transition">Reaction Roles</Link>
            <Link href={`/servers/${gid}/configuration/member-verification`} className="block px-4 py-2 rounded-lg bg-orange-100 text-orange-600 transition">Member Verification</Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 ml-64 py-12 px-4 md:px-8 flex justify-center">
        <div className="w-full max-w-4xl space-y-4 md:space-y-6">
          <ServerHeader guildId={gid} />
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">Configuration</p>
            <h1 className="text-3xl font-bold">Member Verification</h1>
          </div>

          <div className="bg-white border border-orange-100 rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between pb-6 border-b border-orange-100">
              <div>
                <h2 className="text-xl font-semibold text-[#0f172a]">Member Verification System</h2>
                <p className="text-slate-600 text-sm mt-1">Verify new members before granting access</p>
              </div>
              <button type="button" onClick={() => updateSetting('enabled', !settings.enabled)}
                className={`${settings.enabled ? 'bg-orange-500' : 'bg-slate-300'} relative inline-flex h-6 w-11 items-center rounded-full transition`}>
                <span className={`${settings.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0f172a]">Core Settings</h3>
              <div className="p-4 rounded-lg border border-orange-100 space-y-2">
                <label className="block text-sm font-semibold text-slate-800">Verification Method</label>
                <select value={settings.method} onChange={(e) => updateSetting('method', e.target.value as any)} className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white">
                  <option value="button">Button Click</option>
                  <option value="captcha">CAPTCHA</option>
                  <option value="email">Email Verification</option>
                </select>
                <p className="text-xs text-slate-500">Choose how members verify themselves</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-64 right-0 bg-orange-500 text-white px-8 py-4 flex items-center justify-between z-50">
          <p className="font-semibold">You have unsaved changes</p>
          <div className="flex gap-3">
            <button onClick={() => setSettings(originalSettings)} className="px-4 py-2 bg-white text-orange-500 rounded-lg hover:bg-orange-50 transition font-medium">Discard</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
