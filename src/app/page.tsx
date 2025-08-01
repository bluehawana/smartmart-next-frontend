'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from 'next/link';

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
    const url = `${BASE_URL}/products?status=active&limit=6`
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
      images: ["/placeholder-product.svg"],
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
      images: ["/placeholder-product.svg"],
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
      images: ["/placeholder-product.svg"],
      description: "Industry-leading noise canceling headphones",
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
    '/placeholder-product.svg',
    '/placeholder-product.svg', 
    '/placeholder-product.svg',
    '/placeholder-product.svg',
    '/placeholder-product.svg',
    '/placeholder-product.svg'
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
        console.log('Products:', productsData);
        console.log('Featured photos:', photosData);
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
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Latest Drops Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Drops</h2>
          <a href="/products" className="text-blue-600 hover:underline">View all</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => <LoadingCard key={`loading-${i}`} />)
          ) : products.length > 0 ? products.map((product) => (
              <Link 
                href={`/products/${product.id}`}
                key={`product-${product.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full pt-[100%]">
                  <Image
                    src={product.images && product.images.length > 0 
                      ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${product.images[0]}`
                      : '/placeholder-product.jpg'
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:opacity-75 transition-opacity duration-300"
                    priority
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                  {product.stock > 0 ? (
                    <p className="text-sm text-green-600">In Stock ({product.stock})</p>
                  ) : (
                    <p className="text-sm text-red-600">Out of Stock</p>
                  )}
                </div>
              </Link>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No products available at the moment.</p>
              </div>
            )}
        </div>
      </section>

      {/* Weekly Picks Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Weekly Picks</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={photo}
                alt={`Featured product ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
