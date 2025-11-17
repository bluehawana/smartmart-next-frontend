'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { getProductImageUrl } from '@/lib/utils';
import { EmblaOptionsType } from "embla-carousel";
import { API_BASE } from '@/lib/config';
import { useSession } from '@/lib/auth-client';

// API base URL
const BASE_URL = API_BASE

// Helper function to get product URL
const getProductUrl = (productId: string): string => `/products/${productId}`

// Product interface matching Go backend
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
}

// 加载状态组件
function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200"/>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"/>
        <div className="h-10 bg-gray-200 rounded"/>
      </div>
    </div>
  );
}

// 错误状态组件
function ErrorCard({ error }: { error: Error }) {
  return (
    <div className="bg-red-50 rounded-lg p-4 text-red-500">
      <p>Error loading products: {error.message}</p>
    </div>
  );
}

async function getProducts() {
  try {
    const url = `${BASE_URL}/products`
    console.log('Fetching products from:', url)

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      // Cache for 5 minutes to prevent rate limiting
      next: { revalidate: 300 }
    })

    if (!res.ok) {
      console.error(`API Error: ${res.status}`)
      return getMockProducts()
    }

    const response = await res.json()
    console.log('API Response:', response)

    // The Go API returns data in response.data.data format
    if (response.success && response.data && response.data.data) {
      // Return products as-is with UUID IDs and API images
      return response.data.data
    }

    return getMockProducts()
  } catch (error) {
    console.error('Error fetching products:', error)
    // Return mock data for local development
    return getMockProducts()
  }
}

function getMockProducts(): Product[] {
  return [
    {
      id: "1",
      name: "MacBook Pro 16-inch",
      price: 2499,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg"],
      description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals and creatives.",
      stock: 15,
      status: "active",
      featured: true,
      category: "computers"
    },
    {
      id: "2",
      name: "AirPods Pro 2nd Generation",
      price: 249,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/airpods2.jpg"],
      description: "Apple AirPods Pro with Active Noise Cancellation, Transparency mode, and spatial audio.",
      stock: 50,
      status: "active",
      featured: true,
      category: "audio"
    },
    {
      id: "3",
      name: "Sony WH-1000XM5 Headphones", 
      price: 399,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg"],
      description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
      stock: 25,
      status: "active",
      featured: true,
      category: "audio"
    },
    {
      id: "4",
      name: "Dell XPS 13 Laptop",
      price: 1299,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/xps.jpg"],
      description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM, 512GB SSD, and stunning InfinityEdge display.",
      stock: 20,
      status: "active",
      featured: false,
      category: "computers"
    },
    {
      id: "5",
      name: "Dell Alienware 34 Curved Monitor", 
      price: 899,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg"],
      description: "34-inch curved gaming monitor with 144Hz refresh rate, NVIDIA G-SYNC, and stunning WQHD resolution.",
      stock: 10,
      status: "active",
      featured: true,
      category: "monitors"
    },
    {
      id: "6",
      name: "Apple Watch Ultra", 
      price: 799,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg"],
      description: "The most rugged and capable Apple Watch, designed for endurance athletes and outdoor adventurers.",
      stock: 30,
      status: "active",
      featured: true,
      category: "wearables"
    },
    {
      id: "7",
      name: "AI Translate Earphones Pro", 
      price: 199,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ai-translate-pro.jpg"],
      description: "Revolutionary intelligent translate earphones with real-time translation in 40+ languages.",
      stock: 25,
      status: "active",
      featured: true,
      category: "audio"
    },
    {
      id: "8",
      name: "Smart Language Translator Buds",
      price: 149,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/smart-translator.jpg"],
      description: "Next-generation wireless earbuds with built-in AI translator. Supports conversation mode, offline translation for 12 languages, and crystal-clear audio quality.",
      stock: 40,
      status: "active",
      featured: true,
      category: "audio"
    },
    {
      id: "9",
      name: "ASUS ROG Rapture GT-BE98 Gaming Router",
      price: 8990,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/asus.jpg"],
      description: "ASUS ROG Rapture GT-BE98 Quad-band Gaming Router with WiFi 7, advanced QoS, and ultra-low latency for competitive gaming.",
      stock: 8,
      status: "active",
      featured: false,
      category: "networking"
    },
    {
      id: "10",
      name: "iPhone 15 Pro Max",
      price: 1199,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/iphone.jpg"],
      description: "The ultimate iPhone with titanium design, A17 Pro chip, and professional camera system.",
      stock: 18,
      status: "active",
      featured: false,
      category: "smartphones"
    },
    {
      id: "11",
      name: "Dell XPS 15 Developer Edition",
      price: 1899,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell-xps-15-2023.jpg"],
      description: "Dell XPS 15 Developer Edition with Ubuntu, Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA GeForce RTX 4050. Perfect for developers and content creators.",
      stock: 12,
      status: "active",
      featured: true,
      category: "computers"
    }
  ]
}

// Get featured products for gallery (from already fetched products)
function getFeaturedProductImages(products: Product[]): string[] {
  try {
    const featuredProducts = products.filter(p => p.featured).slice(0, 6);
    return featuredProducts.map(p => p.images[0]).filter(Boolean);
  } catch (error) {
    console.error('Error getting featured products:', error);
    return [];
  }
}

function getMockPhotos(): string[] {
  return [
    'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg',
    'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/airpods2.jpg', 
    'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg',
    'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg',
    'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg',
    'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ai-translate-pro.jpg'
  ]
}

const autoplayOptions = {
  delay: 3000,
  rootNode: (emblaRoot: HTMLElement) => emblaRoot.parentElement,
}

const carouselOptions: EmblaOptionsType = {
  loop: true,
  align: 'start',
  slidesToScroll: 1,
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data...');
        // Fetch products once, then derive featured images
        const productsData = await getProducts();
        const photosData = getFeaturedProductImages(productsData);

        setProducts(productsData);
        setPhotos(photosData);
        console.log('Products loaded:', productsData.length);
        console.log('Sample product images:', productsData[0]?.images);
        console.log('Featured photos loaded:', photosData.length);
        console.log('Sample photo URL:', photosData[0]);
      } catch (e) {
        setError(e as Error);
        console.error('Data fetch failed:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <ErrorCard error={error} />;
  }

  const isAuthenticated = !isPending && session;
  const shouldShowLoginOverlay = !isPending && !session;

  return (
    <div className="relative">
      {/* Authentication Overlay - Only show when session is loaded and user is not authenticated */}
      {shouldShowLoginOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 border border-gray-200">
            <h2 className="text-2xl font-semibold text-black mb-4 text-center">
              Sign in to access SmrtMart
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Please sign in to view our premium collection of electronics and products.
            </p>
            <Link
              href="/login"
              className="block w-full bg-black text-white text-center py-3 px-6 hover:bg-gray-800 transition-colors font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Content with blur effect when not authenticated */}
      <div className={shouldShowLoginOverlay ? "filter blur-md pointer-events-none select-none" : ""}>
        {/* Hero Section */}
        <section className="relative bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light text-black mb-6">
              Premium Electronics
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the latest in technology and premium electronics, carefully curated for the modern lifestyle.
            </p>
            <Link 
              href="/products"
              className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-light text-black">All Products</h2>
            <Link href="/products" className="text-sm text-gray-600 hover:text-black border-b border-gray-300 hover:border-black transition-colors">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={`loading-${i}`} className="group">
                  <div className="aspect-square bg-gray-100 animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-100 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-100 animate-pulse w-1/3"></div>
                </div>
              ))
            ) : products.length > 0 ? products.map((product) => (
              <Link 
                href={getProductUrl(product.id)}
                key={`product-${product.id}`}
                className="group"
              >
                <div className="aspect-square bg-gray-50 mb-4 overflow-hidden">
                  <img
                    src={product.images && product.images.length > 0 
                      ? getProductImageUrl(product.images[0])
                      : '/placeholder-product.svg'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-sm font-medium text-black">{product.price.toLocaleString('sv-SE')} kr</p>
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-light text-black mb-12 text-center">Shop by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Computers', image: 'https://2a35af424f8734e497a5d707344d79d5.r2.cloudflarestorage.com/smrtmart/macbook.jpg' },
              { name: 'Audio', image: 'https://2a35af424f8734e497a5d707344d79d5.r2.cloudflarestorage.com/smrtmart/sony.jpg' },
              { name: 'Smartphones', image: 'https://2a35af424f8734e497a5d707344d79d5.r2.cloudflarestorage.com/smrtmart/iphone.jpg' },
              { name: 'Wearables', image: 'https://2a35af424f8734e497a5d707344d79d5.r2.cloudflarestorage.com/smrtmart/ultra.jpg' }
            ].map((category, index) => (
              <Link 
                href={`/products?category=${category.name.toLowerCase()}`}
                key={index}
                className="group text-center"
              >
                <div className="aspect-square bg-white mb-4 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                </div>
                <h3 className="text-sm font-medium text-black group-hover:text-gray-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
