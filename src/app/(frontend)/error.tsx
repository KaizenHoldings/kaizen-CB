'use client'

import React, { useEffect } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon } from '@/components/ui/Icon'
import { SITE } from '@/lib/site'

/**
 * Frontera de error de la web pública.
 *
 * No se expone el mensaje interno ni la traza: solo el identificador que Next
 * genera, que permite localizar el incidente en los registros del servidor.
 */
export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // El detalle queda en el registro del servidor, nunca en la interfaz.
    console.error('Error en la web pública', error.digest ?? '')
  }, [error])

  return (
    <div className="bg-white">
      <div className="kcb-container flex min-h-[60vh] flex-col justify-center py-20">
        <div className="max-w-2xl">
          <span className="kcb-chip">
            <Icon name="alert" className="size-5" />
          </span>

          <h1 className="mt-6 text-[clamp(1.875rem,1.5rem+1.9vw,2.75rem)] font-bold text-navy">
            Algo no cargó como esperábamos
          </h1>

          <p className="kcb-measure mt-4 text-[1.0625rem] leading-relaxed text-muted">
            Ya estamos al tanto. Puedes reintentar ahora mismo; si el problema persiste, escríbenos
            a{' '}
            <a href={SITE.contact.emailHref} className="kcb-link">
              {SITE.contact.email}
            </a>
            .
          </p>

          {error.digest ? (
            <p className="mt-3 text-sm text-muted">
              Referencia del incidente: <span data-tabular>{error.digest}</span>
            </p>
          ) : null}

          <div className="mt-8">
            <ActionButton type="button" surface="light" emphasis="primary" onClick={reset}>
              Reintentar
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}
