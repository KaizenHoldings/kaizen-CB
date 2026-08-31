import type { AudienceProvider } from './audience-provider'

/**
 * Implementación segura cuando faltan las credenciales de la audiencia.
 *
 * Devuelve `error` en lugar de fingir un alta: dar por suscrita una dirección
 * que nunca llegó a la lista es peor que decir que no se pudo registrar. La
 * suscripción sí queda guardada en Payload, así que el dato no se pierde.
 */
export const unconfiguredAudienceProvider: AudienceProvider = {
  name: 'unconfigured',
  isConfigured: false,
  async subscribe() {
    return { status: 'error' }
  },
}
