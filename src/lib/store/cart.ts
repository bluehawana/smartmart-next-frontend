import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
    price: 3499.99, 
    image: "macbook.jpg",
    description: "The most powerful MacBook Pro ever with M2 Pro or M2 Max chip for unprecedented performance and up to 22 hours of battery life."
  },
  2: { 
    name: "Apple AirPods Pro", 
    price: 249.99, 
    image: "airpods2.jpg",
    description: "AirPods Pro feature Active Noise Cancellation, Transparency mode, and Personalized Spatial Audio for immersive sound."
  },
  3: { 
    name: "Sony WH-1000XM5", 
    price: 399.99, 
    image: "sony.jpg",
    description: "Industry-leading noise cancellation with two processors and eight microphones for crystal clear audio quality."
  },
  4: { 
    name: "Dell XPS 13", 
    price: 1299.99, 
    image: "xps.jpg",
    description: "The smallest 13-inch laptop with InfinityEdge display and 12th Gen Intel Core processors for ultimate performance."
  },
  5: { 
    name: "Dell Alienware 34", 
    price: 999.99, 
    image: "dell.jpg",
    description: "34-inch curved QD-OLED gaming monitor with 175Hz refresh rate and true 0.1ms response time for immersive gaming."
  },
  6: { 
    name: "Apple Watch Ultra", 
    price: 799.99, 
    image: "ultra.jpg",
    description: "The most rugged and capable Apple Watch with precision dual-frequency GPS and up to 36 hours of battery life."
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
          const response = await fetch('/api/cart', {
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

      getCartItemsCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      addToCart: async (productId: number, quantity: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch('/api/cart/items', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              productId: Number(productId),
              quantity: Number(quantity)
            })
          })
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error('Add to cart error:', errorText)
            throw new Error(`Failed to add to cart: ${response.status}`)
          }

          const addedItem = await response.json()
          const productInfo = PRODUCTS_MAP[productId]

          if (productInfo) {
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
                    id: String(addedItem.id),
                    productId,
                    quantity,
                    ...productInfo
                  }]
                }
              }
            })
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to add to cart' })
        } finally {
          set({ isLoading: false })
        }
      },

      removeFromCart: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`/api/cart/items/${id}`, {
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
          const response = await fetch(`/api/cart/items/${id}`, {
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

      clearCart: () => {
        try {
          // 清空本地状态
          set({ items: [], error: null })
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