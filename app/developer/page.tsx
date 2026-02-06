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
  X,
  Database,
  Link2,
  Megaphone,
  BarChart3,
  Beaker
} from 'lucide-react';

const DEVELOPER_USER_ID = '922940896322940929';

type TabType = 'overview' | 'maintenance' | 'servers' | 'premium' | 'bans' | 'users' | 'defaults' | 'settings';

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
  const [expandedDefaults, setExpandedDefaults] = useState<string[]>([]);
  const [serverDefaults, setServerDefaults] = useState({
    prefix: '!',
    premium: true,
    configuration: {
      automod: { 
        enabled: true,
        // Filter Toggles (9)
        antiLinkEnabled: false,
        antiInviteEnabled: false,
        antiSpamEnabled: true,
        antiMentionEnabled: true,
        antiFloodEnabled: true,
        antiZalgoEnabled: false,
        antiSwearEnabled: false,
        capsFilterEnabled: false,
        // Thresholds (11)
        spamMessageCount: 5,
        spamTimeWindow: 5,
        mentionLimit: 5,
        capsPercentage: 70,
        floodMessageCount: 3,
        floodTimeWindow: 2,
        zalgoLimit: 10,
        warningDuration: 5,
        // Auto-Timeout
        autoTimeoutEnabled: false,
        autoTimeoutViolations: 3,
        autoTimeoutWindow: 60,
        autoTimeoutDuration: 300,
        // Actions (5)
        deleteMessage: true,
        sendWarning: true,
        dmUser: true,
        autoWhitelistModerators: true,
        escalatingPunishments: false
      },
      logging: { 
        enabled: true,
        // AutoMod Logs (3)
        logAutomodViolations: true,
        logAutomodActions: true,
        logAutomodFilters: false,
        // Anti-Raid Logs (3)
        logRaidDetections: true,
        logRaidActions: true,
        logJoinPatterns: false,
        // Verification Logs (2)
        trackVerificationMetrics: false,
        logFailedVerificationAttempts: false,
        // Moderation Logs (12)
        warnsEnabled: true,
        kicksEnabled: true,
        bansEnabled: true,
        unbansEnabled: true,
        timeoutsEnabled: true,
        untimeoutsEnabled: true,
        softbansEnabled: true,
        channelLocksEnabled: true,
        lockdownsEnabled: true,
        slowmodeEnabled: true,
        messagePurgeEnabled: true,
        automodActionsEnabled: true,
        // Member Logs (5)
        memberJoinEnabled: true,
        memberLeaveEnabled: true,
        roleUpdatesEnabled: true,
        nicknameChangesEnabled: true,
        usernameChangesEnabled: true,
        // Message Logs (4)
        messageDeleteEnabled: true,
        messageEditEnabled: true,
        bulkDeleteEnabled: true,
        messageAttachmentsEnabled: true,
        // Channel Logs (3)
        channelCreateEnabled: true,
        channelDeleteEnabled: true,
        channelUpdateEnabled: true,
        // Role Logs (3)
        roleCreateEnabled: true,
        roleDeleteEnabled: true,
        roleUpdateEnabled: true,
        // Voice Logs (5)
        voiceJoinEnabled: true,
        voiceLeaveEnabled: true,
        voiceMoveEnabled: true,
        voiceMuteDeafenEnabled: true,
        voiceStreamingEnabled: false,
        // Server Logs (6)
        serverUpdateEnabled: true,
        emojiEnabled: true,
        stickerEnabled: true,
        webhookEnabled: true,
        inviteEnabled: true,
        integrationEnabled: true,
        // Advanced (3)
        includeBotActions: false,
        logMessageContent: true,
        logEmbedUrls: true,
        retentionPeriod: 30
      },
      antiRaid: { 
        enabled: false,
        protectionLevel: 'medium', // low/medium/high/extreme/custom
        accountAge: 600000, // milliseconds
        joinRateLimit: 5,
        joinRateWindow: 60000,
        verificationLevel: 1,
        autoKickNewAccounts: true,
        kickOnRateExceeded: true
      },
      reactionRoles: { 
        enabled: false,
        roleLimit: 0, // 0 = unlimited
        allowRoleStacking: true,
        autoDeleteReactions: false,
        dmOnRoleChange: false,
        rolePersistence: false,
        reactionCooldown: 0
      },
      verification: { 
        enabled: false,
        verificationMethod: 'button', // reaction/button/captcha/manual
        accountAgeRequirement: 0, // days
        requireServerAgreement: true,
        multipleSteps: false,
        welcomeDM: false,
        removeVerificationMessages: true,
        antiAltProtection: false,
        kickUnverifiedAfter: 0, // hours, 0 = disabled
        verificationCooldown: 0 // seconds
      },
    },
    modules: {
      moderation: { 
        enabled: true,
        // Command toggles
        banEnabled: true,
        softbanEnabled: true,
        unbanEnabled: true,
        kickEnabled: true,
        timeoutEnabled: true,
        untimeoutEnabled: true,
        warnEnabled: true,
        clearEnabled: true,
        slowmodeEnabled: true,
        lockEnabled: true,
        unlockEnabled: true,
        lockdownEnabled: true,
        unlockdownEnabled: true
      },
      roleManagement: { 
        enabled: true,
        roleCreateEnabled: true,
        roleDeleteEnabled: true,
        roleAssignEnabled: true
      },
      memberManagement: { 
        enabled: false,
        userinfoEnabled: true,
        useravatarEnabled: true,
        userbannerEnabled: true,
        rolemembers: true,
        pruneusersEnabled: true
      },
      announcements: { 
        enabled: false,
        announceEnabled: true,
        giveawayCreateEnabled: true,
        giveawayDrawEnabled: true,
        pollEnabled: true
      },
      welcomeMessages: { 
        enabled: false,
        // Welcome settings
        welcomeEnabled: true,
        welcomeMessage: 'Welcome {user} to {server}!',
        welcomeTitle: 'Welcome!',
        welcomeDescription: '',
        welcomeColor: '#5865F2',
        // Leave settings
        leaveEnabled: false,
        leaveMessage: '{user} has left the server.',
        leaveTitle: 'Goodbye',
        leaveDescription: '',
        leaveColor: '#ED4245'
      },
      fun: { 
        enabled: true,
        memeEnabled: true,
        eightballEnabled: true,
        coinflipEnabled: true,
        diceEnabled: true,
        jokeEnabled: true,
        rpsEnabled: true,
        rateEnabled: true
      },
      utilities: { 
        enabled: true,
        serverinfoEnabled: true,
        channelinfoEnabled: true,
        roleinfoEnabled: true,
        emojiinfoEnabled: true,
        pingEnabled: true,
        inviteEnabled: true,
        helpEnabled: true,
        supportEnabled: true,
        dashboardEnabled: true
      },
    }
  });
  
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceStatus, setMaintenanceStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [premiumPurchaseEnabled, setPremiumPurchaseEnabled] = useState(false);
  const [premiumManagementEnabled, setPremiumManagementEnabled] = useState(false);
  const [botInviteEnabled, setBotInviteEnabled] = useState(true);
  const [systemAnnouncementsEnabled, setSystemAnnouncementsEnabled] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [betaFeaturesEnabled, setBetaFeaturesEnabled] = useState(false);
  const [announcementConfig, setAnnouncementConfig] = useState({
    title: '',
    description: '',
    backgroundColor: '#f97316',
    buttonText: '',
    buttonUrl: '',
    dismissable: true,
    visibleOnHomePage: true,
    visibleAfterLogin: true
  });
  const [settingsStatus, setSettingsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [settingsMessage, setSettingsMessage] = useState('');
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
    { id: 'defaults', label: 'Defaults', icon: Database },
    { id: 'settings', label: 'Settings', icon: Zap },
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
    if (activeTab === 'settings') {
      fetchSettings();
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

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/site-settings');
      if (response.ok) {
        const data = await response.json();
        setPremiumPurchaseEnabled(data.premiumPurchaseEnabled || false);
        setPremiumManagementEnabled(data.premiumManagementEnabled || false);
        setBotInviteEnabled(data.botInviteEnabled ?? true);
        setSystemAnnouncementsEnabled(data.systemAnnouncementsEnabled || false);
        setAnalyticsEnabled(data.analyticsEnabled ?? true);
        setBetaFeaturesEnabled(data.betaFeaturesEnabled || false);
        if (data.announcementConfig) {
          setAnnouncementConfig(data.announcementConfig);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handlePremiumPurchaseToggle = async () => {
    const newValue = !premiumPurchaseEnabled;
    setSettingsStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premiumPurchaseEnabled: newValue }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPremiumPurchaseEnabled(newValue);
        setSettingsStatus('success');
        setSettingsMessage('Premium purchase setting updated successfully!');
      } else {
        setSettingsStatus('error');
        setSettingsMessage(data.error || 'Failed to update setting');
      }
    } catch (error) {
      setSettingsStatus('error');
      setSettingsMessage('Network error occurred');
      console.error('Premium purchase toggle error:', error);
    }

    setTimeout(() => {
      setSettingsStatus('idle');
      setSettingsMessage('');
    }, 3000);
  };

  const handlePremiumManagementToggle = async () => {
    const newValue = !premiumManagementEnabled;
    setSettingsStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ premiumManagementEnabled: newValue }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPremiumManagementEnabled(newValue);
        setSettingsStatus('success');
        setSettingsMessage('Premium management setting updated successfully!');
      } else {
        setSettingsStatus('error');
        setSettingsMessage(data.error || 'Failed to update setting');
      }
    } catch (error) {
      setSettingsStatus('error');
      setSettingsMessage('Network error occurred');
      console.error('Premium management toggle error:', error);
    }

    setTimeout(() => {
      setSettingsStatus('idle');
      setSettingsMessage('');
    }, 3000);
  };

  const handleBotInviteToggle = async () => {
    const newValue = !botInviteEnabled;
    setSettingsStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botInviteEnabled: newValue }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBotInviteEnabled(newValue);
        setSettingsStatus('success');
        setSettingsMessage('Bot invite setting updated successfully!');
      } else {
        setSettingsStatus('error');
        setSettingsMessage(data.error || 'Failed to update setting');
      }
    } catch (error) {
      setSettingsStatus('error');
      setSettingsMessage('Network error occurred');
      console.error('Bot invite toggle error:', error);
    }

    setTimeout(() => {
      setSettingsStatus('idle');
      setSettingsMessage('');
    }, 3000);
  };

  const handleSystemAnnouncementsToggle = async () => {
    const newValue = !systemAnnouncementsEnabled;
    setSettingsStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemAnnouncementsEnabled: newValue }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSystemAnnouncementsEnabled(newValue);
        setSettingsStatus('success');
        setSettingsMessage('System announcements setting updated successfully!');
      } else {
        setSettingsStatus('error');
        setSettingsMessage(data.error || 'Failed to update setting');
      }
    } catch (error) {
      setSettingsStatus('error');
      setSettingsMessage('Network error occurred');
      console.error('System announcements toggle error:', error);
    }

    setTimeout(() => {
      setSettingsStatus('idle');
      setSettingsMessage('');
    }, 3000);
  };

  const handleSaveAnnouncementConfig = async () => {
    setSettingsStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementConfig }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSettingsStatus('success');
        setSettingsMessage('Announcement configuration saved successfully!');
      } else {
        setSettingsStatus('error');
        setSettingsMessage(data.error || 'Failed to save configuration');
      }
    } catch (error) {
      setSettingsStatus('error');
      setSettingsMessage('Network error occurred');
      console.error('Announcement config save error:', error);
    }

    setTimeout(() => {
      setSettingsStatus('idle');
      setSettingsMessage('');
    }, 3000);
  };

  const handleAnalyticsToggle = async () => {
    const newValue = !analyticsEnabled;
    setSettingsStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analyticsEnabled: newValue }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setAnalyticsEnabled(newValue);
        setSettingsStatus('success');
        setSettingsMessage('Analytics setting updated successfully!');
      } else {
        setSettingsStatus('error');
        setSettingsMessage(data.error || 'Failed to update setting');
      }
    } catch (error) {
      setSettingsStatus('error');
      setSettingsMessage('Network error occurred');
      console.error('Analytics toggle error:', error);
    }

    setTimeout(() => {
      setSettingsStatus('idle');
      setSettingsMessage('');
    }, 3000);
  };

  const handleBetaFeaturesToggle = async () => {
    const newValue = !betaFeaturesEnabled;
    setSettingsStatus('loading');
    
    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betaFeaturesEnabled: newValue }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setBetaFeaturesEnabled(newValue);
        setSettingsStatus('success');
        setSettingsMessage('Beta features setting updated successfully!');
      } else {
        setSettingsStatus('error');
        setSettingsMessage(data.error || 'Failed to update setting');
      }
    } catch (error) {
      setSettingsStatus('error');
      setSettingsMessage('Network error occurred');
      console.error('Beta features toggle error:', error);
    }

    setTimeout(() => {
      setSettingsStatus('idle');
      setSettingsMessage('');
    }, 3000);
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
                      <button
                        onClick={() => router.push(`/servers/${serverProfile.guildId}`)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap"
                      >
                        View Server Dashboard
                      </button>
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

              {/* Defaults Management Button */}
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                    <Settings className="w-10 h-10 text-orange-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Default Settings</h3>
                    <p className="text-gray-600 text-lg mb-4">
                      Configure default bot settings for new servers using an interface identical to the server management dashboard.
                    </p>
                    <p className="text-sm text-gray-500">
                      These defaults will be automatically applied when a server first adds the bot. You can manage all configuration options including prefix, timezone, modules, and more.
                    </p>
                  </div>

                  <button
                    onClick={() => router.push('/developer/defaults')}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Open Defaults Dashboard</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Database className="w-4 h-4" />
                      <span>Manage settings as if you were configuring a server</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
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

                {/* Configuration Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <span className="text-orange-600">🔧</span> Configuration
                  </h3>
                  <div className="space-y-3">
                    {/* Automod */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.configuration.automod.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('automod') ? prev.filter(i => i !== 'automod') : [...prev, 'automod']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('automod') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Automod</p>
                            <p className="text-xs text-gray-500">Automated content moderation</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            configuration: {
                              ...serverDefaults.configuration,
                              automod: { ...serverDefaults.configuration.automod, enabled: !serverDefaults.configuration.automod.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.configuration.automod.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.configuration.automod.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.configuration.automod.enabled && expandedDefaults.includes('automod') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Filter Types</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Anti-Link</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.antiLinkEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, antiLinkEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Anti-Invite</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.antiInviteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, antiInviteEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Anti-Spam</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.antiSpamEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, antiSpamEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Anti-Mention</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.antiMentionEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, antiMentionEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Anti-Flood</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.antiFloodEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, antiFloodEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Anti-Zalgo</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.antiZalgoEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, antiZalgoEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Anti-Swear</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.antiSwearEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, antiSwearEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Caps Filter</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.capsFilterEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, capsFilterEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Thresholds</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Spam Messages</span>
                                <input type="number" min="1" max="20" value={serverDefaults.configuration.automod.spamMessageCount} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, spamMessageCount: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Spam Window (s)</span>
                                <input type="number" min="1" max="60" value={serverDefaults.configuration.automod.spamTimeWindow} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, spamTimeWindow: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Mention Limit</span>
                                <input type="number" min="1" max="20" value={serverDefaults.configuration.automod.mentionLimit} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, mentionLimit: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Caps % Max</span>
                                <input type="number" min="0" max="100" value={serverDefaults.configuration.automod.capsPercentage} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, capsPercentage: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Flood Messages</span>
                                <input type="number" min="1" max="10" value={serverDefaults.configuration.automod.floodMessageCount} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, floodMessageCount: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Flood Window (s)</span>
                                <input type="number" min="1" max="30" value={serverDefaults.configuration.automod.floodTimeWindow} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, floodTimeWindow: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Zalgo Chars</span>
                                <input type="number" min="1" max="50" value={serverDefaults.configuration.automod.zalgoLimit} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, zalgoLimit: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Warning Display (s)</span>
                                <input type="number" min="1" max="60" value={serverDefaults.configuration.automod.warningDuration} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, warningDuration: parseInt(e.target.value) }}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Auto-Timeout Settings</p>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Enable Auto-Timeout</span>
                              <input type="checkbox" checked={serverDefaults.configuration.automod.autoTimeoutEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, autoTimeoutEnabled: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Violations</span>
                                <input type="number" min="1" max="10" value={serverDefaults.configuration.automod.autoTimeoutViolations} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, autoTimeoutViolations: parseInt(e.target.value) }}})} className="w-12 px-1 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Window (s)</span>
                                <input type="number" min="10" max="600" value={serverDefaults.configuration.automod.autoTimeoutWindow} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, autoTimeoutWindow: parseInt(e.target.value) }}})} className="w-12 px-1 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Duration (s)</span>
                                <input type="number" min="60" max="2592000" value={serverDefaults.configuration.automod.autoTimeoutDuration} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, autoTimeoutDuration: parseInt(e.target.value) }}})} className="w-12 px-1 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Actions</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Delete Messages</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.deleteMessage} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, deleteMessage: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Send Warning</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.sendWarning} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, sendWarning: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">DM User</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.dmUser} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, dmUser: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Whitelist Mods</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.autoWhitelistModerators} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, autoWhitelistModerators: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Escalating Punishments</span>
                                <input type="checkbox" checked={serverDefaults.configuration.automod.escalatingPunishments} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, automod: { ...serverDefaults.configuration.automod, escalatingPunishments: e.target.checked }}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Logging - TEMPORARILY DISABLED FOR DEBUGGING
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.configuration.logging.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('logging') ? prev.filter(i => i !== 'logging') : [...prev, 'logging']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('logging') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Logging</p>
                            <p className="text-xs text-gray-500">Server activity logs</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            configuration: {
                              ...serverDefaults.configuration,
                              logging: { ...serverDefaults.configuration.logging, enabled: !serverDefaults.configuration.logging.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.configuration.logging.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.configuration.logging.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.configuration.logging.enabled && expandedDefaults.includes('logging') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3 max-h-96 overflow-y-auto">
                          {/* AutoMod Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">AutoMod Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Violations</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logAutomodViolations} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logAutomodViolations: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Actions</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logAutomodActions} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logAutomodActions: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Filters</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logAutomodFilters} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logAutomodFilters: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Anti-Raid Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Anti-Raid Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Detections</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logRaidDetections} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logRaidDetections: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Actions</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logRaidActions} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logRaidActions: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Join Patterns</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logJoinPatterns} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logJoinPatterns: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Verification Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Verification Logs</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Track Metrics</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.trackVerificationMetrics} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, trackVerificationMetrics: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Failed Attempts</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logFailedVerificationAttempts} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logFailedVerificationAttempts: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Moderation Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Moderation Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Warns</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.warnsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, warnsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Kicks</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.kicksEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, kicksEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Bans</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.bansEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, bansEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Unbans</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.unbansEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, unbansEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Timeouts</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.timeoutsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, timeoutsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Untimeouts</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.untimeoutsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, untimeoutsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Softbans</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.softbansEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, softbansEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Ch. Locks</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.channelLocksEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelLocksEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Lockdowns</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.lockdownsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, lockdownsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Slowmode</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.slowmodeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, slowmodeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Msg Purge</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.messagePurgeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messagePurgeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Automod</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.automodActionsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, automodActionsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Member Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Member Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Joins</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.memberJoinEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, memberJoinEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Leaves</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.memberLeaveEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, memberLeaveEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Role Updates</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.roleUpdatesEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleUpdatesEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Nicknames</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.nicknameChangesEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, nicknameChangesEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Usernames</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.usernameChangesEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, usernameChangesEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Message Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Message Logs</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Deletes</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.messageDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messageDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Edits</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.messageEditEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messageEditEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Bulk Delete</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.bulkDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, bulkDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Attachments</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.messageAttachmentsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, messageAttachmentsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Channel Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Channel Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Created</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.channelCreateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelCreateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Deleted</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.channelDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Updated</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.channelUpdateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, channelUpdateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Role Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Role Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Created</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.roleCreateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleCreateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Deleted</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.roleDeleteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleDeleteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Updated</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.roleUpdateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, roleUpdateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Voice Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Voice Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Joins</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.voiceJoinEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceJoinEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Leaves</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.voiceLeaveEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceLeaveEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Moves</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.voiceMoveEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceMoveEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Mute/Deafen</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.voiceMuteDeafenEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceMuteDeafenEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Streaming</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.voiceStreamingEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, voiceStreamingEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Server Logs */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Server Logs</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Updates</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.serverUpdateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, serverUpdateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Emojis</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.emojiEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, emojiEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Stickers</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.stickerEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, stickerEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Webhooks</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.webhookEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, webhookEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Invites</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.inviteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, inviteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Integrations</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.integrationEnabled} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, integrationEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                            </div>
                          </div>

                          {/* Advanced */}
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Advanced Settings</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Include Bot Actions</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.includeBotActions} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, includeBotActions: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Log Message Content</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logMessageContent} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logMessageContent: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Log Embed URLs</span>
                                <input type="checkbox" checked={serverDefaults.configuration.logging.logEmbedUrls} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, logEmbedUrls: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded">
                                <span className="text-xs text-gray-700">Retention (days)</span>
                                <input type="number" min="1" max="365" value={serverDefaults.configuration.logging.retentionPeriod} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, logging: {...serverDefaults.configuration.logging, retentionPeriod: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    */}

                    {/* Anti-Raid - simpler structure */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.configuration.antiRaid.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('antiRaid') ? prev.filter(i => i !== 'antiRaid') : [...prev, 'antiRaid']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('antiRaid') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Anti-Raid</p>
                            <p className="text-xs text-gray-500">Raid protection measures</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            configuration: {
                              ...serverDefaults.configuration,
                              antiRaid: { ...serverDefaults.configuration.antiRaid, enabled: !serverDefaults.configuration.antiRaid.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.configuration.antiRaid.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.configuration.antiRaid.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.configuration.antiRaid.enabled && expandedDefaults.includes('antiRaid') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Protection Level</span>
                              <select value={serverDefaults.configuration.antiRaid.protectionLevel} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, antiRaid: {...serverDefaults.configuration.antiRaid, protectionLevel: e.target.value}}})} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="extreme">Extreme</option>
                                <option value="custom">Custom</option>
                              </select>
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Account Age (ms)</span>
                              <input type="number" min="0" value={serverDefaults.configuration.antiRaid.accountAge} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, antiRaid: {...serverDefaults.configuration.antiRaid, accountAge: parseInt(e.target.value)}}})} className="w-20 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Join Rate Limit</span>
                              <input type="number" min="1" max="50" value={serverDefaults.configuration.antiRaid.joinRateLimit} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, antiRaid: {...serverDefaults.configuration.antiRaid, joinRateLimit: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Join Window (ms)</span>
                              <input type="number" min="1000" value={serverDefaults.configuration.antiRaid.joinRateWindow} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, antiRaid: {...serverDefaults.configuration.antiRaid, joinRateWindow: parseInt(e.target.value)}}})} className="w-20 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Verification Level</span>
                              <select value={serverDefaults.configuration.antiRaid.verificationLevel} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, antiRaid: {...serverDefaults.configuration.antiRaid, verificationLevel: parseInt(e.target.value)}}})} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900">
                                <option value="0">None</option>
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>
                                <option value="4">Highest</option>
                              </select>
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Auto-Kick New</span>
                              <input type="checkbox" checked={serverDefaults.configuration.antiRaid.autoKickNewAccounts} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, antiRaid: {...serverDefaults.configuration.antiRaid, autoKickNewAccounts: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                              <span className="text-xs text-gray-700">Kick on Rate Exceeded</span>
                              <input type="checkbox" checked={serverDefaults.configuration.antiRaid.kickOnRateExceeded} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, antiRaid: {...serverDefaults.configuration.antiRaid, kickOnRateExceeded: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Reaction Roles */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.configuration.reactionRoles.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('reactionRoles') ? prev.filter(i => i !== 'reactionRoles') : [...prev, 'reactionRoles']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('reactionRoles') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Reaction Roles</p>
                            <p className="text-xs text-gray-500">Role assignment via reactions</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            configuration: {
                              ...serverDefaults.configuration,
                              reactionRoles: { ...serverDefaults.configuration.reactionRoles, enabled: !serverDefaults.configuration.reactionRoles.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.configuration.reactionRoles.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.configuration.reactionRoles.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.configuration.reactionRoles.enabled && expandedDefaults.includes('reactionRoles') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Role Limit</span>
                              <input type="number" min="1" max="25" value={serverDefaults.configuration.reactionRoles.roleLimit} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, reactionRoles: {...serverDefaults.configuration.reactionRoles, roleLimit: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Reaction Cooldown (s)</span>
                              <input type="number" min="0" max="300" value={serverDefaults.configuration.reactionRoles.reactionCooldown} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, reactionRoles: {...serverDefaults.configuration.reactionRoles, reactionCooldown: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Allow Role Stacking</span>
                              <input type="checkbox" checked={serverDefaults.configuration.reactionRoles.allowRoleStacking} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, reactionRoles: {...serverDefaults.configuration.reactionRoles, allowRoleStacking: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Auto Delete Reactions</span>
                              <input type="checkbox" checked={serverDefaults.configuration.reactionRoles.autoDeleteReactions} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, reactionRoles: {...serverDefaults.configuration.reactionRoles, autoDeleteReactions: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">DM on Role Change</span>
                              <input type="checkbox" checked={serverDefaults.configuration.reactionRoles.dmOnRoleChange} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, reactionRoles: {...serverDefaults.configuration.reactionRoles, dmOnRoleChange: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Role Persistence</span>
                              <input type="checkbox" checked={serverDefaults.configuration.reactionRoles.rolePersistence} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, reactionRoles: {...serverDefaults.configuration.reactionRoles, rolePersistence: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Verification */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.configuration.verification.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('verification') ? prev.filter(i => i !== 'verification') : [...prev, 'verification']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('verification') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Verification</p>
                            <p className="text-xs text-gray-500">Member verification system</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            configuration: {
                              ...serverDefaults.configuration,
                              verification: { ...serverDefaults.configuration.verification, enabled: !serverDefaults.configuration.verification.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.configuration.verification.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.configuration.verification.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.configuration.verification.enabled && expandedDefaults.includes('verification') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Method</span>
                              <select value={serverDefaults.configuration.verification.verificationMethod} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, verificationMethod: e.target.value}}})} className="px-2 py-1 text-xs border border-gray-300 rounded text-gray-900">
                                <option value="button">Button</option>
                                <option value="captcha">Captcha</option>
                                <option value="reaction">Reaction</option>
                              </select>
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Account Age Req (days)</span>
                              <input type="number" min="0" max="365" value={serverDefaults.configuration.verification.accountAgeRequirement} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, accountAgeRequirement: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Verification Cooldown (s)</span>
                              <input type="number" min="0" max="3600" value={serverDefaults.configuration.verification.verificationCooldown} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, verificationCooldown: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Kick Unverified After (min)</span>
                              <input type="number" min="0" max="1440" value={serverDefaults.configuration.verification.kickUnverifiedAfter} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, kickUnverifiedAfter: parseInt(e.target.value)}}})} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Require Server Agreement</span>
                              <input type="checkbox" checked={serverDefaults.configuration.verification.requireServerAgreement} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, requireServerAgreement: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Multiple Steps</span>
                              <input type="checkbox" checked={serverDefaults.configuration.verification.multipleSteps} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, multipleSteps: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Welcome DM</span>
                              <input type="checkbox" checked={serverDefaults.configuration.verification.welcomeDM} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, welcomeDM: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Remove Verification Messages</span>
                              <input type="checkbox" checked={serverDefaults.configuration.verification.removeVerificationMessages} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, removeVerificationMessages: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                              <span className="text-xs text-gray-700">Anti-Alt Protection</span>
                              <input type="checkbox" checked={serverDefaults.configuration.verification.antiAltProtection} onChange={(e) => setServerDefaults({...serverDefaults, configuration: {...serverDefaults.configuration, verification: {...serverDefaults.configuration.verification, antiAltProtection: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modules Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <span className="text-orange-600">📦</span> Modules
                  </h3>
                  <div className="space-y-3">
                    {/* Moderation */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.modules.moderation.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('moderation') ? prev.filter(i => i !== 'moderation') : [...prev, 'moderation']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('moderation') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Moderation</p>
                            <p className="text-xs text-gray-500">Ban, kick, timeout, warn, etc.</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            modules: {
                              ...serverDefaults.modules,
                              moderation: { ...serverDefaults.modules.moderation, enabled: !serverDefaults.modules.moderation.enabled }
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
                      {serverDefaults.modules.moderation.enabled && expandedDefaults.includes('moderation') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Ban</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.banEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, banEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Kick</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.kickEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, kickEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Warn</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.warnEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, warnEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Timeout</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.timeoutEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, timeoutEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Untimeout</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.untimeoutEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, untimeoutEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Softban</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.softbanEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, softbanEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Unban</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.unbanEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, unbanEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Clear</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.clearEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, clearEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Lock</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.lockEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, lockEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Unlock</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.unlockEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, unlockEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Slowmode</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.slowmodeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, slowmodeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Lockdown</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.lockdownEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, lockdownEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Unlockdown</span>
                              <input type="checkbox" checked={serverDefaults.modules.moderation.unlockdownEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, moderation: {...serverDefaults.modules.moderation, unlockdownEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Role Management */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.modules.roleManagement.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('roleManagement') ? prev.filter(i => i !== 'roleManagement') : [...prev, 'roleManagement']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('roleManagement') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Role Management</p>
                            <p className="text-xs text-gray-500">Create, delete, manage roles</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            modules: {
                              ...serverDefaults.modules,
                              roleManagement: { ...serverDefaults.modules.roleManagement, enabled: !serverDefaults.modules.roleManagement.enabled }
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
                      {serverDefaults.modules.roleManagement.enabled && expandedDefaults.includes('roleManagement') && (
                        <div className="px-6 pb-4 space-y-2 border-t border-gray-200 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Role Create</span>
                            <input
                              type="checkbox"
                              checked={serverDefaults.modules.roleManagement.roleCreateEnabled}
                              onChange={(e) => setServerDefaults({
                                ...serverDefaults,
                                modules: {
                                  ...serverDefaults.modules,
                                  roleManagement: { ...serverDefaults.modules.roleManagement, roleCreateEnabled: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-orange-600 rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Role Delete</span>
                            <input
                              type="checkbox"
                              checked={serverDefaults.modules.roleManagement.roleDeleteEnabled}
                              onChange={(e) => setServerDefaults({
                                ...serverDefaults,
                                modules: {
                                  ...serverDefaults.modules,
                                  roleManagement: { ...serverDefaults.modules.roleManagement, roleDeleteEnabled: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-orange-600 rounded"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Role Assign</span>
                            <input
                              type="checkbox"
                              checked={serverDefaults.modules.roleManagement.roleAssignEnabled}
                              onChange={(e) => setServerDefaults({
                                ...serverDefaults,
                                modules: {
                                  ...serverDefaults.modules,
                                  roleManagement: { ...serverDefaults.modules.roleManagement, roleAssignEnabled: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-orange-600 rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Member Management */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.modules.memberManagement.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('memberManagement') ? prev.filter(i => i !== 'memberManagement') : [...prev, 'memberManagement']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('memberManagement') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Member Management</p>
                            <p className="text-xs text-gray-500">User info, avatars, roles</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            modules: {
                              ...serverDefaults.modules,
                              memberManagement: { ...serverDefaults.modules.memberManagement, enabled: !serverDefaults.modules.memberManagement.enabled }
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
                      {serverDefaults.modules.memberManagement.enabled && expandedDefaults.includes('memberManagement') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">User Info</span>
                              <input type="checkbox" checked={serverDefaults.modules.memberManagement.userinfoEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, memberManagement: {...serverDefaults.modules.memberManagement, userinfoEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">User Avatar</span>
                              <input type="checkbox" checked={serverDefaults.modules.memberManagement.useravatarEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, memberManagement: {...serverDefaults.modules.memberManagement, useravatarEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">User Banner</span>
                              <input type="checkbox" checked={serverDefaults.modules.memberManagement.userbannerEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, memberManagement: {...serverDefaults.modules.memberManagement, userbannerEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Role Members</span>
                              <input type="checkbox" checked={serverDefaults.modules.memberManagement.rolemembers} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, memberManagement: {...serverDefaults.modules.memberManagement, rolemembers: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Prune Users</span>
                              <input type="checkbox" checked={serverDefaults.modules.memberManagement.pruneusersEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, memberManagement: {...serverDefaults.modules.memberManagement, pruneusersEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                          </div>
                        </div>
                      )}

                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.modules.announcements.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('announcements') ? prev.filter(i => i !== 'announcements') : [...prev, 'announcements']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('announcements') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Announcements</p>
                            <p className="text-xs text-gray-500">Server announcements and updates</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            modules: {
                              ...serverDefaults.modules,
                              announcements: { ...serverDefaults.modules.announcements, enabled: !serverDefaults.modules.announcements.enabled }
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
                      {serverDefaults.modules.announcements.enabled && expandedDefaults.includes('announcements') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Announce</span>
                              <input type="checkbox" checked={serverDefaults.modules.announcements.announceEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, announcements: {...serverDefaults.modules.announcements, announceEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Giveaway Create</span>
                              <input type="checkbox" checked={serverDefaults.modules.announcements.giveawayCreateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, announcements: {...serverDefaults.modules.announcements, giveawayCreateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Giveaway Draw</span>
                              <input type="checkbox" checked={serverDefaults.modules.announcements.giveawayDrawEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, announcements: {...serverDefaults.modules.announcements, giveawayDrawEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Poll</span>
                              <input type="checkbox" checked={serverDefaults.modules.announcements.pollEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, announcements: {...serverDefaults.modules.announcements, pollEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Welcome Messages */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.modules.welcomeMessages.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('welcomeMessages') ? prev.filter(i => i !== 'welcomeMessages') : [...prev, 'welcomeMessages']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('welcomeMessages') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Welcome Messages</p>
                            <p className="text-xs text-gray-500">Greet new members</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            modules: {
                              ...serverDefaults.modules,
                              welcomeMessages: { ...serverDefaults.modules.welcomeMessages, enabled: !serverDefaults.modules.welcomeMessages.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.modules.welcomeMessages.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.modules.welcomeMessages.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.modules.welcomeMessages.enabled && expandedDefaults.includes('welcomeMessages') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3 max-h-80 overflow-y-auto">
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Welcome Message</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Welcome Enabled</span>
                                <input type="checkbox" checked={serverDefaults.modules.welcomeMessages.welcomeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, welcomeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Welcome Title</span>
                                <input type="text" value={serverDefaults.modules.welcomeMessages.welcomeTitle} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, welcomeTitle: e.target.value}}})} className="w-40 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" placeholder="Welcome!" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Welcome Description</span>
                                <input type="text" value={serverDefaults.modules.welcomeMessages.welcomeDescription} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, welcomeDescription: e.target.value}}})} className="w-40 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" placeholder="Welcome to the server!" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Welcome Color</span>
                                <input type="color" value={serverDefaults.modules.welcomeMessages.welcomeColor} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, welcomeColor: e.target.value}}})} className="w-12 h-6 border border-gray-300 rounded" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase">Leave Message</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Leave Enabled</span>
                                <input type="checkbox" checked={serverDefaults.modules.welcomeMessages.leaveEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, leaveEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Leave Title</span>
                                <input type="text" value={serverDefaults.modules.welcomeMessages.leaveTitle} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, leaveTitle: e.target.value}}})} className="w-40 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" placeholder="Goodbye" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Leave Description</span>
                                <input type="text" value={serverDefaults.modules.welcomeMessages.leaveDescription} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, leaveDescription: e.target.value}}})} className="w-40 px-2 py-1 text-xs border border-gray-300 rounded text-gray-900" placeholder="User has left" />
                              </div>
                              <div className="flex items-center justify-between bg-white p-2 rounded col-span-2">
                                <span className="text-xs text-gray-700">Leave Color</span>
                                <input type="color" value={serverDefaults.modules.welcomeMessages.leaveColor} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, welcomeMessages: {...serverDefaults.modules.welcomeMessages, leaveColor: e.target.value}}})} className="w-12 h-6 border border-gray-300 rounded" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fun */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.modules.fun.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('fun') ? prev.filter(i => i !== 'fun') : [...prev, 'fun']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('fun') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Fun</p>
                            <p className="text-xs text-gray-500">Games and entertainment commands</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            modules: {
                              ...serverDefaults.modules,
                              fun: { ...serverDefaults.modules.fun, enabled: !serverDefaults.modules.fun.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.modules.fun.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.modules.fun.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.modules.fun.enabled && expandedDefaults.includes('fun') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">8ball</span>
                              <input type="checkbox" checked={serverDefaults.modules.fun.eightballEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, fun: {...serverDefaults.modules.fun, eightballEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Dice</span>
                              <input type="checkbox" checked={serverDefaults.modules.fun.diceEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, fun: {...serverDefaults.modules.fun, diceEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Coinflip</span>
                              <input type="checkbox" checked={serverDefaults.modules.fun.coinflipEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, fun: {...serverDefaults.modules.fun, coinflipEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">RPS</span>
                              <input type="checkbox" checked={serverDefaults.modules.fun.rpsEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, fun: {...serverDefaults.modules.fun, rpsEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Meme</span>
                              <input type="checkbox" checked={serverDefaults.modules.fun.memeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, fun: {...serverDefaults.modules.fun, memeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Joke</span>
                              <input type="checkbox" checked={serverDefaults.modules.fun.jokeEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, fun: {...serverDefaults.modules.fun, jokeEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Rate</span>
                              <input type="checkbox" checked={serverDefaults.modules.fun.rateEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, fun: {...serverDefaults.modules.fun, rateEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Utilities */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-3 flex-1">
                          {serverDefaults.modules.utilities.enabled && (
                            <button
                              onClick={() => setExpandedDefaults(prev => 
                                prev.includes('utilities') ? prev.filter(i => i !== 'utilities') : [...prev, 'utilities']
                              )}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedDefaults.includes('utilities') ? '▼' : '▶'}
                            </button>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">Utilities</p>
                            <p className="text-xs text-gray-500">Utility and helper commands</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setServerDefaults({
                            ...serverDefaults,
                            modules: {
                              ...serverDefaults.modules,
                              utilities: { ...serverDefaults.modules.utilities, enabled: !serverDefaults.modules.utilities.enabled }
                            }
                          })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            serverDefaults.modules.utilities.enabled ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              serverDefaults.modules.utilities.enabled ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {serverDefaults.modules.utilities.enabled && expandedDefaults.includes('utilities') && (
                        <div className="px-6 pb-4 space-y-3 border-t border-gray-200 pt-3">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Server Info</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.serverinfoEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, serverinfoEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Channel Info</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.channelinfoEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, channelinfoEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Role Info</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.roleinfoEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, roleinfoEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Emoji Info</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.emojiinfoEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, emojiinfoEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Ping</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.pingEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, pingEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Invite</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.inviteEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, inviteEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Help</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.helpEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, helpEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Support</span>
                              <input type="checkbox" checked={serverDefaults.modules.utilities.supportEnabled} onChange={(e) => setServerDefaults({...serverDefaults, modules: {...serverDefaults.modules, utilities: {...serverDefaults.modules.utilities, supportEnabled: e.target.checked}}})} className="w-4 h-4 text-orange-600 rounded" />
                            </div>
                            <div className="flex items-center justify-between bg-white p-2 rounded">
                              <span className="text-xs text-gray-700">Dashboard</span>
                              <input 
                                type="checkbox" 
                                checked={serverDefaults.modules.utilities.dashboardEnabled} 
                                onChange={(e) => setServerDefaults({
                                  ...serverDefaults, 
                                  modules: {
                                    ...serverDefaults.modules, 
                                    utilities: {
                                      ...serverDefaults.modules.utilities, 
                                      dashboardEnabled: e.target.checked
                                    }
                                  }
                                })} 
                                className="w-4 h-4 text-orange-600 rounded" 
                              />
                            </div>
                          </div>
                        </div>
                      )}
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
              </div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Site Settings
                </h2>
                <p className="text-gray-600 text-sm">Configure site-wide features and availability.</p>
              </div>

              <div className="space-y-4">
                {/* Premium Purchase Toggle */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">Premium Purchasing</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Enable or disable the ability for users to purchase premium subscriptions. 
                        When disabled, users cannot access the premium purchase page.
                      </p>
                    </div>
                    <button
                      onClick={handlePremiumPurchaseToggle}
                      disabled={settingsStatus === 'loading'}
                      className={`ml-6 relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-sm disabled:opacity-50 ${
                        premiumPurchaseEnabled ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          premiumPurchaseEnabled ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm text-orange-900 font-medium">
                      Status: {premiumPurchaseEnabled ? (
                        <span className="text-green-700">✓ Premium purchases are enabled</span>
                      ) : (
                        <span className="text-gray-700">✕ Premium purchases are disabled</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Premium Management Page Toggle */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Gem className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">Premium Management Page</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Enable or disable the premium management dashboard. 
                        When disabled, users will see a "Coming Soon" banner instead of the management interface.
                      </p>
                    </div>
                    <button
                      onClick={handlePremiumManagementToggle}
                      disabled={settingsStatus === 'loading'}
                      className={`ml-6 relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-sm disabled:opacity-50 ${
                        premiumManagementEnabled ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          premiumManagementEnabled ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm text-orange-900 font-medium">
                      Status: {premiumManagementEnabled ? (
                        <span className="text-green-700">✓ Management page is accessible</span>
                      ) : (
                        <span className="text-gray-700">✕ Showing "Coming Soon" banner</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Bot Invite Toggle */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link2 className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">Bot Invite Link</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Control whether new servers can invite and add the bot. 
                        When disabled, the bot invite link will show an error message.
                      </p>
                    </div>
                    <button
                      onClick={handleBotInviteToggle}
                      disabled={settingsStatus === 'loading'}
                      className={`ml-6 relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-sm disabled:opacity-50 ${
                        botInviteEnabled ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          botInviteEnabled ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm text-orange-900 font-medium">
                      Status: {botInviteEnabled ? (
                        <span className="text-green-700">✓ New servers can add the bot</span>
                      ) : (
                        <span className="text-gray-700">✕ Bot invites are disabled</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* System Announcements Toggle */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Megaphone className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">System Announcements</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Display site-wide announcements and banners to all users. 
                        Useful for informing users about updates, features, or planned maintenance.
                      </p>
                    </div>
                    <button
                      onClick={handleSystemAnnouncementsToggle}
                      disabled={settingsStatus === 'loading'}
                      className={`ml-6 relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-sm disabled:opacity-50 ${
                        systemAnnouncementsEnabled ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          systemAnnouncementsEnabled ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm text-orange-900 font-medium">
                      Status: {systemAnnouncementsEnabled ? (
                        <span className="text-green-700">✓ Announcements are visible</span>
                      ) : (
                        <span className="text-gray-700">✕ Announcements are hidden</span>
                      )}
                    </p>
                  </div>

                  {/* Announcement Configuration (Only shown when enabled) */}
                  {systemAnnouncementsEnabled && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Configure Announcement</h4>
                      
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={announcementConfig.title}
                          onChange={(e) => setAnnouncementConfig({ ...announcementConfig, title: e.target.value })}
                          placeholder="Important Update"
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={announcementConfig.description}
                          onChange={(e) => setAnnouncementConfig({ ...announcementConfig, description: e.target.value })}
                          placeholder="We've added new features to improve your experience..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                        />
                      </div>

                      {/* Background Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Background Color
                        </label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={announcementConfig.backgroundColor}
                            onChange={(e) => setAnnouncementConfig({ ...announcementConfig, backgroundColor: e.target.value })}
                            className="h-10 w-20 rounded-lg border border-gray-300 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={announcementConfig.backgroundColor}
                            onChange={(e) => setAnnouncementConfig({ ...announcementConfig, backgroundColor: e.target.value })}
                            placeholder="#f97316"
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Button Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Button Text (Optional)
                          </label>
                          <input
                            type="text"
                            value={announcementConfig.buttonText}
                            onChange={(e) => setAnnouncementConfig({ ...announcementConfig, buttonText: e.target.value })}
                            placeholder="Learn More"
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                          />
                        </div>

                        {/* Button URL */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Button URL (Optional)
                          </label>
                          <input
                            type="url"
                            value={announcementConfig.buttonUrl}
                            onChange={(e) => setAnnouncementConfig({ ...announcementConfig, buttonUrl: e.target.value })}
                            placeholder="https://example.com"
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      {/* Dismissable Toggle */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Dismissable</p>
                          <p className="text-xs text-gray-500 mt-1">Allow users to close the announcement</p>
                        </div>
                        <button
                          onClick={() => setAnnouncementConfig({ ...announcementConfig, dismissable: !announcementConfig.dismissable })}
                          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                            announcementConfig.dismissable ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                              announcementConfig.dismissable ? 'translate-x-9' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Visibility Options */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-900 text-sm">Visibility Settings</h5>
                        
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Visible on Home Page</p>
                            <p className="text-xs text-gray-500 mt-1">Show announcement on the landing page</p>
                          </div>
                          <button
                            onClick={() => setAnnouncementConfig({ ...announcementConfig, visibleOnHomePage: !announcementConfig.visibleOnHomePage })}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                              announcementConfig.visibleOnHomePage ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                                announcementConfig.visibleOnHomePage ? 'translate-x-9' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Visible After Login</p>
                            <p className="text-xs text-gray-500 mt-1">Show announcement on authenticated pages (dashboard, servers, etc.)</p>
                          </div>
                          <button
                            onClick={() => setAnnouncementConfig({ ...announcementConfig, visibleAfterLogin: !announcementConfig.visibleAfterLogin })}
                            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all ${
                              announcementConfig.visibleAfterLogin ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
                                announcementConfig.visibleAfterLogin ? 'translate-x-9' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={handleSaveAnnouncementConfig}
                        disabled={settingsStatus === 'loading'}
                        className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {settingsStatus === 'loading' ? 'Saving...' : 'Save Announcement Configuration'}
                      </button>

                      {/* Preview */}
                      {announcementConfig.title && (
                        <div className="mt-6">
                          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                          <div 
                            className="rounded-lg p-4 text-white shadow-md"
                            style={{ backgroundColor: announcementConfig.backgroundColor }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h5 className="font-bold text-lg mb-1">{announcementConfig.title}</h5>
                                {announcementConfig.description && (
                                  <p className="text-sm opacity-95">{announcementConfig.description}</p>
                                )}
                              </div>
                              {announcementConfig.buttonText && (
                                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold text-sm transition-all whitespace-nowrap">
                                  {announcementConfig.buttonText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Analytics Collection Toggle */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">Analytics Collection</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Enable or disable collection of usage analytics and statistics. 
                        Analytics help improve the platform but can be disabled for privacy.
                      </p>
                    </div>
                    <button
                      onClick={handleAnalyticsToggle}
                      disabled={settingsStatus === 'loading'}
                      className={`ml-6 relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-sm disabled:opacity-50 ${
                        analyticsEnabled ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          analyticsEnabled ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm text-orange-900 font-medium">
                      Status: {analyticsEnabled ? (
                        <span className="text-green-700">✓ Analytics are being collected</span>
                      ) : (
                        <span className="text-gray-700">✕ Analytics collection is disabled</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Beta Features Toggle */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Beaker className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">Beta Features</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Enable experimental and beta features for all users. 
                        These features may be unstable or subject to change.
                      </p>
                    </div>
                    <button
                      onClick={handleBetaFeaturesToggle}
                      disabled={settingsStatus === 'loading'}
                      className={`ml-6 relative inline-flex h-10 w-20 items-center rounded-full transition-all shadow-sm disabled:opacity-50 ${
                        betaFeaturesEnabled ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform ${
                          betaFeaturesEnabled ? 'translate-x-11' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                    <p className="text-sm text-orange-900 font-medium">
                      Status: {betaFeaturesEnabled ? (
                        <span className="text-green-700">✓ Beta features are enabled</span>
                      ) : (
                        <span className="text-gray-700">✕ Beta features are disabled</span>
                      )}
                    </p>
                  </div>
                </div>

                {settingsMessage && (
                  <div className={`p-4 rounded-lg border ${
                    settingsStatus === 'success'
                      ? 'bg-green-50 border-green-200 text-green-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    <div className="flex items-center gap-2">
                      {settingsStatus === 'success' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                      <span className="font-medium">{settingsMessage}</span>
                    </div>
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
