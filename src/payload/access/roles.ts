import type { Access, FieldAccess } from 'payload'

import type { AdminUser } from '@/payload-types'

export type Role = 'super-admin' | 'editor'

/**
 * Payload inyecta `req.user` con la colección autenticada. Normalizamos el
 * acceso al rol en un único lugar para que ninguna colección lo deduzca a mano.
 */
type MaybeUser = Partial<AdminUser> | null | undefined

export const roleOf = (user: MaybeUser): Role | null => {
  const role = user?.role
  return role === 'super-admin' || role === 'editor' ? role : null
}

/** Una cuenta desactivada conserva su registro pero pierde todo acceso. */
export const isActive = (user: MaybeUser): boolean => Boolean(user) && user?.isActive !== false

export const isSuperAdmin = (user: MaybeUser): boolean =>
  isActive(user) && roleOf(user) === 'super-admin'

export const isEditor = (user: MaybeUser): boolean => isActive(user) && roleOf(user) === 'editor'

/** Cualquier usuario administrativo activo (super-admin o editor). */
export const isStaff = (user: MaybeUser): boolean => isSuperAdmin(user) || isEditor(user)

// --- Access functions a nivel de colección ---------------------------------

export const superAdminOnly: Access = ({ req }) => isSuperAdmin(req.user as MaybeUser)

export const staffOnly: Access = ({ req }) => isStaff(req.user as MaybeUser)

/** Acceso al panel `/admin`: exige un rol conocido y la cuenta activa. */
export const canAccessAdminPanel: Access = ({ req }) => isStaff(req.user as MaybeUser)

/**
 * Lectura pública restringida a contenido publicado.
 *
 * Payload aplica `_status` sobre la consulta cuando la colección tiene drafts
 * habilitados; el staff ve borradores y el público solo lo publicado.
 */
export const publishedOrStaff: Access = ({ req }) => {
  if (isStaff(req.user as MaybeUser)) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

// --- Field access -----------------------------------------------------------

export const superAdminFieldOnly: FieldAccess = ({ req }) => isSuperAdmin(req.user as MaybeUser)
