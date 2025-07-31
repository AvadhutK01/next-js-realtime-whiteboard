'use client';

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={() => signIn('google')}
        className="px-4 py-2 text-white bg-blue-600 rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}
