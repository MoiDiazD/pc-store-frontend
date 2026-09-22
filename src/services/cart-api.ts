import { apiRequest } from './api-client'
import type { Cart } from './types'
type CartItemMutation = { id: number; cartId: number; productId: number; quantity: number }
export const cartApi = {
  get: () => apiRequest<Cart>('/cart'),
  add: (productId: number, quantity: number) => apiRequest<CartItemMutation>('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  update: (productId: number, quantity: number) => apiRequest<CartItemMutation>(`/cart/items/${productId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  remove: (productId: number) => apiRequest<void>(`/cart/items/${productId}`, { method: 'DELETE' }),
}
