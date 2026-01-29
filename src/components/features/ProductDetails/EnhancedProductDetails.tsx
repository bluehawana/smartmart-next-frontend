'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Minus, ShoppingBag, Heart, Share2, ZoomIn, Star, Truck, Shield, RotateCcw, ChevronRight, Check } from 'lucide-react'
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
      navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    }
  }

  const currentImage = getProductImageUrl(product.images?.[selectedImageIndex] || product.images?.[0] || '') || '/placeholder-product.svg'
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercentage = hasDiscount && product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  if (!product) {
    return <div>Product not found</div>
  }

  const features = [
    { icon: Truck, text: 'Free shipping over 500 kr', color: 'text-accent-dark' },
    { icon: RotateCcw, text: '30-day returns', color: 'text-primary-600' },
    { icon: Shield, text: '2-year warranty', color: 'text-success' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-primary-400 hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-primary-300" />
            <Link href="/products" className="text-primary-400 hover:text-primary-600 transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4 text-primary-300" />
            <Link
              href={`/products?category=${product.category.toLowerCase()}`}
              className="text-primary-400 hover:text-primary-600 transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-primary-300" />
            <span className="text-primary-950 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Product Images */}
          <div className="space-y-4 animate-fade-in-up">
            {/* Main Image */}
            <div className="relative aspect-square bg-primary-50 rounded-2xl overflow-hidden group">
              <img
                src={currentImage}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isImageZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in group-hover:scale-105'
                }`}
                onClick={() => setIsImageZoomed(!isImageZoomed)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-product.svg';
                }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="badge badge-accent">Featured</span>
                )}
                {hasDiscount && (
                  <span className="badge badge-primary">-{discountPercentage}%</span>
                )}
              </div>

              {/* Zoom Button */}
              <button
                onClick={() => setIsImageZoomed(!isImageZoomed)}
                className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-soft-md opacity-0 group-hover:opacity-100 transition-all"
              >
                <ZoomIn className="w-5 h-5 text-primary-700" />
              </button>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-primary-950 ring-offset-2'
                        : 'hover:opacity-80'
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
          <div className="space-y-6 animate-fade-in-up stagger-2">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-sm text-primary-500 uppercase tracking-wide mb-2">{product.category}</p>
                  <h1 className="font-display text-display-xs sm:text-display-sm text-primary-950">{product.name}</h1>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-3 rounded-xl border transition-all ${
                      isFavorited
                        ? 'bg-error/5 border-error/20 text-error'
                        : 'border-primary-200 text-primary-500 hover:border-primary-300 hover:text-primary-700'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-xl border border-primary-200 text-primary-500 hover:border-primary-300 hover:text-primary-700 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <span className="text-sm text-primary-500">4.8 (124 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl text-primary-950">
                {product.price.toLocaleString('sv-SE')} kr
              </span>
              {hasDiscount && (
                <span className="text-xl text-primary-400 line-through">
                  {product.compare_price?.toLocaleString('sv-SE')} kr
                </span>
              )}
              <span className="text-sm text-primary-400">inkl. 25% moms</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm text-success font-medium">
                    In Stock — {product.stock} available
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-error rounded-full" />
                  <span className="text-sm text-error font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-primary-600 leading-relaxed">{product.description}</p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-50 text-primary-600 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t border-primary-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-primary-700">Quantity</span>
                <div className="flex items-center border border-primary-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center text-primary-600 hover:bg-primary-50 disabled:opacity-50 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-14 text-center font-medium text-primary-950">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-12 h-12 flex items-center justify-center text-primary-600 hover:bg-primary-50 disabled:opacity-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
                className="w-full flex items-center justify-center gap-3 bg-primary-950 text-white py-4 px-6 rounded-xl font-medium hover:bg-primary-800 transition-all disabled:bg-primary-300 disabled:cursor-not-allowed group"
              >
                {isAddingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingBag className="w-5 h-5" />
                )}
                {isAddingToCart
                  ? 'Adding to Cart...'
                  : product.stock <= 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-primary-100">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center">
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-primary-50 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <p className="text-xs text-primary-600">{feature.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="border-t border-primary-100 pt-12">
          {/* Tab Navigation */}
          <div className="flex gap-1 mb-8 bg-primary-50 p-1 rounded-xl max-w-md">
            {[
              { id: 'description' as const, label: 'Description' },
              { id: 'specs' as const, label: 'Specifications' },
              { id: 'reviews' as const, label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-950 shadow-soft-sm'
                    : 'text-primary-500 hover:text-primary-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl animate-fade-in">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div className="prose prose-primary max-w-none">
                  <p className="text-primary-600 leading-relaxed text-lg">{product.description}</p>
                  <p className="text-primary-600 leading-relaxed">
                    This premium {product.category.toLowerCase()} product offers exceptional quality and performance.
                    Designed with attention to detail and built to last, it's perfect for both professional
                    and personal use.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {[
                    'High-quality materials and construction',
                    'Modern design that fits any environment',
                    'Easy to use with intuitive controls',
                    'Energy efficient and environmentally friendly',
                    'Compatible with modern standards',
                    'Premium packaging included',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-sm text-primary-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-primary-50 rounded-2xl p-6">
                  <h4 className="font-display text-lg text-primary-950 mb-6">General Information</h4>
                  <dl className="space-y-4">
                    {[
                      { label: 'SKU', value: product.sku || 'N/A' },
                      { label: 'Category', value: product.category },
                      { label: 'Weight', value: product.weight ? `${product.weight} kg` : 'N/A' },
                      {
                        label: 'Dimensions',
                        value: product.dimensions
                          ? `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`
                          : 'N/A'
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-primary-100 last:border-0">
                        <dt className="text-primary-500 text-sm">{item.label}</dt>
                        <dd className="text-primary-950 text-sm font-medium">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="bg-primary-50 rounded-2xl p-6">
                  <h4 className="font-display text-lg text-primary-950 mb-6">Key Features</h4>
                  <ul className="space-y-3">
                    {[
                      'Premium quality construction',
                      'Modern design aesthetic',
                      'User-friendly interface',
                      'Energy efficient operation',
                      '2-year warranty included',
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-sm text-primary-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Rating Summary */}
                <div className="flex items-center gap-6 p-6 bg-primary-50 rounded-2xl">
                  <div className="text-center">
                    <p className="font-display text-4xl text-primary-950">4.8</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-xs text-primary-500 mt-1">124 reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { stars: 5, percent: 78 },
                      { stars: 4, percent: 15 },
                      { stars: 3, percent: 5 },
                      { stars: 2, percent: 1 },
                      { stars: 1, percent: 1 },
                    ].map((rating) => (
                      <div key={rating.stars} className="flex items-center gap-2">
                        <span className="text-xs text-primary-500 w-12">{rating.stars} stars</span>
                        <div className="flex-1 h-2 bg-primary-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all"
                            style={{ width: `${rating.percent}%` }}
                          />
                        </div>
                        <span className="text-xs text-primary-500 w-10">{rating.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {[
                    {
                      name: "Sarah Johnson",
                      rating: 5,
                      date: "2 days ago",
                      comment: "Excellent product! Exactly as described and arrived quickly. The quality exceeded my expectations. Highly recommend!"
                    },
                    {
                      name: "Mike Chen",
                      rating: 4,
                      date: "1 week ago",
                      comment: "Great quality and value. Very satisfied with my purchase. Shipping was fast too."
                    },
                    {
                      name: "Emma Wilson",
                      rating: 5,
                      date: "2 weeks ago",
                      comment: "Outstanding! This product exceeded my expectations. Will definitely buy again from SmrtMart."
                    }
                  ].map((review, index) => (
                    <div key={index} className="p-6 border border-primary-100 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-dark rounded-full flex items-center justify-center text-primary-950 text-sm font-semibold">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-primary-950">{review.name}</p>
                            <p className="text-xs text-primary-400">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? 'fill-accent text-accent' : 'text-primary-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-primary-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
