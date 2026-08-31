/**
 * Resultado de una solicitud de suscripción.
 *
 * `already-subscribed` se separó de `accepted` a petición expresa del encargo.
 * Conviene tenerlo presente: distinguirlos convierte el formulario en un oráculo
 * capaz de confirmar si una dirección concreta está en la lista, que es justo lo
 * que la respuesta genérica anterior evitaba. Es una decisión de producto —la
 * persona sabe que no hace falta reintentar—, no un descuido.
 */
export type SubscriptionOutcome =
  | { status: 'accepted' }
  | { status: 'already-subscribed' }
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

/** Mensajes de la interfaz. */
export const SUBSCRIPTION_MESSAGES: Record<SubscriptionOutcome['status'], string> = {
  accepted: 'Listo. Si todo está en orden, recibirás nuestras próximas comunicaciones.',
  'already-subscribed': 'Este correo ya está suscrito.',
  'invalid-email': 'Revisa el correo: parece que le falta algo.',
  'consent-required': 'Necesitamos tu autorización para escribirte.',
  'rate-limited': 'Recibimos varias solicitudes desde aquí. Inténtalo de nuevo en unos minutos.',
  error: 'No pudimos registrar tu suscripción. Inténtalo más tarde o escríbenos por correo.',
}
