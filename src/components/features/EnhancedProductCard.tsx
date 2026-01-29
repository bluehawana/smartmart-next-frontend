'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StockIndicator } from '@/components/ui/StockIndicator';
import { Tooltip } from '@/components/ui/Tooltip';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { getProductImageUrl } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  images: string[];
  stock: number;
  status: string;
  featured: boolean;
  category: string;
  rating?: number;
  reviewCount?: number;
}

interface EnhancedProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (productId: string) => Promise<void>;
  onQuickView?: (product: Product) => void;
  onWishlist?: (productId: string) => void;
}

export function EnhancedProductCard({
  product,
  index = 0,
  onAddToCart,
  onQuickView,
  onWishlist,
}: EnhancedProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onAddToCart || product.stock === 0) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(product.id);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onWishlist?.(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <div
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
    >
      <Link href={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-square bg-primary-50 rounded-xl overflow-hidden mb-4">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="accent" size="sm">Featured</Badge>
            )}
            {discount > 0 && (
              <Badge variant="primary" size="sm">-{discount}%</Badge>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <Badge variant="warning" size="sm" pulse>Low Stock</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Tooltip content={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} position="left">
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all hover:scale-110 shadow-soft-sm"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  isWishlisted ? 'fill-error text-error' : 'text-primary-600'
                }`}
              />
            </button>
          </Tooltip>

          {/* Product Image */}
          <div
            className="relative w-full h-full"
            onMouseEnter={() => {
              if (product.images.length > 1) setImageIndex(1);
            }}
            onMouseLeave={() => setImageIndex(0)}
          >
            <ProgressiveImage
              src={getProductImageUrl(product.images[imageIndex]) || '/placeholder-product.svg'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-primary-950/90 via-primary-950/60 to-transparent pt-16">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="flex-1 py-2.5 bg-white text-primary-950 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors disabled:bg-primary-200 disabled:text-primary-400 flex items-center justify-center gap-2"
              >
                {isAddingToCart ? (
                  <div className="w-4 h-4 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
                ) : product.stock === 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>
              
              {onQuickView && (
                <Tooltip content="Quick view" position="top">
                  <button
                    onClick={handleQuickView}
                    className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm text-primary-950 rounded-lg hover:bg-white transition-colors"
                    aria-label="Quick view"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="space-y-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-primary-400 uppercase tracking-wide">
              {product.category}
            </p>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-accent text-accent" />
                <span className="text-xs font-medium text-primary-600">
                  {product.rating}
                </span>
                {product.reviewCount && (
                  <span className="text-xs text-primary-400">
                    ({product.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-primary-950 group-hover:text-accent-dark transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-primary-500 line-clamp-2 min-h-[2rem]">
            {product.description}
          </p>

          {/* Price */}
          <PriceDisplay
            price={product.price}
            comparePrice={product.compare_price}
            size="md"
            showVAT
          />

          {/* Stock Indicator - Compact */}
          <StockIndicator stock={product.stock} variant="compact" />
        </div>
      </Link>
    </div>
  );
}
