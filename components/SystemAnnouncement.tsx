'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { X } from 'lucide-react';

interface AnnouncementConfig {
  title: string;
  description: string;
  backgroundColor: string;
  buttonText: string;
  buttonUrl: string;
  dismissable: boolean;
  visibleOnHomePage: boolean;
  visibleAfterLogin: boolean;
}

export default function SystemAnnouncement() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<AnnouncementConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch('/api/site-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.systemAnnouncementsEnabled && data.announcementConfig?.title) {
            setConfig(data.announcementConfig);
          }
        }
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
      }
    };

    fetchAnnouncement();
  }, []);

  useEffect(() => {
    if (!config) {
      setVisible(false);
      return;
    }

    const isHomePage = pathname === '/';
    const isAuthenticated = status === 'authenticated';

    // Check visibility rules
    if (isHomePage && !config.visibleOnHomePage) {
      setVisible(false);
      return;
    }

    if (!isHomePage && isAuthenticated && !config.visibleAfterLogin) {
      setVisible(false);
      return;
    }

    if (!isHomePage && !isAuthenticated && !config.visibleOnHomePage) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [config, pathname, status]);

  const handleDismiss = () => {
    if (config?.dismissable) {
      setDismissed(true);
    }
  };

  if (!visible || !config || dismissed) return null;

  return (
    <div
      className="w-full text-white shadow-lg relative z-50"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1">{config.title}</h3>
            {config.description && (
              <p className="text-sm opacity-95 leading-relaxed">{config.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {config.buttonText && config.buttonUrl && (
              <a
                href={config.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold text-sm transition-all whitespace-nowrap"
              >
                {config.buttonText}
              </a>
            )}
            {config.dismissable && (
              <button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
