'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { EmblaOptionsType } from "embla-carousel";

// API base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

// UUID to numeric ID mapping for clean URLs - based on actual API data
const UUID_TO_NUMERIC: Record<string, string> = {
  "88d35c54-ce2d-40d5-92e9-4af5c7e5e330": "1", // MacBook
  "c0d069ee-031f-4340-8588-4706103e6b04": "2", // AirPods
  "7a82d048-b478-4b4b-8b78-64eeb3a7ab86": "3", // Sony Headphones
  "611bac4c-ef16-484e-899d-1e7992819a88": "4", // Dell XPS
  "a4e33218-57c3-4133-ac51-ca9aa711eddb": "5", // Dell Monitor
  "ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1": "6", // Apple Watch
  "a87117d8-e9dd-49ab-a131-245cff3cbf2d": "7", // AI Translate Earphones
  "eed7ffb1-5dc5-45fe-8e77-63430419dce3": "8"  // Smart Language Translator Buds
}

// Helper function to get clean product URL
const getProductUrl = (productId: string): string => {
  const numericId = UUID_TO_NUMERIC[productId] || productId
  return `/products/${numericId}`
}

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
      mode: 'cors'
    })

    if (!res.ok) {
      console.error(`API Error: ${res.status}`)
      return getMockProducts()
    }

    const response = await res.json()
    console.log('API Response:', response)
    
    // The Go API returns data in response.data.data format
    if (response.success && response.data && response.data.data) {
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
      id: "88d35c54-ce2d-40d5-92e9-4af5c7e5e330",
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
      id: "c0d069ee-031f-4340-8588-4706103e6b04", 
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
      id: "7a82d048-b478-4b4b-8b78-64eeb3a7ab86",
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
      id: "611bac4c-ef16-484e-899d-1e7992819a88",
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
      id: "a4e33218-57c3-4133-ac51-ca9aa711eddb",
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
      id: "ff5c7fc1-c3c7-4b35-9e21-15ba9d1c71d1",
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
      id: "a87117d8-e9dd-49ab-a131-245cff3cbf2d",
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
      id: "eed7ffb1-5dc5-45fe-8e77-63430419dce3",
      name: "Smart Language Translator Buds",
      price: 149,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/smart-translator.jpg"],
      description: "Next-generation wireless earbuds with built-in AI translator. Supports conversation mode, offline translation for 12 languages, and crystal-clear audio quality.",
      stock: 40,
      status: "active",
      featured: true,
      category: "audio"
    }
  ]
}

// Get featured products for gallery
async function getFeaturedProducts() {
  try {
    console.log('Fetching featured products...');
    const res = await fetch(`${BASE_URL}/products?featured=true&limit=6`, {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    if (!res.ok) {
      console.error(`Featured products API error: ${res.status}`);
      return getMockPhotos();
    }

    const response = await res.json();
    if (response.success && response.data && response.data.data) {
      // Extract image URLs from featured products
      return response.data.data.map((product: Product) => 
        product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.svg'
      );
    }
    return getMockPhotos();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Return mock photos for local development
    return getMockPhotos();
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

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data...');
        const [productsData, photosData] = await Promise.all([
          getProducts(),
          getFeaturedProducts()
        ]);
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

  return (
    <div>
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
                      ? product.images[0]
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
                  <p className="text-sm font-medium text-black">${product.price.toFixed(2)}</p>
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
              { name: 'Computers', image: 'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg' },
              { name: 'Audio', image: 'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg' },
              { name: 'Smartphones', image: 'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/iphone.jpg' },
              { name: 'Wearables', image: 'https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg' }
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
  );
}
