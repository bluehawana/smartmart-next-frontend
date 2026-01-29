'use client';

import { Package, AlertCircle, CheckCircle } from 'lucide-react';

interface StockIndicatorProps {
  stock: number;
  lowStockThreshold?: number;
  showIcon?: boolean;
  variant?: 'default' | 'compact';
  className?: string;
}

export function StockIndicator({
  stock,
  lowStockThreshold = 5,
  showIcon = true,
  variant = 'default',
  className = '',
}: StockIndicatorProps) {
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= lowStockThreshold;
  const isInStock = stock > lowStockThreshold;

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        {isOutOfStock && (
          <>
            <div className="w-2 h-2 rounded-full bg-error" />
            <span className="text-xs font-medium text-error">Out of Stock</span>
          </>
        )}
        {isLowStock && (
          <>
            <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <span className="text-xs font-medium text-warning-dark">Only {stock} left</span>
          </>
        )}
        {isInStock && (
          <>
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-medium text-success">In Stock</span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {isOutOfStock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-error/5 border border-error/20 rounded-lg">
          {showIcon && <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />}
          <div>
            <p className="text-sm font-semibold text-error">Out of Stock</p>
            <p className="text-xs text-error/70">Notify me when available</p>
          </div>
        </div>
      )}
      
      {isLowStock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-warning/5 border border-warning/20 rounded-lg">
          {showIcon && <Package className="w-4 h-4 text-warning-dark flex-shrink-0 animate-pulse" />}
          <div>
            <p className="text-sm font-semibold text-warning-dark">Low Stock</p>
            <p className="text-xs text-warning-dark/70">Only {stock} left - Order soon!</p>
          </div>
        </div>
      )}
      
      {isInStock && (
        <div className="flex items-center gap-2 px-3 py-2 bg-success/5 border border-success/20 rounded-lg">
          {showIcon && <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />}
          <div>
            <p className="text-sm font-semibold text-success">In Stock</p>
            <p className="text-xs text-success/70">Ready to ship</p>
          </div>
        </div>
      )}
    </div>
  );
}
