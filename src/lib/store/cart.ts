import { create } from 'zustand'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getCartTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addToCart: (item, quantity) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id)
      
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        }
      }
      
      return {
        items: [...state.items, { ...item, quantity }],
      }
    })
  },
  
  removeFromCart: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },
  
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }))
  },
  
  getCartTotal: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
}))