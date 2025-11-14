'use client';

import Layout from '@/components/Layout';
import Button from '@/components/Button';
import { UserIcon, BriefcaseIcon, EnvelopeIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';


export default function ProfilePage() {
  const user = {
    name: 'John Doe',
    role: 'Administrator',
    email: 'john.doe@example.com',
  };

  const handleLogout = () => {
    console.log('User logged out.');
    // In a real app, this would clear authentication tokens and redirect to login
  };

  return (
    <Layout>        <h1 className="text-3xl font-bold text-tajheez-dark-navy mb-8">Profile & Settings</h1>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <div className="mb-4">
            <p className="text-gray-600 text-sm flex items-center space-x-1"><UserIcon className="h-4 w-4" /><span>Name:</span></p>
            <p className="text-gray-800 text-lg font-semibold">{user.name}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-600 text-sm flex items-center space-x-1"><BriefcaseIcon className="h-4 w-4" /><span>Role:</span></p>
            <p className="text-gray-800 text-lg font-semibold">{user.role}</p>
          </div>
          <div className="mb-6">
            <p className="text-gray-600 text-sm flex items-center space-x-1"><EnvelopeIcon className="h-4 w-4" /><span>Email:</span></p>
            <p className="text-gray-800 text-lg font-semibold">{user.email}</p>
          </div>

          <Button
            onClick={handleLogout}
            variant="danger"
            Icon={ArrowRightOnRectangleIcon}
            className="w-full"
          >
            Logout
          </Button>
        </div>
    </Layout>
  );
}
