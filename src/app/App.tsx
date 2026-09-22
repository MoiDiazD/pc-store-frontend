import { NavLink, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { UnavailablePage } from '../pages/UnavailablePage'

const navItems = [
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/pedidos', label: 'Mis pedidos' },
]

export function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <NavLink className="brand" to="/" aria-label="pc-store, inicio">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>pc-store</span>
        </NavLink>
        <nav className="main-nav" aria-label="Navegación principal">
          {navItems.map(({ to, label }) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <NavLink className="text-link" to="/acceso">Acceder</NavLink>
          <NavLink className="cart-link" to="/carrito" aria-label="Abrir carrito">Carrito <span aria-hidden="true">→</span></NavLink>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<UnavailablePage feature="El catálogo" />} />
          <Route path="/pedidos" element={<UnavailablePage feature="Los pedidos" />} />
          <Route path="/acceso" element={<UnavailablePage feature="El acceso a tu cuenta" />} />
          <Route path="/carrito" element={<UnavailablePage feature="El carrito" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} pc-store</span>
        <span>Componentes para construir sin límites.</span>
      </footer>
    </div>
  )
}
