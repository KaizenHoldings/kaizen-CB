import 'server-only'

import { msGraph } from '@/lib/env'

import { createGraphMailer, type Mailer } from './graph-mailer'
import { unconfiguredMailer } from './unconfigured-mailer'

/**
 * Cliente de correo en uso.
 *
 * Se resuelve en cada llamada para que un despliegue que añada las variables no
 * exija reconstruir el módulo.
 */
export const resolveMailer = (): Mailer => {
  const { tenantId, clientId, clientSecret, senderEmail } = msGraph()

  /* Se nombra la variable ausente, no «faltan credenciales»: sin el nombre
     concreto hay que ir probando. Ningún valor llega al registro. */
  const ausentes = [
    !tenantId && 'MS_GRAPH_TENANT_ID',
    !clientId && 'MS_GRAPH_CLIENT_ID',
    !clientSecret && 'MS_GRAPH_CLIENT_SECRET',
    !senderEmail && 'MS_GRAPH_SENDER_EMAIL',
  ].filter((nombre): nombre is string => typeof nombre === 'string')

  if (!tenantId || !clientId || !clientSecret || !senderEmail) {
    console.error(
      `Microsoft Graph sin configurar: falta ${ausentes.join(', ')}. El formulario de contacto no puede enviar correo.`,
    )
    return unconfiguredMailer
  }

  return createGraphMailer({ tenantId, clientId, clientSecret, senderEmail })
}
