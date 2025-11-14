import Link from 'next/link';
import { HomeIcon, ListBulletIcon, CheckCircleIcon, ChartPieIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

const navLinks = [
  { href: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { href: '/transactions', icon: ListBulletIcon, label: 'Transactions' },
  { href: '/approvals', icon: CheckCircleIcon, label: 'Approvals' },
  { href: '/reports', icon: ChartPieIcon, label: 'Reports' },
  { href: '/profile', icon: UserCircleIcon, label: 'Profile' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-tajheez-dark-navy text-white p-4 hidden md:block">
      <h2 className="text-2xl font-bold mb-6">TAJHEEZ</h2> {/* Placeholder for Logo */}
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.href} className="mb-2">
              <Link href={link.href} className="flex items-center space-x-2 hover:text-tajheez-orange">
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
