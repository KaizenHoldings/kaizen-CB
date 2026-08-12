import { unstable_cache } from 'next/cache'
import 'server-only'

import { getPayloadClient } from '@/lib/payload-client'
import { CACHE_TAGS } from '@/payload/hooks/revalidate'
import type { Document as PayloadDocument } from '@/payload-types'

import type { DocumentCategory, PublicDocument } from '../domain/document'
import { toPublicDocument } from './document.mapper'

/**
 * Contrato de acceso a documentos. El servicio depende de esta interfaz, no de
 * Payload: sustituir el origen no obliga a tocar la capa de negocio.
 */
export interface DocumentRepository {
  findPublished(options?: { categories?: DocumentCategory[]; limit?: number }): Promise<
    PublicDocument[]
  >
}

const MAX_DOCUMENTS = 500

/**
 * Consulta pública: `overrideAccess: false` sin usuario deja que el control de
 * acceso de la colección filtre a solo publicados. No confiamos en añadir el
 * `where` a mano.
 */
const fetchPublished = async (categories?: DocumentCategory[]): Promise<PublicDocument[]> => {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'documents',
    overrideAccess: false,
    user: null,
    draft: false,
    depth: 1, // pobla `file` con el registro de media, sin ir más profundo
    limit: MAX_DOCUMENTS,
    pagination: false,
    sort: ['-periodYear', '-periodMonth', 'sortOrder', '-publishedAt'],
    where: categories?.length ? { category: { in: categories } } : undefined,
  })

  return (result.docs as PayloadDocument[]).map(toPublicDocument)
}

/**
 * La caché se invalida desde los hooks de publicación de Payload
 * (`CACHE_TAGS.documents`), de modo que publicar un documento lo muestra sin
 * esperar a que expire un tiempo arbitrario.
 */
const cachedFetchPublished = unstable_cache(
  async (categoriesKey: string) => {
    const categories = categoriesKey ? (categoriesKey.split(',') as DocumentCategory[]) : undefined
    return fetchPublished(categories)
  },
  ['kcb-documents'],
  { tags: [CACHE_TAGS.documents], revalidate: 3600 },
)

export const payloadDocumentRepository: DocumentRepository = {
  async findPublished({ categories, limit } = {}) {
    const documents = await cachedFetchPublished([...(categories ?? [])].sort().join(','))
    return typeof limit === 'number' ? documents.slice(0, limit) : documents
  },
}
