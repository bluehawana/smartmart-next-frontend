'use client';

import { Shield, Truck, RefreshCw, Award, Lock, Headphones } from 'lucide-react';

interface TrustBadge {
  icon: React.ElementType;
  title: string;
  description: string;
}

const badges: TrustBadge[] = [
  {
    icon: Shield,
    title: 'Secure Payment',
    description: '256-bit SSL encryption',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over 500 kr',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return policy',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: 'Authentic products only',
  },
  {
    icon: Lock,
    title: 'Privacy Protected',
    description: 'Your data is safe',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Always here to help',
  },
];

interface TrustBadgesProps {
  variant?: 'horizontal' | 'grid';
  limit?: number;
  className?: string;
}

export function TrustBadges({ variant = 'horizontal', limit, className = '' }: TrustBadgesProps) {
  const displayBadges = limit ? badges.slice(0, limit) : badges;

  if (variant === 'grid') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {displayBadges.map((badge, index) => (
          <TrustBadgeCard key={index} badge={badge} />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-6 ${className}`}>
      {displayBadges.map((badge, index) => (
        <TrustBadgeInline key={index} badge={badge} />
      ))}
    </div>
  );
}

function TrustBadgeCard({ badge }: { badge: TrustBadge }) {
  const Icon = badge.icon;
  
  return (
    <div className="flex flex-col items-center text-center p-4 bg-white border border-primary-100 rounded-xl hover:border-primary-200 hover:shadow-soft-md transition-all">
      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-accent-dark" />
      </div>
      <h3 className="text-sm font-semibold text-primary-950 mb-1">{badge.title}</h3>
      <p className="text-xs text-primary-500">{badge.description}</p>
    </div>
  );
}

function TrustBadgeInline({ badge }: { badge: TrustBadge }) {
  const Icon = badge.icon;
  
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-accent-dark" />
      </div>
      <div>
        <p className="text-sm font-medium text-primary-950">{badge.title}</p>
        <p className="text-xs text-primary-500">{badge.description}</p>
      </div>
    </div>
  );
}
