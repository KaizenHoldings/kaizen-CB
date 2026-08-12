import type { MarketDataProvider } from './market-data-provider'

/**
 * Estado inicial seguro: mientras no exista fuente oficial confirmada, la web
 * declara que no hay datos en lugar de mostrar cifras inventadas.
 */
export const unavailableMarketDataProvider: MarketDataProvider = {
  name: 'unavailable',
  async getTickerData() {
    return { status: 'unavailable', reason: 'not-configured' }
  },
}
