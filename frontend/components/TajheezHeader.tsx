'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { BRAND_COLORS } from '@/lib/theme/brand';

interface TajheezHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  useLogo?: boolean;
}

const TajheezHeader: React.FC<TajheezHeaderProps> = ({
  title = 'TAJHEEZ',
  subtitle,
  showBackButton = true,
  onBack,
  rightSlot,
  useLogo = false,
}) => {
  const handleBack = () => {
    if (!showBackButton) return;
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <header
      className="flex items-center justify-between p-4 shadow-lg sticky top-0 z-20"
      style={{ backgroundColor: BRAND_COLORS.NAVY, color: 'white' }}
    >
      <button
        type="button"
        onClick={handleBack}
        className={`text-white transition ${showBackButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-label="Go back"
      >
        <ChevronLeft size={24} />
      </button>
      <div className="flex flex-col items-center text-center flex-1 px-4">
        {useLogo ? (
          <Image src="/Tajheez.gif" alt="TAJHEEZ Logo" width={120} height={40} className="h-10 w-auto" priority />
        ) : (
          <>
            {subtitle && <span className="text-xs uppercase tracking-wide opacity-80">{subtitle}</span>}
            <h1 className="text-lg font-semibold">{title}</h1>
          </>
        )}
      </div>
      <div className="flex items-center justify-end w-8">
        {rightSlot || <span className="inline-block w-5" />}
      </div>
    </header>
  );
};

export default TajheezHeader;
