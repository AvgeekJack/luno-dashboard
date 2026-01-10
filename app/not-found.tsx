'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-orange-500"></div>
        </div>

        {/* Error message */}
        <div className="text-center space-y-4 max-w-md mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-slate-400 text-lg mb-8">
            Oops! The page you're looking for seems to have wandered off into the void.
          </p>

          {/* Animated 404 illustration */}
          <div className="mb-8 relative">
            <div className="text-8xl font-bold text-orange-500/20 select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-orange-500 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center max-w-md px-4">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-slate-300 text-lg mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}
