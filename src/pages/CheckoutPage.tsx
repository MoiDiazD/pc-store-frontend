import { Elements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { StripePaymentForm } from '../features/checkout/StripePaymentForm'
import { stripeIsConfigured, stripePromise } from '../features/checkout/stripe'
import { useAuth } from '../features/auth/AuthContext'
import { userMessage } from '../services/api-client'
import { ordersApi } from '../services/orders-api'
import type { Checkout } from '../services/types'

export function CheckoutPage() {
  const { user, loading } = useAuth()
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function startCheckout() {
    setBusy(true); setError('')
    try { setCheckout(await ordersApi.checkout()) } catch (cause) { setError(userMessage(cause)) } finally { setBusy(false) }
  }
  if (!loading && !user) return <section className="page-state"><h1>Accede antes de continuar al pago.</h1><Link className="button button-primary" to="/acceso">Acceder</Link></section>
  if (loading) return <section className="page-state">Comprobando tu sesión…</section>
  if (!stripeIsConfigured || !stripePromise) return <section className="content-page checkout"><p className="eyebrow">Checkout</p><h1>Finaliza tu pedido</h1><p className="form-error" role="alert">El pago no está configurado para este entorno. Falta la variable <code>VITE_STRIPE_PUBLISHABLE_KEY</code>.</p><p>Vuelve al carrito o solicita la configuración de la clave publicable de Stripe. Nunca se usa una clave secreta en el navegador.</p><Link className="button button-primary" to="/carrito">Volver al carrito</Link></section>
  return <section className="content-page checkout"><p className="eyebrow">Checkout</p><h1>Finaliza tu pedido</h1>{error && <p className="form-error" role="alert">{error}</p>}{!checkout ? <><p>Revisaremos el stock y prepararemos el pago seguro con Stripe.</p><button className="button button-primary" onClick={() => void startCheckout()} disabled={busy}>{busy ? 'Preparando pago…' : 'Continuar al pago'}</button><p className="note">No se mostrará un pedido como completado hasta que Stripe y el webhook del backend lo confirmen.</p></> : <Elements stripe={stripePromise} options={{ clientSecret: checkout.clientSecret }}><StripePaymentForm orderId={checkout.orderId} /></Elements>}</section>
}
