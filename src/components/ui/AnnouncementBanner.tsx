'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface AnnouncementBannerProps {
  message: string;
  link?: string;
  linkText?: string;
  variant?: 'default' | 'accent' | 'success';
  dismissible?: boolean;
  storageKey?: string;
}

export function AnnouncementBanner({
  message,
  link,
  linkText = 'Learn more',
  variant = 'default',
  dismissible = true,
  storageKey = 'announcement-dismissed',
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (dismissible && typeof window !== 'undefined') {
      const dismissed = localStorage.getItem(storageKey);
      setIsVisible(!dismissed);
    } else {
      setIsVisible(true);
    }
  }, [dismissible, storageKey]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (dismissible && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true');
    }
  };

  if (!isVisible) return null;

  const variants = {
    default: 'bg-primary-950 text-white',
    accent: 'bg-gradient-to-r from-accent to-accent-light text-primary-950',
    success: 'bg-success text-white',
  };

  const icons = {
    default: Sparkles,
    accent: TrendingUp,
    success: Zap,
  };

  const Icon = icons[variant];

  return (
    <div className={`relative ${variants[variant]} animate-slide-in-down`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Icon className="w-4 h-4 flex-shrink-0 animate-pulse" />
          <p className="font-medium text-center">
            {message}
            {link && (
              <>
                {' '}
                <a
                  href={link}
                  className="underline hover:no-underline font-semibold"
                >
                  {linkText} →
                </a>
              </>
            )}
          </p>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="ml-auto flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
