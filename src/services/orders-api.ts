import { apiRequest } from './api-client'
import type { Checkout, Order } from './types'
export const ordersApi = { checkout: () => apiRequest<Checkout>('/orders/checkout', { method: 'POST' }), orders: () => apiRequest<Order[]>('/orders'), order: (id: number) => apiRequest<Order>(`/orders/${id}`) }
