import type { EmailProvider } from './email-provider'

/**
 * Implementación segura mientras no se confirma el proveedor de correo.
 *
 * No envía nada y no falla: la suscripción queda registrada en Payload con su
 * consentimiento, y el estado `pending` documenta que aún falta la doble
 * confirmación por correo.
 */
export const unconfiguredEmailProvider: EmailProvider = {
  name: 'unconfigured',
  isConfigured: false,
  async enqueueSubscriptionConfirmation() {
    // Sin proveedor no hay envío. Se omite deliberadamente cualquier log para
    // no dejar direcciones de correo en los registros del servidor.
  },
}
