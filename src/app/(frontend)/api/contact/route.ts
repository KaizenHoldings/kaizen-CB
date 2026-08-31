import { NextResponse } from 'next/server'

import { serverUrl } from '@/lib/env'
import { communicationService } from '@/modules/communications/services/communication.service'
import type { ContactOutcome } from '@/modules/contact/domain/contact'
import { CONTACT_MESSAGES, LIMITS } from '@/modules/contact/domain/contact'
import { contactService } from '@/modules/contact/services/contact.service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const HTTP_STATUS: Record<ContactOutcome['status'], number> = {
  sent: 200,
  invalid: 400,
  'rate-limited': 429,
  error: 500,
}

const respond = (outcome: ContactOutcome) =>
  NextResponse.json(
    { status: outcome.status, message: CONTACT_MESSAGES[outcome.status] },
    { status: HTTP_STATUS[outcome.status] },
  )

const readString = (value: unknown, max: number): string =>
  typeof value === 'string' ? value.slice(0, max) : ''

/**
 * Formulario de contacto.
 *
 * Entrega el mensaje al buzón de la institución por Microsoft Graph. Ningún
 * secreto de Graph sale de aquí: al navegador solo viaja `status` y un texto en
 * castellano, y las causas técnicas van al registro del servidor.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!communicationService.isSameOrigin(request.headers, serverUrl)) {
    console.error(
      `Contacto rechazado por origen: llegó "${request.headers.get('origin')}" y NEXT_PUBLIC_SERVER_URL declara "${serverUrl}".`,
    )
    return respond({ status: 'error' })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return respond({ status: 'invalid' })
  }

  const payload = (body ?? {}) as Record<string, unknown>

  // Trampa para bots: se responde como si todo hubiera ido bien, pero no se
  // envía nada. Es el mismo criterio que en el newsletter.
  if (communicationService.isHoneypotTriggered(payload.company)) {
    return respond({ status: 'sent' })
  }

  /* Se recorta en la entrada, antes de validar: así un cuerpo enorme no llega
     a construir un correo enorme. */
  const outcome = await contactService.send(
    {
      name: readString(payload.nombre ?? payload.name, LIMITS.name),
      email: readString(payload.correo ?? payload.email, LIMITS.email),
      message: readString(payload.mensaje ?? payload.message, LIMITS.message),
    },
    { clientKey: communicationService.clientKey(request.headers) },
  )

  return respond(outcome)
}
