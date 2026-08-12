import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { MarketTicker } from '@/components/layout/MarketTicker'
import { SITE } from '@/lib/site'
import { marketDataService } from '@/modules/market-data/services/market-data.service'

import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

/**
 * Contrato de dirección de la landing. Se emite como comentario HTML para que
 * siga siendo auditable en el build de producción.
 */
const DIRECTION_CONTRACT = `<!--
CONTRATO DE DIRECCIÓN — Kaizen Casa de Bolsa · landing (Persuade)
THESIS: una casa de bolsa se elige por la evidencia que publica, no por la
  promesa que hace. Rechaza el embudo genérico de una sola ruta cerrado con un
  muro de tarjetas iguales.
OWN-WORLD: Navy y White dominan, Blue marca acción, Tint y Pearl separan
  bloques. Sora en títulos, Inter en lectura. Filetes de 1px en lugar de cajas;
  la elevación se declara una sola vez, con sombra azulada difusa.
STORY: la visitante reconoce su ruta —persona o empresa—, entiende qué puede
  hacer con Kaizen, comprueba la documentación pública y abre su cuenta o se
  suscribe.
FIRST VIEWPORT: sobre gradiente Blue→Navy, titular a la izquierda y la
  trayectoria de mercado a la derecha; bajo el titular, las dos rutas nombradas
  como acción principal, y la línea del regulador al pie.
FORM: ruta institucional de doble vía; candidato 3 de la lista ordenada por
  resonancia; seed e043cd42.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, and DESIGN.md
-->`

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Invertir con visión, crecer con confianza`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name }],
  keywords: [
    'casa de bolsa',
    'mercado de valores',
    'Venezuela',
    'inversión',
    'renta fija',
    'renta variable',
    'Kaizen Casa de Bolsa',
  ],
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    siteName: SITE.name,
    title: `${SITE.name} — Invertir con visión, crecer con confianza`,
    description: SITE.description,
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: `${SITE.name} — Invertir con visión, crecer con confianza`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  // El dominio de producción aún no está confirmado: no se declara `canonical`
  // absoluto hasta que exista.
}

export const viewport: Viewport = {
  themeColor: '#0e3048',
  width: 'device-width',
  initialScale: 1,
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const marketSnapshot = await marketDataService.getSnapshot()

  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`}>
      <head>
        {/*
          Habilita el estado inicial de las entradas de sección antes del primer
          pintado, y solo si el movimiento está permitido. El HTML servido nunca
          oculta contenido: sin JavaScript o con movimiento reducido, esta marca
          no se pone y el texto se lee tal cual. Va en `head` para ejecutarse
          antes de que el navegador pinte, sin provocar parpadeo.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='on'}}catch(e){}`,
          }}
        />
      </head>
      <body>
        {/* El contrato viaja como comentario HTML real: un comentario JSX lo
            borraría el compilador y quedaría fuera del build auditable. */}
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />

        <a className="kcb-skip-link" href="#contenido">
          Saltar al contenido
        </a>

        <MarketTicker snapshot={marketSnapshot} />
        <SiteHeader />

        <main id="contenido">{children}</main>

        <SiteFooter />
      </body>
    </html>
  )
}
