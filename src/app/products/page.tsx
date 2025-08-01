'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://smrtmart-go-backend-1753976056-b4c4ef7e5ab7.herokuapp.com/api/v1';

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
        setProducts(getMockProducts());
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data when API fails
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = (): Product[] => {
    return [
      {
        id: "1",
        name: "MacBook Pro 16-inch",
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative w-full pt-[75%]">
              <img
                src={product.images[0] || '/placeholder-product.svg'}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition-opacity duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.svg';
                }}
              />
              {product.featured && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                  Featured
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.compare_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.compare_price.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}