'use client';

import { useState } from 'react';
import { X, Check, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  compare_price?: number;
  image: string;
  category: string;
  stock: number;
  specs: {
    [key: string]: string | number | boolean;
  };
}

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
  className?: string;
}

export function ProductComparison({
  products,
  onRemove,
  onAddToCart,
  className = '',
}: ProductComparisonProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(products.slice(0, 3));

  if (selectedProducts.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-primary-500">No products to compare</p>
      </div>
    );
  }

  // Get all unique spec keys
  const allSpecs = Array.from(
    new Set(selectedProducts.flatMap(p => Object.keys(p.specs)))
  );

  const renderSpecValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-success mx-auto" />
      ) : (
        <Minus className="w-5 h-5 text-primary-300 mx-auto" />
      );
    }
    return <span className="text-sm text-primary-950">{value}</span>;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="min-w-[800px]">
        {/* Product Cards */}
        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)` }}>
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="relative bg-white border border-primary-100 rounded-xl p-4 hover:border-primary-200 transition-colors"
            >
              {/* Remove Button */}
              <button
                onClick={() => onRemove(product.id)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white border border-primary-200 rounded-full hover:bg-error hover:text-white hover:border-error transition-colors z-10"
                aria-label="Remove from comparison"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Product Image */}
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square bg-primary-50 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-primary-400 uppercase tracking-wide mb-1">
                    {product.category}
                  </p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium text-primary-950 hover:text-accent-dark transition-colors line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                  </Link>
                </div>

                <PriceDisplay
                  price={product.price}
                  comparePrice={product.compare_price}
                  size="md"
                />

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  {product.stock > 0 ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <span className="text-xs text-success">In Stock</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-error" />
                      <span className="text-xs text-error">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ShoppingBag className="w-4 h-4" />}
                  onClick={() => onAddToCart?.(product.id)}
                  disabled={product.stock === 0}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Specifications Table */}
        <div className="bg-white border border-primary-100 rounded-xl overflow-hidden">
          <div className="bg-primary-50 px-4 py-3 border-b border-primary-100">
            <h3 className="font-semibold text-primary-950">Specifications</h3>
          </div>
          
          <div className="divide-y divide-primary-100">
            {allSpecs.map((specKey) => (
              <div
                key={specKey}
                className="grid hover:bg-primary-50 transition-colors"
                style={{ gridTemplateColumns: `200px repeat(${selectedProducts.length}, 1fr)` }}
              >
                {/* Spec Name */}
                <div className="px-4 py-3 font-medium text-sm text-primary-600 bg-primary-50/50">
                  {specKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                
                {/* Spec Values */}
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="px-4 py-3 text-center flex items-center justify-center"
                  >
                    {product.specs[specKey] !== undefined ? (
                      renderSpecValue(product.specs[specKey])
                    ) : (
                      <span className="text-sm text-primary-300">—</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Comparison Bar Component (sticky at bottom)
export function ComparisonBar({
  productCount,
  onViewComparison,
  onClear,
}: {
  productCount: number;
  onViewComparison: () => void;
  onClear: () => void;
}) {
  if (productCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary-950 text-white shadow-soft-2xl animate-slide-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-semibold">
              {productCount}
            </div>
            <div>
              <p className="font-medium">
                {productCount} {productCount === 1 ? 'product' : 'products'} selected
              </p>
              <p className="text-sm text-white/70">Compare features and prices</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear All
            </Button>
            <Button variant="accent" size="md" onClick={onViewComparison}>
              Compare Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
