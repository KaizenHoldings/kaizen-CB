/**
 * Contrato del proveedor de correo.
 *
 * El proveedor definitivo y la estrategia de campañas son decisiones
 * pendientes del proyecto. Hasta que se confirmen, ninguna parte de la
 * aplicación envía correo: el envío masivo nunca debe ejecutarse como un bucle
 * dentro de una petición web, sino a través de este contrato y de una tarea en
 * segundo plano del proveedor elegido.
 */
export interface EmailProvider {
  readonly name: string
  /** ¿Hay un proveedor real detrás? */
  readonly isConfigured: boolean
  /**
   * Deja la confirmación de suscripción lista para su envío. La implementación
   * real debe delegar en la cola del proveedor y devolver de inmediato.
   */
  enqueueSubscriptionConfirmation(input: { email: string }): Promise<void>
}
