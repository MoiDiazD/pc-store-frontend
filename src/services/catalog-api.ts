import { apiRequest } from './api-client'
import type { Brand, Category, Product } from './types'
export const catalogApi = {
  products: () => apiRequest<Product[]>('/products'),
  product: (id: number) => apiRequest<Product>(`/products/${id}`),
  brands: () => apiRequest<Brand[]>('/brands'),
  categories: () => apiRequest<Category[]>('/categories'),
  categoryProducts: (id: number) => apiRequest<Product[]>(`/categories/${id}/products`),
}
