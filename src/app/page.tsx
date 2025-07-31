import Image from "next/image";
import { Suspense } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { PhotoGallery } from "@/components/PhotoGallery";
import { useCartStore } from '@/lib/store/cart';
import Link from 'next/link';
import { EmblaOptionsType } from 'embla-carousel-react'

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
      next: { revalidate: 3600 }, // Cache for 1 hour instead of no-store
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      console.error(`API Error: ${res.status}`)
      const errorText = await res.text()
      console.error('Error details:', errorText)
      return []
    }

    const response = await res.json()
    console.log('API Response:', response)
    
    // The Go API returns data in response.data.data format
    if (response.success && response.data && response.data.data) {
      return response.data.data
    }
    
    return []
  } catch (error) {
    console.error('Error fetching products:', error)
    // Return empty array during build when API is not available
    return []
  }
}

// Get featured products for gallery
async function getFeaturedProducts() {
  try {
    console.log('Fetching featured products...');
    const res = await fetch(`${BASE_URL}/products/featured?limit=6`, {
      next: { revalidate: 3600 }, // Cache for 1 hour instead of no-store
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error(`Featured products API error: ${res.status}`);
      return [];
    }

    const response = await res.json();
    if (response.success && response.data) {
      // Extract image URLs from featured products
      return response.data.map((product: Product) => 
        product.images && product.images.length > 0 ? product.images[0] : 'placeholder.jpg'
      );
    }
    return [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Return empty array during build when API is not available
    return [];
  }
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

export default async function Home() {
  let products: Product[] = [];
  let photos: string[] = [];
  let error = null;

  try {
    console.log('Fetching data...');
    [products, photos] = await Promise.all([
      getProducts(),
      getFeaturedProducts()
    ]);
    console.log('Products:', products);
    console.log('Featured photos:', photos);
  } catch (e) {
    error = e as Error;
    console.error('Data fetch failed:', error);
  }

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
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <LoadingCard key={`loading-${i}`} />)}
            </div>
          }>
            {products.length > 0 ? products.map((product) => (
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
          </Suspense>
        </div>
      </section>

      {/* Weekly Picks Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Weekly Picks</h2>
        </div>
        
        <Suspense fallback={<div className="h-64 bg-gray-200 animate-pulse rounded-lg" />}>
          <PhotoGallery photos={photos} />
        </Suspense>
      </section>
    </div>
  );
}
