import { describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest, userMessage } from './api-client'
import { authApi } from './auth-api'
import { cartApi } from './cart-api'

describe('apiRequest', () => {
  it('sends JSON requests with session credentials', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 4 }), { headers: { 'content-type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)
    await expect(apiRequest<{ id: number }>('/cart', { method: 'POST', body: JSON.stringify({ productId: 4 }) })).resolves.toEqual({ id: 4 })
    expect(fetchMock).toHaveBeenCalledWith('/api/cart', expect.objectContaining({ credentials: 'include', headers: expect.objectContaining({ 'Content-Type': 'application/json' }) }))
  })

  it('turns HTTP validation errors into ApiError and safe UI messages', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: ['Stock insuficiente'] }), { status: 400, headers: { 'content-type': 'application/json' } })))
    await expect(apiRequest('/cart/items')).rejects.toMatchObject({ status: 400, message: 'Stock insuficiente' })
    expect(userMessage(new ApiError(500, 'database trace'))).toBe('El servidor ha tenido un problema. Inténtalo más tarde.')
    expect(userMessage(new ApiError(401))).toBe('Tu sesión no es válida. Accede de nuevo para continuar.')
  })

  it('uses the documented login, logout and cart mutation endpoints', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 1, name: 'Ada', email: 'ada@example.com', role: 'customer' }), { headers: { 'content-type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: 2, cartId: 1, productId: 5, quantity: 3 }), { headers: { 'content-type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)
    await authApi.login({ email: 'ada@example.com', password: 'password123' })
    await authApi.logout()
    await cartApi.update(5, 3)
    expect(fetchMock.mock.calls.map(([url, init]) => [url, init.method])).toEqual([
      ['/api/auth/login', 'POST'], ['/api/auth/logout', 'POST'], ['/api/cart/items/5', 'PATCH'],
    ])
  })
})
