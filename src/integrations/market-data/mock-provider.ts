import { directionOf, type MarketQuote } from '@/modules/market-data/domain/market-quote'

import type { MarketDataProvider } from './market-data-provider'

/**
 * Proveedor de revisión visual.
 *
 * Solo se activa fuera de producción (`lib/env` lo degrada a `unavailable`
 * cuando `NODE_ENV === 'production'`). Todo snapshot que devuelve lleva
 * `isSimulated: true`, y la interfaz está obligada a rotularlo como dato
 * simulado: estas cifras no son ni pueden presentarse como información real.
 */
const SIMULATED: Array<Omit<MarketQuote, 'direction'>> = [
  { id: 'sim:1', symbol: 'AAA', name: 'Emisor de prueba A', value: 100, unit: 'Bs.', changePercent: 1.25 },
  { id: 'sim:2', symbol: 'BBB', name: 'Emisor de prueba B', value: 250.5, unit: 'Bs.', changePercent: -0.75 },
  { id: 'sim:3', symbol: 'CCC', name: 'Emisor de prueba C', value: 42.1, unit: 'Bs.', changePercent: 0 },
  { id: 'sim:4', symbol: 'DDD', name: 'Emisor de prueba D', value: 18.4, unit: 'Bs.', changePercent: 2.4 },
  { id: 'sim:5', symbol: 'EEE', name: 'Emisor de prueba E', value: 76.9, unit: 'Bs.', changePercent: -1.6 },
]

export const mockMarketDataProvider: MarketDataProvider = {
  name: 'mock',
  async getTickerData() {
    return {
      status: 'available',
      isSimulated: true,
      updatedAt: new Date().toISOString(),
      source: { name: 'Datos simulados de desarrollo', url: null },
      quotes: SIMULATED.map((quote) => ({
        ...quote,
        direction: directionOf(quote.changePercent),
      })),
    }
  },
}
