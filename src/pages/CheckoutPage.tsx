import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js'
import { useAuth } from '../features/auth/AuthContext'
import { StripePaymentForm } from '../features/checkout/StripePaymentForm'
import { stripeIsConfigured, stripePromise } from '../features/checkout/stripe'
import { userMessage } from '../services/api-client'
import { ordersApi } from '../services/orders-api'
import type { Checkout } from '../services/types'

export function CheckoutPage() {
  const { user, loading } = useAuth()
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <section className="page-state">Comprobando tu sesión…</section>

  if (!user) {
    return (
      <section className="page-state">
        <h1>Accede antes de continuar al pago.</h1>
        <Link className="button button-primary" to="/acceso">Acceder</Link>
      </section>
    )
  }

  async function startCheckout() {
    if (!stripeIsConfigured || !stripePromise) {
      setError('Configura VITE_STRIPE_PUBLISHABLE_KEY para habilitar el pago con Stripe.')
      return
    }

    setBusy(true)
    setError('')
    try {
      const result = await ordersApi.checkout()
      if (!result.clientSecret) {
        throw new Error('El servidor no ha devuelto los datos necesarios para iniciar el pago.')
      }
      setCheckout(result)
    } catch (cause) {
      setError(userMessage(cause))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="content-page checkout">
      <p className="eyebrow">Checkout</p>
      <h1>Finaliza tu pedido</h1>

      {!checkout && (
        <>
          <p>
            Al continuar, el servidor reservará el contenido de tu carrito y
            creará el pago de Stripe. El pedido sólo quedará confirmado cuando
            el webhook del servidor procese correctamente el pago.
          </p>

          {!stripeIsConfigured && (
            <p className="form-error" role="alert">
              Falta configurar <code>VITE_STRIPE_PUBLISHABLE_KEY</code>. Es la
              clave publicable de Stripe y nunca debe sustituirse por
              <code>STRIPE_SECRET_KEY</code>.
            </p>
          )}

          {error && stripeIsConfigured && (
            <p className="form-error" role="alert">{error}</p>
          )}

          <div className="cart-total">
            <Link className="button button-secondary" to="/carrito">Volver al carrito</Link>
            <button
              className="button button-primary"
              onClick={() => void startCheckout()}
              disabled={busy || !stripeIsConfigured}
            >
              {busy ? 'Preparando pago…' : 'Continuar al pago'}
            </button>
          </div>
        </>
      )}

      {checkout && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: checkout.clientSecret }}
        >
          <StripePaymentForm orderId={checkout.orderId} />
        </Elements>
      )}

      {checkout && (
        <p className="note">
          Pedido #{checkout.orderId}. Tras confirmar el pago, el estado final
          se mostrará en el detalle del pedido cuando el webhook del servidor
          lo procese.
        </p>
      )}
    </section>
  )
}
