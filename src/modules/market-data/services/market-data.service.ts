import type { MarketDataProvider } from '@/integrations/market-data/market-data-provider'
import { resolveMarketDataProvider } from '@/integrations/market-data/resolve-provider'

import type { MarketDataSnapshot } from '../domain/market-quote'

/**
 * Normaliza y protege el consumo de datos de mercado.
 *
 * La cinta superior y la tabla de cotizaciones consumen este mismo modelo, pero
 * el servicio no asume que ambas provendrán siempre de la misma fuente: cada
 * consumidor pide su snapshot y decide cuántos valores muestra.
 */
export class MarketDataService {
  constructor(private readonly provider: MarketDataProvider = resolveMarketDataProvider()) {}

  async getSnapshot(): Promise<MarketDataSnapshot> {
    try {
      const snapshot = await this.provider.getTickerData()

      // Un proveedor que devuelve «disponible» sin cotizaciones equivale a no
      // tener datos: no se muestra una cinta vacía como si fuera información.
      if (snapshot.status === 'available' && snapshot.quotes.length === 0) {
        return { status: 'unavailable', reason: 'source-error' }
      }

      return snapshot
    } catch {
      // Ningún error de integración debe romper el renderizado de la página.
      return { status: 'unavailable', reason: 'source-error' }
    }
  }
}

export const marketDataService = new MarketDataService()
