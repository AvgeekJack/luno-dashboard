'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check, Settings, Shield, Bell, Smile, Wrench, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (config: SetupConfig) => void;
  serverName: string;
  initialPrefix?: string;
}

interface SetupConfig {
  prefix: string;
  modules: {
    moderation: boolean;
    fun: boolean;
    utilities: boolean;
    roleManagement: boolean;
    memberManagement: boolean;
    announcements: boolean;
    notifications: boolean;
  };
  features: {
    logging: boolean;
    antiraid: boolean;
    automod: boolean;
  };
}

export default function SetupWizard({ isOpen, onClose, onComplete, serverName, initialPrefix = '!' }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<SetupConfig>({
    prefix: initialPrefix,
    modules: {
      moderation: true,
      fun: true,
      utilities: true,
      roleManagement: false,
      memberManagement: false,
      announcements: false,
      notifications: false,
    },
    features: {
      logging: false,
      antiraid: false,
      automod: false,
    },
  });

  const steps = [
    {
      title: 'Basic Configuration',
      description: 'Set your command prefix',
      icon: Settings,
      color: 'blue',
    },
    {
      title: 'Enable Modules',
      description: 'Choose which command modules to activate',
      icon: Wrench,
      color: 'purple',
    },
    {
      title: 'Security Features',
      description: 'Configure protection and logging',
      icon: Shield,
      color: 'green',
    },
    {
      title: 'Complete Setup',
      description: 'Review and confirm your settings',
      icon: CheckCircle2,
      color: 'orange',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(config);
  };

  const toggleModule = (module: keyof typeof config.modules) => {
    setConfig({
      ...config,
      modules: {
        ...config.modules,
        [module]: !config.modules[module],
      },
    });
  };

  const toggleFeature = (feature: keyof typeof config.features) => {
    setConfig({
      ...config,
      features: {
        ...config.features,
        [feature]: !config.features[feature],
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Setup Wizard</h2>
              <p className="text-orange-100 text-sm">{serverName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-center mb-3 max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-20 h-1 mx-2 rounded-full transition-all ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{steps[currentStep].title}</p>
            <p className="text-xs text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Basic Configuration */}
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Set Your Command Prefix</h3>
                  <p className="text-gray-600">This is what users will type before commands</p>
                </div>

                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Command Prefix
                  </label>
                  <input
                    type="text"
                    value={config.prefix}
                    onChange={(e) => setConfig({ ...config, prefix: e.target.value })}
                    maxLength={3}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-900 text-lg font-mono"
                    placeholder="!"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Example: If you set <span className="font-mono font-semibold">{config.prefix}</span>, users will type <span className="font-mono font-semibold">{config.prefix}help</span>
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-700">
                    <strong className="text-blue-700">Tip:</strong> Common prefixes are ! ? . or /
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 1: Enable Modules */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Modules</h3>
                  <p className="text-gray-600">Enable the features you want to use</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ModuleToggle
                    title="Moderation"
                    description="Kick, ban, timeout, warn users"
                    icon={Shield}
                    enabled={config.modules.moderation}
                    onToggle={() => toggleModule('moderation')}
                    recommended
                  />
                  <ModuleToggle
                    title="Fun Commands"
                    description="Games, jokes, entertainment"
                    icon={Smile}
                    enabled={config.modules.fun}
                    onToggle={() => toggleModule('fun')}
                    recommended
                  />
                  <ModuleToggle
                    title="Utilities"
                    description="Server info, user lookup tools"
                    icon={Wrench}
                    enabled={config.modules.utilities}
                    onToggle={() => toggleModule('utilities')}
                    recommended
                  />
                  <ModuleToggle
                    title="Role Management"
                    description="Create and manage roles"
                    icon={Settings}
                    enabled={config.modules.roleManagement}
                    onToggle={() => toggleModule('roleManagement')}
                  />
                  <ModuleToggle
                    title="Member Management"
                    description="View and manage members"
                    icon={Settings}
                    enabled={config.modules.memberManagement}
                    onToggle={() => toggleModule('memberManagement')}
                  />
                  <ModuleToggle
                    title="Announcements"
                    description="Server announcements"
                    icon={Bell}
                    enabled={config.modules.announcements}
                    onToggle={() => toggleModule('announcements')}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Security Features */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Security & Protection</h3>
                  <p className="text-gray-600">Keep your server safe</p>
                </div>

                <div className="space-y-3 max-w-2xl mx-auto">
                  <FeatureToggle
                    title="Event Logging"
                    description="Track moderation actions, message edits/deletes, member joins/leaves"
                    enabled={config.features.logging}
                    onToggle={() => toggleFeature('logging')}
                  />
                  <FeatureToggle
                    title="Anti-Raid Protection"
                    description="Automatically detect and prevent raid attacks"
                    enabled={config.features.antiraid}
                    onToggle={() => toggleFeature('antiraid')}
                  />
                  <FeatureToggle
                    title="Auto-Moderation"
                    description="Automatically filter spam, links, and bad words"
                    enabled={config.features.automod}
                    onToggle={() => toggleFeature('automod')}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 max-w-2xl mx-auto">
                  <p className="text-sm text-gray-700">
                    <strong className="text-yellow-700">Note:</strong> You can configure detailed settings for these features after setup is complete.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                    className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">You're All Set!</h3>
                  <p className="text-gray-600">Review your configuration below</p>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Configuration Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Command Prefix:</span>
                        <span className="font-mono font-semibold text-gray-900">{config.prefix}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Enabled Modules:</span>
                        <span className="font-semibold text-gray-900">
                          {Object.values(config.modules).filter(Boolean).length} of {Object.keys(config.modules).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Security Features:</span>
                        <span className="font-semibold text-gray-900">
                          {Object.values(config.features).filter(Boolean).length} enabled
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-xs text-blue-600 font-semibold mb-1">MODULES</p>
                      <div className="space-y-1">
                        {Object.entries(config.modules).filter(([_, enabled]) => enabled).map(([key]) => (
                          <div key={key} className="flex items-center gap-1.5 text-sm">
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-xs text-green-600 font-semibold mb-1">SECURITY</p>
                      <div className="space-y-1">
                        {Object.entries(config.features).map(([key, enabled]) => (
                          <div key={key} className="flex items-center gap-1.5 text-sm">
                            {enabled ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-gray-400" />
                            )}
                            <span className={enabled ? 'text-gray-700' : 'text-gray-400'}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700">
                      ✨ You can customize all these settings later from your dashboard
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer - Navigation buttons */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Check className="w-4 h-4" />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper components
interface ModuleToggleProps {
  title: string;
  description: string;
  icon: any;
  enabled: boolean;
  onToggle: () => void;
  recommended?: boolean;
}

function ModuleToggle({ title, description, icon: Icon, enabled, onToggle, recommended }: ModuleToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
        enabled
          ? 'bg-orange-50 border-orange-500 shadow-sm'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {recommended && (
        <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-semibold rounded">
          Recommended
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          enabled ? 'bg-orange-500' : 'bg-gray-200'
        }`}>
          <Icon className={`w-5 h-5 ${enabled ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1 pt-1">
          <h4 className={`font-semibold mb-1 ${enabled ? 'text-gray-900' : 'text-gray-700'}`}>
            {title}
          </h4>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-2 ${
          enabled ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'
        }`}>
          {enabled && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
      </div>
    </button>
  );
}

interface FeatureToggleProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function FeatureToggle({ title, description, enabled, onToggle }: FeatureToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        enabled
          ? 'bg-green-50 border-green-500'
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className={`font-semibold mb-1 ${enabled ? 'text-gray-900' : 'text-gray-700'}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ml-4 flex-shrink-0 ${
          enabled ? 'bg-green-500' : 'bg-gray-300'
        }`}>
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
              enabled ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </div>
      </div>
    </button>
  );
}
