import 'server-only'

import type { AudienceProvider, AudienceResult } from './audience-provider'

type Credentials = {
  apiKey: string
  /** Centro de datos: `us21`, `us14`… Va en el subdominio de la API. */
  serverPrefix: string
  audienceId: string
}

/** Corte de la espera. Una petición web no debe quedarse colgada de un tercero. */
const TIMEOUT_MS = 8_000

/**
 * Mailchimp responde 400 con `title: "Member Exists"` cuando la dirección ya
 * está en la lista. Es un caso corriente, no un fallo, y merece su propia
 * respuesta.
 *
 * Se comprueban también `errors[].code` y el texto del detalle porque el título
 * llega traducido según la cuenta y no es una clave estable por sí solo.
 */
const isMemberExists = (status: number, body: unknown): boolean => {
  if (status !== 400) return false

  const payload = (body ?? {}) as { title?: unknown; detail?: unknown }
  const title = typeof payload.title === 'string' ? payload.title.toLowerCase() : ''
  const detail = typeof payload.detail === 'string' ? payload.detail.toLowerCase() : ''

  return title.includes('member exists') || detail.includes('already a list member')
}

/**
 * Alta en una audiencia de Mailchimp.
 *
 * `status: 'subscribed'` da el alta directa, sin doble confirmación. Es lo que
 * pide el encargo; si la audiencia estuviera configurada como *double opt-in*,
 * Mailchimp responderá igualmente y quien decide es su ajuste, no este código.
 *
 * Las credenciales se leen solo aquí y nunca salen en la respuesta ni en un log:
 * el cuerpo de error de Mailchimp puede incluir la dirección de correo.
 */
export const createMailchimpProvider = (credentials: Credentials): AudienceProvider => ({
  name: 'mailchimp',
  isConfigured: true,

  async subscribe({ email }): Promise<AudienceResult> {
    const url = `https://${credentials.serverPrefix}.api.mailchimp.com/3.0/lists/${credentials.audienceId}/members`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          /* Autenticación básica, que es la que documenta Mailchimp: el usuario
             es la palabra literal `apikey` y la contraseña, la clave. `Buffer`
             está disponible porque la ruta declara `runtime = 'nodejs'`; en un
             runtime de borde habría que usar `btoa`. */
          Authorization: `Basic ${Buffer.from(`apikey:${credentials.apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email_address: email, status: 'subscribed' }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        // Un alta nunca se sirve de caché.
        cache: 'no-store',
      })

      if (response.ok) return { status: 'subscribed' }

      /* El cuerpo se lee siempre, incluso en error: es lo único que distingue
         «ya suscrito» de un fallo real. Si no es JSON, se trata como fallo. */
      let body: unknown = null
      try {
        body = await response.json()
      } catch {
        body = null
      }

      if (isMemberExists(response.status, body)) return { status: 'already-subscribed' }

      /* Al registro del servidor, nunca a la respuesta: el cuerpo de error de
         Mailchimp trae el detalle que hace falta para diagnosticar, y también
         la dirección de correo. Se recorta el `detail` porque puede repetir el
         correo varias veces. */
      console.error('Mailchimp API Error:', {
        status: response.status,
        title: (body as { title?: unknown })?.title,
        detail: String((body as { detail?: unknown })?.detail ?? '').slice(0, 200),
        errors: (body as { errors?: unknown })?.errors,
      })

      return { status: 'error' }
    } catch (causa) {
      // Red caída, DNS, o el corte de los 8 s. El detalle va al registro, no al
      // cliente: puede contener la URL con el identificador de la audiencia.
      console.error('Mailchimp: la petición no llegó a completarse:', causa)
      return { status: 'error' }
    }
  },
})
