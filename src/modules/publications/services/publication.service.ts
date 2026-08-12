import type { PublicationRepository } from '../data/publication.repository'
import { payloadPublicationRepository } from '../data/publication.repository'
import type {
  PublicationDetail,
  PublicationSummary,
  PublicationType,
} from '../domain/publication'

/** Consulta de publicaciones ya publicadas. Los borradores nunca salen de aquí. */
export class PublicationService {
  constructor(private readonly repository: PublicationRepository = payloadPublicationRepository) {}

  async listLatest(limit?: number): Promise<PublicationSummary[]> {
    return this.repository.findPublished({ limit })
  }

  async listByType(type: PublicationType, limit?: number): Promise<PublicationSummary[]> {
    return this.repository.findPublished({ type, limit })
  }

  async getBySlug(slug: string): Promise<PublicationDetail | null> {
    const normalized = slug.trim().toLowerCase()
    if (!normalized) return null
    return this.repository.findBySlug(normalized)
  }

  /** Slugs publicados, para el sitemap y la generación estática. */
  async listSlugs(): Promise<string[]> {
    return this.repository.listSlugs()
  }

  /** Tipos que realmente tienen contenido: alimenta los filtros de la interfaz. */
  async availableTypes(): Promise<PublicationType[]> {
    const publications = await this.repository.findPublished()
    const order: PublicationType[] = ['newsletter', 'compliance', 'market-update']
    const present = new Set(publications.map((publication) => publication.type))
    return order.filter((type) => present.has(type))
  }
}

export const publicationService = new PublicationService()
