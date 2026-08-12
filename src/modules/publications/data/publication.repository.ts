import { unstable_cache } from 'next/cache'
import 'server-only'

import { getPayloadClient } from '@/lib/payload-client'
import { CACHE_TAGS } from '@/payload/hooks/revalidate'
import type { Publication } from '@/payload-types'

import type {
  PublicationDetail,
  PublicationSummary,
  PublicationType,
} from '../domain/publication'
import { toPublicationDetail, toPublicationSummary } from './publication.mapper'

export interface PublicationRepository {
  findPublished(options?: { type?: PublicationType; limit?: number }): Promise<PublicationSummary[]>
  findBySlug(slug: string): Promise<PublicationDetail | null>
  listSlugs(): Promise<string[]>
}

const MAX_PUBLICATIONS = 200

const fetchPublished = async (type?: PublicationType): Promise<PublicationSummary[]> => {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'publications',
    overrideAccess: false,
    user: null,
    draft: false,
    depth: 1,
    limit: MAX_PUBLICATIONS,
    pagination: false,
    sort: '-publishedAt',
    where: type ? { type: { equals: type } } : undefined,
  })

  return (result.docs as Publication[]).map(toPublicationSummary)
}

const cachedFetchPublished = unstable_cache(
  async (type: string) => fetchPublished(type ? (type as PublicationType) : undefined),
  ['kcb-publications'],
  { tags: [CACHE_TAGS.publications], revalidate: 3600 },
)

const cachedFetchBySlug = unstable_cache(
  async (slug: string): Promise<PublicationDetail | null> => {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'publications',
      overrideAccess: false,
      user: null,
      draft: false,
      // `depth: 2` puebla el documento relacionado y, dentro de él, su archivo.
      depth: 2,
      limit: 1,
      pagination: false,
      where: { slug: { equals: slug } },
    })

    const [publication] = result.docs as Publication[]
    return publication ? toPublicationDetail(publication) : null
  },
  ['kcb-publication-detail'],
  { tags: [CACHE_TAGS.publications], revalidate: 3600 },
)

export const payloadPublicationRepository: PublicationRepository = {
  async findPublished({ type, limit } = {}) {
    const publications = await cachedFetchPublished(type ?? '')
    return typeof limit === 'number' ? publications.slice(0, limit) : publications
  },
  findBySlug: (slug) => cachedFetchBySlug(slug),
  async listSlugs() {
    const publications = await cachedFetchPublished('')
    return publications.map((publication) => publication.slug)
  },
}
