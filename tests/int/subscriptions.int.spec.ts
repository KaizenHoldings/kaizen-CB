import { describe, expect, it } from 'vitest'

import type { EmailProvider } from '@/integrations/email/email-provider'
import type { AudienceProvider } from '@/integrations/newsletter/audience-provider'
import type { SubscriberRepository } from '@/modules/subscriptions/data/subscriber.repository'
import { isValidEmail, normalizeEmail } from '@/modules/subscriptions/domain/subscription'
import { SubscriptionService } from '@/modules/subscriptions/services/subscription.service'

const silentProvider: EmailProvider = {
  name: 'test',
  isConfigured: false,
  async enqueueSubscriptionConfirmation() {},
}

/**
 * Doble de la audiencia. **Obligatorio en cada construcción del servicio.**
 *
 * El tercer argumento del constructor cae por defecto en `resolveAudienceProvider()`,
 * que es el proveedor real: omitirlo hace que la suite dé de alta direcciones de
 * prueba en la audiencia de producción del cliente. Ya ocurrió una vez y hubo que
 * borrar siete registros a mano.
 */
const audienciaFalsa = (): AudienceProvider & { readonly altas: string[] } => {
  const altas: string[] = []
  return {
    name: 'test',
    isConfigured: true,
    altas,
    async subscribe({ email }) {
      // Modela el comportamiento real: la segunda alta del mismo correo ya existe.
      if (altas.includes(email)) return { status: 'already-subscribed' }
      altas.push(email)
      return { status: 'subscribed' }
    },
  }
}

const recordingRepository = () => {
  const seen: string[] = []
  const repository: SubscriberRepository = {
    async upsert({ email }) {
      seen.push(email)
      return true
    },
  }
  return { repository, seen }
}

/** Cada prueba usa su propia clave para no compartir el cubo del limitador. */
let counter = 0
const uniqueContext = () => ({ clientKey: `test-${Date.now()}-${counter++}` })
const uniqueEmail = () => `Persona.${Date.now()}.${counter++}@Ejemplo.COM`

describe('validación de correo', () => {
  it('acepta direcciones plausibles y rechaza las que no lo son', () => {
    expect(isValidEmail('persona@ejemplo.com')).toBe(true)
    expect(isValidEmail('persona@ejemplo')).toBe(false)
    expect(isValidEmail('persona ejemplo.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })

  it('normaliza a minúsculas y sin espacios', () => {
    expect(normalizeEmail('  Persona@Ejemplo.COM ')).toBe('persona@ejemplo.com')
  })
})

describe('SubscriptionService', () => {
  it('exige consentimiento antes que cualquier otra cosa', async () => {
    const { repository, seen } = recordingRepository()
    const service = new SubscriptionService(repository, silentProvider, audienciaFalsa())

    const outcome = await service.subscribe(
      { email: 'persona@ejemplo.com', consentAccepted: false, source: 'test' },
      uniqueContext(),
    )

    expect(outcome.status).toBe('consent-required')
    expect(seen).toEqual([])
  })

  it('vuelve a validar en servidor aunque el cliente ya lo hiciera', async () => {
    const { repository, seen } = recordingRepository()
    const service = new SubscriptionService(repository, silentProvider, audienciaFalsa())

    const outcome = await service.subscribe(
      { email: 'no-es-un-correo', consentAccepted: true, source: 'test' },
      uniqueContext(),
    )

    expect(outcome.status).toBe('invalid-email')
    expect(seen).toEqual([])
  })

  it('normaliza el correo antes de guardarlo', async () => {
    const { repository, seen } = recordingRepository()
    const service = new SubscriptionService(repository, silentProvider, audienciaFalsa())
    const email = uniqueEmail()

    const outcome = await service.subscribe(
      { email, consentAccepted: true, source: 'newsletter-home' },
      uniqueContext(),
    )

    expect(outcome.status).toBe('accepted')
    expect(seen).toEqual([email.trim().toLowerCase()])
  })

  /* El contrato cambió a petición del encargo: antes un correo repetido devolvía
     «accepted» para no revelar qué direcciones estaban registradas. Ahora se
     distingue, y el formulario lo dice. Queda anotado porque es una decisión de
     producto, no una regresión. */
  it('distingue un correo que ya estaba en la audiencia', async () => {
    const repository: SubscriberRepository = { async upsert() { return true } }
    const audiencia = audienciaFalsa()
    const service = new SubscriptionService(repository, silentProvider, audiencia)
    const email = uniqueEmail()

    const first = await service.subscribe(
      { email, consentAccepted: true, source: 'test' },
      uniqueContext(),
    )
    const second = await service.subscribe(
      { email, consentAccepted: true, source: 'test' },
      uniqueContext(),
    )

    expect(first.status).toBe('accepted')
    expect(second.status).toBe('already-subscribed')
  })

  it('limita la tasa por origen', async () => {
    const { repository } = recordingRepository()
    const service = new SubscriptionService(repository, silentProvider, audienciaFalsa())
    const context = uniqueContext()

    const results = []
    for (let index = 0; index < 7; index++) {
      results.push(
        await service.subscribe(
          { email: uniqueEmail(), consentAccepted: true, source: 'test' },
          context,
        ),
      )
    }

    expect(results.slice(0, 5).every((r) => r.status === 'accepted')).toBe(true)
    expect(results.at(-1)?.status).toBe('rate-limited')
  })

  it('convierte un fallo del repositorio en un error genérico, sin filtrar detalles', async () => {
    const service = new SubscriptionService(
      {
        async upsert() {
          throw new Error('conexión a postgres://usuario:clave@host rechazada')
        },
      },
      silentProvider,
      audienciaFalsa(),
    )

    const outcome = await service.subscribe(
      { email: uniqueEmail(), consentAccepted: true, source: 'test' },
      uniqueContext(),
    )

    expect(outcome).toEqual({ status: 'error' })
  })
})
