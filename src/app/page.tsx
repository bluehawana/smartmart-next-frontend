import Image from "next/image";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { PhotoGallery } from "@/components/PhotoGallery";
import { useCartStore } from '@/lib/store/cart'
import { ProductCard } from "@/components/ProductCard";

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
  2: "airpods2.jpg",    // AirPods Pro 2 - 确保这个文件名正确
  3: "sony.jpg",        // Sony WH-1000XM5
  4: "xps.jpg",         // Dell XPS 13
  5: "dell.jpg",        // Dell Alienware 34
  6: "ultra.jpg"        // Apple Watch Ultra - 改回 ultra.jpg
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
    const res = await fetch('http://localhost:8080/api/products', { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }
    
    const products = await res.json();
    console.log('Raw products data:', products);

    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      image: PRODUCT_IMAGES[product.id] || 'default.jpg',
      stock: parseInt(product.stockQuantity) || 100
    }));
    
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// 获取照片gallery数据
async function getPhotos() {
  try {
    const res = await fetch('http://localhost:8080/api/photos', { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) throw new Error(`Failed to fetch photos: ${res.status}`);
    const data = await res.json();
    
    // 确保返回完整的URL，包括新添加的照片
    return data.data.map((photo: string) => `http://localhost:8080${photo}`);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
}

export default async function Home() {
  let products: Product[] = [];
  let photos: string[] = [];
  let error = null;

  try {
    [products, photos] = await Promise.all([
      getProducts(),
      getPhotos()
    ]);
  } catch (e) {
    error = e as Error;
  }

  if (error) {
    return <ErrorCard error={error} />;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      {/* Latest Drops Section - 现在显示6个产品 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Drops</h2>
          <a href="/products" className="text-blue-600 hover:underline">View all</a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <LoadingCard key={i} />)}
          </div>}>
            {products.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                description={product.description}
                stock={product.stock}
              />
            ))}
          </Suspense>
        </div>
      </section>

      {/* Weekly Picks Section - 现在是照片轮播 */}
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
