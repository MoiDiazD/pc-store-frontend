import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { CheckoutPage } from './CheckoutPage'

const mocks = vi.hoisted(() => ({
  auth: { user: { id: 1, name: 'Ada', email: 'ada@example.com', role: 'customer' }, loading: false },
  configured: true,
  checkout: vi.fn(),
}))
vi.mock('../features/auth/AuthContext', () => ({ useAuth: () => mocks.auth }))
vi.mock('../features/checkout/stripe', () => ({ get stripeIsConfigured() { return mocks.configured }, get stripePromise() { return mocks.configured ? Promise.resolve(null) : null } }))
vi.mock('../features/checkout/StripePaymentForm', () => ({ StripePaymentForm: ({ orderId }: { orderId: number }) => <p>Formulario Stripe para {orderId}</p> }))
vi.mock('@stripe/react-stripe-js', () => ({ Elements: ({ children, options }: { children: ReactNode; options: { clientSecret: string } }) => <div data-secret={options.clientSecret}>{children}</div> }))
vi.mock('../services/orders-api', () => ({ ordersApi: { checkout: mocks.checkout } }))

describe('CheckoutPage', () => {
  it('shows a configuration error without starting checkout when Stripe is unavailable', () => {
    mocks.configured = false
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>)
    expect(screen.getByRole('alert').textContent).toContain('VITE_STRIPE_PUBLISHABLE_KEY')
    expect(mocks.checkout).not.toHaveBeenCalled()
  })

  it('starts documented checkout and gives its client secret to Elements', async () => {
    mocks.configured = true
    mocks.checkout.mockResolvedValueOnce({ orderId: 42, paymentId: 8, provider: 'stripe', clientSecret: 'pi_secret' })
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }))
    await waitFor(() => expect(mocks.checkout).toHaveBeenCalledOnce())
    expect(screen.getByText('Formulario Stripe para 42')).toBeTruthy()
    expect(screen.getByText('Formulario Stripe para 42').parentElement?.getAttribute('data-secret')).toBe('pi_secret')
  })

  it('shows a checkout API failure instead of a fake successful payment', async () => {
    mocks.configured = true
    mocks.checkout.mockRejectedValueOnce(new Error('offline'))
    render(<MemoryRouter><CheckoutPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Continuar al pago' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('conectar'))
    expect(screen.queryByText(/Formulario Stripe/)).toBeNull()
  })
})
