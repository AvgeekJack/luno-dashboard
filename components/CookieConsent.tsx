'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleDecline}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">🍪</div>
            <h2 className="text-2xl font-bold text-gray-900">Cookie & Privacy Notice</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
            By continuing to use this site, you agree to our use of cookies.
          </p>
          <p className="text-gray-600 leading-relaxed">
            For more information about how we handle your data, please review our{' '}
            <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold underline">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-semibold underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAccept}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            Accept All Cookies
          </button>
          <button
            onClick={handleDecline}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Decline
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          You can change your cookie preferences at any time in your browser settings.
        </p>
      </div>
    </div>
  );
}
