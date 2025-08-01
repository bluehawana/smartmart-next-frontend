'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { EmblaOptionsType } from "embla-carousel";

// API base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'

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
    const url = `${BASE_URL}/products?limit=6`
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
      id: "1",
      name: "MacBook Pro 16-inch",
      price: 2499,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg"],
      description: "Apple MacBook Pro 16-inch with M3 Pro chip",
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
      description: "Apple AirPods Pro with Active Noise Cancellation",
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
      description: "Industry-leading noise canceling headphones",
      stock: 25,
      status: "active",
      featured: true,
      category: "audio"
    },
    {
      id: "4",
      name: "Dell Alienware 34 Monitor", 
      price: 899,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg"],
      description: "34-inch curved gaming monitor with 144Hz",
      stock: 10,
      status: "active",
      featured: true,
      category: "monitors"
    },
    {
      id: "5",
      name: "Apple Watch Ultra", 
      price: 799,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg"],
      description: "Most rugged Apple Watch for athletes",
      stock: 30,
      status: "active",
      featured: true,
      category: "wearables"
    },
    {
      id: "6",
      name: "AI Translate Earphones Pro", 
      price: 199,
      images: ["https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ai-translate-pro.jpg"],
      description: "Real-time translation earphones in 40+ languages",
      stock: 25,
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

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-light text-black">Featured Products</h2>
            <Link href="/products" className="text-sm text-gray-600 hover:text-black border-b border-gray-300 hover:border-black transition-colors">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={`loading-${i}`} className="group">
                  <div className="aspect-square bg-gray-100 animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-100 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-100 animate-pulse w-1/3"></div>
                </div>
              ))
            ) : products.length > 0 ? products.slice(0, 6).map((product) => (
              <Link 
                href={`/products/${product.id}`}
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
              { name: 'Computers', image: photos[0] || '/placeholder-product.svg' },
              { name: 'Audio', image: photos[1] || '/placeholder-product.svg' },
              { name: 'Wearables', image: photos[2] || '/placeholder-product.svg' },
              { name: 'Monitors', image: photos[3] || '/placeholder-product.svg' }
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
