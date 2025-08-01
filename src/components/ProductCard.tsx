'use client'

import Image from "next/image";
import { useCartStore } from '@/lib/store/cart'
import { useState } from 'react';

interface ProductCardProps {
  id: string
  name: string
  price: number
  images: string[]
  description: string
  stock: number
}

export function ProductCard({ id, name, price, images, description, stock }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      await addItem({
        id,
        name,
        price,
        image: images && images.length > 0 ? images[0] : 'placeholder.jpg',
        quantity: 1
      });
      
      // 显示成功反馈
      const button = document.activeElement as HTMLButtonElement;
      if (button) {
        button.textContent = "Added!";
        setTimeout(() => {
          button.textContent = "Add to Cart";
          setIsAdding(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      alert(error instanceof Error ? error.message : 'Failed to add item to cart. Please try again.');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[600px]">
      <div className="relative h-80 bg-gray-50 flex-shrink-0">
        <Image
          src={images && images.length > 0 
            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${images[0]}`
            : '/placeholder-product.jpg'
          }
          alt={name}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{name}</h3>
          <p className="text-sm text-gray-500 mb-4 line-clamp-3">{description}</p>
          <p className="text-xl font-semibold text-gray-900">${price.toFixed(2)}</p>
        </div>
        {stock > 0 ? (
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`
              mt-6 w-full py-3 px-4 rounded-md transition-colors
              ${isAdding 
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
              }
            `}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        ) : (
          <button disabled className="mt-6 w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-md cursor-not-allowed">
            Out of Stock
          </button>
        )}
      </div>
    </div>
  )
} 