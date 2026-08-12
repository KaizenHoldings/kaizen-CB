import 'server-only'

import type { EmailProvider } from '@/integrations/email/email-provider'
import { resolveEmailProvider } from '@/integrations/email/resolve-provider'
import { rateLimit } from '@/lib/rate-limit'

import type { SubscriberRepository } from '../data/subscriber.repository'
import { payloadSubscriberRepository } from '../data/subscriber.repository'
import type { SubscriptionOutcome, SubscriptionRequest } from '../domain/subscription'
import { isValidEmail, normalizeEmail } from '../domain/subscription'

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 } // 5 intentos cada 10 minutos

export class SubscriptionService {
  constructor(
    private readonly repository: SubscriberRepository = payloadSubscriberRepository,
    private readonly emailProvider: EmailProvider = resolveEmailProvider(),
  ) {}

  /**
   * Valida en servidor —sin confiar en la validación del cliente—, normaliza,
   * registra el consentimiento y responde siempre de forma genérica.
   */
  async subscribe(
    request: SubscriptionRequest,
    context: { clientKey: string },
  ): Promise<SubscriptionOutcome> {
    if (!request.consentAccepted) return { status: 'consent-required' }
    if (!isValidEmail(request.email)) return { status: 'invalid-email' }

    const email = normalizeEmail(request.email)

    // Doble cubo: por origen y por correo. El segundo evita que rotar la IP
    // permita machacar una misma dirección.
    const byClient = rateLimit(`newsletter:client:${context.clientKey}`, RATE_LIMIT)
    if (!byClient.allowed) return { status: 'rate-limited' }

    const byEmail = rateLimit(`newsletter:email:${email}`, { limit: 3, windowMs: 60 * 60 * 1000 })
    if (!byEmail.allowed) return { status: 'rate-limited' }

    try {
      await this.repository.upsert({
        email,
        consentTimestamp: new Date().toISOString(),
        source: request.source,
      })
    } catch {
      // El detalle del error no sale al cliente ni al log: puede contener el
      // correo o datos de la conexión.
      return { status: 'error' }
    }

    // La confirmación queda encolada en la capa de integración. Mientras no
    // haya proveedor configurado, el proveedor «no configurado» no hace nada:
    // no se envían correos desde dentro de la petición web.
    await this.emailProvider.enqueueSubscriptionConfirmation({ email })

    return { status: 'accepted' }
  }
}

export const subscriptionService = new SubscriptionService()
