import { toPublicDocument } from '@/modules/documents/data/document.mapper'
import type { Document as PayloadDocument, Media, Publication } from '@/payload-types'

import type {
  PublicationDetail,
  PublicationImage,
  PublicationSummary,
  PublicationType,
} from '../domain/publication'

const isPopulatedMedia = (value: unknown): value is Media =>
  typeof value === 'object' && value !== null && 'filename' in (value as Record<string, unknown>)

const isPopulatedDocument = (value: unknown): value is PayloadDocument =>
  typeof value === 'object' && value !== null && 'category' in (value as Record<string, unknown>)

const toImage = (value: Publication['featuredImage']): PublicationImage | null => {
  if (!isPopulatedMedia(value) || !value.url) return null

  // Preferimos el recorte `card`: evita servir el original a tamaño completo.
  const card = value.sizes?.card
  const url = card?.url ?? value.url

  return {
    url,
    // El campo `alt` es obligatorio para imágenes en la colección Media.
    alt: value.alt?.trim() || value.title,
    width: card?.width ?? value.width ?? null,
    height: card?.height ?? value.height ?? null,
  }
}

export const toPublicationSummary = (publication: Publication): PublicationSummary => ({
  id: String(publication.id),
  slug: publication.slug,
  title: publication.title,
  excerpt: publication.excerpt,
  type: publication.type as PublicationType,
  publishedAt: publication.publishedAt,
  image: toImage(publication.featuredImage),
  hasAttachment: Boolean(publication.relatedDocument),
})

export const toPublicationDetail = (publication: Publication): PublicationDetail => ({
  ...toPublicationSummary(publication),
  body: publication.body,
  relatedDocument: isPopulatedDocument(publication.relatedDocument)
    ? toPublicDocument(publication.relatedDocument)
    : null,
  metaTitle: publication.metaTitle?.trim() || null,
  metaDescription: publication.metaDescription?.trim() || null,
  updatedAt: publication.updatedAt,
})
