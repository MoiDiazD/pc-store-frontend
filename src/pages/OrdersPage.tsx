import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { userMessage } from '../services/api-client'
import { ordersApi } from '../services/orders-api'
import type { Order } from '../services/types'

const money = (value: string) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value))

export function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!user) return
    setLoading(true); setError('')
    ordersApi.orders().then(setOrders).catch((cause) => setError(userMessage(cause))).finally(() => setLoading(false))
  }, [user])
  if (!authLoading && !user) return <section className="page-state"><h1>Accede para consultar tus pedidos.</h1><Link className="button button-primary" to="/acceso">Acceder</Link></section>
  return <section className="content-page"><p className="eyebrow">Tu historial</p><h1>Mis pedidos</h1>
    {authLoading || loading ? <p>Cargando pedidos…</p> : error ? <p className="form-error" role="alert">{error}</p> : orders.length === 0 ? <div className="empty"><p>Aún no tienes pedidos.</p><Link to="/catalogo">Ver catálogo</Link></div> : <div className="order-list">{orders.map((order) => <article className="order-card" key={order.id}><div><h2>Pedido #{order.id}</h2><p>{new Date(order.createdAt).toLocaleDateString('es-ES')}</p></div><span className={`status ${order.status}`}>{order.status}</span><strong>{money(order.total)}</strong><ul>{order.items.map((item) => <li key={item.id}>{item.quantity} × {item.productName} ({money(item.unitPrice)})</li>)}</ul><Link className="text-link" to={`/pedidos/${order.id}`}>Ver detalle</Link></article>)}</div>}
  </section>
}
