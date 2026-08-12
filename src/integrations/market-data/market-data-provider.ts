import type { MarketDataSnapshot } from '@/modules/market-data/domain/market-quote'

/**
 * Contrato de la fuente de datos de mercado / Banco Central.
 *
 * Definido en `TECHNICAL_ARCHITECTURE`. La implementación oficial se conectará
 * aquí cuando se confirmen la API, sus términos y su esquema de respuesta.
 */
export interface MarketDataProvider {
  readonly name: string
  /**
   * Nunca lanza: un fallo de la fuente se traduce en un snapshot
   * `unavailable`, porque la cinta no debe romper la navegación.
   */
  getTickerData(): Promise<MarketDataSnapshot>
}
