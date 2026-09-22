import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi } from '../../services/auth-api'
import type { User } from '../../services/types'

type AuthContextValue = { user: User | null; loading: boolean; refresh: () => Promise<void>; setUser: (user: User | null) => void }
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const refresh = async () => { try { setUser(await authApi.me()) } catch { setUser(null) } finally { setLoading(false) } }
  useEffect(() => { void refresh() }, [])
  return <AuthContext.Provider value={{ user, loading, refresh, setUser }}>{children}</AuthContext.Provider>
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth debe usarse dentro de AuthProvider.'); return value }
