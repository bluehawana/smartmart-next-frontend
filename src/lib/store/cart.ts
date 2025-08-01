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

// 产品数据映射
const PRODUCTS_MAP: Record<number, { name: string; price: number; image: string; description: string }> = {
  1: { 
    name: "Apple MacBook Pro 16-inch", 
    price: 2499.99, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/macbook.jpg",
    description: "Apple MacBook Pro 16-inch with M3 Pro chip, 18GB RAM, 512GB SSD. Perfect for professionals and creatives."
  },
  2: { 
    name: "Apple AirPods Pro 2nd Generation", 
    price: 249.99, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/airpods2.jpg",
    description: "Apple AirPods Pro with Active Noise Cancellation, Transparency mode, and spatial audio."
  },
  3: { 
    name: "Sony WH-1000XM5 Headphones", 
    price: 399.99, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/sony.jpg",
    description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life."
  },
  4: { 
    name: "Dell XPS 13 Laptop", 
    price: 1299.99, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/xps.jpg",
    description: "Ultra-portable Dell XPS 13 with Intel Core i7, 16GB RAM, 512GB SSD, and stunning InfinityEdge display."
  },
  5: { 
    name: "Dell Alienware 34 Curved Monitor", 
    price: 899.99, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/dell.jpg",
    description: "34-inch curved gaming monitor with 144Hz refresh rate, NVIDIA G-SYNC, and stunning WQHD resolution."
  },
  6: { 
    name: "Apple Watch Ultra", 
    price: 799.99, 
    image: "https://mqkoydypybxgcwxioqzc.supabase.co/storage/v1/object/public/products/ultra.jpg",
    description: "The most rugged and capable Apple Watch, designed for endurance athletes and outdoor adventurers."
  },
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
        } catch (error) {
          console.error('Error fetching cart:', error)
          set({ items: [], error: error instanceof Error ? error.message : 'Failed to fetch cart' })
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
            const existingItem = state.items.find(item => item.productId === productId)
            if (existingItem) {
              return {
                items: state.items.map(item => 
                  item.productId === productId 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                )
              }
            } else {
              return {
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
          })
        } catch (error) {
          console.error('Error adding to cart:', error)
          
          // Fallback: Add to local state only
          set((state) => {
            const existingItem = state.items.find(item => item.productId === productId)
            if (existingItem) {
              return {
                items: state.items.map(item => 
                  item.productId === productId 
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
                ),
                error: null
              }
            } else {
              return {
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