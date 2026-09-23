import { describe, expect, it } from 'vitest'
import { canManageProducts, canManageStore } from './roles'

describe('role UI permissions', () => {
  it('allows product management only for worker and manager', () => {
    expect(canManageProducts('customer')).toBe(false)
    expect(canManageProducts('worker')).toBe(true)
    expect(canManageProducts('manager')).toBe(true)
  })

  it('reserves store and user management for manager', () => {
    expect(canManageStore('customer')).toBe(false)
    expect(canManageStore('worker')).toBe(false)
    expect(canManageStore('manager')).toBe(true)
  })
})
