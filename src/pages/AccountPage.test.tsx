import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AccountPage } from './AccountPage'

const mocks = vi.hoisted(() => ({
  setUser: vi.fn(), logout: vi.fn(),
  auth: { user: { id: 1, name: 'Ada', email: 'ada@example.com', role: 'customer' }, loading: false },
}))
vi.mock('../features/auth/AuthContext', () => ({ useAuth: () => ({ ...mocks.auth, setUser: mocks.setUser }) }))
vi.mock('../services/auth-api', () => ({ authApi: { logout: mocks.logout, changePassword: vi.fn() } }))
vi.mock('../services/users-api', () => ({ usersApi: { updateMe: vi.fn() } }))

describe('AccountPage logout', () => {
  it('revokes the backend session and clears the in-memory user', async () => {
    mocks.logout.mockResolvedValueOnce(undefined)
    render(<MemoryRouter><AccountPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    await waitFor(() => expect(mocks.logout).toHaveBeenCalledOnce())
    expect(mocks.setUser).toHaveBeenCalledWith(null)
  })
})
