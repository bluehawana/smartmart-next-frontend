import Image from "next/image";
import { Suspense } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { PhotoGallery } from "@/components/PhotoGallery";
import { useCartStore } from '@/lib/store/cart';
import Link from 'next/link';
import { EmblaOptionsType } from 'embla-carousel-react'

// 修改基础URL定义
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// 定义产品类型
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

// 定义固定的图片映射
const PRODUCT_IMAGES: Record<number, string> = {
  1: "macbook.jpg",     // MacBook Pro
  2: "airpods2.jpg",    // AirPods Pro 2
  3: "sony.jpg",        // Sony WH-1000XM5
  4: "xps.jpg",         // Dell XPS 13
  5: "dell.jpg",        // Dell Alienware 34
  6: "ultra.jpg"        // Apple Watch Ultra
};

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
    console.log('API URL:', url)
    console.log('Environment:', {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      BASE_URL
    })

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!res.ok) {
      console.error(`API响应错误: ${res.status}`)
      const errorText = await res.text()
      console.error('错误详情:', errorText)
      return []
    }

    const data = await res.json()
    console.log('API响应数据:', data)
    return data
  } catch (error) {
    console.error('获取产品时出错:', error)
    return []
  }
}

// 获取照片gallery数据
async function getPhotos() {
  try {
    console.log('开始获取照片数据...');
    const res = await fetch(`${BASE_URL}/photos`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`照片API响应错误: 状态码=${res.status}, 错误信息=${errorText}`);
      return [
        'macbook.jpg',
        'airpods2.jpg',
        'sony.jpg',
        'xps.jpg',
        'dell.jpg',
        'ultra.jpg'
      ];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('获取照片时出错:', error);
    return [
      'macbook.jpg',
      'airpods2.jpg',
      'sony.jpg',
      'xps.jpg',
      'dell.jpg',
      'ultra.jpg'
    ];
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
    console.log('开始获取数据...');
    [products, photos] = await Promise.all([
      getProducts(),
      getPhotos()
    ]);
    console.log('获取到的产品:', products);
    console.log('获取到的照片:', photos);
  } catch (e) {
    error = e as Error;
    console.error('数据获取失败:', error);
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
            {products.slice(0, 6).map((product) => (
              <Link 
                href={`/products/${product.id}`}
                key={`product-${product.id}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full pt-[100%]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${PRODUCT_IMAGES[product.id]}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute inset-0 w-full h-full object-contain p-4 group-hover:opacity-75 transition-opacity duration-300"
                    priority
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-xl font-semibold text-gray-900">€{product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
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
