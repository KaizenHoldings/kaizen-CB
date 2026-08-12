import 'server-only'

import { clientKeyFromHeaders, rateLimit } from '@/lib/rate-limit'

/**
 * Lógica común a los formularios y comunicaciones públicas.
 *
 * Hoy solo existe el formulario de newsletter, pero la validación de origen y
 * la protección contra abuso viven aquí para que cualquier formulario futuro
 * (contacto, solicitud de asesoría) las reutilice en vez de reimplementarlas.
 */
export type FormChannel = 'newsletter' | 'contact'

export class CommunicationService {
  /**
   * Identificador estable del cliente para el limitador de tasa, derivado solo
   * de cabeceras de red. No se guarda ni se registra.
   */
  clientKey(headers: Headers): string {
    return clientKeyFromHeaders(headers)
  }

  /**
   * Comprueba que el envío venga del propio sitio. Es una barrera contra
   * automatización simple, nunca el único control: la validación de datos y el
   * rate limiting se aplican igualmente.
   */
  isSameOrigin(headers: Headers, serverUrl: string): boolean {
    const origin = headers.get('origin')
    if (!origin) return true // navegadores antiguos y peticiones same-origin sin cabecera

    try {
      return new URL(origin).origin === new URL(serverUrl).origin
    } catch {
      return false
    }
  }

  /** Cubo genérico por canal, para formularios que aún no tienen servicio propio. */
  throttle(channel: FormChannel, clientKey: string, limit = 5, windowMs = 10 * 60 * 1000) {
    return rateLimit(`${channel}:${clientKey}`, { limit, windowMs })
  }

  /**
   * Trampa para bots: un campo oculto que una persona nunca completa.
   * Devuelve `true` cuando el envío debe descartarse en silencio.
   */
  isHoneypotTriggered(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0
  }
}

export const communicationService = new CommunicationService()
