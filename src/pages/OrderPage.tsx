import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { userMessage } from '../services/api-client'
import { ordersApi } from '../services/orders-api'
import type { Order } from '../services/types'

const money = (value: string) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value))

export function OrderPage() {
  const { user, loading } = useAuth()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const loadOrder = useCallback(async (showLoading = true) => {
    if (!id) return
    if (showLoading) setRefreshing(true)
    setError('')
    try {
      setOrder(await ordersApi.order(Number(id)))
    } catch (cause) {
      setError(userMessage(cause))
    } finally {
      if (showLoading) setRefreshing(false)
    }
  }, [id])

  useEffect(() => {
    if (user && id) void loadOrder()
  }, [user, id, loadOrder])

  const waitingForPayment = searchParams.get('pago') === 'en-proceso'

  useEffect(() => {
    if (!waitingForPayment || !order || order.status !== 'pending') return

    const interval = window.setInterval(() => {
      void loadOrder(false)
    }, 2000)

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval)
    }, 30000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [waitingForPayment, order?.status, loadOrder])

  if (loading) return <section className="page-state">Comprobando tu sesión…</section>

  if (!user) {
    return (
      <section className="page-state">
        <h1>Accede para ver el pedido.</h1>
        <Link className="button button-primary" to="/acceso">Acceder</Link>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-state">
        <p className="form-error" role="alert">{error}</p>
        <button onClick={() => void loadOrder()}>Reintentar</button>
        <Link to="/pedidos">Volver a pedidos</Link>
      </section>
    )
  }

  if (!order) return <section className="page-state">Cargando pedido…</section>

  return (
    <section className="content-page order-detail">
      <Link className="back-link" to="/pedidos">← Mis pedidos</Link>
      <p className="eyebrow">Pedido #{order.id}</p>
      <h1>Detalle del pedido</h1>

      <p>
        <span className={`status ${order.status}`}>{order.status}</span>
        {' · '}
        {new Date(order.createdAt).toLocaleString('es-ES')}
      </p>

      {waitingForPayment && order.status === 'pending' && (
        <div className="note">
          <p>El pago se ha enviado a Stripe. Estamos esperando la confirmación del webhook del servidor.</p>
          <button className="button button-secondary" onClick={() => void loadOrder()} disabled={refreshing}>
            {refreshing ? 'Actualizando…' : 'Actualizar estado'}
          </button>
        </div>
      )}

      {order.status === 'pending' && order.expiresAt && (
        <p className="note">
          Este pedido está pendiente de pago hasta {new Date(order.expiresAt).toLocaleString('es-ES')}.
        </p>
      )}

      {order.status === 'confirmed' && waitingForPayment && (
        <p className="success" role="status">El servidor ha confirmado el pedido.</p>
      )}

      {order.items.length === 0 ? (
        <p className="empty">Este pedido no contiene artículos.</p>
      ) : (
        <div className="order-items">
          {order.items.map((item) => (
            <article key={item.id}>
              <div>
                <h2>{item.productName}</h2>
                <p>{item.productModel}</p>
              </div>
              <span>{item.quantity} × {money(item.unitPrice)}</span>
              <strong>{money((Number(item.unitPrice) * item.quantity).toFixed(2))}</strong>
            </article>
          ))}
        </div>
      )}

      <div className="cart-total">
        <strong>Total: {money(order.total)}</strong>
      </div>
    </section>
  )
}
