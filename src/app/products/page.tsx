'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'react-hot-toast';

// ProductCard component
function ProductCard({ id, name, price, imageUrl, description, comparePrice, stock, featured }: {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  comparePrice: number;
  stock: number;
  featured: boolean;
}) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      await addToCart(Number(id), 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="group">
      <Link href={`/products/${id}`}>
        <div className="aspect-square bg-gray-50 mb-4 overflow-hidden relative">
          <img
            src={imageUrl || '/placeholder-product.svg'}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.svg';
            }}
          />
          {featured && (
            <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
              Featured
            </div>
          )}
        </div>
      </Link>
      <div>
        <Link href={`/products/${id}`}>
          <h3 className="text-sm font-medium text-black mb-1 hover:text-gray-700">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-black">
              ${price.toFixed(2)}
            </span>
            {comparePrice > price && (
              <span className="text-sm text-gray-400 line-through">
                ${comparePrice.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || stock <= 0}
          className="w-full bg-black text-white py-2 px-4 text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {isAddingToCart ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
            </svg>
          )}
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-go-backend-1753976056-b4c4ef7e5ab7.herokuapp.com/api/v1';

// Helper function to get clean product URL
const getProductUrl = (productId: string): string => {
  return `/products/${productId}`
}

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'computers', label: 'Computers' },
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'audio', label: 'Audio' },
    { value: 'wearables', label: 'Wearables' },
    { value: 'monitors', label: 'Monitors' },
    { value: 'networking', label: 'Networking' },
    { value: 'accessories', label: 'Accessories' },
  ];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts();
  }, [page, category, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${BASE_URL}/products?page=${page}&limit=12`;

      if (category) url += `&category=${category}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProducts(data.data.data);
        }
      } else {
        console.error('API Error:', response.status);
        // Use mock data when API fails
        setProducts(getFilteredMockProducts());
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data when API fails
      setProducts(getFilteredMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMockProducts = () => {
    let filtered = getMockProducts();

    // Filter by category
    if (category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  };

  const getMockProducts = (): Product[] => {
    return [
      {
        id: "1",
        name: "Apple MacBook Pro 16-inch",
        price: 2499,
        compare_price: 2799,
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center"],
        description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals and creatives.",
        stock: 15,
        status: "active",
        featured: true,
        category: "computers",
        tags: ["apple", "macbook", "laptop", "professional"]
      },
      {
        id: "2",
        name: "AirPods Pro 2nd Generation",
        price: 249,
        compare_price: 279,
        images: ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center"],
        description: "Apple AirPods Pro with Active Noise Cancellation, Transparency mode, and spatial audio.",
        stock: 50,
        status: "active",
        featured: true,
        category: "audio",
        tags: ["apple", "airpods", "wireless", "noise-cancellation"]
      },
      {
        id: "3",
        name: "Sony WH-1000XM5 Headphones",
        price: 399,
        compare_price: 449,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center"],
        description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
        stock: 25,
        status: "active",
        featured: true,
        category: "audio",
        tags: ["sony", "headphones", "noise-cancellation", "wireless"]
      },
      {
        id: "4",
        name: "Dell Alienware 34 Curved Monitor",
        price: 899,
        compare_price: 1099,
        images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop&crop=center"],
        description: "34-inch curved gaming monitor with 144Hz refresh rate, NVIDIA G-SYNC, and stunning WQHD resolution.",
        stock: 10,
        status: "active",
        featured: true,
        category: "monitors",
        tags: ["dell", "alienware", "monitor", "gaming", "curved", "144hz"]
      },
      {
        id: "5",
        name: "Apple Watch Ultra",
        price: 799,
        compare_price: 849,
        images: ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop&crop=center"],
        description: "The most rugged and capable Apple Watch, designed for endurance athletes and outdoor adventurers.",
        stock: 30,
        status: "active",
        featured: true,
        category: "wearables",
        tags: ["apple", "watch", "ultra", "fitness", "rugged"]
      },
      {
        id: "6",
        name: "AI Translate Earphones Pro",
        price: 199,
        compare_price: 249,
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop&crop=center"],
        description: "Revolutionary intelligent translate earphones with real-time translation in 40+ languages.",
        stock: 25,
        status: "active",
        featured: true,
        category: "audio",
        tags: ["translate", "earphones", "ai", "language", "travel", "wireless"]
      },
      {
        id: "7",
        name: "Dell XPS 13 Laptop",
        price: 1299,
        compare_price: 1499,
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&crop=center"],
        description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM, 512GB SSD, and stunning InfinityEdge display.",
        stock: 20,
        status: "active",
        featured: false,
        category: "computers",
        tags: ["dell", "xps", "laptop", "ultrabook", "portable"]
      },
      {
        id: "8",
        name: "ASUS ROG Rapture GT-BE98 Gaming Router",
        price: 8990,
        compare_price: 9990,
        images: ["https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=500&h=500&fit=crop&crop=center"],
        description: "ASUS ROG Rapture GT-BE98 Quad-band Gaming Router with WiFi 7, advanced QoS, and ultra-low latency for competitive gaming.",
        stock: 8,
        status: "active",
        featured: false,
        category: "networking",
        tags: ["asus", "rog", "router", "gaming", "wifi7", "networking"]
      },
      {
        id: "9",
        name: "iPhone 15 Pro Max",
        price: 1199,
        compare_price: 1299,
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center"],
        description: "The ultimate iPhone with titanium design, A17 Pro chip, and professional camera system.",
        stock: 18,
        status: "active",
        featured: false,
        category: "smartphones",
        tags: ["apple", "iphone", "smartphone", "titanium", "a17", "pro"]
      },
      {
        id: "10",
        name: "Smart Language Translator Buds",
        price: 149,
        compare_price: 199,
        images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop&crop=center"],
        description: "Next-generation wireless earbuds with built-in AI translator. Supports conversation mode, offline translation for 12 languages, and crystal-clear audio quality.",
        stock: 40,
        status: "active",
        featured: true,
        category: "audio",
        tags: ["translator", "earbuds", "ai", "language", "wireless", "travel"]
      },
      {
        id: "11",
        name: "Dell XPS 15 Developer Edition",
        price: 1899,
        compare_price: 2199,
        images: ["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=center"],
        description: "Dell XPS 15 Developer Edition with Ubuntu, Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA GeForce RTX 4050. Perfect for developers and content creators.",
        stock: 12,
        status: "active",
        featured: true,
        category: "computers",
        tags: ["dell", "xps", "laptop", "developer", "ubuntu", "nvidia"]
      }
    ];
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-light text-black mb-8">All Products</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 focus:border-black focus:outline-none text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div key={`loading-${i}`} className="group">
              <div className="aspect-square bg-gray-100 animate-pulse mb-4"></div>
              <div className="h-4 bg-gray-100 animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-100 animate-pulse w-1/3"></div>
            </div>
          ))
        ) : products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.images && product.images.length > 0 ? product.images[0] : ''}
            description={product.description}
            comparePrice={product.compare_price}
            stock={product.stock}
            featured={product.featured}
          />
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium text-black mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}