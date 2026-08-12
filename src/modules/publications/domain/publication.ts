import type { PublicDocument } from '@/modules/documents/domain/document'

export const PUBLICATION_TYPES = ['newsletter', 'compliance', 'market-update'] as const

export type PublicationType = (typeof PUBLICATION_TYPES)[number]

export const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  newsletter: 'Newsletter',
  compliance: 'Cumplimiento',
  'market-update': 'Mercado',
}

/**
 * Cada tipo lleva su propio par fondo/texto de la paleta de etiquetas de
 * `BRAND.md`, más una inicial que se lee sin depender del color.
 */
export const PUBLICATION_TYPE_TOKENS: Record<
  PublicationType,
  { background: string; foreground: string }
> = {
  newsletter: { background: '#EDF5EF', foreground: '#2E6B45' },
  compliance: { background: '#FFF4E5', foreground: '#B87020' },
  'market-update': { background: '#E8F4F0', foreground: '#1A6B4A' },
}

export type PublicationImage = {
  url: string
  alt: string
  width: number | null
  height: number | null
}

export type PublicationSummary = {
  id: string
  slug: string
  title: string
  excerpt: string
  type: PublicationType
  publishedAt: string
  image: PublicationImage | null
  hasAttachment: boolean
}

export type PublicationDetail = PublicationSummary & {
  /** Estado serializado de Lexical; se renderiza con el conversor oficial. */
  body: unknown
  relatedDocument: PublicDocument | null
  metaTitle: string | null
  metaDescription: string | null
  updatedAt: string
}
