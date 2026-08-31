import type { Mailer } from './graph-mailer'

/**
 * Buzón inexistente: sin credenciales no se envía nada y se dice.
 *
 * Devolver `error` y no `sent` es deliberado. Dar por entregado un mensaje que
 * nadie recibió es la peor respuesta posible en un formulario de contacto:
 * quien escribe se queda esperando una contestación que no va a llegar.
 */
export const unconfiguredMailer: Mailer = {
  name: 'unconfigured',
  isConfigured: false,
  async send() {
    return { status: 'error' }
  },
}
