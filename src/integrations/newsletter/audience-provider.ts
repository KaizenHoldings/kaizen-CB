/**
 * Contrato del proveedor de audiencia del newsletter.
 *
 * Separado de `EmailProvider` a propósito: aquel envía correos, este mantiene la
 * lista de suscriptores. Hoy lo implementa Mailchimp, pero la aplicación no
 * conoce ese nombre en ningún punto fuera de este directorio.
 */

/** Resultado de intentar dar de alta una dirección en la audiencia. */
export type AudienceResult =
  | { status: 'subscribed' }
  /** La dirección ya figuraba en la lista. */
  | { status: 'already-subscribed' }
  /** El proveedor falló o no está configurado. */
  | { status: 'error' }

export interface AudienceProvider {
  readonly name: string
  /** ¿Hay un proveedor real detrás? */
  readonly isConfigured: boolean
  subscribe(input: { email: string }): Promise<AudienceResult>
}
