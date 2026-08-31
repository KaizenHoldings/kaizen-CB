import 'server-only'

import { mailchimpAudience } from '@/lib/env'

import type { AudienceProvider } from './audience-provider'
import { createMailchimpProvider } from './mailchimp-provider'
import { unconfiguredAudienceProvider } from './unconfigured-audience-provider'

/**
 * Proveedor de audiencia en uso.
 *
 * Se resuelve en cada llamada, no en un módulo de nivel superior: leer el
 * entorno al importar dejaría el proveedor congelado en el valor que hubiera
 * durante el build, que no es el del despliegue.
 */
export const resolveAudienceProvider = (): AudienceProvider => {
  const { apiKey, serverPrefix, audienceId } = mailchimpAudience()

  /* Se nombra la variable que falta, no «faltan credenciales»: sin el nombre
     concreto hay que ir probando. Nunca se registra ningún valor. */
  const ausentes = [
    !apiKey && 'MAILCHIMP_API_KEY',
    !serverPrefix && 'MAILCHIMP_SERVER_PREFIX',
    !audienceId && 'MAILCHIMP_AUDIENCE_ID',
  ].filter((nombre): nombre is string => typeof nombre === 'string')

  if (!apiKey || !serverPrefix || !audienceId) {
    console.error(
      `Mailchimp sin configurar: falta ${ausentes.join(', ')}. La suscripción se guarda en Payload, pero no se da de alta en la audiencia.`,
    )
    return unconfiguredAudienceProvider
  }

  /* El sufijo de la clave es el centro de datos. Si no coincide con el prefijo
     declarado, la petición sale hacia un servidor que no es el de la cuenta y
     el fallo no dice por qué. */
  const sufijo = apiKey.split('-').pop()
  if (sufijo && sufijo !== serverPrefix) {
    console.error(
      `Mailchimp: MAILCHIMP_SERVER_PREFIX es "${serverPrefix}" pero la clave termina en "${sufijo}". Deben coincidir.`,
    )
  }

  return createMailchimpProvider({ apiKey, serverPrefix, audienceId })
}
