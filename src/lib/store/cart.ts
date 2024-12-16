import { create } from 'zustand'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// 后端返回的购物车数据格式
interface CartResponse {
  id: number
  userId: number
  items: Array<{
    id: number
    productId: number
    quantity: number
  }>
}

// 前端使用的购物车项目格式
interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  image: string
}

// 产品数据映射
const PRODUCTS_MAP: Record<number, { name: string; price: number; image: string }> = {
  1: { name: "Apple MacBook Pro 16-inch", price: 3499.99, image: "macbook.jpg" },
  2: { name: "Apple AirPods Pro", price: 249.99, image: "airpods2.jpg" },
  3: { name: "Sony WH-1000XM5", price: 399.99, image: "sony.jpg" },
  4: { name: "Dell XPS 13", price: 1299.99, image: "xps.jpg" },
  5: { name: "Dell Alienware 34", price: 999.99, image: "dell.jpg" },
  6: { name: "Apple Watch Ultra", price: 799.99, image: "ultra.jpg" },
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
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  getCartTotal: () => {
    const { items } = get()
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  getCartItemsCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.quantity, 0)
  },

  fetchCart: async () => {
    if (typeof window === 'undefined') return

    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: CartResponse = await response.json()
      
      // 转换后端数据格式为前端格式
      const cartItems = data.items.map(item => ({
        id: item.id.toString(),
        productId: item.productId,
        quantity: item.quantity,
        ...PRODUCTS_MAP[item.productId] || {
          name: `Product ${item.productId}`,
          price: 0,
          image: 'default.jpg'
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

  addToCart: async (productId: number, quantity: number) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }
      
      // 刷新购物车数据
      await get().fetchCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to add to cart' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  removeFromCart: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_BASE_URL}/cart/items/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to remove from cart')
      }
      
      // 成功后更新本地状态
      const { items } = get()
      set({ 
        items: items.filter(item => item.id !== id),
        error: null 
      })

      // 然后再刷新购物车数据
      await get().fetchCart()
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
      const response = await fetch(`${API_BASE_URL}/cart/items/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ quantity })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || 'Failed to update quantity')
      }
      
      // 成功后更新本地状态
      const { items } = get()
      set({
        items: items.map(item => 
          item.id === id ? { ...item, quantity } : item
        ),
        error: null
      })

      // 然后再刷新购物车数据
      await get().fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to update quantity' })
    } finally {
      set({ isLoading: false })
    }
  }
}))