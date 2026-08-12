import type { CollectionConfig } from 'payload'

import { isActive, isSuperAdmin, superAdminFieldOnly, superAdminOnly } from '../access/roles'

/**
 * Colección autenticable del panel. Payload administra el hash de contraseña,
 * la sesión en cookie HTTP-only, el bloqueo por intentos y la recuperación.
 * No existe ningún otro mecanismo de autenticación en el proyecto.
 */
export const AdminUsers: CollectionConfig = {
  slug: 'admin-users',
  labels: {
    singular: 'Usuario administrativo',
    plural: 'Usuarios administrativos',
  },
  auth: {
    tokenExpiration: 60 * 60 * 8, // 8 horas
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutos
    useAPIKey: false,
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  admin: {
    group: 'Administración',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'isActive'],
    description:
      'Personas con acceso al panel. Solo un Super Admin puede crear, editar o desactivar cuentas.',
  },
  access: {
    // Todo el CRUD de usuarios queda reservado al super-admin…
    create: superAdminOnly,
    delete: superAdminOnly,
    unlock: superAdminOnly,
    update: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      // …salvo que cada persona pueda editar su propio perfil.
      if (!req.user || !isActive(req.user)) return false
      return { id: { equals: req.user.id } }
    },
    read: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      if (!req.user || !isActive(req.user)) return false
      return { id: { equals: req.user.id } }
    },
    // Puerta del panel `/admin`: exige cuenta activa con rol conocido.
    admin: ({ req }) => isActive(req.user) && Boolean(req.user?.role),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nombre y apellido',
      required: true,
      admin: {
        description: 'Se muestra en la lista de usuarios y en el historial de versiones.',
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      required: true,
      defaultValue: 'editor',
      index: true,
      options: [
        {
          label: 'Super Admin — usuarios, configuración y todo el contenido',
          value: 'super-admin',
        },
        {
          label: 'Editor — documentos, publicaciones, archivos y suscriptores',
          value: 'editor',
        },
      ],
      access: {
        // Un editor no puede promoverse a sí mismo.
        create: superAdminFieldOnly,
        update: superAdminFieldOnly,
      },
      admin: {
        description: 'Solo un Super Admin puede asignar o cambiar el rol.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Cuenta activa',
      defaultValue: true,
      index: true,
      access: {
        create: superAdminFieldOnly,
        update: superAdminFieldOnly,
      },
      admin: {
        position: 'sidebar',
        description:
          'Al desactivarla, la persona conserva su historial pero pierde el acceso al panel.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (typeof data?.email === 'string') {
          data.email = data.email.trim().toLowerCase()
        }
        return data
      },
    ],
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data

        // La primera cuenta se crea desde la pantalla inicial de Payload, sin
        // sesión: el campo `role` viene filtrado por su field access. Sin esta
        // promoción el sistema quedaría sin ningún Super Admin.
        const existing = await req.payload.count({
          collection: 'admin-users',
          overrideAccess: true,
        })

        if (existing.totalDocs === 0) {
          return { ...data, role: 'super-admin', isActive: true }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
