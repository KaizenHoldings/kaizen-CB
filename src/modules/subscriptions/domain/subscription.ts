/**
 * Resultado de una solicitud de suscripción.
 *
 * `accepted` se devuelve tanto para un alta nueva como para un correo que ya
 * estaba registrado: la respuesta pública no revela qué direcciones existen.
 */
export type SubscriptionOutcome =
  | { status: 'accepted' }
  | { status: 'invalid-email' }
  | { status: 'consent-required' }
  | { status: 'rate-limited' }
  | { status: 'error' }

export type SubscriptionRequest = {
  email: string
  consentAccepted: boolean
  source: string
}

/** Validación de correo compartida por cliente y servidor. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

export const isValidEmail = (value: string): boolean => {
  const trimmed = value.trim()
  return trimmed.length > 0 && trimmed.length <= 254 && EMAIL_PATTERN.test(trimmed)
}

export const normalizeEmail = (value: string): string => value.trim().toLowerCase()

/**
 * Mensajes de la interfaz. Se mantienen genéricos a propósito: ninguno permite
 * deducir si un correo ya estaba suscrito.
 */
export const SUBSCRIPTION_MESSAGES: Record<SubscriptionOutcome['status'], string> = {
  accepted: 'Listo. Si todo está en orden, recibirás nuestras próximas comunicaciones.',
  'invalid-email': 'Revisa el correo: parece que le falta algo.',
  'consent-required': 'Necesitamos tu autorización para escribirte.',
  'rate-limited': 'Recibimos varias solicitudes desde aquí. Inténtalo de nuevo en unos minutos.',
  error: 'No pudimos registrar tu suscripción. Inténtalo más tarde o escríbenos por correo.',
}
