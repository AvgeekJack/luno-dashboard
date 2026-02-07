'use client';

import { useState } from 'react';
import { X, Check, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SetupCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  serverName: string;
}

export default function SetupCompleteModal({ isOpen, onClose, onStartTour, serverName }: SetupCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Success Header */}
        <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 px-8 py-10 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              Setup Complete!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-green-100 text-lg"
            >
              {serverName} is ready to go
            </motion.p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-6"
          >
            <p className="text-gray-700 mb-4">
              Your bot is now configured and ready to use! Would you like a quick tour of the dashboard?
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Dashboard Tour</p>
                  <p className="text-xs text-gray-600">
                    We'll show you where to find commands, modules, settings, and more. Takes about 1 minute.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={onStartTour}
              className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
            >
              <span className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                Take a Tour
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
            >
              Skip Tour
            </button>
          </motion.div>

          <p className="text-xs text-gray-500 text-center mt-4">
            You can always access settings and help from the sidebar
          </p>
        </div>
      </motion.div>
    </div>
  );
}
