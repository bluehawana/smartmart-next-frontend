'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { getProductImageUrl } from '@/lib/utils';
import { API_BASE } from '@/lib/config'

// API base URL
const BASE_URL = API_BASE

// Helper function to get product URL - use numeric_id
const getProductUrl = (product: Product): string => {
  return `/products/${product.numeric_id}`
}


// Product interface matching Go backend
interface Product {
  id: string;
  numeric_id: number;
  name: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  status: string;
  featured: boolean;
  category: string;
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
    const url = `${BASE_URL}/products?limit=30`  // Get all products
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
      // Return the products directly from API
      return response.data.data || []
    }
    
    // Only return mock products if API completely fails
    console.log('API failed completely, using mock products')
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
      numeric_id: 1,
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
      numeric_id: 2,
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
      numeric_id: 3,
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
      numeric_id: 7,
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
      numeric_id: 4,
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
      numeric_id: 5,
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
      numeric_id: 6,
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
      numeric_id: 10,
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
      id: "13e2b89d-4f65-4ad0-8c4a-5150657e5bde",
      numeric_id: 8,
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
      id: "4dc6d3bf-ec23-4c1b-b47d-f156c82e92fa",
      numeric_id: 9,
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
      id: "a3f5302f-f496-4211-9737-e55de3b526c2",
      numeric_id: 11,
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

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data...');
        // Fetch all products once
        const productsData = await getProducts();
        setProducts(productsData);
        console.log('Products loaded:', productsData.length);
        console.log('Sample product images:', productsData[0]?.images);
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
                href={getProductUrl(product)}
                key={`product-${product.id}`}
                className="group"
              >
                <div className="aspect-square bg-gray-50 mb-4 overflow-hidden relative">
                  <Image
                    src={product.images && product.images.length > 0 
                      ? getProductImageUrl(product.images[0])
                      : '/placeholder-product.svg'
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(event) => {
                      const target = event.currentTarget;
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
                <div className="aspect-square bg-white mb-4 overflow-hidden relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(event) => {
                      const target = event.currentTarget;
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
