'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { getProductImageUrl } from '@/lib/utils';
import { API_BASE } from '@/lib/config';
import { useSession } from '@/lib/auth-client';
import { ArrowRight, Truck, Shield, Headphones, RefreshCw, Star, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import toast from 'react-hot-toast';

const BASE_URL = API_BASE

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  status: string;
  featured: boolean;
  category: string;
  compare_price?: number;
}

// Premium Product Card Component
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const discount = product.compare_price && product.compare_price > product.price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await addToCart(product.id, 1, {
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        description: product.description,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={`group relative animate-fade-in-up stagger-${(index % 8) + 1}`}
    >
      <div className="relative aspect-square bg-primary-50 rounded-xl overflow-hidden mb-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.featured && (
            <span className="badge badge-accent">Featured</span>
          )}
          {discount > 0 && (
            <span className="badge badge-primary">-{discount}%</span>
          )}
        </div>

        {/* Image */}
        <img
          src={product.images && product.images.length > 0
            ? getProductImageUrl(product.images[0])
            : '/placeholder-product.svg'
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.svg';
          }}
        />

        {/* Quick Add Button */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock <= 0}
            className="w-full py-3 bg-primary-950 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors disabled:bg-primary-300 flex items-center justify-center gap-2"
          >
            {isAddingToCart ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : product.stock <= 0 ? (
              'Out of Stock'
            ) : (
              'Quick Add'
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div>
        <p className="text-xs text-primary-500 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="text-sm font-medium text-primary-950 group-hover:text-accent-dark transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-primary-950">
            {product.price.toLocaleString('sv-SE')} kr
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-sm text-primary-400 line-through">
              {product.compare_price.toLocaleString('sv-SE')} kr
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Category Card Component
function CategoryCard({ name, image, href, index }: { name: string; image: string; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group relative aspect-[4/5] rounded-2xl overflow-hidden animate-fade-in-up stagger-${index + 1}`}
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder-product.svg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 via-primary-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-xl text-white mb-2">{name}</h3>
        <span className="inline-flex items-center gap-1 text-sm text-white/80 group-hover:text-accent transition-colors">
          Shop Now <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}

// Loading Skeleton
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-primary-100 rounded-xl mb-4" />
      <div className="h-3 bg-primary-100 rounded w-1/4 mb-2" />
      <div className="h-4 bg-primary-100 rounded w-3/4 mb-2" />
      <div className="h-4 bg-primary-100 rounded w-1/3" />
    </div>
  );
}

async function getProducts() {
  try {
    const url = `${BASE_URL}/products`
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      next: { revalidate: 300 }
    })

    if (!res.ok) return getMockProducts()

    const response = await res.json()
    if (response.success && response.data && response.data.data) {
      return response.data.data
    }
    return getMockProducts()
  } catch (error) {
    return getMockProducts()
  }
}

function getMockProducts(): Product[] {
  return [
    {
      id: "1",
      name: "MacBook Pro 16-inch",
      price: 24990,
      compare_price: 27990,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg"],
      description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD.",
      stock: 15,
      status: "active",
      featured: true,
      category: "Computers"
    },
    {
      id: "2",
      name: "AirPods Pro 2nd Generation",
      price: 2490,
      compare_price: 2790,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/airpods2.jpg"],
      description: "Apple AirPods Pro with Active Noise Cancellation.",
      stock: 50,
      status: "active",
      featured: true,
      category: "Audio"
    },
    {
      id: "3",
      name: "Sony WH-1000XM5 Headphones",
      price: 3990,
      compare_price: 4490,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg"],
      description: "Industry-leading noise canceling headphones.",
      stock: 25,
      status: "active",
      featured: true,
      category: "Audio"
    },
    {
      id: "4",
      name: "Dell XPS 13 Laptop",
      price: 12990,
      compare_price: 14990,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/xps.jpg"],
      description: "Ultra-portable Dell XPS 13 with Intel Core i7.",
      stock: 20,
      status: "active",
      featured: false,
      category: "Computers"
    },
    {
      id: "5",
      name: "Dell Alienware 34 Curved Monitor",
      price: 8990,
      compare_price: 10990,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg"],
      description: "34-inch curved gaming monitor with 144Hz.",
      stock: 10,
      status: "active",
      featured: true,
      category: "Monitors"
    },
    {
      id: "6",
      name: "Apple Watch Ultra",
      price: 7990,
      compare_price: 8490,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg"],
      description: "The most rugged and capable Apple Watch.",
      stock: 30,
      status: "active",
      featured: true,
      category: "Wearables"
    },
    {
      id: "7",
      name: "AI Translate Earphones Pro",
      price: 1990,
      compare_price: 2490,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ai-translate-pro.jpg"],
      description: "Real-time translation in 40+ languages.",
      stock: 25,
      status: "active",
      featured: true,
      category: "Audio"
    },
    {
      id: "8",
      name: "Smart Language Translator Buds",
      price: 1490,
      compare_price: 1990,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/smart-translator.jpg"],
      description: "Wireless earbuds with built-in AI translator.",
      stock: 40,
      status: "active",
      featured: true,
      category: "Audio"
    }
  ]
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    async function fetchData() {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (e) {
        console.error('Data fetch failed:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const shouldShowLoginOverlay = !isPending && !session;
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const allProducts = products.slice(0, 8);

  const categories = [
    { name: 'Computers', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=800&fit=crop', href: '/products?category=computers' },
    { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop', href: '/products?category=audio' },
    { name: 'Wearables', image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=800&fit=crop', href: '/products?category=wearables' },
    { name: 'Smartphones', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=800&fit=crop', href: '/products?category=smartphones' },
  ];

  const features = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders over 500 kr' },
    { icon: Shield, title: 'Secure Payment', description: '256-bit SSL encryption' },
    { icon: RefreshCw, title: 'Easy Returns', description: '30-day return policy' },
    { icon: Headphones, title: '24/7 Support', description: 'Dedicated help center' },
  ];

  return (
    <div className="relative">
      {/* Authentication Overlay */}
      {shouldShowLoginOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-soft-2xl max-w-md w-full mx-4 animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-950" />
              </div>
              <h2 className="font-display text-2xl text-primary-950 mb-2">
                Welcome to SmrtMart
              </h2>
              <p className="text-primary-500">
                Sign in to access our premium collection of electronics.
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-primary-950 text-white py-3.5 px-6 rounded-lg font-medium hover:bg-primary-800 transition-colors"
            >
              Sign In to Continue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={shouldShowLoginOverlay ? "filter blur-md pointer-events-none select-none" : ""}>

        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center bg-mesh overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Text Content */}
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent-dark text-sm font-medium rounded-full mb-6">
                  <Star className="w-4 h-4 fill-current" />
                  New Collection 2025
                </span>
                <h1 className="font-display text-display-lg sm:text-display-xl lg:text-display-2xl text-primary-950 mb-6">
                  Premium Tech
                  <br />
                  <span className="text-gradient-gold">Curated for You</span>
                </h1>
                <p className="text-lg sm:text-xl text-primary-500 mb-8 max-w-lg leading-relaxed">
                  Discover the latest in technology and premium electronics, carefully selected for the modern lifestyle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 bg-primary-950 text-white px-8 py-4 text-sm font-medium rounded-lg hover:bg-primary-800 transition-all hover:shadow-soft-lg group"
                  >
                    Shop Collection
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 bg-white text-primary-950 px-8 py-4 text-sm font-medium rounded-lg border border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 mt-10 pt-10 border-t border-primary-200">
                  <div className="text-center">
                    <p className="font-display text-2xl font-semibold text-primary-950">10K+</p>
                    <p className="text-xs text-primary-500">Happy Customers</p>
                  </div>
                  <div className="w-px h-10 bg-primary-200" />
                  <div className="text-center">
                    <p className="font-display text-2xl font-semibold text-primary-950">500+</p>
                    <p className="text-xs text-primary-500">Products</p>
                  </div>
                  <div className="w-px h-10 bg-primary-200" />
                  <div className="text-center">
                    <p className="font-display text-2xl font-semibold text-primary-950">4.9</p>
                    <p className="text-xs text-primary-500">Store Rating</p>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative animate-fade-in-up stagger-2">
                <div className="relative aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl rotate-6" />
                  <div className="relative bg-white rounded-3xl shadow-soft-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop"
                      alt="Featured Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Floating Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-soft-lg animate-bounce-gentle">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-accent-dark" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-950">Free Delivery</p>
                        <p className="text-xs text-primary-500">On orders 500 kr+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-primary-950 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{feature.title}</p>
                      <p className="text-xs text-white/60">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-sm font-medium text-accent-dark uppercase tracking-wide">Featured</span>
                <h2 className="font-display text-display-sm sm:text-display-md text-primary-950 mt-2">
                  Editor's Picks
                </h2>
              </div>
              <Link
                href="/products?featured=true"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors group"
              >
                View All Featured
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {loading ? (
                [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </div>

            <Link
              href="/products?featured=true"
              className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors"
            >
              View All Featured
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-20 lg:py-28 bg-primary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-accent-dark uppercase tracking-wide">Browse</span>
              <h2 className="font-display text-display-sm sm:text-display-md text-primary-950 mt-2">
                Shop by Category
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.name}
                  name={category.name}
                  image={category.image}
                  href={category.href}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* All Products */}
        <section className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-sm font-medium text-accent-dark uppercase tracking-wide">Latest</span>
                <h2 className="font-display text-display-sm sm:text-display-md text-primary-950 mt-2">
                  All Products
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-950 transition-colors group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {loading ? (
                [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
              ) : (
                allProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 bg-primary-950 text-white px-8 py-4 text-sm font-medium rounded-lg hover:bg-primary-800 transition-all hover:shadow-soft-lg group"
              >
                Browse All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-primary-950 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-display-sm sm:text-display-md text-white mb-6">
              Ready to Upgrade Your Tech?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust SmrtMart for their premium electronics needs.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-accent text-primary-950 px-8 py-4 text-sm font-semibold rounded-lg hover:bg-accent-light transition-colors group"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
