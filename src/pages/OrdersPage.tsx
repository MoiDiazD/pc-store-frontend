import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ordersApi } from '../services/orders-api'
import { useAuth } from '../features/auth/AuthContext'
import { userMessage } from '../services/api-client'
import type { Order } from '../services/types'

const money = (value: string) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value))

export function OrdersPage() {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const [loadingOrders, setLoadingOrders] = useState(false)

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true)
    setError('')
    try {
      setOrders(await ordersApi.orders())
    } catch (cause) {
      setError(userMessage(cause))
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  useEffect(() => {
    if (user) void loadOrders()
  }, [user, loadOrders])

  if (loading) return <section className="page-state">Comprobando tu sesión…</section>

  if (!user) {
    return (
      <section className="page-state">
        <h1>Accede para consultar tus pedidos.</h1>
        <Link className="button button-primary" to="/acceso">Acceder</Link>
      </section>
    )
  }

  return (
    <section className="content-page">
      <p className="eyebrow">Tu historial</p>
      <h1>Mis pedidos</h1>

      {loadingOrders ? (
        <p>Cargando pedidos…</p>
      ) : error ? (
        <div className="empty">
          <p className="form-error" role="alert">{error}</p>
          <button onClick={() => void loadOrders()}>Reintentar</button>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty">
          <p>Aún no tienes pedidos.</p>
          <Link to="/catalogo">Ver catálogo</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <h2>Pedido #{order.id}</h2>
                <p>{new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
              </div>
              <span className={`status ${order.status}`}>{order.status}</span>
              <strong>{money(order.total)}</strong>
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>{item.quantity} × {item.productName} ({money(item.unitPrice)})</li>
                ))}
              </ul>
              <Link className="text-link" to={`/pedidos/${order.id}`}>Ver detalle</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
