import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { StripePaymentForm } from './StripePaymentForm'

const { confirmPayment } = vi.hoisted(() => ({ confirmPayment: vi.fn() }))
vi.mock('@stripe/react-stripe-js', () => ({
  PaymentElement: () => <div data-testid="payment-element" />,
  useElements: () => ({ getElement: vi.fn() }),
  useStripe: () => ({ confirmPayment }),
}))

describe('StripePaymentForm', () => {
  it('confirms the Payment Element with a return URL for the order', async () => {
    confirmPayment.mockResolvedValue({})
    render(<MemoryRouter><StripePaymentForm orderId={88} /></MemoryRouter>)
    expect(screen.getByTestId('payment-element')).toBeTruthy()
    fireEvent.submit(screen.getByRole('button', { name: 'Confirmar y pagar' }).closest('form')!)
    await waitFor(() => expect(confirmPayment).toHaveBeenCalledWith(expect.objectContaining({ confirmParams: { return_url: `${window.location.origin}/pedidos/88?pago=en-proceso` } })))
  })

  it('does not claim success when Stripe returns a confirmation error', async () => {
    confirmPayment.mockResolvedValue({ error: { message: 'declined' } })
    render(<MemoryRouter><StripePaymentForm orderId={88} /></MemoryRouter>)
    fireEvent.submit(screen.getByRole('button', { name: 'Confirmar y pagar' }).closest('form')!)
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('No se pudo confirmar el pago'))
  })
})
