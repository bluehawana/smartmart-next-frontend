'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { StockIndicator } from '@/components/ui/StockIndicator';
import { TrustBadges } from '@/components/ui/TrustBadges';
import { NewsletterSignup } from '@/components/ui/NewsletterSignup';
import { AnnouncementBanner } from '@/components/ui/AnnouncementBanner';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { EnhancedProductCard } from '@/components/features/EnhancedProductCard';
import { QuickView } from '@/components/ui/QuickView';
import { ShoppingBag, Heart, Star, Info } from 'lucide-react';

const mockProduct = {
  id: "1",
  name: "MacBook Pro 16-inch M3 Pro",
  description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals.",
  price: 24990,
  compare_price: 27990,
  images: [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
  ],
  stock: 15,
  status: "active",
  featured: true,
  category: "Computers",
  rating: 4.8,
  reviewCount: 124,
};

export default function ShowcasePage() {
  const [quickViewProduct, setQuickViewProduct] = useState<typeof mockProduct | null>(null);
  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 24);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-primary-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl mb-2">Component Showcase</h1>
          <p className="text-white/70">Preview all new UI/UX components</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Announcement Banner */}
        <Section title="Announcement Banner" description="Promotional messages at the top of the page">
          <div className="space-y-4">
            <AnnouncementBanner
              message="🎉 New Year Sale! Get 20% off on all electronics"
              link="/products"
              linkText="Shop Now"
              variant="accent"
              dismissible={false}
            />
            <AnnouncementBanner
              message="✨ Free shipping on orders over 500 kr"
              variant="default"
              dismissible={false}
            />
            <AnnouncementBanner
              message="⚡ Flash Sale: Limited time offer!"
              variant="success"
              dismissible={false}
            />
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons" description="Multiple variants and states">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="accent">Accent Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="primary" isLoading>Loading...</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary" leftIcon={<ShoppingBag className="w-4 h-4" />}>
              Add to Cart
            </Button>
            <Button variant="accent" rightIcon={<Heart className="w-4 h-4" />}>
              Wishlist
            </Button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </Section>

        {/* Badges */}
        <Section title="Badges" description="Status indicators and labels">
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">Featured</Badge>
            <Badge variant="accent">New</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Low Stock</Badge>
            <Badge variant="error">Out of Stock</Badge>
            <Badge variant="outline">Sale</Badge>
            <Badge variant="primary" pulse>Live</Badge>
            <Badge variant="accent" size="md">-20%</Badge>
          </div>
        </Section>

        {/* Tooltips */}
        <Section title="Tooltips" description="Helpful hints on hover">
          <div className="flex flex-wrap gap-8">
            <Tooltip content="This is a tooltip" position="top">
              <Button variant="secondary">Hover me (top)</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" position="bottom">
              <Button variant="secondary">Hover me (bottom)</Button>
            </Tooltip>
            <Tooltip content="Left tooltip" position="left">
              <Button variant="secondary">Hover me (left)</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" position="right">
              <Button variant="secondary">Hover me (right)</Button>
            </Tooltip>
          </div>
        </Section>

        {/* Price Display */}
        <Section title="Price Display" description="Product pricing with discounts">
          <div className="space-y-6">
            <PriceDisplay price={24990} size="sm" />
            <PriceDisplay price={24990} comparePrice={27990} size="md" showVAT />
            <PriceDisplay price={24990} comparePrice={27990} size="lg" showVAT />
            <PriceDisplay price={24990} comparePrice={27990} size="xl" showVAT />
          </div>
        </Section>

        {/* Stock Indicators */}
        <Section title="Stock Indicators" description="Inventory status display">
          <div className="space-y-4 max-w-md">
            <StockIndicator stock={50} />
            <StockIndicator stock={3} />
            <StockIndicator stock={0} />
          </div>
          <div className="flex gap-4 mt-6">
            <StockIndicator stock={50} variant="compact" />
            <StockIndicator stock={3} variant="compact" />
            <StockIndicator stock={0} variant="compact" />
          </div>
        </Section>

        {/* Countdown Timer */}
        <Section title="Countdown Timer" description="Create urgency for limited offers">
          <div className="bg-primary-50 p-6 rounded-xl inline-block">
            <p className="text-sm text-primary-600 mb-2">Flash Sale Ends In:</p>
            <CountdownTimer endDate={futureDate} />
          </div>
        </Section>

        {/* Trust Badges */}
        <Section title="Trust Badges" description="Build customer confidence">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-primary-600 mb-4">Horizontal Layout</h4>
              <TrustBadges variant="horizontal" limit={3} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary-600 mb-4">Grid Layout</h4>
              <TrustBadges variant="grid" limit={6} />
            </div>
          </div>
        </Section>

        {/* Newsletter Signup */}
        <Section title="Newsletter Signup" description="Email collection forms">
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-semibold text-primary-600 mb-4">Inline Variant</h4>
              <NewsletterSignup variant="inline" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary-600 mb-4">Card Variant</h4>
              <div className="max-w-lg">
                <NewsletterSignup variant="card" />
              </div>
            </div>
          </div>
        </Section>

        {/* Enhanced Product Card */}
        <Section title="Enhanced Product Card" description="Feature-rich product display">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EnhancedProductCard
              product={mockProduct}
              onAddToCart={async (id) => {
                console.log('Add to cart:', id);
              }}
              onQuickView={setQuickViewProduct}
              onWishlist={(id) => {
                console.log('Add to wishlist:', id);
              }}
            />
            <EnhancedProductCard
              product={{ ...mockProduct, id: "2", stock: 3, featured: false }}
              onAddToCart={async (id) => {
                console.log('Add to cart:', id);
              }}
              onQuickView={setQuickViewProduct}
            />
            <EnhancedProductCard
              product={{ ...mockProduct, id: "3", stock: 0, compare_price: undefined }}
              onAddToCart={async (id) => {
                console.log('Add to cart:', id);
              }}
              onQuickView={setQuickViewProduct}
            />
          </div>
        </Section>

        {/* Quick View Demo */}
        <Section title="Quick View Modal" description="Fast product preview">
          <Button
            variant="primary"
            onClick={() => setQuickViewProduct(mockProduct)}
          >
            Open Quick View Demo
          </Button>
        </Section>

        {/* Color Palette */}
        <Section title="Color Palette" description="Design system colors">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Primary" color="bg-primary-950" />
            <ColorSwatch name="Accent" color="bg-accent" />
            <ColorSwatch name="Success" color="bg-success" />
            <ColorSwatch name="Warning" color="bg-warning" />
            <ColorSwatch name="Error" color="bg-error" />
            <ColorSwatch name="Gray 100" color="bg-primary-100" />
            <ColorSwatch name="Gray 500" color="bg-primary-500" />
            <ColorSwatch name="Accent Light" color="bg-accent-light" />
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography" description="Font hierarchy">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-primary-500 mb-1">Display 2XL</p>
              <h1 className="font-display text-display-2xl">The quick brown fox</h1>
            </div>
            <div>
              <p className="text-xs text-primary-500 mb-1">Display XL</p>
              <h2 className="font-display text-display-xl">The quick brown fox</h2>
            </div>
            <div>
              <p className="text-xs text-primary-500 mb-1">Display LG</p>
              <h3 className="font-display text-display-lg">The quick brown fox</h3>
            </div>
            <div>
              <p className="text-xs text-primary-500 mb-1">Display MD</p>
              <h4 className="font-display text-display-md">The quick brown fox</h4>
            </div>
            <div>
              <p className="text-xs text-primary-500 mb-1">Body Text</p>
              <p className="text-base">The quick brown fox jumps over the lazy dog. This is regular body text.</p>
            </div>
          </div>
        </Section>

      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={async (id) => {
          console.log('Add to cart from quick view:', id);
        }}
      />
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-primary-100 pb-12">
      <div className="mb-6">
        <h2 className="font-display text-2xl text-primary-950 mb-1">{title}</h2>
        <p className="text-primary-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ColorSwatch({ name, color }: { name: string; color: string }) {
  return (
    <div className="space-y-2">
      <div className={`${color} h-20 rounded-lg shadow-soft-md`} />
      <p className="text-sm font-medium text-primary-950">{name}</p>
    </div>
  );
}
