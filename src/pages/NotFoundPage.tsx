import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <section className="not-found"><p className="eyebrow">404</p><h1>Esta página no existe.</h1><p>Vuelve al inicio para seguir construyendo tu equipo.</p><Link className="button button-primary" to="/">Ir al inicio</Link></section>
}
