import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { canManageProducts } from './roles'

type RequireAuthProps = { requireStaff?: boolean }

export function RequireAuth({ requireStaff = false }: RequireAuthProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <section className="page-state">Comprobando tu sesión…</section>
  if (!user) return <Navigate to="/acceso" replace state={{ from: location.pathname }} />
  if (requireStaff && !canManageProducts(user.role)) return <section className="page-state"><h1>Acceso restringido.</h1><p>No tienes permiso para acceder a esta zona.</p></section>
  return <Outlet />
}
