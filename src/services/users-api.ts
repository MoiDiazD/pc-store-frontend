import { apiRequest } from './api-client'
import type { User } from './types'
export const usersApi = {
  me: () => apiRequest<User>('/users/me'),
  updateMe: (input: Partial<Pick<User, 'name' | 'email'>>) => apiRequest<User>('/users/me', { method: 'PATCH', body: JSON.stringify(input) }),
  user: (id: number) => apiRequest<User>(`/users/${id}`),
  update: (id: number, input: Partial<Pick<User, 'name' | 'email'>>) => apiRequest<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: number) => apiRequest<User>(`/users/${id}`, { method: 'DELETE' }),
  changeRole: (id: number, role: User['role']) => apiRequest<User>(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
}
