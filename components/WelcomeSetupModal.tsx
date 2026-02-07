'use client';

import { useState } from 'react';
import { X, Sparkles, Settings, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSetup: () => void;
  serverName: string;
}

export default function WelcomeSetupModal({ isOpen, onClose, onStartSetup, serverName }: WelcomeSetupModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 px-8 py-10 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold mb-2"
              >
                Welcome to {serverName}'s Dashboard!
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-orange-100 text-lg"
              >
                Let's get your bot configured in just a few steps
              </motion.p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <div className="space-y-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Quick Setup Wizard</h3>
                  <p className="text-sm text-gray-600">Configure essential features like moderation, logging, and modules in a guided process</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Defaults Included</h3>
                  <p className="text-sm text-gray-600">We've pre-configured recommended settings based on best practices</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100"
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Customize Anytime</h3>
                  <p className="text-sm text-gray-600">You can always modify these settings later from the dashboard</p>
                </div>
              </motion.div>
            </div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={onStartSetup}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/30"
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Take Me to Setup
                </span>
              </button>
              
              <button
                onClick={handleClose}
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
              >
                I'll Do This Later
              </button>
            </motion.div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Setup takes about 2-3 minutes • You can skip steps you don't need
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
