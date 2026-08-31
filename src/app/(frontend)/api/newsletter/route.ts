import { NextResponse } from 'next/server'

import { serverUrl } from '@/lib/env'
import { communicationService } from '@/modules/communications/services/communication.service'
import type { SubscriptionOutcome } from '@/modules/subscriptions/domain/subscription'
import { SUBSCRIPTION_MESSAGES } from '@/modules/subscriptions/domain/subscription'
import { subscriptionService } from '@/modules/subscriptions/services/subscription.service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HTTP_STATUS: Record<SubscriptionOutcome['status'], number> = {
  accepted: 202,
  // 400 y no 409: el encargo pide que el correo ya suscrito llegue al cliente
  // como un error de la solicitud, igual que un correo mal escrito.
  'already-subscribed': 400,
  'invalid-email': 400,
  'consent-required': 400,
  'rate-limited': 429,
  error: 503,
}

const respond = (outcome: SubscriptionOutcome) =>
  NextResponse.json(
    { status: outcome.status, message: SUBSCRIPTION_MESSAGES[outcome.status] },
    { status: HTTP_STATUS[outcome.status] },
  )

/**
 * Único punto de escritura pública de la aplicación.
 *
 * Valida en servidor, normaliza el correo, aplica límite de tasa, guarda el
 * consentimiento en Payload y da de alta la dirección en la audiencia de
 * Mailchimp. Las credenciales del proveedor viven en el servidor y no aparecen
 * ni en la respuesta ni en los logs.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!communicationService.isSameOrigin(request.headers, serverUrl)) {
    /* Tercer camino al mismo mensaje genérico, y el más difícil de adivinar: si
       el sitio se sirve tras un proxy inverso con un dominio distinto del que
       declara `NEXT_PUBLIC_SERVER_URL`, toda suscripción se rechaza aquí sin
       haber tocado ni la base de datos ni Mailchimp. */
    console.error(
      `Suscripción rechazada por origen: llegó "${request.headers.get('origin')}" y NEXT_PUBLIC_SERVER_URL declara "${serverUrl}".`,
    )
    return respond({ status: 'error' })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return respond({ status: 'invalid-email' })
  }

  const payload = (body ?? {}) as Record<string, unknown>

  // Trampa para bots: se acepta la petición con la misma respuesta de éxito
  // para no darle señal al automatismo, pero no se registra nada.
  if (communicationService.isHoneypotTriggered(payload.company)) {
    return respond({ status: 'accepted' })
  }

  const email = typeof payload.email === 'string' ? payload.email : ''
  const consentAccepted = payload.consentAccepted === true

  const outcome = await subscriptionService.subscribe(
    { email, consentAccepted, source: 'newsletter-home' },
    { clientKey: communicationService.clientKey(request.headers) },
  )

  return respond(outcome)
}
