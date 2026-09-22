import { apiRequest } from './api-client'
import type { User } from './types'
export const usersApi = { me: () => apiRequest<User>('/users/me'), updateMe: (input: Partial<Pick<User, 'name' | 'email'>>) => apiRequest<User>('/users/me', { method: 'PATCH', body: JSON.stringify(input) }) }
