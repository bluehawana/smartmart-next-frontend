import { create } from 'zustand'
import { persist, PersistOptions } from 'zustand/middleware'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isLoading: boolean
  addItem: (product: CartItem) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotal: () => number
}

type CartPersist = (
  config: StateCreator<CartStore>,
  options: PersistOptions<CartStore>
) => StateCreator<CartStore>

export const useCartStore = create<CartStore>()(
  (persist as CartPersist)(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      addItem: async (product: CartItem) => {
        set({ isLoading: true });
        try {
          // 调用后端 API
          const response = await fetch('http://localhost:8080/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product_id: product.id,
              quantity: 1,
              price: product.price,
              name: product.name
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Cart API Error Response:', errorText);
            throw new Error(errorText || 'Failed to add item to cart');
          }

          // 更新本地状态
          set((state) => {
            const existingItem = state.items.find(item => item.id === product.id);
            
            if (existingItem) {
              return {
                items: state.items.map(item =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                ),
                isLoading: false
              };
            }
            
            return {
              items: [...state.items, { ...product, quantity: 1 }],
              isLoading: false
            };
          });
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      removeItem: async (productId: number) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`http://localhost:8080/api/cart/${productId}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to remove item from cart');
          }

          set((state) => ({
            items: state.items.filter(item => item.id !== productId),
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      updateQuantity: async (productId: number, quantity: number) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`http://localhost:8080/api/cart/${productId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
          });

          if (!response.ok) {
            throw new Error('Failed to update cart item');
          }

          set((state) => ({
            items: state.items.map(item =>
              item.id === productId
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
            ).filter(item => item.quantity > 0),
            isLoading: false
          }));
        } catch (error) {
          console.error('Failed to update cart item:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      clearCart: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('http://localhost:8080/api/cart', {
            method: 'DELETE',
          });

          if (!response.ok) {
            throw new Error('Failed to clear cart');
          }

          set({ items: [], isLoading: false });
        } catch (error) {
          console.error('Failed to clear cart:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
      version: 1,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  )
); 

export async function testCartAPI() {
  try {
    const response = await fetch('http://localhost:8080/api/cart', {
      method: 'GET',
      credentials: 'include',
    });
    
    console.log('Cart API Test Response:', {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Cart Data:', data);
    }
  } catch (error) {
    console.error('Cart API Test Error:', error);
  }
}