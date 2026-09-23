import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { OrderPage } from './OrderPage'
import { OrdersPage } from './OrdersPage'

const mocks = vi.hoisted(() => ({
  auth: { user: { id: 1, name: 'Ada', email: 'ada@example.com', role: 'customer' }, loading: false },
  orders: vi.fn(), order: vi.fn(),
}))
vi.mock('../features/auth/AuthContext', () => ({ useAuth: () => mocks.auth }))
vi.mock('../services/orders-api', () => ({ ordersApi: { orders: mocks.orders, order: mocks.order } }))

const order = { id: 9, userId: 1, status: 'confirmed' as const, total: '20.00', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', expiresAt: null, items: [{ id: 1, orderId: 9, productId: 3, productName: 'GPU', productModel: 'X', quantity: 1, unitPrice: '20.00' }] }
const deferred = <T,>() => { let resolve!: (value: T) => void; const promise = new Promise<T>((done) => { resolve = done }); return { promise, resolve } }

describe('order pages', () => {
  it('shows order-list loading, empty, error and populated states', async () => {
    const pending = deferred<Array<typeof order>>()
    mocks.orders.mockReturnValueOnce(pending.promise)
    const view = render(<MemoryRouter><OrdersPage /></MemoryRouter>)
    expect(screen.getByText('Cargando pedidos…')).toBeTruthy()
    pending.resolve([])
    await waitFor(() => expect(screen.getByText('Aún no tienes pedidos.')).toBeTruthy())
    view.unmount()
    mocks.orders.mockRejectedValueOnce(new Error('offline'))
    render(<MemoryRouter><OrdersPage /></MemoryRouter>)
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('conectar'))
  })

  it('renders an order detail and its backend status', async () => {
    mocks.order.mockResolvedValueOnce(order)
    render(<MemoryRouter initialEntries={['/pedidos/9']}><Routes><Route path="/pedidos/:id" element={<OrderPage />} /></Routes></MemoryRouter>)
    expect(screen.getByText('Cargando pedido…')).toBeTruthy()
    await waitFor(() => expect(screen.getByText('Pedido #9')).toBeTruthy())
    expect(screen.getByText('confirmed')).toBeTruthy()
    expect(screen.getByText('GPU')).toBeTruthy()
  })

  it('renders pending, confirmed and cancelled statuses returned by the backend', async () => {
    mocks.orders.mockResolvedValueOnce([{ ...order, id: 1, status: 'pending' as const }, { ...order, id: 2, status: 'confirmed' as const }, { ...order, id: 3, status: 'cancelled' as const }])
    render(<MemoryRouter><OrdersPage /></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('pending')).toBeTruthy())
    expect(screen.getByText('confirmed')).toBeTruthy()
    expect(screen.getByText('cancelled')).toBeTruthy()
  })

  it('shows an error when the order cannot be read', async () => {
    mocks.order.mockRejectedValueOnce(new Error('offline'))
    render(<MemoryRouter initialEntries={['/pedidos/9']}><Routes><Route path="/pedidos/:id" element={<OrderPage />} /></Routes></MemoryRouter>)
    await waitFor(() => expect(screen.getByText('No se ha podido conectar con el servidor. Inténtalo de nuevo.')).toBeTruthy())
  })
})
