'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';

const DEVELOPER_USER_ID = '922940896322940929';

interface VerificationSettings {
  enabled: boolean;
  verificationMethod: 'reaction' | 'button' | 'captcha' | 'manual';
  messageTitle: string;
  messageDescription: string;
  messageColor: string;
  rulesText: string;
  accountAgeRequirement: number;
  requireServerAgreement: boolean;
  multipleSteps: boolean;
  welcomeDM: boolean;
  welcomeDMMessage: string;
  removeVerificationMessages: boolean;
  antiAltProtection: boolean;
  kickUnverifiedAfter: number;
  verificationCooldown: number;
}

export default function DefaultsVerificationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(true);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [settings, setSettings] = useState<VerificationSettings>({
    enabled: false,
    verificationMethod: 'button',
    messageTitle: 'Server Verification',
    messageDescription: 'Click the button below to verify and gain access to the server!',
    messageColor: '#5865F2',
    rulesText: 'By verifying, you agree to follow our server rules.',
    accountAgeRequirement: 0,
    requireServerAgreement: true,
    multipleSteps: false,
    welcomeDM: false,
    welcomeDMMessage: 'Welcome to the server! You have been verified.',
    removeVerificationMessages: true,
    antiAltProtection: false,
    kickUnverifiedAfter: 0,
    verificationCooldown: 0,
  });

  const [originalSettings, setOriginalSettings] = useState<VerificationSettings>(settings);

  const isDeveloper = session?.user?.id === DEVELOPER_USER_ID;

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
      return;
    }

    if (!isDeveloper) {
      router.push('/');
      return;
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/developer/defaults/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.configuration?.verification) {
            const loadedSettings = { ...settings, ...data.configuration.verification };
            setSettings(loadedSettings);
            setOriginalSettings(loadedSettings);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status, router, isDeveloper]);

  const handleVerifyPin = async () => {
    if (!pin.trim()) {
      setVerifyError('Please enter PIN');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');

    try {
      const response = await fetch('/api/developer/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!response.ok) {
        const data = await response.json();
        setVerifyError(data.error || 'Invalid PIN');
        setIsVerifying(false);
        return;
      }

      setIsVerified(true);
      setPin('');
    } catch (error) {
      setVerifyError('Error verifying PIN');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/developer/defaults/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'configuration.verification': settings,
        }),
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

  if (status === 'loading' || loading) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Loading...</div>;
  }

  if (!isDeveloper) {
    return <div className="flex min-h-screen items-center justify-center text-[#0f172a]">Access Denied</div>;
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Developer Verification</h2>
            <p className="text-gray-600 text-center mb-6">Enter your PIN to access default settings</p>
            
            <div className="space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyPin()}
                placeholder="Enter Developer PIN"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={isVerifying}
              />
              
              {verifyError && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{verifyError}</span>
                </div>
              )}
              
              <button
                onClick={handleVerifyPin}
                disabled={isVerifying || !pin.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Verifying...' : 'Verify PIN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-white/90 border-r border-orange-100 shadow-sm overflow-y-auto flex flex-col z-[50] transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-orange-100">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity ml-12 md:ml-0">
            <img src="/luno-logo.png" alt="Luno Bot" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-[#0f172a]">Luno</span>
          </Link>
        </div>
        
        <div className="px-4 py-4">
          <Link href="/developer" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm px-3" onClick={() => setMobileMenuOpen(false)}>← Back to Developer Panel</Link>
        </div>
        
        <nav className="px-4 space-y-2 text-sm font-semibold text-slate-700">
          <Link href="/developer/defaults" className="flex items-center gap-3 px-3 py-6 hover:bg-orange-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
            <img src="/dashbaord.png" alt="" className="w-5 h-5" />
            Default Settings Dashboard
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
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${settingsOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '0ms'}}>
                  General (N/A for Defaults)
                </span>
                <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-400 text-left cursor-not-allowed" style={{animationDelay: '50ms'}}>
                  Setup (N/A for Defaults)
                </span>
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
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${configOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href="/developer/defaults/automod" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Automod
                </Link>
                <Link href="/developer/defaults/logging" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Logging
                </Link>
                <Link href="/developer/defaults/antiraid" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Anti-Raid
                </Link>
                <Link href="/developer/defaults/reaction-roles" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Reaction Roles
                </Link>
                <Link href="/developer/defaults/verification" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-orange-100 text-orange-700 transition-colors text-left ${configOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
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
              <div className={`px-2 py-1 space-y-1 border-l-2 border-orange-400 ml-3 ${modulesOpen ? 'animate-dropdown-open' : 'animate-dropdown-close'}`}>
                <Link href="/developer/defaults/moderation" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '0ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Moderation
                </Link>
                <Link href="/developer/defaults/role-management" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '50ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Role Management
                </Link>
                <Link href="/developer/defaults/member-management" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '100ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Member Management
                </Link>
                <Link href="/developer/defaults/announcements" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '150ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Announcements
                </Link>
                <Link href="/developer/defaults/welcome-messages" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '200ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Welcome Messages
                </Link>
                <Link href="/developer/defaults/fun" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '250ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Fun
                </Link>
                <Link href="/developer/defaults/utilities" className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors text-left ${modulesOpen ? 'animate-item-open' : 'animate-item-close'}`} style={{animationDelay: '300ms'}} onClick={() => setMobileMenuOpen(false)}>
                  Utilities
                </Link>
              </div>
            )}
          </details>
        </nav>

        <div className="mt-auto p-4 border-t border-orange-200">
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-orange-900 mb-1">⚙️ Default Settings Mode</p>
            <p className="text-xs text-orange-700">Changes here will apply to all new servers.</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-0 md:ml-64 py-12 px-4 md:px-8 pt-20 md:pt-12 flex justify-center">
        <div className="w-full max-w-4xl space-y-6">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-semibold">DEFAULT CONFIGURATION</p>
            <h1 className="text-3xl font-bold">Verification Defaults</h1>
          </div>

          {/* Warning Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-orange-900 mb-1">⚠️ These are default settings applied to new servers</p>
                <p className="text-sm text-orange-800">Any changes made here will only affect newly added servers. Existing servers will retain their current settings. Verification channels and roles must be configured per-server.</p>
              </div>
            </div>
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
            <>
              {/* Info Box about Channel/Role Configuration */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 space-y-2">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">About Verification Configuration</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Verification channels and roles must be configured per-server. The settings below control the behavior and requirements of verification across new servers, but actual channels and roles are assigned individually for each server.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Method */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
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
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-bold text-sm text-slate-800">{method.label}</p>
                        <p className="text-xs text-slate-600 mt-1">{method.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Customization */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Message Customization</h3>
                  
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Message Title</label>
                    <input
                      type="text"
                      value={settings.messageTitle}
                      onChange={(e) => updateSetting('messageTitle', e.target.value)}
                      placeholder="Server Verification"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Message Description</label>
                    <textarea
                      value={settings.messageDescription}
                      onChange={(e) => updateSetting('messageDescription', e.target.value)}
                      placeholder="Click the button below to verify and gain access to the server!"
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Embed Color</label>
                    <input
                      type="color"
                      value={settings.messageColor}
                      onChange={(e) => updateSetting('messageColor', e.target.value)}
                      className="w-full h-10 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Rules & Requirements */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Rules & Requirements</h3>
                  
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Custom Rules Text</label>
                    <textarea
                      value={settings.rulesText}
                      onChange={(e) => updateSetting('rulesText', e.target.value)}
                      placeholder="By verifying, you agree to follow our server rules."
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                    <p className="text-xs text-slate-500">Displayed in verification embed</p>
                  </div>

                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">Account Age Requirement</label>
                    <input 
                      type="number" 
                      value={settings.accountAgeRequirement} 
                      onChange={(e) => updateSetting('accountAgeRequirement', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      min="0"
                    />
                    <p className="text-xs text-slate-500">Minimum account age in days (0 = no requirement)</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Require Server Agreement</p>
                        <p className="text-xs text-slate-500">User must agree to rules checkbox</p>
                      </div>
                      <Switch 
                        checked={settings.requireServerAgreement} 
                        onCheckedChange={(checked) => updateSetting('requireServerAgreement', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
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
              </div>

              {/* Post-Verification Actions */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Post-Verification Actions</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
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
                      <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                        <label className="block text-sm font-semibold text-slate-800">Welcome DM Message</label>
                        <textarea
                          value={settings.welcomeDMMessage}
                          onChange={(e) => updateSetting('welcomeDMMessage', e.target.value)}
                          placeholder="Welcome to the server! You have been verified."
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
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
              </div>

              {/* Security Settings */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#0f172a]">Security Settings</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50">
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Anti-Alt Protection</p>
                        <p className="text-xs text-slate-500">Detect potential alternate accounts</p>
                      </div>
                      <Switch 
                        checked={settings.antiAltProtection} 
                        onCheckedChange={(checked) => updateSetting('antiAltProtection', checked)}
                      />
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Kick Unverified After</label>
                      <input 
                        type="number" 
                        value={settings.kickUnverifiedAfter} 
                        onChange={(e) => updateSetting('kickUnverifiedAfter', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        min="0"
                      />
                      <p className="text-xs text-slate-500">Kick unverified users after X hours (0 = disabled)</p>
                    </div>

                    <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">Verification Cooldown</label>
                      <input 
                        type="number" 
                        value={settings.verificationCooldown} 
                        onChange={(e) => updateSetting('verificationCooldown', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        min="0"
                      />
                      <p className="text-xs text-slate-500">Seconds between verification attempts (0 = no cooldown)</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
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
