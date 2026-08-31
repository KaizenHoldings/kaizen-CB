import type { Metadata } from 'next'
import React from 'react'

import { ContactSection } from '@/components/sections/ContactSection'
import { getDictionary } from '@/dictionaries/getDictionary'
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n'

type Params = { params: Promise<{ lang: string }> }

/* Los metadatos dependen del idioma del segmento, así que no pueden ser una
   constante: esa se evalúa una sola vez para las dos rutas. */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const dict = (await getDictionary(locale)).contact

  return {
    title: dict.metaTitle,
    description: dict.metaDescription,
    openGraph: {
      title: dict.ogTitle,
      description: dict.ogDescription,
      url: `/${locale}/contacto`,
    },
  }
}

/* El título de la sección pasa a `h1`: en su propia página es el encabezado
   principal del documento, no un apartado dentro de otro. */
export default async function ContactPage({ params }: Params) {
  const { lang } = await params
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const dict = await getDictionary(locale)

  return <ContactSection dict={dict.contact} level={1} />
}
