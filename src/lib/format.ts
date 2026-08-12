/** Utilidades de formato compartidas. Locale fijo `es-VE` en todo el sitio. */

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const

export const monthName = (month: number): string => MONTHS_ES[month - 1] ?? ''

export const monthNameCapitalized = (month: number): string => {
  const name = monthName(month)
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
}

/**
 * Formatea una fecha ISO como «12 de abril de 2026».
 * Devuelve `null` cuando la entrada no es una fecha válida: nunca inventa un valor.
 */
export const formatLongDate = (iso: string | null | undefined): string | null => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getUTCDate()} de ${monthName(date.getUTCMonth() + 1)} de ${date.getUTCFullYear()}`
}

/** Formato corto para metadatos: «12 abr 2026». */
export const formatShortDate = (iso: string | null | undefined): string | null => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return `${date.getUTCDate()} ${monthName(date.getUTCMonth() + 1).slice(0, 3)} ${date.getUTCFullYear()}`
}

export const toDateTimeAttribute = (iso: string | null | undefined): string | undefined => {
  if (!iso) return undefined
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

/**
 * Tamaño de archivo legible, con coma decimal.
 * Devuelve `null` si el tamaño no está disponible: no se inventa un valor.
 */
export const formatFileSize = (bytes: number | null | undefined): string | null => {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) return null

  if (bytes < 1024) return `${bytes} B`

  const units = ['KB', 'MB', 'GB'] as const
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const rounded = value >= 10 ? Math.round(value) : Math.round(value * 10) / 10
  return `${String(rounded).replace('.', ',')} ${units[unitIndex]}`
}

/** Etiqueta corta del tipo de archivo a partir de su MIME o extensión. */
export const fileTypeLabel = (
  mimeType: string | null | undefined,
  filename: string | null | undefined,
): string | null => {
  const byMime: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'application/vnd.ms-excel': 'XLS',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WEBP',
    'image/svg+xml': 'SVG',
  }

  if (mimeType && byMime[mimeType]) return byMime[mimeType]

  const extension = filename?.split('.').pop()?.toUpperCase()
  return extension && extension.length <= 5 ? extension : null
}

/** Número con separadores es-VE y decimales fijos, para tablas comparables. */
export const formatDecimal = (value: number, fractionDigits = 2): string =>
  value.toLocaleString('es-VE', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })

/** Variación con signo explícito: «+1,85 %» / «−0,62 %». */
export const formatVariation = (value: number): string => {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${formatDecimal(Math.abs(value))} %`
}
