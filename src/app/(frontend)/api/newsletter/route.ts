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
 * Valida en servidor, normaliza el correo, aplica límite de tasa y responde
 * siempre con un mensaje genérico: nunca revela si una dirección ya estaba
 * registrada.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!communicationService.isSameOrigin(request.headers, serverUrl)) {
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
