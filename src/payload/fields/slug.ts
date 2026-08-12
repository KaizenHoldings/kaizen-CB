import type { Field, FieldHook } from 'payload'

/** Convierte un título en un slug estable, sin acentos ni caracteres raros. */
export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)

    // Solo autogeneramos al crear: cambiar el título de un documento publicado
    // no debe romper una URL que ya se compartió.
    if (operation !== 'create') return originalDoc?.slug ?? value

    const fallback = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    return typeof fallback === 'string' ? slugify(fallback) : value
  }

export const slugField = (fallbackField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Identificador (slug)',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Se genera automáticamente a partir del título al crear el registro. Forma parte de la URL pública: cámbialo solo si es imprescindible.',
  },
  hooks: {
    beforeValidate: [formatSlug(fallbackField)],
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'El identificador es obligatorio.'
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'Usa solo minúsculas, números y guiones (ejemplo: estados-financieros-2026-04).'
    }
    return true
  },
})
