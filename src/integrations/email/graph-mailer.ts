import 'server-only'

/**
 * Envío de correo por Microsoft Graph con credenciales de aplicación.
 *
 * Flujo `client_credentials`: la aplicación se autentica contra Entra ID sin
 * usuario delegado y envía en nombre del buzón que indica `senderEmail`. Ese
 * buzón debe tener concedido el permiso de aplicación `Mail.Send`.
 *
 * Ni el token ni el secreto salen nunca de este módulo: la capa que lo usa solo
 * recibe un resultado.
 */

export type GraphCredentials = {
  tenantId: string
  clientId: string
  clientSecret: string
  /** Buzón desde el que sale el correo (UPN o dirección). */
  senderEmail: string
}

export type MailMessage = {
  to: string
  subject: string
  /** Cuerpo en HTML. Graph lo entrega tal cual. */
  html: string
}

export type MailResult = { status: 'sent' } | { status: 'error' }

export interface Mailer {
  readonly name: string
  readonly isConfigured: boolean
  send(message: MailMessage): Promise<MailResult>
}

/** Corte de la espera: una petición web no debe colgarse de un tercero. */
const TIMEOUT_MS = 10_000

/** Margen antes de la expiración: se renueva el token antes de que caduque. */
const TOKEN_MARGIN_MS = 60_000

type CachedToken = { value: string; expiresAt: number }

/**
 * Token de aplicación, cacheado en memoria del proceso.
 *
 * Entra ID los emite con una hora de validez; pedir uno nuevo en cada envío
 * añadiría una ida y vuelta innecesaria y acabaría topando con el límite de
 * peticiones del inquilino.
 */
const requestToken = async (
  credentials: GraphCredentials,
  cache: { current: CachedToken | null },
): Promise<string | null> => {
  const ahora = Date.now()
  if (cache.current && cache.current.expiresAt - TOKEN_MARGIN_MS > ahora) {
    return cache.current.value
  }

  const url = `https://login.microsoftonline.com/${encodeURIComponent(credentials.tenantId)}/oauth2/v2.0/token`

  const cuerpo = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    scope: 'https://graph.microsoft.com/.default',
    grant_type: 'client_credentials',
  })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: cuerpo,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  })

  if (!response.ok) {
    let detalle: unknown = null
    try {
      detalle = await response.json()
    } catch {
      detalle = null
    }
    /* Al registro del servidor, nunca a la respuesta. `error_description` de
       Entra ID nombra la causa exacta —secreto caducado, permiso sin conceder,
       inquilino equivocado— y no contiene el secreto. */
    console.error('Microsoft Graph: no se pudo obtener el token de aplicación:', {
      status: response.status,
      error: (detalle as { error?: unknown })?.error,
      description: String((detalle as { error_description?: unknown })?.error_description ?? '').slice(
        0,
        300,
      ),
    })
    return null
  }

  const datos = (await response.json()) as { access_token?: string; expires_in?: number }
  if (!datos.access_token) return null

  cache.current = {
    value: datos.access_token,
    expiresAt: ahora + (datos.expires_in ?? 3600) * 1000,
  }

  return datos.access_token
}

export const createGraphMailer = (credentials: GraphCredentials): Mailer => {
  // Vive en el cierre, no en el módulo: cada instancia tiene su propio token.
  const cache: { current: CachedToken | null } = { current: null }

  return {
    name: 'microsoft-graph',
    isConfigured: true,

    async send({ to, subject, html }): Promise<MailResult> {
      try {
        const token = await requestToken(credentials, cache)
        if (!token) return { status: 'error' }

        const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(credentials.senderEmail)}/sendMail`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              subject,
              body: { contentType: 'HTML', content: html },
              toRecipients: [{ emailAddress: { address: to } }],
            },
            /* Se guarda en Elementos enviados: deja rastro auditable en el buzón
               de la institución de cada aviso que sale del sitio. */
            saveToSentItems: true,
          }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
          cache: 'no-store',
        })

        // `sendMail` responde 202 sin cuerpo cuando acepta el envío.
        if (response.ok) return { status: 'sent' }

        let detalle: unknown = null
        try {
          detalle = await response.json()
        } catch {
          detalle = null
        }

        console.error('Microsoft Graph API Error:', {
          status: response.status,
          code: (detalle as { error?: { code?: unknown } })?.error?.code,
          message: String((detalle as { error?: { message?: unknown } })?.error?.message ?? '').slice(
            0,
            300,
          ),
        })

        return { status: 'error' }
      } catch (causa) {
        // Red caída, DNS o el corte de los 10 s.
        console.error('Microsoft Graph: la petición no llegó a completarse:', causa)
        return { status: 'error' }
      }
    },
  }
}
