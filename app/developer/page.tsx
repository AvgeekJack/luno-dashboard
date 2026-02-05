'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Server, 
  Star, 
  Ban, 
  Users, 
  Settings, 
  CheckCircle2, 
  Clock,
  ArrowLeft,
  AlertTriangle,
  Shield,
  Zap,
  Gem,
  MoreVertical,
  Edit,
  X
} from 'lucide-react';

const DEVELOPER_USER_ID = '922940896322940929';

type TabType = 'overview' | 'maintenance' | 'servers' | 'premium' | 'bans' | 'users' | 'defaults';

export default function DeveloperPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const [guildIdToRemove, setGuildIdToRemove] = useState('');
  const [removeStatus, setRemoveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [removeMessage, setRemoveMessage] = useState('');
  const [serverProfile, setServerProfile] = useState<any>(null);
  const [serverProfileLoading, setServerProfileLoading] = useState(false);
  const [serverActionStatus, setServerActionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverActionMessage, setServerActionMessage] = useState('');
  
  const [premiumGuildId, setPremiumGuildId] = useState('');
  const [premiumStatus, setPremiumStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [premiumMessage, setPremiumMessage] = useState('');
  
  const [banUserId, setBanUserId] = useState('');
  const [banReason, setBanReason] = useState('');
  const [banStatus, setBanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [banMessage, setBanMessage] = useState('');
  
  const [userViewId, setUserViewId] = useState('');
  const [userViewStatus, setUserViewStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [userViewMessage, setUserViewMessage] = useState('');
  const [userViewData, setUserViewData] = useState<any>(null);
  
  const [defaultsStatus, setDefaultsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [defaultsMessage, setDefaultsMessage] = useState('');
  const [serverDefaults, setServerDefaults] = useState({
    prefix: '!',
    premium: true,
    modules: {
      moderation: { enabled: true },
      roleManagement: { enabled: true },
      memberManagement: { enabled: false },
      announcements: { enabled: false },
    }
  });
  
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceStatus, setMaintenanceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [maintenanceETA, setMaintenanceETA] = useState('');
  
  const [bannedUsers, setBannedUsers] = useState<any[]>([]);
  const [bannedUsersLoading, setBannedUsersLoading] = useState(false);
  const [editingBanId, setEditingBanId] = useState<string | null>(null);
  const [editReason, setEditReason] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Settings },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'servers', label: 'Servers', icon: Server },
    { id: 'premium', label: 'Premium', icon: Star },
    { id: 'bans', label: 'Bans', icon: Ban },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'defaults', label: 'Defaults', icon: Settings },
  ] as const;

  const isDeveloper = session?.user?.id === DEVELOPER_USER_ID;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    if (status === 'authenticated' && !isDeveloper) {
      router.push('/');
    }
  }, [status, isDeveloper, router]);

  useEffect(() => {
    fetchMaintenanceStatus();
    if (activeTab === 'bans') {
      fetchBannedUsers();
    }
  }, [activeTab]);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setMaintenanceMode(data.maintenanceMode || false);
        setMaintenanceETA(data.maintenanceETA || '');
      }
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
    }
  };

  const fetchBannedUsers = async () => {
    setBannedUsersLoading(true);
    try {
      const response = await fetch('/api/developer/banned-users');
      if (response.ok) {
        const data = await response.json();
        setBannedUsers(data.bannedUsers || []);
      }
    } catch (error) {
      console.error('Error fetching banned users:', error);
    } finally {
      setBannedUsersLoading(false);
    }
  };

  const handleMaintenanceToggle = async () => {
    const newValue = !maintenanceMode;
    setMaintenanceStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode: newValue, maintenanceETA }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMaintenanceMode(newValue);
        setMaintenanceStatus('success');
        setMaintenanceMessage('Maintenance mode updated successfully!');
      } else {
        setMaintenanceMode(!newValue);
        setMaintenanceStatus('error');
        setMaintenanceMessage(data.error || 'Failed to update maintenance mode');
      }
    } catch (error) {
      setMaintenanceMode(!newValue);
      setMaintenanceStatus('error');
      setMaintenanceMessage('Network error occurred');
      console.error('Maintenance toggle error:', error);
    }

    setTimeout(() => {
      setMaintenanceStatus('idle');
      setMaintenanceMessage('');
    }, 3000);
  };

  const handleUpdateETA = async () => {
    setMaintenanceStatus('loading');
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceETA }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMaintenanceStatus('success');
        setMaintenanceMessage('ETA updated successfully!');
      } else {
        setMaintenanceStatus('error');
        setMaintenanceMessage(data.error || 'Failed to update ETA');
      }
    } catch (error) {
      setMaintenanceStatus('error');
      setMaintenanceMessage('Network error occurred');
    }

    setTimeout(() => {
      setMaintenanceStatus('idle');
      setMaintenanceMessage('');
    }, 3000);
  };

  const handleUpdateBanReason = async (userId: string, newReason: string) => {
    try {
      const response = await fetch('/api/developer/ban-user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, reason: newReason }),
      });

      if (response.ok) {
        await fetchBannedUsers();
        setEditingBanId(null);
        setEditReason('');
      }
    } catch (error) {
      console.error('Error updating ban reason:', error);
    }
  };

  const handleUnbanFromList = async (userId: string) => {
    try {
      const response = await fetch('/api/developer/ban-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await fetchBannedUsers();
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  const handleRemoveBot = async () => {
    if (!guildIdToRemove.trim()) {
      setRemoveMessage('Please enter a Guild ID');
      setRemoveStatus('error');
      return;
    }

    setRemoveStatus('loading');
    try {
      const response = await fetch('/api/developer/remove-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: guildIdToRemove }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRemoveStatus('success');
        setRemoveMessage('Bot successfully removed from server!');
        setGuildIdToRemove('');
      } else {
        setRemoveStatus('error');
        setRemoveMessage(data.error || 'Failed to remove bot');
      }
    } catch (error) {
      setRemoveStatus('error');
      setRemoveMessage('Network error occurred');
    }

    setTimeout(() => {
      setRemoveStatus('idle');
      setRemoveMessage('');
    }, 3000);
  };

  const handleViewServer = async () => {
    if (!guildIdToRemove.trim()) {
      setServerActionMessage('Please enter a Guild ID');
      setServerActionStatus('error');
      return;
    }

    setServerProfileLoading(true);
    setServerProfile(null);
    setServerActionStatus('idle');
    setServerActionMessage('');

    try {
      const response = await fetch(`/api/developer/server-profile?guildId=${guildIdToRemove}`);
      const data = await response.json();
      
      if (response.ok) {
        setServerProfile(data);
      } else {
        setServerActionStatus('error');
        setServerActionMessage(data.error || 'Failed to fetch server profile');
      }
    } catch (error) {
      setServerActionStatus('error');
      setServerActionMessage('Network error occurred');
    } finally {
      setServerProfileLoading(false);
    }
  };

  const handleServerAction = async (action: string) => {
    if (!serverProfile?.guildId) return;

    setServerActionStatus('loading');
    setServerActionMessage('');

    try {
      let endpoint = '';
      let method = 'POST';
      let body: any = { guildId: serverProfile.guildId };

      switch (action) {
        case 'grant-premium':
          endpoint = '/api/developer/premium';
          break;
        case 'remove-premium':
          endpoint = '/api/developer/premium';
          method = 'DELETE';
          break;
        case 'remove-bot':
          endpoint = '/api/developer/remove-bot';
          break;
        case 'erase-data':
          endpoint = '/api/developer/erase-server-data';
          method = 'DELETE';
          break;
        case 'reset-settings':
          endpoint = '/api/developer/reset-defaults';
          body = { ...body, guildId: serverProfile.guildId };
          break;
        default:
          return;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (response.ok) {
        setServerActionStatus('success');
        setServerActionMessage(data.message || 'Action completed successfully!');
        // Refresh server profile
        await handleViewServer();
      } else {
        setServerActionStatus('error');
        setServerActionMessage(data.error || 'Action failed');
      }
    } catch (error) {
      setServerActionStatus('error');
      setServerActionMessage('Network error occurred');
    }

    setTimeout(() => {
      setServerActionStatus('idle');
      setServerActionMessage('');
    }, 3000);
  };

  const handleGrantPremium = async () => {
    if (!premiumGuildId.trim()) {
      setPremiumMessage('Please enter a Guild ID');
      setPremiumStatus('error');
      return;
    }

    setPremiumStatus('loading');
    try {
      const response = await fetch('/api/developer/premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: premiumGuildId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPremiumStatus('success');
        setPremiumMessage('Premium access granted successfully!');
        setPremiumGuildId('');
      } else {
        setPremiumStatus('error');
        setPremiumMessage(data.error || 'Failed to grant premium');
      }
    } catch (error) {
      setPremiumStatus('error');
      setPremiumMessage('Network error occurred');
    }

    setTimeout(() => {
      setPremiumStatus('idle');
      setPremiumMessage('');
    }, 3000);
  };

  const handleRevokePremium = async () => {
    if (!premiumGuildId.trim()) {
      setPremiumMessage('Please enter a Guild ID');
      setPremiumStatus('error');
      return;
    }

    setPremiumStatus('loading');
    try {
      const response = await fetch('/api/developer/premium', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId: premiumGuildId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPremiumStatus('success');
        setPremiumMessage('Premium access revoked successfully!');
        setPremiumGuildId('');
      } else {
        setPremiumStatus('error');
        setPremiumMessage(data.error || 'Failed to revoke premium');
      }
    } catch (error) {
      setPremiumStatus('error');
      setPremiumMessage('Network error occurred');
    }

    setTimeout(() => {
      setPremiumStatus('idle');
      setPremiumMessage('');
    }, 3000);
  };

  const handleBanUser = async () => {
    if (!banUserId.trim()) {
      setBanMessage('Please enter a User ID');
      setBanStatus('error');
      return;
    }

    setBanStatus('loading');
    try {
      const response = await fetch('/api/developer/ban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: banUserId, banned: true, reason: banReason }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBanStatus('success');
        setBanMessage('User banned successfully!');
        setBanUserId('');
        setBanReason('');
        await fetchBannedUsers();
      } else {
        setBanStatus('error');
        setBanMessage(data.error || 'Failed to ban user');
      }
    } catch (error) {
      setBanStatus('error');
      setBanMessage('Network error occurred');
    }

    setTimeout(() => {
      setBanStatus('idle');
      setBanMessage('');
    }, 3000);
  };

  const handleUnbanUser = async () => {
    if (!banUserId.trim()) {
      setBanMessage('Please enter a User ID');
      setBanStatus('error');
      return;
    }

    setBanStatus('loading');
    try {
      const response = await fetch('/api/developer/ban-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: banUserId }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBanStatus('success');
        setBanMessage('User unbanned successfully!');
        setBanUserId('');
        setBanReason('');
        await fetchBannedUsers();
      } else {
        setBanStatus('error');
        setBanMessage(data.error || 'Failed to unban user');
      }
    } catch (error) {
      setBanStatus('error');
      setBanMessage('Network error occurred');
    }

    setTimeout(() => {
      setBanStatus('idle');
      setBanMessage('');
    }, 3000);
  };

  const handleViewUser = async () => {
    if (!userViewId.trim()) {
      setUserViewMessage('Please enter a User ID');
      setUserViewStatus('error');
      return;
    }

    setUserViewStatus('loading');
    setUserViewData(null);
    try {
      const response = await fetch(`/api/developer/user-view?userId=${userViewId}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserViewStatus('success');
        setUserViewData(data);
        setUserViewMessage('');
      } else {
        setUserViewStatus('error');
        setUserViewMessage(data.error || 'Failed to fetch user data');
      }
    } catch (error) {
      setUserViewStatus('error');
      setUserViewMessage('Network error occurred');
    }
  };

  const handleSaveDefaults = async () => {
    setDefaultsStatus('loading');
    try {
      const response = await fetch('/api/developer/reset-defaults', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serverDefaults),
      });

      const data = await response.json();
      
      if (response.ok) {
        setDefaultsStatus('success');
        setDefaultsMessage('Server defaults updated successfully!');
      } else {
        setDefaultsStatus('error');
        setDefaultsMessage(data.error || 'Failed to update defaults');
      }
    } catch (error) {
      setDefaultsStatus('error');
      setDefaultsMessage('Network error occurred');
    }

    setTimeout(() => {
      setDefaultsStatus('idle');
      setDefaultsMessage('');
    }, 3000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isDeveloper) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-7 h-7 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">Developer Control Panel</h1>
              </div>
              <p className="text-gray-600">Master controls for the entire site</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 text-gray-700 rounded-lg transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="font-medium text-orange-600">Authenticated as Developer</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">User ID: {session?.user?.id}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  System Overview
                </h2>
                <p className="text-gray-600 text-sm">Real-time status and quick metrics of the application infrastructure.</p>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Maintenance</span>
                    <Wrench className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${maintenanceMode ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                    <p className="text-2xl font-bold text-gray-900">{maintenanceMode ? 'Offline' : 'Online'}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{maintenanceMode ? 'Mode Public' : 'Mode Public'}</p>
                  <button className="text-orange-600 text-sm font-medium mt-3 hover:text-orange-700 transition-colors">
                    Settings →
                  </button>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Est. Completion</span>
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">N/A</p>
                  <p className="text-xs text-gray-500 mt-1">No scheduled maintenance</p>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">API Status</span>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">99.9%</p>
                  <p className="text-xs text-gray-500 mt-1">Operational • Latency: 42ms</p>
                </div>
              </div>

              {/* Quick Actions & Recent Login */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-100">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg transition-colors text-left font-medium">
                      Clear Cache
                    </button>
                    <button className="w-full px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg transition-colors text-left font-medium">
                      Restart Workers
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <h3 className="font-bold text-gray-900">Recent Dev Login</h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
                      D
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Developer #0001</p>
                      <p className="text-xs text-gray-500">Last seen: 2 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'maintenance' && (
            <motion.div
              key="maintenance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-600" />
                  Maintenance Mode
                </h2>
                <p className="text-gray-600 text-sm">Enable to prevent all users (except you) from accessing the site. Users will see a maintenance screen.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Note:</p>
                      <p className="text-sm text-gray-700">When enabled, only you (developer) can bypass the maintenance screen using your PIN.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Maintenance Mode</p>
                    <p className="text-sm text-gray-600">
                      {maintenanceMode ? 'System is offline for maintenance' : 'System is operational'}
                    </p>
                  </div>
                  <button
                    onClick={handleMaintenanceToggle}
                    disabled={maintenanceStatus === 'loading'}
                    className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all ${
                      maintenanceMode ? 'bg-orange-600' : 'bg-gray-300'
                    } ${maintenanceStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : 'shadow-sm'}`}
                  >
                    <span
                      className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                        maintenanceMode ? 'translate-x-11' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Completion Date/Time
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="datetime-local"
                      value={maintenanceETA}
                      onChange={(e) => setMaintenanceETA(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                    />
                    <button
                      onClick={handleUpdateETA}
                      disabled={maintenanceStatus === 'loading'}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Update ETA
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">This will be displayed on the maintenance screen</p>
                </div>

                {maintenanceMessage && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    maintenanceStatus === 'success'
                      ? 'bg-orange-50 border-orange-200 text-orange-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    {maintenanceMessage}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'servers' && (
            <motion.div
              key="servers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Server className="w-5 h-5 text-orange-600" />
                  Bot Server Management
                </h2>
                <p className="text-gray-600 text-sm">View and manage bot servers with comprehensive admin actions.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Guild ID (e.g., 1234567890123456678)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={guildIdToRemove}
                      onChange={(e) => setGuildIdToRemove(e.target.value)}
                      placeholder="1234567890123456678"
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                    />
                    <button
                      onClick={handleViewServer}
                      disabled={serverProfileLoading}
                      className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {serverProfileLoading ? 'Loading...' : 'View Server'}
                    </button>
                  </div>
                </div>

                {serverActionMessage && (
                  <div className={`mb-4 p-4 rounded-lg border ${
                    serverActionStatus === 'success'
                      ? 'bg-orange-50 border-orange-200 text-orange-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    {serverActionMessage}
                  </div>
                )}

                {serverProfile && (
                  <div className="space-y-6">
                    {/* Server Header */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {serverProfile.icon && (
                        <img
                          src={serverProfile.icon}
                          alt={serverProfile.name}
                          className="w-16 h-16 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{serverProfile.name}</h3>
                        <p className="text-sm text-gray-500 font-mono">{serverProfile.guildId}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>👥 {serverProfile.memberCount || 'N/A'} members</span>
                          {serverProfile.isPremium && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">Premium</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Server Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">Owner</p>
                        <p className="text-gray-900 font-mono text-sm">{serverProfile.ownerId || 'Unknown'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">Command Prefix</p>
                        <p className="text-gray-900 font-semibold">{serverProfile.prefix || '!'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">Premium Status</p>
                        <p className="text-gray-900 font-semibold">{serverProfile.isPremium ? 'Active' : 'Inactive'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500 mb-1">Settings Configured</p>
                        <p className="text-gray-900 font-semibold">{serverProfile.hasSettings ? 'Yes' : 'No'}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Server Actions</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {!serverProfile.isPremium ? (
                          <button
                            onClick={() => handleServerAction('grant-premium')}
                            disabled={serverActionStatus === 'loading'}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Star className="w-4 h-4" />
                            Grant Premium
                          </button>
                        ) : (
                          <button
                            onClick={() => handleServerAction('remove-premium')}
                            disabled={serverActionStatus === 'loading'}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Remove Premium
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleServerAction('reset-settings')}
                          disabled={serverActionStatus === 'loading'}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Settings className="w-4 h-4" />
                          Reset to Defaults
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Remove bot from this server? This cannot be undone.')) {
                              handleServerAction('remove-bot');
                            }
                          }}
                          disabled={serverActionStatus === 'loading'}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Server className="w-4 h-4" />
                          Remove Bot
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Erase ALL MongoDB data for this server? This is IRREVERSIBLE!')) {
                              handleServerAction('erase-data');
                            }
                          }}
                          disabled={serverActionStatus === 'loading'}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Erase All Data
                        </button>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 mb-1">Warning:</p>
                          <p className="text-sm text-gray-700">All actions are immediate and most cannot be undone. Use with caution.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'premium' && (
            <motion.div
              key="premium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-600" />
                  Premium Management
                </h2>
                <p className="text-gray-600 text-sm">Grant or revoke premium access for a server by entering the Guild ID.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Guild ID
                  </label>
                  <input
                    type="text"
                    value={premiumGuildId}
                    onChange={(e) => setPremiumGuildId(e.target.value)}
                    placeholder="Enter Guild ID"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleGrantPremium}
                    disabled={premiumStatus === 'loading'}
                    className="flex-1 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {premiumStatus === 'loading' ? 'Processing...' : 'Grant Premium'}
                  </button>
                  <button
                    onClick={handleRevokePremium}
                    disabled={premiumStatus === 'loading'}
                    className="flex-1 px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove Premium
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <Gem className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Note:</p>
                      <p className="text-sm text-gray-700">Premium status is stored in MongoDB and takes effect immediately.</p>
                    </div>
                  </div>
                </div>

                {premiumMessage && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    premiumStatus === 'success'
                      ? 'bg-orange-50 border-orange-200 text-orange-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    {premiumMessage}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'bans' && (
            <motion.div
              key="bans"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Ban className="w-5 h-5 text-orange-600" />
                  User Ban Management
                </h2>
                <p className="text-gray-600 text-sm">Ban or unban users from accessing the website. Banned users can only access the home page.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter User ID
                  </label>
                  <input
                    type="text"
                    value={banUserId}
                    onChange={(e) => setBanUserId(e.target.value)}
                    placeholder="Enter User ID"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all mb-4 text-gray-900"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ban reason (optional but recommended)
                  </label>
                  <textarea
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="Enter ban reason..."
                    rows={4}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-gray-900"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBanUser}
                    disabled={banStatus === 'loading'}
                    className="flex-1 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {banStatus === 'loading' ? 'Processing...' : 'Ban User'}
                  </button>
                  <button
                    onClick={handleUnbanUser}
                    disabled={banStatus === 'loading'}
                    className="flex-1 px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Unban User
                  </button>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Warning:</p>
                      <p className="text-sm text-gray-700">Banned users will be automatically signed out and redirected to the home page.</p>
                    </div>
                  </div>
                </div>

                {banMessage && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    banStatus === 'success'
                      ? 'bg-orange-50 border-orange-200 text-orange-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    {banMessage}
                  </div>
                )}
              </div>

              {/* Banned Users List */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Banned Users List</h3>
                
                {bannedUsersLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading banned users...</div>
                ) : bannedUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No banned users found</div>
                ) : (
                  <div className="space-y-3">
                    {bannedUsers.map((user) => (
                      <div key={user.userId} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {user.avatar && (
                                <img
                                  src={user.avatar}
                                  alt={user.username || 'User'}
                                  className="w-10 h-10 rounded-full"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900">{user.username || 'Unknown User'}</p>
                                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">Banned</span>
                                </div>
                                <p className="text-xs text-gray-500 font-mono">{user.userId}</p>
                              </div>
                            </div>
                            
                            {editingBanId === user.userId ? (
                              <div className="mt-2">
                                <textarea
                                  value={editReason}
                                  onChange={(e) => setEditReason(e.target.value)}
                                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-gray-900"
                                  rows={2}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleUpdateBanReason(user.userId, editReason)}
                                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingBanId(null);
                                      setEditReason('');
                                    }}
                                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600 mb-1">
                                  <span className="font-medium">Reason:</span> {user.reason || 'No reason provided'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Banned on: {new Date(user.bannedAt).toLocaleDateString()} by {user.bannedBy}
                                </p>
                              </>
                            )}
                          </div>
                          
                          <div className="relative">
                            <button
                              onClick={() => setOpenMenuId(openMenuId === user.userId ? null : user.userId)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-gray-600" />
                            </button>
                            
                            {openMenuId === user.userId && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                  onClick={() => {
                                    setEditingBanId(user.userId);
                                    setEditReason(user.reason || '');
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Reason
                                </button>
                                <button
                                  onClick={() => handleUnbanFromList(user.userId)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <X className="w-4 h-4" />
                                  Unban User
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  User Account View
                </h2>
                <p className="text-gray-600 text-sm">View any user's account information and their accessible servers.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter User ID (e.g., 1234567890123456678)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={userViewId}
                      onChange={(e) => setUserViewId(e.target.value)}
                      placeholder="1234567890123456678"
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                    />
                    <button
                      onClick={handleViewUser}
                      disabled={userViewStatus === 'loading'}
                      className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {userViewStatus === 'loading' ? 'Loading...' : 'View Account'}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Note:</p>
                      <p className="text-sm text-gray-700">Only shows servers where the bot is present and the user has MANAGE_GUILD permission.</p>
                    </div>
                  </div>
                </div>

                {userViewMessage && (
                  <div className="mt-4 p-4 rounded-lg border bg-red-50 border-red-200 text-red-900">
                    {userViewMessage}
                  </div>
                )}

                {userViewData && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">User ID</p>
                      <p className="font-mono font-semibold text-gray-900">{userViewData.userId}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Accessible Servers ({userViewData.servers?.length || 0})</p>
                      {userViewData.servers && userViewData.servers.length > 0 ? (
                        <div className="space-y-2">
                          {userViewData.servers.map((server: any) => (
                            <div key={server.id} className="p-3 bg-white rounded-lg border border-gray-200">
                              <p className="font-semibold text-gray-900">{server.name}</p>
                              <p className="text-xs text-gray-500 font-mono">{server.id}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No servers found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'defaults' && (
            <motion.div
              key="defaults"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  New Server Defaults
                </h2>
                <p className="text-gray-600 text-sm">Configure default settings that will be applied when a server first adds the bot and sets up their dashboard.</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                {/* Default Command Prefix */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Command Prefix
                  </label>
                  <input
                    type="text"
                    value={serverDefaults.prefix}
                    onChange={(e) => setServerDefaults({ ...serverDefaults, prefix: e.target.value })}
                    placeholder="!"
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">The default prefix for bot commands (e.g., "!", "/", ".")</p>
                </div>

                {/* Default Premium Status */}
                <div className="mb-6">
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-orange-600" />
                        <p className="font-semibold text-gray-900">Default Premium Status</p>
                      </div>
                      <p className="text-sm text-gray-600">Enable premium features by default for new servers</p>
                    </div>
                    <button
                      onClick={() => setServerDefaults({ ...serverDefaults, premium: !serverDefaults.premium })}
                      className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-sm ${
                        serverDefaults.premium ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          serverDefaults.premium ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Default Module States */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Default Module States</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Moderation</p>
                        <p className="text-xs text-gray-500">Ban, kick, timeout, warn, etc.</p>
                      </div>
                      <button
                        onClick={() => setServerDefaults({
                          ...serverDefaults,
                          modules: {
                            ...serverDefaults.modules,
                            moderation: { enabled: !serverDefaults.modules.moderation.enabled }
                          }
                        })}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                          serverDefaults.modules.moderation.enabled ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                            serverDefaults.modules.moderation.enabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Role Management</p>
                        <p className="text-xs text-gray-500">Create, delete, manage roles</p>
                      </div>
                      <button
                        onClick={() => setServerDefaults({
                          ...serverDefaults,
                          modules: {
                            ...serverDefaults.modules,
                            roleManagement: { enabled: !serverDefaults.modules.roleManagement.enabled }
                          }
                        })}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                          serverDefaults.modules.roleManagement.enabled ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                            serverDefaults.modules.roleManagement.enabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Member Management</p>
                        <p className="text-xs text-gray-500">User info, avatars, roles</p>
                      </div>
                      <button
                        onClick={() => setServerDefaults({
                          ...serverDefaults,
                          modules: {
                            ...serverDefaults.modules,
                            memberManagement: { enabled: !serverDefaults.modules.memberManagement.enabled }
                          }
                        })}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                          serverDefaults.modules.memberManagement.enabled ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                            serverDefaults.modules.memberManagement.enabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Announcements</p>
                        <p className="text-xs text-gray-500">Announcements, giveaways, polls</p>
                      </div>
                      <button
                        onClick={() => setServerDefaults({
                          ...serverDefaults,
                          modules: {
                            ...serverDefaults.modules,
                            announcements: { enabled: !serverDefaults.modules.announcements.enabled }
                          }
                        })}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                          serverDefaults.modules.announcements.enabled ? 'bg-green-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                            serverDefaults.modules.announcements.enabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveDefaults}
                  disabled={defaultsStatus === 'loading'}
                  className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {defaultsStatus === 'loading' ? 'Saving...' : 'Save Default Settings'}
                </button>

                {defaultsMessage && (
                  <div className={`mt-4 p-4 rounded-lg border ${
                    defaultsStatus === 'success'
                      ? 'bg-orange-50 border-orange-200 text-orange-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    {defaultsMessage}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
