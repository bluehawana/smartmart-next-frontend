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

interface BackendCartItem {
  id: number | string
  productId: number
  quantity: number
}

interface Product {
  id: string
  numeric_id: number
  name: string
  price: number
  images: string[]
  description: string
}

// Cache for product data to avoid repeated API calls
const productCache: Record<number, Product> = {}

// Fetch product data from API
async function fetchProductData(productId: number): Promise<Product | null> {
  if (productCache[productId]) {
    return productCache[productId]
  }

  try {
    const response = await fetch(`${API_BASE}/products/${productId}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product ${productId}`)
    }
    const result = await response.json()
    if (result.success && result.data) {
      productCache[productId] = result.data
      return result.data
    }
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error)
  }
  return null
}

// Convert product data to cart item format
function productToCartItem(product: Product, quantity: number, cartItemId?: string): CartItem {
  return {
    id: cartItemId || `local-${product.numeric_id}-${Date.now()}`,
    productId: product.numeric_id,
    name: product.name,
    price: product.price,
    quantity,
    image: product.images?.[0] || '',
    description: product.description
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
  fixCartItems: () => Promise<void>
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

          const items = await response.json() as BackendCartItem[]
          console.log('Cart data received:', items)

          // Only update if backend has items, otherwise keep local storage
          if (items && items.length > 0) {
            // Fetch product data for each cart item
            const cartItems = await Promise.all(
              items.map(async (item) => {
                const productData = await fetchProductData(item.productId)
                if (productData) {
                  return productToCartItem(productData, item.quantity, String(item.id))
                } else {
                  // Fallback for missing product data
                  return {
                    id: String(item.id),
                    productId: item.productId,
                    quantity: item.quantity,
                    name: `Product ${item.productId}`,
                    price: 0,
                    image: '',
                    description: ''
                  }
                }
              })
            )

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
          // Fetch fresh product data from API
          const productData = await fetchProductData(productId)
          if (!productData) {
            throw new Error(`Product ${productId} not found`)
          }

          // Add to local state immediately
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
                items: [...state.items, productToCartItem(productData, quantity)]
              }
            }

            console.log('New cart state after update:', newState.items)

            // Dispatch custom event to update cart count in header
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('cartUpdated'));
            }

            return { ...newState, isLoading: false }
          })

          // Try to sync with backend but don't fail if it errors
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

            if (response.ok) {
              console.log('Successfully synced with backend')
            }
          } catch (error) {
            console.log('Backend sync failed, but local cart updated:', error)
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to add to cart', isLoading: false })
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

      // Fix existing cart items with missing product data
      fixCartItems: async () => {
        const { items } = get()
        const itemsToFix = items.filter(item =>
          item.price === 0 || item.name.startsWith('Product ') || !item.image
        )

        if (itemsToFix.length === 0) return

        console.log('Fixing cart items:', itemsToFix)
        set({ isLoading: true })

        try {
          const fixedItems = await Promise.all(
            items.map(async (item) => {
              if (item.price === 0 || item.name.startsWith('Product ') || !item.image) {
                const productData = await fetchProductData(item.productId)
                if (productData) {
                  return productToCartItem(productData, item.quantity, item.id)
                }
              }
              return item
            })
          )

          set({ items: fixedItems, isLoading: false })
          console.log('Cart items fixed successfully')
        } catch (error) {
          console.error('Error fixing cart items:', error)
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: false,
      migrate: (persistedState: { items?: CartItem[] } | undefined) => {
        // Legacy migration - just return the state as is
        // The fixCartItems function will handle updating product data from API
        return persistedState
      },
      version: 3
    }
  )
)
