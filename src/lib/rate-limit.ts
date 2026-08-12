import 'server-only'

/**
 * Limitador de tasa en memoria por ventana deslizante.
 *
 * Suficiente para una instancia única de desarrollo o un despliegue de un solo
 * proceso. Al escalar horizontalmente debe sustituirse por un almacén
 * compartido (Redis o similar) detrás de esta misma interfaz.
 */
type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Evita que el mapa crezca sin límite si llegan muchas claves distintas. */
const MAX_TRACKED_KEYS = 5_000

const sweep = (now: number): void => {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export type RateLimitResult = {
  allowed: boolean
  /** Segundos hasta que la ventana se reinicia. */
  retryAfterSeconds: number
}

export const rateLimit = (
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult => {
  const now = Date.now()

  if (buckets.size > MAX_TRACKED_KEYS) sweep(now)

  const existing = buckets.get(key)

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  existing.count += 1

  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  return { allowed: true, retryAfterSeconds: 0 }
}

/**
 * Identificador del cliente a partir de las cabeceras del proxy.
 * Si no hay ninguna, todas las peticiones comparten el mismo cubo: es la opción
 * conservadora frente a dejar el endpoint sin protección.
 */
export const clientKeyFromHeaders = (headers: Headers): string => {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return headers.get('x-real-ip')?.trim() || 'unknown-client'
}
