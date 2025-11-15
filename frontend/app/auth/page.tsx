'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately route users away from auth; authentication is disabled for this build.
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-tajheez-dark-navy">Authentication Disabled</h1>
        <p className="text-gray-600">
          Access control is temporarily turned off for this release. You will be redirected to the dashboard.
        </p>
        <Button onClick={() => router.push('/dashboard')} className="w-full">
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
