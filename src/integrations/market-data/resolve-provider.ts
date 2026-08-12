import 'server-only'

import { marketDataProvider } from '@/lib/env'

import { bcvMarketDataProvider } from './bcv-provider'
import type { MarketDataProvider } from './market-data-provider'
import { mockMarketDataProvider } from './mock-provider'
import { unavailableMarketDataProvider } from './unavailable-provider'

/**
 * Selección del proveedor según `MARKET_DATA_PROVIDER`.
 * `lib/env` ya impide que `mock` se active en producción.
 */
export const resolveMarketDataProvider = (): MarketDataProvider => {
  switch (marketDataProvider()) {
    case 'bcv':
      return bcvMarketDataProvider
    case 'mock':
      return mockMarketDataProvider
    default:
      return unavailableMarketDataProvider
  }
}
