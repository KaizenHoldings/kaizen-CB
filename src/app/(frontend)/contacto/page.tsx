import type { Metadata } from 'next'
import React from 'react'

import { ContactSection } from '@/components/sections/ContactSection'

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escríbenos o visítanos. Kaizen Casa de Bolsa responde en días hábiles a consultas sobre inversión, financiamiento y emisiones en el mercado de valores venezolano.',
  openGraph: {
    title: 'Contacto · Kaizen Casa de Bolsa',
    description: 'Conversemos sobre tus objetivos financieros. Te respondemos en días hábiles.',
    url: '/contacto',
  },
}

/* El título de la sección pasa a `h1`: en su propia página es el encabezado
   principal del documento, no un apartado dentro de otro. */
export default function ContactPage() {
  return <ContactSection level={1} />
}
