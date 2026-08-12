/**
 * Lectura y validación de variables de entorno.
 *
 * Solo `NEXT_PUBLIC_SERVER_URL` puede llegar al navegador. Todo lo demás se
 * consulta exclusivamente desde el servidor y nunca se registra en logs.
 */

type RequiredKey = 'DATABASE_URI' | 'PAYLOAD_SECRET'

const readRequired = (key: RequiredKey): string => {
  const value = process.env[key]
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Falta la variable de entorno obligatoria ${key}. Copia .env.example como .env y complétala.`,
    )
  }
  return value
}

const readOptional = (key: string): string | undefined => {
  const value = process.env[key]
  return value && value.trim().length > 0 ? value.trim() : undefined
}

/** URL pública absoluta, sin barra final. */
export const serverUrl = (
  readOptional('NEXT_PUBLIC_SERVER_URL') ?? 'http://localhost:3000'
).replace(/\/+$/, '')

export const isProduction = process.env.NODE_ENV === 'production'

export const databaseUri = (): string => readRequired('DATABASE_URI')

export const payloadSecret = (): string => readRequired('PAYLOAD_SECRET')

export type MarketDataProviderName = 'unavailable' | 'mock' | 'bcv'

/**
 * Selección del proveedor de datos de mercado.
 *
 * `mock` queda bloqueado en producción: presentar cifras simuladas como reales
 * está expresamente prohibido. `bcv` exige la URL de la API oficial; sin ella
 * se degrada a `unavailable` en lugar de fallar la petición.
 */
export const marketDataProvider = (): MarketDataProviderName => {
  const requested = readOptional('MARKET_DATA_PROVIDER')?.toLowerCase()

  if (requested === 'mock') {
    return isProduction ? 'unavailable' : 'mock'
  }

  if (requested === 'bcv') {
    return readOptional('BCV_API_URL') ? 'bcv' : 'unavailable'
  }

  return 'unavailable'
}

export const bcvApi = () => ({
  url: readOptional('BCV_API_URL'),
  apiKey: readOptional('BCV_API_KEY'),
})

export const emailProvider = () => ({
  name: readOptional('EMAIL_PROVIDER'),
  apiKey: readOptional('EMAIL_PROVIDER_API_KEY'),
  from: readOptional('EMAIL_FROM_ADDRESS'),
})

export const storageProvider = () => ({
  bucket: readOptional('STORAGE_BUCKET'),
  region: readOptional('STORAGE_REGION'),
  endpoint: readOptional('STORAGE_ENDPOINT'),
  accessKey: readOptional('STORAGE_ACCESS_KEY'),
  secretKey: readOptional('STORAGE_SECRET_KEY'),
})

/**
 * Comprobación temprana al construir la configuración de Payload: si falta una
 * variable obligatoria, la aplicación falla al arrancar y no a mitad de una
 * petición. El mensaje nunca incluye el valor.
 */
export const assertRequiredEnv = (): void => {
  readRequired('DATABASE_URI')
  readRequired('PAYLOAD_SECRET')
}
