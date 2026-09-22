import { Link } from 'react-router-dom'

type UnavailablePageProps = { feature: string }

export function UnavailablePage({ feature }: UnavailablePageProps) {
  return (
    <section className="not-found">
      <p className="eyebrow">Integración pendiente</p>
      <h1>{feature} aún no está disponible.</h1>
      <p>Esta vista se habilitará cuando podamos validar su contrato con el API de pc-store.</p>
      <Link className="button button-primary" to="/">Volver al inicio</Link>
    </section>
  )
}
