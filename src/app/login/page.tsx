'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Github } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn('github', { callbackUrl: '/' });
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Welcome to Realtime Whiteboard
        </h1>
        <p className="text-gray-500 mb-6">
          Sign in to start creating and collaborating.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`flex items-center justify-center gap-3 w-full py-3 rounded-lg text-white font-medium transition cursor-pointer ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-black hover:bg-gray-900'
            }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          ) : (
            <Github className="w-5 h-5" />
          )}
          {loading ? 'Signing in...' : 'Sign in with GitHub'}
        </button>

        <p className="mt-6 text-xs text-gray-400">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-gray-600">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-gray-600">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}
