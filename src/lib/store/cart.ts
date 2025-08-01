import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_BASE } from '../config'

interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  image: string
  description: string
}

// 产品数据映射 - Updated with correct product data
const PRODUCTS_MAP: Record<number, { name: string; price: number; image: string; description: string }> = {
  1: { 
    name: "Apple MacBook Pro 16-inch", 
    price: 2499, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg",
    description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals and creatives."
  },
  2: { 
    name: "AirPods Pro 2nd Generation", 
    price: 249, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/airpods2.jpg",
    description: "Apple AirPods Pro with Active Noise Cancellation, Transparency mode, and spatial audio."
  },
  3: { 
    name: "Sony WH-1000XM5 Headphones", 
    price: 399, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg",
    description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life."
  },
  4: { 
    name: "Dell Alienware 34 Curved Monitor", 
    price: 899, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg",
    description: "34-inch curved gaming monitor with 144Hz refresh rate, NVIDIA G-SYNC, and stunning WQHD resolution."
  },
  5: { 
    name: "Apple Watch Ultra", 
    price: 799, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg",
    description: "The most rugged and capable Apple Watch, designed for endurance athletes and outdoor adventurers."
  },
  6: { 
    name: "AI Translate Earphones Pro", 
    price: 199, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ai-translate-pro.jpg",
    description: "Revolutionary intelligent translate earphones with real-time translation in 40+ languages."
  },
  7: { 
    name: "Dell XPS 13 Laptop", 
    price: 1299, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/xps.jpg",
    description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM, 512GB SSD, and stunning InfinityEdge display."
  },
  8: { 
    name: "ASUS ROG Rapture GT-BE98 Gaming Router", 
    price: 8990, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/asus.jpg",
    description: "ASUS ROG Rapture GT-BE98 Quad-band Gaming Router with WiFi 7, advanced QoS, and ultra-low latency for competitive gaming."
  },
  9: { 
    name: "iPhone 15 Pro Max", 
    price: 1199, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/iphone.jpg",
    description: "The ultimate iPhone with titanium design, A17 Pro chip, and professional camera system."
  },
  10: { 
    name: "Smart Language Translator Buds", 
    price: 149, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/smart-translator.jpg",
    description: "Next-generation wireless earbuds with built-in AI translator. Supports conversation mode, offline translation for 12 languages, and crystal-clear audio quality."
  },
  11: { 
    name: "Dell XPS 15 Developer Edition", 
    price: 1899, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell-xps-15-2023.jpg",
    description: "Dell XPS 15 Developer Edition with Ubuntu, Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA GeForce RTX 4050. Perfect for developers and content creators."
  },
  10: { 
    name: "Smart Language Translator Buds", 
    price: 149, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/smart-translator.jpg",
    description: "Next-generation wireless earbuds with built-in AI translator. Supports conversation mode, offline translation for 12 languages, and crystal-clear audio quality."
  },
  11: { 
    name: "Dell XPS 15 Developer Edition", 
    price: 1899, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell-xps-15-2023.jpg",
    description: "Dell XPS 15 Developer Edition with Ubuntu, Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA GeForce RTX 4050. Perfect for developers and content creators."
  }
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  addToCart: (productId: number, quantity: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  fetchCart: () => Promise<void>
  getCartTotal: () => number
  getTotalPrice: () => number
  getCartItemsCount: () => number
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/cart`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const items = await response.json()
          console.log('Cart data received:', items)

          // Only update if backend has items, otherwise keep local storage
          if (items && items.length > 0) {
            // 转换后端数据格式为前端格式
            const cartItems = items.map((item: any) => ({
              id: String(item.id),
              productId: item.productId,
              quantity: item.quantity,
              ...PRODUCTS_MAP[item.productId] || {
                name: `Product ${item.productId}`,
                price: 0,
                image: 'default.jpg',
                description: ''
              }
            }))

            set({ items: cartItems, error: null })
          } else {
            // Backend is empty, keep existing local items
            console.log('Backend cart empty, keeping local cart items')
          }
        } catch (error) {
          console.error('Error fetching cart:', error)
          // Don't clear local items on API error, just log it
          console.log('API error, keeping local cart items')
          set({ error: error instanceof Error ? error.message : 'Failed to fetch cart' })
        } finally {
          set({ isLoading: false })
        }
      },

      getCartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },

      getCartItemsCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      addToCart: async (productId: number, quantity: number) => {
        console.log('Adding to cart:', productId, quantity)
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/cart/items`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ 
              productId: Number(productId),
              quantity: Number(quantity)
            })
          })

          if (!response.ok) {
            throw new Error(`Failed to add to cart: ${response.status}`)
          }

          const addedItem = await response.json()
          console.log('Added item response:', addedItem)

          // 更新本地状态
          set((state) => {
            console.log('Current cart state before update:', state.items)
            const existingItem = state.items.find(item => item.productId === productId)
            let newState;
            if (existingItem) {
              newState = {
                items: state.items.map(item => 
                  item.productId === productId 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                )
              }
            } else {
              newState = {
                items: [...state.items, {
                  id: String(addedItem.id || Date.now()),
                  productId,
                  quantity,
                  ...PRODUCTS_MAP[productId] || {
                    name: `Product ${productId}`,
                    price: 0,
                    image: '/placeholder-product.svg',
                    description: ''
                  }
                }]
              }
            }
            
            console.log('New cart state after update:', newState.items)
            
            // Dispatch custom event to update cart count in header
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
            
            return newState;
          })
        } catch (error) {
          console.error('Error adding to cart:', error)
          
          // Fallback: Add to local state only
          set((state) => {
            const existingItem = state.items.find(item => item.productId === productId)
            let newState;
            if (existingItem) {
              newState = {
                items: state.items.map(item => 
                  item.productId === productId 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
                error: null
              }
            } else {
              newState = {
                items: [...state.items, {
                  id: `local-${productId}-${Date.now()}`,
                  productId,
                  quantity,
                  ...PRODUCTS_MAP[productId] || {
                    name: `Product ${productId}`,
                    price: 0,
                    image: '/placeholder-product.svg',
                    description: ''
                  }
                }],
                error: null
              }
            }
            
            // Dispatch custom event to update cart count in header
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
            
            return newState;
          })
        } finally {
          set({ isLoading: false })
        }
      },

      removeFromCart: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/cart/items/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          
          if (!response.ok) {
            throw new Error(`Failed to remove item: ${response.status}`)
          }
          
          set(state => ({
            items: state.items.filter(item => item.id !== id)
          }))
        } catch (error) {
          console.error('Error removing from cart:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to remove from cart' })
        } finally {
          set({ isLoading: false })
        }
      },

      updateQuantity: async (id: string, quantity: number) => {
        if (quantity < 1) return
        
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/cart/items/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
          })
          
          if (!response.ok) {
            throw new Error(`Failed to update quantity: ${response.status}`)
          }
          
          set(state => ({
            items: state.items.map(item => 
              item.id === id ? { ...item, quantity } : item
            )
          }))
        } catch (error) {
          console.error('Error updating quantity:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update quantity' })
        } finally {
          set({ isLoading: false })
        }
      },

      clearCart: async () => {
        try {
          // 清空本地状态
          set({ items: [], error: null })
          
          // 同步到后端
          await fetch(`${API_BASE}/cart/clear`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          console.log('Cart cleared successfully')
        } catch (error) {
          console.error('Error clearing cart:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to clear cart' })
        }
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true
    }
  )
)