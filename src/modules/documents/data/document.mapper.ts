import { fileTypeLabel, formatFileSize, monthNameCapitalized } from '@/lib/format'
import type { Document as PayloadDocument, Media } from '@/payload-types'

import type { DocumentCategory, DocumentFile, PublicDocument } from '../domain/document'

const isPopulatedMedia = (value: PayloadDocument['file']): value is Media =>
  typeof value === 'object' && value !== null && 'filename' in value

/**
 * Un documento sin archivo utilizable devuelve `null` aquí, y la interfaz
 * muestra el documento sin acción de descarga. Nunca se construye un enlace
 * hacia un archivo inexistente.
 */
const toDocumentFile = (media: PayloadDocument['file']): DocumentFile | null => {
  if (!isPopulatedMedia(media)) return null
  if (!media.url || !media.filename) return null

  return {
    url: media.url,
    filename: media.filename,
    typeLabel: fileTypeLabel(media.mimeType, media.filename),
    sizeLabel: formatFileSize(media.filesize),
    mimeType: media.mimeType ?? null,
  }
}

const toPeriodLabel = (year: number | null, month: number | null): string | null => {
  if (!year) return null
  return month ? `${monthNameCapitalized(month)} ${year}` : String(year)
}

/** Traduce un registro de Payload al modelo de dominio público. */
export const toPublicDocument = (doc: PayloadDocument): PublicDocument => {
  const periodYear = typeof doc.periodYear === 'number' ? doc.periodYear : null
  const periodMonth = doc.periodMonth ? Number(doc.periodMonth) : null

  return {
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    description: doc.description?.trim() ? doc.description.trim() : null,
    category: doc.category as DocumentCategory,
    intent: doc.intent === 'open' ? 'open' : 'download',
    periodYear,
    periodMonth: Number.isFinite(periodMonth) ? periodMonth : null,
    periodLabel: toPeriodLabel(periodYear, periodMonth),
    publishedAt: doc.publishedAt,
    effectiveDate: doc.effectiveDate ?? null,
    sortOrder: typeof doc.sortOrder === 'number' ? doc.sortOrder : 0,
    file: toDocumentFile(doc.file),
  }
}
