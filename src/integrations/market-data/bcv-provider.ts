import 'server-only'

import { bcvApi } from '@/lib/env'
import {
  directionOf,
  type MarketDataSnapshot,
  type MarketQuote,
} from '@/modules/market-data/domain/market-quote'

import type { MarketDataProvider } from './market-data-provider'

const TIMEOUT_MS = 5_000

/**
 * Forma mínima que se espera de la respuesta oficial. El esquema definitivo
 * está pendiente de confirmación: por eso cada campo se comprueba antes de
 * usarse y un registro que no encaje se descarta en lugar de completarse con
 * un valor inventado.
 */
type RawQuote = {
  symbol?: unknown
  name?: unknown
  value?: unknown
  unit?: unknown
  changePercent?: unknown
}

const toQuote = (raw: RawQuote): MarketQuote | null => {
  const symbol = typeof raw.symbol === 'string' ? raw.symbol.trim() : ''
  const value = typeof raw.value === 'number' ? raw.value : Number.NaN

  if (!symbol || !Number.isFinite(value)) return null

  const changePercent =
    typeof raw.changePercent === 'number' && Number.isFinite(raw.changePercent)
      ? raw.changePercent
      : null

  return {
    id: `bcv:${symbol}`,
    symbol,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : symbol,
    value,
    unit: typeof raw.unit === 'string' && raw.unit.trim() ? raw.unit.trim() : 'Bs.',
    changePercent,
    direction: directionOf(changePercent),
  }
}

/**
 * Implementación para la API oficial del Banco Central / mercado.
 *
 * Queda inactiva mientras `BCV_API_URL` no esté configurada (`lib/env` devuelve
 * entonces el proveedor `unavailable`). La clave se envía solo desde servidor y
 * nunca se registra en logs.
 */
export const bcvMarketDataProvider: MarketDataProvider = {
  name: 'bcv',
  async getTickerData(): Promise<MarketDataSnapshot> {
    const { url, apiKey } = bcvApi()
    if (!url) return { status: 'unavailable', reason: 'not-configured' }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
        // Revalidación controlada: la cinta no necesita golpear la fuente en
        // cada visita.
        next: { revalidate: 300 },
      })

      if (!response.ok) return { status: 'unavailable', reason: 'source-error' }

      const payload = (await response.json()) as {
        quotes?: RawQuote[]
        updatedAt?: unknown
        source?: { name?: unknown; url?: unknown }
      }

      const quotes = (payload.quotes ?? []).map(toQuote).filter((quote): quote is MarketQuote =>
        Boolean(quote),
      )

      if (quotes.length === 0) return { status: 'unavailable', reason: 'source-error' }

      const updatedAt =
        typeof payload.updatedAt === 'string' && !Number.isNaN(Date.parse(payload.updatedAt))
          ? new Date(payload.updatedAt).toISOString()
          : new Date().toISOString()

      return {
        status: 'available',
        isSimulated: false,
        quotes,
        updatedAt,
        source: {
          name:
            typeof payload.source?.name === 'string' && payload.source.name.trim()
              ? payload.source.name.trim()
              : 'Fuente oficial',
          url: typeof payload.source?.url === 'string' ? payload.source.url : null,
        },
      }
    } catch (error) {
      const aborted = error instanceof Error && error.name === 'AbortError'
      return { status: 'unavailable', reason: aborted ? 'timeout' : 'source-error' }
    } finally {
      clearTimeout(timer)
    }
  },
}
