import { describe, expect, it } from 'vitest'

import type { MarketDataProvider } from '@/integrations/market-data/market-data-provider'
import { unavailableMarketDataProvider } from '@/integrations/market-data/unavailable-provider'
import { directionOf } from '@/modules/market-data/domain/market-quote'
import { MarketDataService } from '@/modules/market-data/services/market-data.service'

describe('directionOf', () => {
  it('clasifica la variación sin depender del color', () => {
    expect(directionOf(1.2)).toBe('up')
    expect(directionOf(-1.2)).toBe('down')
    expect(directionOf(0)).toBe('flat')
    expect(directionOf(null)).toBe('flat')
  })
})

describe('MarketDataService', () => {
  it('sin fuente oficial configurada declara la ausencia de datos', async () => {
    const snapshot = await new MarketDataService(unavailableMarketDataProvider).getSnapshot()

    expect(snapshot).toEqual({ status: 'unavailable', reason: 'not-configured' })
  })

  it('un proveedor que falla nunca rompe el renderizado', async () => {
    const broken: MarketDataProvider = {
      name: 'broken',
      async getTickerData() {
        throw new Error('la fuente respondió 500')
      },
    }

    const snapshot = await new MarketDataService(broken).getSnapshot()

    expect(snapshot).toEqual({ status: 'unavailable', reason: 'source-error' })
  })

  it('«disponible» sin cotizaciones se trata como ausencia de datos', async () => {
    const empty: MarketDataProvider = {
      name: 'empty',
      async getTickerData() {
        return {
          status: 'available',
          isSimulated: false,
          quotes: [],
          updatedAt: new Date().toISOString(),
          source: { name: 'Fuente', url: null },
        }
      },
    }

    const snapshot = await new MarketDataService(empty).getSnapshot()

    expect(snapshot.status).toBe('unavailable')
  })

  it('conserva la marca de simulación para que la interfaz pueda rotularla', async () => {
    const simulated: MarketDataProvider = {
      name: 'sim',
      async getTickerData() {
        return {
          status: 'available',
          isSimulated: true,
          updatedAt: '2026-04-30T12:00:00.000Z',
          source: { name: 'Datos simulados', url: null },
          quotes: [
            {
              id: 'sim:1',
              symbol: 'AAA',
              name: 'Emisor de prueba',
              value: 10,
              unit: 'Bs.',
              changePercent: 1,
              direction: 'up' as const,
            },
          ],
        }
      },
    }

    const snapshot = await new MarketDataService(simulated).getSnapshot()

    expect(snapshot.status).toBe('available')
    if (snapshot.status === 'available') {
      expect(snapshot.isSimulated).toBe(true)
      expect(snapshot.source.name).toBe('Datos simulados')
    }
  })
})
