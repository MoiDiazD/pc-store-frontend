import { apiRequest } from './api-client'
import type { User } from './types'
export type RegisterInput = { name: string; email: string; password: string }
export type LoginInput = { email: string; password: string }
export const authApi = {
  register: (input: RegisterInput) => apiRequest<User>('/auth/register', { method: 'POST', body: JSON.stringify(input) }),
  login: (input: LoginInput) => apiRequest<User>('/auth/login', { method: 'POST', body: JSON.stringify(input) }),
  logout: () => apiRequest<void>('/auth/logout', { method: 'POST' }),
  me: () => apiRequest<User>('/auth/me'),
  changePassword: (input: { currentPassword: string; newPassword: string }) => apiRequest<void>('/auth/change-password', { method: 'PATCH', body: JSON.stringify(input) }),
}
