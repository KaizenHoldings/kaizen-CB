import 'server-only'

import { getPayloadClient } from '@/lib/payload-client'

export interface SubscriberRepository {
  /**
   * Registra la suscripción. Devuelve `true` si la operación terminó bien,
   * tanto si creó el registro como si el correo ya existía.
   */
  upsert(input: { email: string; consentTimestamp: string; source: string }): Promise<boolean>
}

/**
 * `overrideAccess: true` es deliberado y está acotado a este repositorio: la
 * colección `subscribers` niega `create` a toda petición por API, y la única
 * vía de alta es el endpoint controlado que llama a este método tras validar,
 * normalizar y limitar la tasa.
 */
export const payloadSubscriberRepository: SubscriberRepository = {
  async upsert({ email, consentTimestamp, source }) {
    const payload = await getPayloadClient()

    const existing = await payload.find({
      collection: 'subscribers',
      overrideAccess: true,
      limit: 1,
      pagination: false,
      where: { email: { equals: email } },
    })

    const current = existing.docs[0]

    if (current) {
      // Un correo dado de baja que vuelve a suscribirse recupera el estado
      // pendiente y renueva su consentimiento. El resto no se toca.
      if (current.status === 'unsubscribed') {
        await payload.update({
          collection: 'subscribers',
          id: current.id,
          overrideAccess: true,
          data: { status: 'pending', consentAccepted: true, consentTimestamp, source },
        })
      }
      return true
    }

    await payload.create({
      collection: 'subscribers',
      overrideAccess: true,
      data: {
        email,
        status: 'pending',
        consentAccepted: true,
        consentTimestamp,
        source,
      },
    })

    return true
  },
}
