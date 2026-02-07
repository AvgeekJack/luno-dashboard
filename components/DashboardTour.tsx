'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardTourProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    target: 'sidebar',
    title: 'Navigation Sidebar',
    description: 'Use this sidebar to navigate between Dashboard, Commands, Modules, and Settings. You can also return to your server list from here.',
    position: 'right',
  },
  {
    target: 'server-stats',
    title: 'Server Statistics',
    description: 'View your server\'s member count, channels, roles, and online status at a glance.',
    position: 'bottom',
  },
  {
    target: 'quick-actions',
    title: 'Quick Actions',
    description: 'Quickly access premium features, bot invite link, and important settings from here.',
    position: 'bottom',
  },
  {
    target: 'bot-status',
    title: 'Bot Status',
    description: 'Monitor your bot\'s online status and current configuration. Green means your bot is online and ready.',
    position: 'bottom',
  },
  {
    target: 'commands-link',
    title: 'Commands Page',
    description: 'Click here to manage individual commands - enable/disable them, set permissions, and configure channels.',
    position: 'right',
  },
  {
    target: 'modules-link',
    title: 'Modules Page',
    description: 'Enable or disable entire command modules like Moderation, Fun, Utilities, and more.',
    position: 'right',
  },
  {
    target: 'settings-link',
    title: 'Settings Page',
    description: 'Configure advanced features like logging, anti-raid protection, auto-moderation, and your command prefix.',
    position: 'right',
  },
];

export default function DashboardTour({ isOpen, onClose }: DashboardTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const step = tourSteps[currentStep];
      let element: HTMLElement | null = null;

      // Find the target element based on the step
      if (step.target === 'sidebar') {
        element = document.querySelector('aside') as HTMLElement;
      } else if (step.target === 'server-stats') {
        element = document.querySelector('[data-tour="server-stats"]') as HTMLElement;
      } else if (step.target === 'quick-actions') {
        element = document.querySelector('[data-tour="quick-actions"]') as HTMLElement;
      } else if (step.target === 'bot-status') {
        element = document.querySelector('[data-tour="bot-status"]') as HTMLElement;
      } else if (step.target === 'commands-link') {
        element = document.querySelector('[href*="/commands"]') as HTMLElement;
      } else if (step.target === 'modules-link') {
        element = document.querySelector('[href*="/modules"]') as HTMLElement;
      } else if (step.target === 'settings-link') {
        element = document.querySelector('[href*="/settings"]') as HTMLElement;
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

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [currentStep, isOpen]);

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
      {/* Backdrop overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none">
        {/* Dark overlay with cutout */}
        <div className="absolute inset-0 bg-black/70" />
        
        {/* Highlight cutout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{
              top: highlightPosition.top - 8,
              left: highlightPosition.left - 8,
              width: highlightPosition.width + 16,
              height: highlightPosition.height + 16,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 24px rgba(59, 130, 246, 0.5)',
              borderRadius: '12px',
              border: '3px solid rgb(59, 130, 246)',
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
