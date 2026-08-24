import type { Field, FieldHook } from 'payload'

/** Convierte un título en un slug estable, sin acentos ni caracteres raros. */
export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)

/** Longitud máxima del identificador, la misma que aplica `slugify`. */
const MAX_SLUG_LENGTH = 120

/* Alfabeto del sufijo: solo minúsculas y dígitos, que es exactamente lo que
   admite la validación del campo. */
const SUFFIX_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SUFFIX_LENGTH = 5
const SUFFIX_PATTERN = new RegExp(`-([a-z0-9]{${SUFFIX_LENGTH}})$`)

/**
 * Sufijo aleatorio corto.
 *
 * Usa `crypto.getRandomValues` y no `Math.random().toString(36)`: aquel devuelve
 * siempre la longitud pedida, mientras que el truco de base 36 puede quedarse
 * corto —un número que termina en ceros los pierde al convertirse— y entregar
 * tres caracteres donde se esperaban cuatro.
 */
const randomSuffix = (): string => {
  const bytes = new Uint8Array(SUFFIX_LENGTH)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => SUFFIX_ALPHABET[byte % SUFFIX_ALPHABET.length]).join('')
}

/** Parte legible de un slug, recortada para dejar sitio al sufijo. */
const baseFor = (title: string): string =>
  slugify(title)
    .slice(0, MAX_SLUG_LENGTH - SUFFIX_LENGTH - 1)
    .replace(/-+$/, '')

/** Separa un slug en su parte legible y su sufijo, si lo lleva. */
const splitSuffix = (slug: string): { base: string; suffix: string | null } => {
  const match = slug.match(SUFFIX_PATTERN)
  return match ? { base: slug.slice(0, -match[0].length), suffix: match[1]! } : { base: slug, suffix: null }
}

const compose = (title: string, suffix: string): string => {
  const base = baseFor(title)
  // Un título compuesto solo por signos deja la base vacía; el sufijo por sí
  // solo sigue siendo un identificador válido.
  return base.length > 0 ? `${base}-${suffix}` : suffix
}

/**
 * Mantiene el identificador al día con el título.
 *
 * Reglas, en orden:
 *
 * 1. Si el editor acaba de escribir en el campo, manda su valor.
 * 2. Si el slug guardado **no** se deriva del título anterior, se dejó a mano en
 *    algún momento y no se toca: seguir el título borraría esa decisión.
 * 3. En cualquier otro caso el slug sigue al título, conservando el sufijo que
 *    ya tuviera. Renombrar cambia solo la parte legible; el sufijo se genera una
 *    vez y permanece, de modo que la URL no cambia más de lo necesario y la
 *    unicidad se mantiene estable.
 *
 * Advertencia deliberada: con esta regla, renombrar un documento **ya publicado
 * cambia su URL pública**, y los enlaces compartidos antes dejan de resolver.
 * Es el comportamiento pedido.
 */
const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ data, originalDoc, value }) => {
    const stored = typeof originalDoc?.slug === 'string' ? originalDoc.slug : ''
    const incoming = typeof value === 'string' ? value : ''

    // 1. Escritura manual en el propio campo.
    if (incoming.length > 0 && incoming !== stored) return slugify(incoming)

    const nextTitle = data?.[fallbackField] ?? originalDoc?.[fallbackField]
    if (typeof nextTitle !== 'string' || nextTitle.trim().length === 0) {
      return incoming.length > 0 ? slugify(incoming) : value
    }

    const { base, suffix } = splitSuffix(stored)
    const previousTitle = originalDoc?.[fallbackField]
    const derivedFromPrevious =
      typeof previousTitle === 'string' && base === baseFor(previousTitle)

    // 2. Slug personalizado en un guardado anterior: se respeta.
    if (stored.length > 0 && !derivedFromPrevious) return stored

    // 3. Sigue al título, con el sufijo que ya tuviera.
    return compose(nextTitle, suffix ?? randomSuffix())
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
