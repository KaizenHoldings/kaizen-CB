import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { MarketTicker } from '@/components/layout/MarketTicker'
import { notFound } from 'next/navigation'

import { SITE } from '@/lib/site'
import { marketDataService } from '@/modules/market-data/services/market-data.service'

import '../globals.css'
import { LOCALES, isLocale } from '@/lib/i18n'
import { getDictionary } from '@/dictionaries/getDictionary'

/**
 * `200` no está en la lista de pesos autorizados por `BRAND.md` §8
 * (400/500/600/700/800). Se agrega como excepción puntual y deliberada, a
 * pedido explícito del cliente, solo para el titular del hero.
 */
const sora = Sora({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
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

/* `generateStaticParams` deja los dos idiomas conocidos por el enrutador; el
   `proxy` ya impide que llegue cualquier otro valor al segmento. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export default async function FrontendLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  /* Un segmento desconocido es un 404, no la portada en castellano: servir
     contenido bajo `/zzz` lo convertiría en una URL válida y duplicada. */
  if (!isLocale(lang)) notFound()

  const locale = lang
  const dict = await getDictionary(locale)
  const marketSnapshot = await marketDataService.getSnapshot()
  // Sin datos la cinta no se dibuja, así que tampoco debe reservar altura: el
  // cálculo se resuelve en el servidor para que no haya salto ni parpadeo.
  const showTicker = marketSnapshot.status !== 'unavailable'

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${inter.variable}`}
      style={showTicker ? undefined : ({ '--kcb-ticker-height': '0rem' } as React.CSSProperties)}
      /* Las extensiones del navegador escriben en `<html>` y `<body>` antes de
         que React hidrate —medido: `data-lt-installed` de LanguageTool aquí, y
         `cz-shortcut-listen` y `data-new-gr-c-s-check-loaded` en el `<body>`—.
         React compara el HTML del servidor con el DOM ya alterado y avisa de un
         desajuste que no es nuestro y que no podemos evitar: la extensión
         siempre llega antes.

         `suppressHydrationWarning` solo silencia los atributos y el texto de
         *este* nodo, no los de sus descendientes, así que no tapa ningún
         desajuste real del árbol. La aplicación no escribe nada en estos dos
         elementos desde el cliente. */
      suppressHydrationWarning
    >
      {/* Mismo motivo que en `<html>`: es donde más escriben las extensiones. */}
      <body suppressHydrationWarning>
        {/* Las entradas son un realce: sin JavaScript, cada bloque que Motion
            revelaría debe renderizarse a plena opacidad y en su sitio. El
            estado oculto lo declara `globals.css` sin condiciones, y es esta
            hoja la que lo deshace cuando no hay scripting.

            Sustituye al `<script>` en línea que marcaba la raíz con
            `data-motion`: aquel se ejecutaba antes del pintado, pero al ser un
            nodo que React reconcilia lanzaba «Encountered a script tag while
            rendering React component» en cada cambio de idioma, que es cuando
            el segmento `[lang]` remonta el layout. `<noscript>` lo resuelve sin
            script alguno, que es como lo hace el proyecto de referencia. */}
        <noscript>
          <style>{`[data-product-item],[data-scroll-media],[data-reveal],[data-hero],[data-hero] *,[data-bento] > *{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>

        {/* El contrato viaja como comentario HTML real: un comentario JSX lo
            borraría el compilador y quedaría fuera del build auditable. */}
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />

        <a className="kcb-skip-link" href="#contenido">
          Saltar al contenido
        </a>

        <MarketTicker snapshot={marketSnapshot} />
        <SiteHeader dict={dict.nav} locale={locale} />

        {/* La cinta y el navbar son cromo fijo: el contenido reserva su altura
            para no quedar debajo. Una sección puede renunciar a esa reserva
            —el hero lo hace— para extenderse bajo el navbar transparente. */}
        <main id="contenido" className="pt-[var(--kcb-chrome-height)]">
          {children}
        </main>

        <SiteFooter dict={dict.nav} footer={dict.footer} locale={locale} />
      </body>
    </html>
  )
}
