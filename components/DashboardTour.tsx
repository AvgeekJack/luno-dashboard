'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

interface DashboardTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  page: 'dashboard' | 'commands' | 'modules' | 'settings';
  navigateTo?: string;
}

const tourSteps: TourStep[] = [
  {
    target: 'sidebar',
    title: '👋 Welcome to Your Dashboard!',
    description: 'This sidebar is your navigation hub. Use it to explore Commands, Modules, and Settings. Let\'s take you on a quick tour!',
    position: 'right',
    page: 'dashboard',
  },
  {
    target: 'server-stats',
    title: '📊 Server Statistics',
    description: 'Here you can see your server\'s member count, online users, and other key metrics at a glance.',
    position: 'bottom',
    page: 'dashboard',
  },
  {
    target: 'quick-actions',
    title: '⚡ Quick Actions & Premium',
    description: 'Access premium features and important quick actions from this card.',
    position: 'bottom',
    page: 'dashboard',
  },
  {
    target: 'bot-status',
    title: '🤖 Bot Status Monitor',
    description: 'Keep track of your bot\'s configuration status. Green indicators mean features are active!',
    position: 'bottom',
    page: 'dashboard',
  },
  {
    target: 'commands-link',
    title: '⚙️ Configuration Section',
    description: 'Click here to access configuration options like Auto-Mod, Logging, and Anti-Raid. Let\'s check it out!',
    position: 'right',
    page: 'dashboard',
    navigateTo: 'configuration/automod',
  },
  {
    target: 'page-content',
    title: '🛡️ Configuration Pages',
    description: 'Here you can configure Auto-Moderation, Logging, and Anti-Raid protection. Each has detailed settings to customize how your bot protects your server.',
    position: 'bottom',
    page: 'commands',
  },
  {
    target: 'modules-link',
    title: '🧩 Modules Section',
    description: 'Now let\'s explore Modules! This is where you enable/disable entire command categories.',
    position: 'right',
    page: 'commands',
    navigateTo: 'modules/moderation',
  },
  {
    target: 'page-content',
    title: '🛠️ Module Management',
    description: 'Each module (Moderation, Fun, Utilities, etc.) can be toggled on/off. You can also configure individual commands within each module.',
    position: 'bottom',
    page: 'modules',
  },
  {
    target: 'settings-link',
    title: '⚙️ Settings Section',
    description: 'Finally, let\'s look at Settings where you can configure the basics.',
    position: 'right',
    page: 'modules',
    navigateTo: 'general',
  },
  {
    target: 'page-content',
    title: '📝 General Settings',
    description: 'Here you can change your bot\'s command prefix, nickname, timezone, and other general configuration options.',
    position: 'bottom',
    page: 'settings',
  },
  {
    target: 'sidebar',
    title: '✅ Tour Complete!',
    description: 'You\'re all set! Feel free to explore on your own. You can always access the documentation or support if you need help.',
    position: 'right',
    page: 'settings',
  },
];

export default function DashboardTour({ isOpen, onClose }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const router = useRouter();
  const params = useParams();
  const guildId = params?.guildId as string;

  useEffect(() => {
    if (!isOpen) return;

    const step = tourSteps[currentStep];
    
    // Navigate to the correct page if specified
    if (step.navigateTo && guildId) {
      router.push(`/servers/${guildId}/${step.navigateTo}`);
    }

    const updatePosition = () => {
      let element: HTMLElement | null = null;

      // Find the target element based on the step
      if (step.target === 'sidebar') {
        element = document.querySelector('aside') as HTMLElement;
      } else if (step.target === 'page-content') {
        element = document.querySelector('main[data-tour="page-content"]') as HTMLElement;
        if (!element) element = document.querySelector('main') as HTMLElement;
      } else if (step.target === 'server-stats') {
        element = document.querySelector('[data-tour="server-stats"]') as HTMLElement;
      } else if (step.target === 'quick-actions') {
        element = document.querySelector('[data-tour="quick-actions"]') as HTMLElement;
      } else if (step.target === 'bot-status') {
        element = document.querySelector('[data-tour="bot-status"]') as HTMLElement;
      } else if (step.target === 'commands-link') {
        // Find Configuration nav item
        element = document.querySelector('[href*="/configuration"]') as HTMLElement;
        if (!element) element = document.querySelector('[href*="/commands"]') as HTMLElement;
      } else if (step.target === 'modules-link') {
        element = document.querySelector('[href*="/modules"]') as HTMLElement;
      } else if (step.target === 'settings-link') {
        element = document.querySelector('[href*="/general"]') as HTMLElement;
        if (!element) element = document.querySelector('[href*="/settings"]') as HTMLElement;
      }

      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });

        // Scroll element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Delay to allow page navigation to complete
    const timer = setTimeout(updatePosition, step.navigateTo ? 800 : 200);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isOpen, guildId, router]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Backdrop overlay - lighter background */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        {/* Light overlay with cutout */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Highlight cutout with bright border */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none"
            style={{
              top: highlightPosition.top - 8,
              left: highlightPosition.left - 8,
              width: highlightPosition.width + 16,
              height: highlightPosition.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3), 0 0 32px rgba(59, 130, 246, 0.8), inset 0 0 0 4px rgba(59, 130, 246, 0.6)',
              borderRadius: '12px',
              border: '3px solid rgb(59, 130, 246)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        </AnimatePresence>
      </div>

      {/* Tour card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed z-[70] bg-white rounded-xl shadow-2xl max-w-md w-full border-2 border-blue-500"
          style={{
            top: calculateCardPosition(step.position, highlightPosition).top,
            left: calculateCardPosition(step.position, highlightPosition).left,
            right: calculateCardPosition(step.position, highlightPosition).right,
            bottom: calculateCardPosition(step.position, highlightPosition).bottom,
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">Dashboard Tour</span>
            </div>
            <button
              onClick={handleSkip}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{step.description}</p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 mb-4">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-blue-500'
                      : index < currentStep
                      ? 'w-1.5 bg-green-500'
                      : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <span className="text-sm text-gray-600">
                {currentStep + 1} of {tourSteps.length}
              </span>

              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all flex items-center gap-1"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>Finish Tour</>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleSkip}
              className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip Tour
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function calculateCardPosition(
  position: 'top' | 'bottom' | 'left' | 'right',
  highlight: { top: number; left: number; width: number; height: number }
) {
  const margin = 24;
  const cardWidth = 448; // max-w-md

  switch (position) {
    case 'right':
      return {
        top: highlight.top + highlight.height / 2 - 150,
        left: highlight.left + highlight.width + margin,
        right: 'auto',
        bottom: 'auto',
      };
    case 'left':
      return {
        top: highlight.top + highlight.height / 2 - 150,
        left: 'auto',
        right: window.innerWidth - highlight.left + margin,
        bottom: 'auto',
      };
    case 'bottom':
      return {
        top: highlight.top + highlight.height + margin,
        left: Math.max(16, Math.min(highlight.left, window.innerWidth - cardWidth - 16)),
        right: 'auto',
        bottom: 'auto',
      };
    case 'top':
      return {
        top: 'auto',
        left: Math.max(16, Math.min(highlight.left, window.innerWidth - cardWidth - 16)),
        right: 'auto',
        bottom: window.innerHeight - highlight.top + margin,
      };
  }
}
