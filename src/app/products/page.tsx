'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { API_BASE } from '@/lib/config';
import { getProductImageUrl } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutGrid, ShoppingBag } from 'lucide-react';

const BASE_URL = API_BASE;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price: number;
  images: string[];
  stock: number;
  status: string;
  featured: boolean;
  category: string;
  tags: string[];
}

// Premium Product Card
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
        description: product.description,
        image: product.images?.[0] || '',
        comparePrice: product.compare_price,
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div
      className={`group animate-fade-in-up`}
      style={{ animationDelay: `${(index % 12) * 50}ms` }}
    >
      <Link href={`/products/${product.id}`}>
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

          {/* Stock Badge */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="badge bg-warning/10 text-warning-dark border border-warning/20">
                Low Stock
              </span>
            </div>
          )}

          {/* Image */}
          <img
            src={getProductImageUrl(product.images?.[0]) || '/placeholder-product.svg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.svg';
            }}
          />

          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-primary-950/80 to-transparent pt-12">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock <= 0}
              className="w-full py-3 bg-white text-primary-950 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors disabled:bg-primary-200 disabled:text-primary-400 flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-primary-950 border-t-transparent rounded-full animate-spin" />
              ) : product.stock <= 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Quick Add
                </>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <Link href={`/products/${product.id}`}>
        <p className="text-xs text-primary-400 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="text-sm font-medium text-primary-950 group-hover:text-accent-dark transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-xs text-primary-500 line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-primary-950">
            {product.price.toLocaleString('sv-SE')} kr
          </span>
          {product.compare_price > product.price && (
            <span className="text-sm text-primary-400 line-through">
              {product.compare_price.toLocaleString('sv-SE')} kr
            </span>
          )}
        </div>
        <p className="text-xs text-primary-400 mt-1">inkl. 25% moms</p>
      </Link>
    </div>
  );
}

// Product Skeleton
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-primary-100 rounded-xl mb-4" />
      <div className="h-3 bg-primary-100 rounded w-1/4 mb-2" />
      <div className="h-4 bg-primary-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-primary-100 rounded w-full mb-2" />
      <div className="h-4 bg-primary-100 rounded w-1/3" />
    </div>
  );
}

// Category Filter Pills
const categories = [
  { value: '', label: 'All' },
  { value: 'computers', label: 'Computers' },
  { value: 'smartphones', label: 'Smartphones' },
  { value: 'audio', label: 'Audio' },
  { value: 'wearables', label: 'Wearables' },
  { value: 'monitors', label: 'Monitors' },
  { value: 'networking', label: 'Networking' },
  { value: 'accessories', label: 'Accessories' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update category from URL
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) setCategory(urlCategory);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [category, searchTerm, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/products?limit=24`;

      if (category) url += `&category=${category}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          let sortedProducts = [...data.data.data];
          sortedProducts = sortProducts(sortedProducts);
          setProducts(sortedProducts);
        }
      } else {
        let filtered = getFilteredMockProducts();
        filtered = sortProducts(filtered);
        setProducts(filtered);
      }
    } catch (error) {
      let filtered = getFilteredMockProducts();
      filtered = sortProducts(filtered);
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (prods: Product[]) => {
    switch (sortBy) {
      case 'price-asc':
        return [...prods].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...prods].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...prods].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return prods;
    }
  };

  const getFilteredMockProducts = () => {
    let filtered = getMockProducts();
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }
    return filtered;
  };

  const getMockProducts = (): Product[] => [
    {
      id: "1", name: "MacBook Pro 16-inch", price: 24990, compare_price: 27990,
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"],
      description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD.",
      stock: 15, status: "active", featured: true, category: "Computers", tags: ["apple", "macbook"]
    },
    {
      id: "2", name: "AirPods Pro 2nd Generation", price: 2490, compare_price: 2790,
      images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500"],
      description: "Apple AirPods Pro with Active Noise Cancellation and spatial audio.",
      stock: 50, status: "active", featured: true, category: "Audio", tags: ["apple", "airpods"]
    },
    {
      id: "3", name: "Sony WH-1000XM5 Headphones", price: 3990, compare_price: 4490,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
      description: "Industry-leading noise canceling headphones with 30-hour battery.",
      stock: 25, status: "active", featured: true, category: "Audio", tags: ["sony", "headphones"]
    },
    {
      id: "4", name: "Dell XPS 13 Laptop", price: 12990, compare_price: 14990,
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"],
      description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM.",
      stock: 20, status: "active", featured: false, category: "Computers", tags: ["dell", "laptop"]
    },
    {
      id: "5", name: "Dell Alienware 34 Monitor", price: 8990, compare_price: 10990,
      images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500"],
      description: "34-inch curved gaming monitor with 144Hz and G-SYNC.",
      stock: 10, status: "active", featured: true, category: "Monitors", tags: ["dell", "monitor"]
    },
    {
      id: "6", name: "Apple Watch Ultra", price: 7990, compare_price: 8490,
      images: ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500"],
      description: "The most rugged Apple Watch for outdoor adventurers.",
      stock: 30, status: "active", featured: true, category: "Wearables", tags: ["apple", "watch"]
    },
    {
      id: "7", name: "AI Translate Earphones Pro", price: 1990, compare_price: 2490,
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500"],
      description: "Real-time translation in 40+ languages.",
      stock: 25, status: "active", featured: true, category: "Audio", tags: ["translate", "earphones"]
    },
    {
      id: "8", name: "iPhone 15 Pro Max", price: 11990, compare_price: 12990,
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"],
      description: "Titanium design with A17 Pro chip and pro camera.",
      stock: 18, status: "active", featured: false, category: "Smartphones", tags: ["apple", "iphone"]
    },
    {
      id: "9", name: "ASUS ROG Gaming Router", price: 8990, compare_price: 9990,
      images: ["https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500"],
      description: "Quad-band WiFi 7 gaming router with ultra-low latency.",
      stock: 8, status: "active", featured: false, category: "Networking", tags: ["asus", "router"]
    },
    {
      id: "10", name: "Smart Language Translator Buds", price: 1490, compare_price: 1990,
      images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500"],
      description: "Wireless earbuds with AI translator for 12 languages.",
      stock: 40, status: "active", featured: true, category: "Audio", tags: ["translator", "earbuds"]
    },
    {
      id: "11", name: "Dell XPS 15 Developer Edition", price: 18990, compare_price: 21990,
      images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"],
      description: "Dell XPS 15 with Ubuntu, 32GB RAM, RTX 4050.",
      stock: 12, status: "active", featured: true, category: "Computers", tags: ["dell", "developer"]
    },
    {
      id: "12", name: "Samsung Galaxy Watch 6", price: 3490, compare_price: 3990,
      images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"],
      description: "Advanced health tracking and seamless Galaxy integration.",
      stock: 35, status: "active", featured: false, category: "Wearables", tags: ["samsung", "watch"]
    },
  ];

  const clearFilters = () => {
    setCategory('');
    setSearchInput('');
    setSearchTerm('');
    setSortBy('newest');
  };

  const hasActiveFilters = category || searchTerm;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-primary-50 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="font-display text-display-sm sm:text-display-md text-primary-950 mb-2">
            {category ? categories.find(c => c.value === category)?.label || 'Products' : 'All Products'}
          </h1>
          <p className="text-primary-500">
            {loading ? 'Loading...' : `${products.length} products available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-primary-50 border border-primary-100 rounded-xl text-sm focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearchTerm(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 bg-white border border-primary-200 rounded-xl text-sm focus:outline-none focus:border-primary-300 cursor-pointer"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-primary-200 rounded-xl text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* View Mode */}
            <div className="hidden sm:flex items-center border border-primary-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-950' : 'text-primary-400 hover:text-primary-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-3 ${viewMode === 'compact' ? 'bg-primary-100 text-primary-950' : 'text-primary-400 hover:text-primary-600'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className={`flex flex-wrap gap-2 mb-8 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-primary-950 text-white'
                  : 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full text-sm font-medium text-error hover:bg-error/5 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear All
            </button>
          )}
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 lg:gap-8 ${
          viewMode === 'grid'
            ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          {loading ? (
            [...Array(12)].map((_, i) => <ProductSkeleton key={i} />)
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))
          ) : null}
        </div>

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="font-display text-xl text-primary-950 mb-2">No products found</h3>
            <p className="text-primary-500 mb-6">Try adjusting your search or filters.</p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-950 text-white text-sm font-medium rounded-lg hover:bg-primary-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="bg-primary-50 border-b border-primary-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="h-10 bg-primary-200 rounded w-48 animate-pulse" />
            <div className="h-5 bg-primary-100 rounded w-32 mt-2 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-primary-100 rounded-xl mb-4" />
                <div className="h-4 bg-primary-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-primary-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
