import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider, useAuth } from './AuthContext'

function SessionState() {
  const { user, loading } = useAuth()
  return <output>{loading ? 'loading' : user?.email ?? 'anonymous'}</output>
}

describe('AuthProvider', () => {
  it('loads the session user without reading browser storage', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: 1, name: 'Ada', email: 'ada@example.com', role: 'customer' }), { headers: { 'content-type': 'application/json' } })))
    render(<AuthProvider><SessionState /></AuthProvider>)
    expect(screen.getByText('loading')).toBeTruthy()
    await waitFor(() => expect(screen.getByText('ada@example.com')).toBeTruthy())
  })

  it('clears an invalid session after /auth/me returns 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } })))
    render(<AuthProvider><SessionState /></AuthProvider>)
    await waitFor(() => expect(screen.getByText('anonymous')).toBeTruthy())
  })
})
