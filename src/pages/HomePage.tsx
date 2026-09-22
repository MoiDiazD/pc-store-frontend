import { Link } from 'react-router-dom'

const promises = [
  ['01', 'Elige con claridad', 'Un catálogo pensado para comparar cada componente con confianza.'],
  ['02', 'Compra con control', 'Gestiona tu carrito y revisa tu pedido antes de pagar.'],
  ['03', 'Sigue tu equipo', 'Consulta el estado de tus pedidos desde tu cuenta.'],
]

export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Tu siguiente build empieza aquí</p>
          <h1>Potencia para <em>cada</em> idea.</h1>
          <p className="hero-description">Encuentra los componentes adecuados para crear, jugar y avanzar al siguiente nivel.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/catalogo">Explorar catálogo <span aria-hidden="true">↗</span></Link>
            <Link className="button button-secondary" to="/acceso">Crear una cuenta</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="glow" />
          <div className="chip"><span>PC</span><i /><i /><i /><i /></div>
          <div className="orb orb-one" /><div className="orb orb-two" />
          <p>BUILD<br />YOUR<br />IDEA</p>
        </div>
      </section>
      <section className="promise-section" aria-labelledby="how-it-works">
        <div className="section-heading"><p className="eyebrow">pc-store</p><h2 id="how-it-works">Todo lo que necesitas.<br /><em>Sin complicaciones.</em></h2></div>
        <div className="promise-grid">
          {promises.map(([number, title, text]) => <article className="promise" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>
    </>
  )
}
