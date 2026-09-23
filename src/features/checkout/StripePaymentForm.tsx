import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

type StripePaymentFormProps = { orderId: number }

export function StripePaymentForm({ orderId }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!stripe || !elements) return
    setBusy(true)
    setError('')
    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/pedidos/${orderId}?pago=en-proceso` },
      })
      if (result.error) {
        setError('No se pudo confirmar el pago. Revisa los datos de pago e inténtalo de nuevo.')
        setBusy(false)
        return
      }
      // Redirect-based methods navigate to return_url. For a non-redirect result,
      // the backend webhook remains responsible for the final order state.
      navigate(`/pedidos/${orderId}?pago=en-proceso`)
    } catch {
      setError('No se pudo confirmar el pago. Revisa los datos de pago e inténtalo de nuevo.')
      setBusy(false)
    }
  }

  return <form className="form-card payment-form" onSubmit={submit}>
    <h2>Pago seguro</h2>
    <PaymentElement options={{ layout: 'tabs' }} />
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary" disabled={!stripe || !elements || busy}>
      {busy ? 'Confirmando pago…' : 'Confirmar y pagar'}
    </button>
    <p className="note">Stripe procesa el pago. El pedido sólo se confirma cuando el webhook del servidor actualiza su estado.</p>
  </form>
}
