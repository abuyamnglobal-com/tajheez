'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import { login } from '@/lib/api/auth';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';


export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login({ email, password });
      console.log('Login successful:', response);
      // Store token/user info in context or local storage
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-tajheez-dark-navy">Login to TAJHEEZ</h1>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-tajheez-red text-tajheez-red px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="mb-4">
            <InputField
              label="Email"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={EnvelopeIcon}
              required
            />
          </div>
          <div className="mb-6">
            <InputField
              label="Password"
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              Icon={LockClosedIcon}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
