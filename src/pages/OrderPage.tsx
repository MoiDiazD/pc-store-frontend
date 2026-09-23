import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { userMessage } from '../services/api-client'
import { ordersApi } from '../services/orders-api'
import type { Order } from '../services/types'

const money = (value: string) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value))
export function OrderPage() {
  const { user, loading } = useAuth(); const { id } = useParams(); const [params] = useSearchParams(); const [order, setOrder] = useState<Order | null>(null); const [error, setError] = useState(''); const [refreshing, setRefreshing] = useState(false)
  async function loadOrder(showRefresh = false) { if (!id) return; if (showRefresh) setRefreshing(true); try { setError(''); setOrder(await ordersApi.order(Number(id))) } catch (cause) { setError(userMessage(cause)) } finally { setRefreshing(false) } }
  useEffect(() => { if (user && id) void loadOrder() }, [user, id])
  useEffect(() => { if (order?.status !== 'pending' || !params.has('pago')) return; const timer = window.setInterval(() => void loadOrder(), 2500); return () => window.clearInterval(timer) }, [order?.status, params])
  if (!loading && !user) return <section className="page-state"><h1>Accede para ver el pedido.</h1><Link className="button button-primary" to="/acceso">Acceder</Link></section>
  if (error) return <section className="page-state"><p className="form-error">{error}</p><Link to="/pedidos">Volver a pedidos</Link></section>
  if (!order) return <section className="page-state">Cargando pedido…</section>
  return <section className="content-page order-detail"><Link className="back-link" to="/pedidos">← Mis pedidos</Link><p className="eyebrow">Pedido #{order.id}</p><h1>Detalle del pedido</h1><p><span className={`status ${order.status}`}>{order.status}</span> · {new Date(order.createdAt).toLocaleString('es-ES')}</p>{order.status === 'pending' && <><p className="note">Estamos esperando la confirmación final del pago por parte del servidor.</p>{order.expiresAt && <p className="note">El checkout vence el {new Date(order.expiresAt).toLocaleString('es-ES')}.</p>}<button onClick={() => void loadOrder(true)} disabled={refreshing}>{refreshing ? 'Actualizando…' : 'Actualizar estado'}</button></>}<div className="order-items">{order.items.map((item) => <article key={item.id}><div><h2>{item.productName}</h2><p>{item.productModel}</p></div><span>{item.quantity} × {money(item.unitPrice)}</span><strong>{money((Number(item.unitPrice) * item.quantity).toFixed(2))}</strong></article>)}</div><div className="cart-total"><strong>Total: {money(order.total)}</strong></div></section>
}
