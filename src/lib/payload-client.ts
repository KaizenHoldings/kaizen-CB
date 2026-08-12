import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'
import 'server-only'

/**
 * Punto único de acceso a la Local API de Payload.
 *
 * Vive en la capa de datos: ningún componente visual debe importarlo. Payload
 * cachea la instancia entre peticiones, así que llamarlo es barato.
 */
export const getPayloadClient = async (): Promise<Payload> => getPayload({ config: configPromise })
