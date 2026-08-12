import 'server-only'

import { emailProvider as emailProviderEnv } from '@/lib/env'

import type { EmailProvider } from './email-provider'
import { unconfiguredEmailProvider } from './unconfigured-email-provider'

/**
 * Punto de conexión del proveedor de correo definitivo.
 *
 * Cuando se decida (Resend, SES, Mailchimp…), se implementa `EmailProvider` en
 * este mismo directorio y se devuelve aquí según `EMAIL_PROVIDER`. Las claves
 * se leen solo en servidor y nunca llegan al navegador.
 */
export const resolveEmailProvider = (): EmailProvider => {
  const { name, apiKey, from } = emailProviderEnv()

  if (!name || !apiKey || !from) return unconfiguredEmailProvider

  // Aún no hay proveedor aprobado: hasta entonces, no enviar es la opción
  // correcta frente a integrar un servicio sin autorización.
  return unconfiguredEmailProvider
}
