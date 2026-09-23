import type { Role } from '../../services/types'

export function canManageProducts(role: Role | undefined): boolean {
  return role === 'worker' || role === 'manager'
}

export function canManageStore(role: Role | undefined): boolean {
  return role === 'manager'
}
