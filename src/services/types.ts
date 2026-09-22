export type Role = 'customer' | 'worker' | 'manager'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: number
  name: string
  model: string
  description: string | null
  price: string
  stock: number
  brandId: number
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface Brand { id: number; name: string; createdAt: string; updatedAt: string; deletedAt?: string | null }
export interface Category { id: number; name: string; createdAt: string; updatedAt: string; deletedAt?: string | null }
export interface CartItem { product: Pick<Product, 'id' | 'name' | 'model' | 'description' | 'price' | 'stock'>; quantity: number }
export interface Cart { id: number; items: CartItem[]; createdAt: string; updatedAt: string }
export interface OrderItem { id: number; orderId: number; productId: number; productName: string; productModel: string; quantity: number; unitPrice: string }
export interface Order { id: number; userId: number; status: 'pending' | 'confirmed' | 'cancelled'; total: string; createdAt: string; updatedAt: string; expiresAt: string | null; items: OrderItem[] }
export interface Checkout { orderId: number; paymentId: number; provider: 'stripe'; clientSecret: string }
