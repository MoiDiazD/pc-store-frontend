import { apiRequest } from './api-client'
import type { Brand, Category, Product } from './types'
export const catalogApi = {
  products: () => apiRequest<Product[]>('/products'),
  product: (id: number) => apiRequest<Product>(`/products/${id}`),
  brands: () => apiRequest<Brand[]>('/brands'),
  categories: () => apiRequest<Category[]>('/categories'),
  categoryProducts: (id: number) => apiRequest<Product[]>(`/categories/${id}/products`),
  createProduct: (input: ProductInput) => apiRequest<Product>('/products', { method: 'POST', body: JSON.stringify(input) }),
  updateProduct: (id: number, input: Partial<ProductInput>) => apiRequest<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  deleteProduct: (id: number) => apiRequest<Product>(`/products/${id}`, { method: 'DELETE' }),
  restoreProduct: (id: number) => apiRequest<Product>(`/products/${id}/restore`, { method: 'PATCH' }),
  createBrand: (name: string) => apiRequest<Brand>('/brands', { method: 'POST', body: JSON.stringify({ name }) }),
  updateBrand: (id: number, name: string) => apiRequest<Brand>(`/brands/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
  deleteBrand: (id: number) => apiRequest<Brand>(`/brands/${id}`, { method: 'DELETE' }),
  restoreBrand: (id: number) => apiRequest<Brand>(`/brands/${id}/restore`, { method: 'PATCH' }),
  createCategory: (name: string) => apiRequest<Category>('/categories', { method: 'POST', body: JSON.stringify({ name }) }),
  updateCategory: (id: number, name: string) => apiRequest<Category>(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
  deleteCategory: (id: number) => apiRequest<Category>(`/categories/${id}`, { method: 'DELETE' }),
  restoreCategory: (id: number) => apiRequest<Category>(`/categories/${id}/restore`, { method: 'PATCH' }),
  addProductToCategory: (categoryId: number, productId: number) => apiRequest<void>(`/categories/${categoryId}/products/${productId}`, { method: 'POST' }),
  removeProductFromCategory: (categoryId: number, productId: number) => apiRequest<void>(`/categories/${categoryId}/products/${productId}`, { method: 'DELETE' }),
}

export type ProductInput = Pick<Product, 'name' | 'model' | 'price' | 'stock' | 'brandId'> & { description?: string }
