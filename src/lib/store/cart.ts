import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { API_BASE } from '../config'

type ProductIdentifier = string

export interface CartItem {
  id: string
  productId: ProductIdentifier
  name: string
  price: number
  quantity: number
  image: string
  description: string
  comparePrice?: number
}

interface CartItemDetails {
  name: string
  price: number
  image: string
  description: string
  comparePrice?: number
}

export type CartItemDetailsInput = Partial<CartItemDetails>

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  addToCart: (productId: string | number, quantity: number, details?: CartItemDetailsInput) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  fetchCart: () => Promise<void>
  refreshItemDetails: () => Promise<void>
  getCartTotal: () => number
  getTotalPrice: () => number
  getCartItemsCount: () => number
  clearCart: () => void
}

const FALLBACK_IMAGE = '/placeholder-product.svg'

const productDetailsCache: Record<ProductIdentifier, CartItemDetails> = {}

const buildFallbackDetails = (productId: ProductIdentifier): CartItemDetails => ({
  name: `Product ${productId}`,
  price: 0,
  image: FALLBACK_IMAGE,
  description: '',
})

const sanitizeCartItemDetails = (
  productId: ProductIdentifier,
  details?: CartItemDetailsInput
): CartItemDetails => {
  const fallback = buildFallbackDetails(productId)
  if (!details) return fallback

  const sanitized: CartItemDetails = {
    name: typeof details.name === 'string' && details.name.trim() ? details.name.trim() : fallback.name,
    price: typeof details.price === 'number' && Number.isFinite(details.price) ? details.price : fallback.price,
    image: typeof details.image === 'string' && details.image ? details.image : fallback.image,
    description: typeof details.description === 'string' && details.description ? details.description : fallback.description,
  }

  if (typeof details.comparePrice === 'number' && Number.isFinite(details.comparePrice)) {
    sanitized.comparePrice = details.comparePrice
  }

  return sanitized
}

const normalizeProductId = (raw: number | string): ProductIdentifier => {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? String(raw) : ''
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (trimmed) return trimmed
  }

  return ''
}

const hasMeaningfulDetails = (
  productId: ProductIdentifier,
  details: CartItemDetails
) => {
  const fallback = buildFallbackDetails(productId)
  return (
    details.name !== fallback.name ||
    details.price !== fallback.price ||
    details.image !== fallback.image ||
    details.description !== fallback.description ||
    details.comparePrice !== fallback.comparePrice
  )
}

async function fetchProductDetails(productId: ProductIdentifier): Promise<CartItemDetails | null> {
  if (!productId) return null

  if (productDetailsCache[productId]) {
    return productDetailsCache[productId]
  }

  const candidates: ProductIdentifier[] = [productId]
  const numericCandidate = Number(productId)
  if (Number.isFinite(numericCandidate)) {
    const numericId = String(numericCandidate)
    if (!candidates.includes(numericId)) {
      candidates.push(numericId)
    }
  }

  for (const candidate of candidates) {
    try {
      const url = `${API_BASE}/products/${encodeURIComponent(candidate)}`
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      })

      if (!response.ok) {
        continue
      }

      const payload = await response.json()
      const product =
        payload?.data ??
        payload?.product ??
        (payload?.success && payload?.data ? payload.data : null)

      if (!product) {
        continue
      }

      const images = Array.isArray(product.images) ? product.images : []
      const fallback = buildFallbackDetails(productId)
      const details: CartItemDetails = {
        name: typeof product.name === 'string' && product.name ? product.name : fallback.name,
        price: Number(product.price) || fallback.price,
        image: typeof product.image === 'string' && product.image
          ? product.image
          : images.length > 0
            ? images[0]
            : fallback.image,
        description: typeof product.description === 'string' ? product.description : fallback.description,
      }

      if (product.compare_price !== undefined) {
        const comparePriceNumber = Number(product.compare_price)
        if (Number.isFinite(comparePriceNumber)) {
          details.comparePrice = comparePriceNumber
        }
      }

      productDetailsCache[productId] = details
      return details
    } catch (error) {
      console.error(`Error fetching product ${candidate} for cart:`, error)
    }
  }

  return null
}

async function resolveCartItemDetails(
  productId: ProductIdentifier,
  provided?: CartItemDetailsInput
): Promise<CartItemDetails> {
  const sanitized = sanitizeCartItemDetails(productId, provided)
  if (hasMeaningfulDetails(productId, sanitized)) {
    productDetailsCache[productId] = sanitized
    return sanitized
  }

  const fetched = await fetchProductDetails(productId)
  if (fetched) {
    return fetched
  }

  return sanitized
}

// Helper to consolidate duplicate items by productId
const consolidateCartItems = (items: CartItem[]): CartItem[] => {
  const consolidated = items.reduce((acc, item) => {
    const existing = acc.find(i => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as CartItem[]);
  return consolidated;
};

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
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const rawItems = await response.json()

          if (Array.isArray(rawItems) && rawItems.length > 0) {
            const cartItems = await Promise.all(
              rawItems.map(async (item: any) => {
                const rawProductId =
                  item.productId ??
                  item.product_id ??
                  item.product_id ??
                  item.id ??
                  ''
                const productId =
                  normalizeProductId(rawProductId) ||
                  `unknown-${Date.now()}`

                const quantityValue = Number(item.quantity)
                const quantity =
                  Number.isFinite(quantityValue) && quantityValue > 0
                    ? quantityValue
                    : 1

                const providedDetails: CartItemDetailsInput | undefined = item.product
                  ? (() => {
                      const priceNumber = Number(item.product.price)
                      const comparePriceRaw = item.product.compare_price
                      const comparePriceNumber = Number(comparePriceRaw)
                      const imageFromArray = Array.isArray(item.product.images) && item.product.images.length > 0
                        ? item.product.images[0]
                        : undefined

                      const details: CartItemDetailsInput = {
                        name: item.product.name,
                        price: Number.isFinite(priceNumber) ? priceNumber : undefined,
                        description: item.product.description,
                        image: imageFromArray || item.product.image,
                      }

                      if (Number.isFinite(comparePriceNumber)) {
                        details.comparePrice = comparePriceNumber
                      }

                      return details
                    })()
                  : undefined

                const details = await resolveCartItemDetails(
                  productId,
                  providedDetails
                )

                return {
                  id: String(item.id ?? `${productId}-${Date.now()}`),
                  productId,
                  quantity,
                  ...details,
                } as CartItem
              })
            )

            // Consolidate any duplicate items
            const consolidatedItems = consolidateCartItems(cartItems);
            set({ items: consolidatedItems, error: null })
          } else {
            console.log('Backend cart empty, keeping local cart items')
          }
        } catch (error) {
          console.error('Error fetching cart:', error)
          console.log('API error, keeping local cart items')
          set({
            error:
              error instanceof Error ? error.message : 'Failed to fetch cart',
          })
        } finally {
          set({ isLoading: false })
        }
      },

      getCartTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getCartItemsCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      addToCart: async (productIdInput, quantityInput, detailsInput) => {
        let productId = normalizeProductId(productIdInput)
        if (!productId) {
          productId =
            typeof productIdInput === 'string' && productIdInput.trim()
              ? productIdInput.trim()
              : `custom-${Date.now()}`
        }

        const quantityParsed = Number(quantityInput)
        const quantity =
          Number.isFinite(quantityParsed) && quantityParsed > 0
            ? Math.floor(quantityParsed)
            : 1

        set({ isLoading: true, error: null })

        try {
          const details = await resolveCartItemDetails(productId, detailsInput)

          set((state) => {
            const existingItem = state.items.find(
              (item) => item.productId === productId
            )

            if (existingItem) {
              const updatedItems = state.items.map((item) =>
                item.productId === productId
                  ? {
                      ...item,
                      ...details,
                      quantity: item.quantity + quantity,
                    }
                  : item
              )

              return { items: updatedItems, isLoading: false }
            }

            const newItem: CartItem = {
              id: `local-${productId}-${Date.now()}`,
              productId,
              quantity,
              ...details,
            }

            return {
              items: [...state.items, newItem],
              isLoading: false,
            }
          })

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cartUpdated'))
          }

          const numericProductId = Number(productId)
          if (Number.isFinite(numericProductId)) {
            try {
              const response = await fetch(`${API_BASE}/cart/items`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  productId: numericProductId,
                  quantity,
                }),
              })

              if (response.ok) {
                console.log('Successfully synced with backend')
              }
            } catch (error) {
              console.log('Backend sync failed, but local cart updated:', error)
            }
          }
        } catch (error) {
          console.error('Error adding to cart:', error)
          const errorMessage = error instanceof Error
            ? error.message
            : 'Failed to add item to cart'
          set({
            error: errorMessage,
            isLoading: false,
          })
          // Re-throw so the component can catch and handle the error
          throw new Error(errorMessage)
        }
      },

      removeFromCart: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE}/cart/items/${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error(`Failed to remove item: ${response.status}`)
          }

          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }))

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cartUpdated'))
          }
        } catch (error) {
          console.error('Error removing from cart:', error)
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to remove from cart',
          })
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
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
          })

          if (!response.ok) {
            throw new Error(`Failed to update quantity: ${response.status}`)
          }

          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          }))

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cartUpdated'))
          }
        } catch (error) {
          console.error('Error updating quantity:', error)
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to update quantity',
          })
        } finally {
          set({ isLoading: false })
        }
      },

      refreshItemDetails: async () => {
        const { items } = get()
        if (!items.length) return

        const candidates = items.filter((item) => !hasMeaningfulDetails(item.productId, item))
        if (!candidates.length) return

        const updates = await Promise.all(
          candidates.map(async (item) => {
            const details = await resolveCartItemDetails(item.productId)
            return { productId: item.productId, details }
          })
        )

        set((state) => ({
          items: state.items.map((item) => {
            const update = updates.find((u) => u.productId === item.productId)
            return update ? { ...item, ...update.details } : item
          }),
        }))
      },

      clearCart: async () => {
        try {
          set({ items: [], error: null })
          await fetch(`${API_BASE}/cart/clear`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cartUpdated'))
          }

          console.log('Cart cleared successfully')
        } catch (error) {
          console.error('Error clearing cart:', error)
          set({
            error:
              error instanceof Error
                ? error.message
                : 'Failed to clear cart',
          })
        }
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: false,
      // Consolidate items when loading from storage
      onRehydrateStorage: () => (state) => {
        if (state?.items && state.items.length > 0) {
          state.items = consolidateCartItems(state.items);
        }
      },
    }
  )
)
