import 'server-only'

import type { Mailer } from '@/integrations/email/graph-mailer'
import { resolveMailer } from '@/integrations/email/resolve-mailer'
import { contactRecipient } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'

import type { ContactOutcome, ContactRequest } from '../domain/contact'
import { buildContactEmailHtml, CONTACT_SUBJECT, validateContact } from '../domain/contact'

/** Más estricto que el del newsletter: un mensaje escrito lleva su tiempo. */
const RATE_LIMIT = { limit: 3, windowMs: 15 * 60 * 1000 }

export class ContactService {
  constructor(
    private readonly mailer: Mailer = resolveMailer(),
    private readonly recipient: string | undefined = contactRecipient(),
  ) {}

  /**
   * Valida en servidor —sin confiar en el navegador—, limita la tasa y entrega
   * el mensaje al buzón de la institución.
   *
   * No se guarda nada: a diferencia del newsletter, aquí no hay consentimiento
   * que registrar ni lista que mantener, así que persistir el mensaje sería
   * acumular datos personales sin una razón que lo justifique.
   */
  async send(request: ContactRequest, context: { clientKey: string }): Promise<ContactOutcome> {
    if (!validateContact(request)) return { status: 'invalid' }

    const porCliente = rateLimit(`contact:client:${context.clientKey}`, RATE_LIMIT)
    if (!porCliente.allowed) return { status: 'rate-limited' }

    if (!this.recipient) {
      console.error(
        'Formulario de contacto sin destinatario: falta CONTACT_FORM_RECIPIENT. El mensaje no se envía.',
      )
      return { status: 'error' }
    }

    const resultado = await this.mailer.send({
      to: this.recipient,
      subject: CONTACT_SUBJECT,
      html: buildContactEmailHtml(request, new Date()),
    })

    return resultado.status === 'sent' ? { status: 'sent' } : { status: 'error' }
  }
}

export const contactService = new ContactService()
