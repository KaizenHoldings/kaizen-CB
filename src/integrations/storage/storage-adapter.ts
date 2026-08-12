import { storageProvider } from '@/lib/env'

/**
 * Límite de infraestructura para el almacenamiento de archivos.
 *
 * En desarrollo, Payload guarda los binarios en `media/` sobre disco local, que
 * es persistente en esta máquina. En producción, si el proveedor de hosting no
 * ofrece disco persistente, hay que instalar el storage adapter oficial
 * correspondiente (`@payloadcms/storage-s3`, `-vercel-blob`, …) y registrarlo
 * en `payload.config.ts`; PostgreSQL sigue guardando la referencia del archivo.
 *
 * El proveedor definitivo es una decisión pendiente del proyecto: no se activa
 * ningún servicio externo sin autorización explícita.
 */
export type StorageMode = 'local-disk' | 'external-configured'

export const resolveStorageMode = (): StorageMode => {
  const { bucket, accessKey, secretKey } = storageProvider()
  return bucket && accessKey && secretKey ? 'external-configured' : 'local-disk'
}

/**
 * Advertencia de despliegue: un despliegue de producción con almacenamiento
 * local solo es válido si el disco es realmente persistente.
 */
export const storageWarning = (): string | null =>
  resolveStorageMode() === 'local-disk'
    ? 'Los archivos se guardan en disco local. Antes de desplegar en una plataforma sin disco persistente, configura un storage adapter aprobado.'
    : null
