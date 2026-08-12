/**
 * Modelo de dominio de un documento público.
 *
 * La capa visual solo conoce esta forma; nunca la estructura interna de la
 * colección de Payload. Un campo ausente se representa como `null`, jamás con
 * un valor de relleno.
 */

export const DOCUMENT_CATEGORIES = [
  'institutional',
  'financial-statement',
  'compliance',
  'reference',
] as const

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number]

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  institutional: 'Documentación institucional',
  'financial-statement': 'Estados financieros',
  compliance: 'Cumplimiento',
  reference: 'Documentos de referencia',
}

export const DOCUMENT_CATEGORY_DESCRIPTIONS: Record<DocumentCategory, string> = {
  institutional:
    'Quiénes somos por escrito: estructura, gobierno corporativo y documentos que describen a la institución.',
  'financial-statement':
    'Balances y estados de resultados por periodo, publicados conforme a los requerimientos del regulador.',
  compliance:
    'Manuales, políticas y material de cumplimiento normativo del mercado de valores.',
  reference:
    'Normativa y textos de consulta que enmarcan la actividad de una casa de bolsa en Venezuela.',
}

export type DocumentFile = {
  /** URL estable servida por Payload. */
  url: string
  /** Nombre legible con el que se descarga el archivo. */
  filename: string
  /** «PDF», «XLSX»… `null` cuando no se puede determinar. */
  typeLabel: string | null
  /** Tamaño real formateado. `null` cuando Payload no lo registró. */
  sizeLabel: string | null
  mimeType: string | null
}

export type PublicDocument = {
  id: string
  slug: string
  title: string
  description: string | null
  category: DocumentCategory
  /** `download` fuerza la descarga; `open` abre en pestaña nueva. */
  intent: 'download' | 'open'
  periodYear: number | null
  periodMonth: number | null
  /** «Abril 2026», «2026» o `null` si el documento no tiene periodo. */
  periodLabel: string | null
  publishedAt: string
  effectiveDate: string | null
  sortOrder: number
  /** `null` cuando el archivo asociado ya no existe: la UI no debe enlazarlo. */
  file: DocumentFile | null
}

/** Un año de estados financieros con sus periodos, del más reciente al más antiguo. */
export type DocumentYearGroup = {
  year: number
  documents: PublicDocument[]
}

export type FinancialStatementArchive = {
  years: DocumentYearGroup[]
  /** Años disponibles, descendente. Alimenta el filtro de la interfaz. */
  availableYears: number[]
  totalDocuments: number
}
