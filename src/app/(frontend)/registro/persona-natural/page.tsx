import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { JotformEmbed } from '@/components/sections/JotformEmbed'
import { Icon } from '@/components/ui/Icon'

/* Sin caché: el formulario se sirve siempre en su versión vigente. */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Formulario de Identificación de Clientes Persona Natural Kaizen Casa de Bolsa',
  description: 'Formulario de identificación de clientes persona natural de Kaizen Casa de Bolsa.',
  robots: { index: false, follow: true },
}

export default function Page() {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-5xl px-4 pt-24 pb-12">
      <nav aria-label="Ruta de navegación" className="mb-8">
        <Link
          href="/#registro"
          className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-blue hover:text-navy"
        >
          <Icon name="arrowRight" className="size-4 rotate-180" />
          Volver a Regístrate con nosotros
        </Link>
      </nav>

      <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,1.25rem+1.2vw,2.125rem)] leading-[1.15] font-light text-balance text-navy">
        Formulario de Identificación de Clientes Persona Natural Kaizen Casa de Bolsa
      </h1>

      <div className="mt-10">
        <JotformEmbed formId="262094240939663" title="Formulario de Identificación de Clientes Persona Natural Kaizen Casa de Bolsa" />
      </div>
    </div>
  )
}
