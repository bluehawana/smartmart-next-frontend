'use client';

import { TrendingDown } from 'lucide-react';

interface PriceDisplayProps {
  price: number;
  comparePrice?: number;
  currency?: string;
  locale?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showVAT?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  comparePrice,
  currency = 'kr',
  locale = 'sv-SE',
  size = 'md',
  showVAT = false,
  className = '',
}: PriceDisplayProps) {
  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const compareSizeStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`font-display font-semibold text-primary-950 ${sizeStyles[size]}`}>
          {price.toLocaleString(locale)} {currency}
        </span>
        
        {comparePrice && comparePrice > price && (
          <>
            <span className={`text-primary-400 line-through ${compareSizeStyles[size]}`}>
              {comparePrice.toLocaleString(locale)} {currency}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-error/10 text-error text-xs font-semibold rounded">
              <TrendingDown className="w-3 h-3" />
              -{discount}%
            </span>
          </>
        )}
      </div>
      
      {showVAT && (
        <p className="text-xs text-primary-500">inkl. 25% moms</p>
      )}
    </div>
  );
}
