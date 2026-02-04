'use client'

import Image from "next/image";
import { useCartStore } from '@/lib/store/cart'
import { getProductImageUrl } from '@/lib/utils'
import { useState } from 'react';
import { toast } from 'react-hot-toast';

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
  const [addedSuccess, setAddedSuccess] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = async () => {
    if (isAdding || addedSuccess) return;

    setIsAdding(true);
    try {
      await addToCart(id, 1, {
        name,
        price,
        description,
        image: images && images.length > 0 ? images[0] : '',
      });

      // Show success state
      setIsAdding(false);
      setAddedSuccess(true);
      toast.success('Added to cart!');

      // Reset button after 1.5 seconds
      setTimeout(() => {
        setAddedSuccess(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart. Please try again.');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[600px]">
      <div className="relative h-80 bg-gray-50 flex-shrink-0">
        <Image
          src={images && images.length > 0
            ? getProductImageUrl(images[0])
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
          <p className="text-xl font-semibold text-gray-900">{price.toLocaleString('sv-SE')} kr</p>
        </div>
        {stock > 0 ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding || addedSuccess}
            className={`
              mt-6 w-full py-3 px-4 rounded-md transition-colors
              ${addedSuccess
                ? 'bg-green-500 text-white cursor-not-allowed'
                : isAdding
                  ? 'bg-gray-500 text-white cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
              }
            `}
          >
            {addedSuccess ? 'Added!' : isAdding ? 'Adding...' : 'Add to Cart'}
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
