'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag, Eye } from 'lucide-react';
import { PriceDisplay } from './PriceDisplay';
import { StockIndicator } from './StockIndicator';
import { Button } from './Button';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  images: string[];
  stock: number;
  category: string;
}

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string) => void;
}

export function QuickView({ product, isOpen, onClose, onAddToCart }: QuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-soft-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-soft-md"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-primary-50 rounded-xl overflow-hidden">
              <img
                src={product.images[selectedImage] || '/placeholder-product.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-primary-950 ring-2 ring-primary-200'
                        : 'border-primary-100 hover:border-primary-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="flex-1">
              <p className="text-xs text-primary-500 uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h2 className="font-display text-2xl text-primary-950 mb-4">
                {product.name}
              </h2>
              
              <PriceDisplay
                price={product.price}
                comparePrice={product.compare_price}
                size="lg"
                showVAT
                className="mb-4"
              />

              <StockIndicator stock={product.stock} className="mb-6" />

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-primary-600 leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-primary-100">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<ShoppingBag className="w-5 h-5" />}
                onClick={() => onAddToCart?.(product.id)}
                disabled={product.stock === 0}
                className="flex-1"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Eye className="w-5 h-5" />}
                onClick={() => {
                  window.location.href = `/products/${product.id}`;
                }}
              >
                View Full Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
