'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-go-backend-1753976056-b4c4ef7e5ab7.herokuapp.com/api/v1';

// UUID to numeric ID mapping for clean URLs - 9 products total
const UUID_TO_NUMERIC: Record<string, string> = {
  "88d35c54-ce2d-40d5-92e9-4af5c7e5e330": "1",
  "c0d069ee-031f-4340-8588-4706103e6b04": "2", 
  "7a82d048-b478-4b4b-8b78-64eeb3a7ab86": "3",
  "a4e33218-57c3-4133-ac51-ca9aa711eddb": "4",
  "ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1": "5",
  "a87117d8-e9dd-49ab-a131-245cff3cbf2d": "6",
  "611bac4c-ef16-484e-899d-1e7992819a88": "7",
  "asus-rog-laptop-001": "8",
  "iphone-15-pro-max-001": "9"
}

// Helper function to get clean product URL
const getProductUrl = (productId: string): string => {
  const numericId = UUID_TO_NUMERIC[productId] || productId
  return `/products/${numericId}`
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

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'computers', label: 'Computers' },
    { value: 'smartphones', label: 'Smartphones' },
    { value: 'audio', label: 'Audio' },
    { value: 'wearables', label: 'Wearables' },
    { value: 'monitors', label: 'Monitors' },
    { value: 'tablets', label: 'Tablets' },
    { value: 'accessories', label: 'Accessories' },
  ];

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
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg"],
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
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/airpods2.jpg"],
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
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg"],
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
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg"],
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
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg"],
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
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ai-translate-pro.jpg"],
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
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/xps.jpg"],
        description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM, 512GB SSD, and stunning InfinityEdge display.",
        stock: 20,
        status: "active",
        featured: false,
        category: "computers",
        tags: ["dell", "xps", "laptop", "ultrabook", "portable"]
      },
      {
        id: "8",
        name: "ASUS ROG Gaming Laptop",
        price: 1599,
        compare_price: 1799,
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/asus.jpg"],
        description: "High-performance gaming laptop with RTX graphics, RGB keyboard, and advanced cooling system.",
        stock: 12,
        status: "active",
        featured: false,
        category: "computers",
        tags: ["asus", "rog", "gaming", "laptop", "rtx", "rgb"]
      },
      {
        id: "9",
        name: "iPhone 15 Pro Max",
        price: 1199,
        compare_price: 1299,
        images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/iphone.jpg"],
        description: "The ultimate iPhone with titanium design, A17 Pro chip, and professional camera system.",
        stock: 18,
        status: "active",
        featured: false,
        category: "smartphones",
        tags: ["apple", "iphone", "smartphone", "titanium", "a17", "pro"]
      }
    ];
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          <Link
            href={getProductUrl(product.id)}
            key={product.id}
            className="group"
          >
            <div className="aspect-square bg-gray-50 mb-4 overflow-hidden relative">
              <img
                src={product.images[0] || '/placeholder-product.svg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.svg';
                }}
              />
              {product.featured && (
                <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-black mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-black">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.compare_price > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ${product.compare_price.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </Link>
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