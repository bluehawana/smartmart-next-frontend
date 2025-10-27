'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingCart, Heart, Share2, ZoomIn, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { getProductImageUrl } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  compare_price?: number
  description: string
  images: string[]
  stock: number
  category: string
  tags?: string[]
  featured?: boolean
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}

interface ProductDetailsProps {
  product: Product
}

export function EnhancedProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  const [isFavorited, setIsFavorited] = useState(false)
  const addToCart = useCartStore((state) => state.addToCart)

  const handleAddToCart = async () => {
    if (!product) return
    
    setIsAddingToCart(true)
    try {
      await addToCart(product.id, quantity, {
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        comparePrice: product.compare_price,
      })
      toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart. Please try again.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  const currentImage = getProductImageUrl(product.images?.[selectedImageIndex] || product.images?.[0] || '') || '/placeholder-product.svg'
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <span>Home</span> / <span>Products</span> / <span>{product.category}</span> / <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden group">
            <img
              src={currentImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isImageZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in hover:scale-105'
              }`}
              onClick={() => setIsImageZoomed(!isImageZoomed)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.svg';
              }}
            />
            {product.featured && (
              <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-sm font-medium">
                Featured
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded">
                -{discountPercentage}%
              </div>
            )}
            <button
              onClick={() => setIsImageZoomed(!isImageZoomed)}
              className="absolute bottom-4 right-4 p-2 bg-white/80 hover:bg-white transition-colors rounded-full opacity-0 group-hover:opacity-100"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 border-2 overflow-hidden ${
                    selectedImageIndex === index ? 'border-black' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={getProductImageUrl(image) || '/placeholder-product.svg'}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Price */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-light text-black pr-4">{product.name}</h1>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsFavorited(!isFavorited)}
                  className={`p-2 border border-gray-300 hover:border-black transition-colors ${
                    isFavorited ? 'bg-red-50 border-red-300' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 border border-gray-300 hover:border-black transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-3">
              <p className="text-2xl font-medium text-black">{product.price.toLocaleString('sv-SE')} kr</p>
              {hasDiscount && (
                <p className="text-lg text-gray-400 line-through">{product.compare_price.toLocaleString('sv-SE')} kr</p>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="mt-2">
              {product.stock > 0 ? (
                <span className="text-green-600 text-sm">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 text-sm">Out of Stock</span>
              )}
            </div>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.8) 124 reviews</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Short Description */}
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 hover:border-black transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-t border-b border-gray-300 text-center min-w-[50px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 hover:border-black transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || product.stock <= 0}
              className="w-full bg-black text-white py-4 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400 text-sm font-medium"
            >
              {isAddingToCart ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              {isAddingToCart ? 'Adding...' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Features */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-4 h-4" />
              <span>Free shipping on orders over 500 kr</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="w-4 h-4" />
              <span>30-day return policy</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>2-year warranty included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="border-t pt-12">
        {/* Tab Navigation */}
        <div className="flex gap-8 mb-8 border-b">
          {[
            { id: 'description' as const, label: 'Description' },
            { id: 'specs' as const, label: 'Specifications' },
            { id: 'reviews' as const, label: 'Reviews (124)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl">
          {activeTab === 'description' && (
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{product.description}</p>
              <p>
                This premium {product.category} product offers exceptional quality and performance. 
                Designed with attention to detail and built to last, it's perfect for both professional 
                and personal use.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>High-quality materials and construction</li>
                <li>Modern design that fits any environment</li>
                <li>Easy to use with intuitive controls</li>
                <li>Energy efficient and environmentally friendly</li>
                <li>Compatible with modern standards</li>
              </ul>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">General Information</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">SKU:</dt>
                    <dd>{product.sku || 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category:</dt>
                    <dd className="capitalize">{product.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Weight:</dt>
                    <dd>{product.weight ? `${product.weight} kg` : 'N/A'}</dd>
                  </div>
                  {product.dimensions && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Dimensions:</dt>
                      <dd>
                        {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              <div>
                <h4 className="font-medium mb-4">Features</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Premium quality construction</li>
                  <li>• Modern design aesthetic</li>
                  <li>• User-friendly interface</li>
                  <li>• Energy efficient operation</li>
                  <li>• Warranty included</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-light">4.8</div>
                <div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">Based on 124 reviews</div>
                </div>
              </div>
              
              {/* Sample Reviews */}
              <div className="space-y-6">
                {[
                  {
                    name: "Sarah Johnson",
                    rating: 5,
                    date: "2 days ago",
                    comment: "Excellent product! Exactly as described and arrived quickly. Highly recommend!"
                  },
                  {
                    name: "Mike Chen",
                    rating: 4,
                    date: "1 week ago",
                    comment: "Great quality and value. Very satisfied with my purchase."
                  },
                  {
                    name: "Emma Wilson",
                    rating: 5,
                    date: "2 weeks ago",
                    comment: "Outstanding! This product exceeded my expectations. Will definitely buy again."
                  }
                ].map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.name}</div>
                          <div className="text-xs text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3 h-3 ${
                              star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
