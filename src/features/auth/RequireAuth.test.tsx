import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { RequireAuth } from './RequireAuth'

const auth = vi.hoisted(() => ({ value: { user: null as { role: 'customer' | 'worker' | 'manager' } | null, loading: false } }))
vi.mock('./AuthContext', () => ({ useAuth: () => auth.value }))

function renderRoute(path: string, staff = false) {
  return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/acceso" element={<p>Acceso</p>} /><Route element={<RequireAuth requireStaff={staff} />}><Route path="/privada" element={<p>Privada</p>} /></Route></Routes></MemoryRouter>)
}

describe('RequireAuth', () => {
  it('redirects anonymous users away from protected routes', () => {
    auth.value = { user: null, loading: false }
    renderRoute('/privada')
    expect(screen.getByText('Acceso')).toBeTruthy()
  })

  it('renders customer pages for an authenticated customer', () => {
    auth.value = { user: { role: 'customer' }, loading: false }
    renderRoute('/privada')
    expect(screen.getByText('Privada')).toBeTruthy()
  })

  it('does not allow customers into staff-only routes but allows workers', () => {
    auth.value = { user: { role: 'customer' }, loading: false }
    const view = renderRoute('/privada', true)
    expect(screen.getByText('Acceso restringido.')).toBeTruthy()
    view.unmount()
    auth.value = { user: { role: 'worker' }, loading: false }
    renderRoute('/privada', true)
    expect(screen.getByText('Privada')).toBeTruthy()
  })
})
