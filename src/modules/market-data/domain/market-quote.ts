/**
 * Modelo normalizado de una cotización.
 *
 * Toda cifra viaja acompañada de su unidad, su fuente y su hora de
 * actualización. La dirección se expresa como dato (`direction`), no como
 * color: la interfaz añade símbolo y texto además del color.
 */
export type QuoteDirection = 'up' | 'down' | 'flat'

export type MarketQuote = {
  /** Identificador estable del instrumento. Ej.: «BVC:BPV». */
  id: string
  /** Símbolo tal como lo publica la fuente. */
  symbol: string
  name: string
  value: number
  /** Unidad o moneda del valor. Ej.: «Bs.». */
  unit: string
  /** Variación porcentual respecto al cierre anterior. `null` si la fuente no la publica. */
  changePercent: number | null
  direction: QuoteDirection
}

export type MarketDataSource = {
  /** Nombre legible de la fuente, mostrado junto a los datos. */
  name: string
  /** Sitio oficial de la fuente, si existe. */
  url: string | null
}

/** Datos disponibles y verificables. */
export type MarketDataAvailable = {
  status: 'available'
  quotes: MarketQuote[]
  source: MarketDataSource
  /** Momento de la última actualización publicada por la fuente, en ISO 8601. */
  updatedAt: string
  /**
   * Cifras simuladas para revisión visual. Cuando es `true` la interfaz debe
   * rotularlo de forma inequívoca; nunca se activa en producción.
   */
  isSimulated: boolean
}

/**
 * Ausencia de datos. `reason` explica por qué, sin filtrar detalles internos.
 * `not-configured` es el estado inicial mientras no haya API oficial confirmada.
 */
export type MarketDataUnavailable = {
  status: 'unavailable'
  reason: 'not-configured' | 'source-error' | 'timeout'
}

export type MarketDataSnapshot = MarketDataAvailable | MarketDataUnavailable

export const UNAVAILABLE_MESSAGES: Record<MarketDataUnavailable['reason'], string> = {
  'not-configured':
    'La conexión con la fuente oficial de cotizaciones aún no está habilitada.',
  'source-error': 'La fuente de cotizaciones no responde en este momento.',
  timeout: 'La fuente de cotizaciones tardó demasiado en responder.',
}

export const directionOf = (changePercent: number | null): QuoteDirection => {
  if (changePercent === null || changePercent === 0) return 'flat'
  return changePercent > 0 ? 'up' : 'down'
}

/** Etiqueta textual de la dirección, para no depender del color. */
export const DIRECTION_LABELS: Record<QuoteDirection, string> = {
  up: 'sube',
  down: 'baja',
  flat: 'sin cambio',
}

/** Símbolo que acompaña siempre a la variación. */
export const DIRECTION_SYMBOLS: Record<QuoteDirection, string> = {
  up: '▲',
  down: '▼',
  flat: '—',
}
