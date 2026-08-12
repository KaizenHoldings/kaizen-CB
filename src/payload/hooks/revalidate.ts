import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Etiquetas de caché compartidas entre los repositorios (que las declaran al
 * leer) y Payload (que las invalida al publicar). Un solo lugar evita que una
 * publicación quede invisible por una etiqueta escrita de dos maneras.
 */
export const CACHE_TAGS = {
  documents: 'kcb:documents',
  publications: 'kcb:publications',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]

/**
 * Perfil de caché con el que Next revalida la etiqueta. `max` deja que mande la
 * invalidación explícita, en lugar de competir con una expiración corta.
 */
const CACHE_PROFILE = 'max'

/**
 * `revalidateTag` exige el contexto de petición de Next y lanza fuera de él.
 * Payload también escribe desde la CLI, las migraciones y las pruebas: ahí no
 * hay caché que invalidar, así que la ausencia de contexto no es un error.
 */
const safeRevalidate = (tag: CacheTag): void => {
  try {
    revalidateTag(tag, CACHE_PROFILE)
  } catch {
    // Sin contexto de petición no existe caché pública que refrescar.
  }
}

export const revalidateOnChange =
  (tag: CacheTag): CollectionAfterChangeHook =>
  ({ doc, req }) => {
    // Las vistas de borrador no se sirven desde caché pública: no hay nada que
    // invalidar mientras el editor sigue trabajando.
    if (req.context?.skipRevalidate) return doc
    safeRevalidate(tag)
    return doc
  }

export const revalidateOnDelete =
  (tag: CacheTag): CollectionAfterDeleteHook =>
  ({ doc }) => {
    safeRevalidate(tag)
    return doc
  }
