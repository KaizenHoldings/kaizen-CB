import Link from 'next/link'
import React from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon } from '@/components/ui/Icon'

export default function NotFound() {
  return (
    <div className="bg-white">
      <div className="kcb-container flex min-h-[60vh] flex-col justify-center py-20">
        <div className="max-w-2xl">
          <span className="kcb-chip">
            <Icon name="search" className="size-5" />
          </span>

          <h1 className="mt-6 text-[clamp(1.875rem,1.5rem+1.9vw,2.75rem)] font-bold text-navy">
            No encontramos esta página
          </h1>

          <p className="kcb-measure mt-4 text-[1.0625rem] leading-relaxed text-muted">
            Es posible que el enlace haya cambiado o que el contenido ya no esté publicado. Desde el
            inicio puedes llegar a los productos, la información financiera y las publicaciones.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ActionButton href="/" surface="light" emphasis="primary">
              Volver al inicio
            </ActionButton>
            <Link href="/contacto" className="kcb-link min-h-11 content-center">
              Escribirnos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
