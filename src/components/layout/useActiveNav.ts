'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { NAV_LINKS } from '@/lib/site'

/** Ids de las secciones de la portada, deducidos de los propios destinos: la
 *  lista de navegación sigue siendo el único origen. */
const SECTION_IDS = NAV_LINKS.filter((link) => link.href.startsWith('/#')).map((link) =>
  link.href.slice(2),
)

/**
 * Destino de navegación activo.
 *
 * Fuera de la portada manda la ruta: `/contacto` marca su propio enlace y no
 * hay que observar nada.
 *
 * En la portada la regla es **la última sección de navegación cuyo borde
 * superior ha cruzado la línea de lectura**, y no la que la línea atraviesa en
 * ese instante. La diferencia importa: solo seis de las once secciones de la
 * página son destinos de navegación, así que exigir que la línea cayera dentro
 * de una de ellas dejaba sin indicador todo el recorrido de «Ventajas»,
 * «Pasos», «Registro» y «Newsletter» —media página medida—. Con «la última
 * cruzada», el destino vigente se mantiene hasta que el siguiente toma el
 * relevo, sin huecos posibles por construcción. Ningún ajuste de `rootMargin`
 * lo habría resuelto: los huecos medían secciones enteras.
 *
 * La línea va justo bajo el cromo fijo, no en el centro: es donde la vista
 * está realmente leyendo.
 *
 * Devuelve el `href` tal cual aparece en `NAV_LINKS`, de modo que quien lo
 * consume solo tiene que comparar cadenas.
 */
export const useActiveNav = (): string | null => {
  const pathname = usePathname()
  const isLanding = pathname === '/'
  const [sectionId, setSectionId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLanding) return

    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    )
    if (nodes.length === 0) return

    const chrome =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--kcb-chrome-height'),
      ) || 80

    // Orden de documento, no el de la lista: la navegación podría reordenarse
    // sin que la página lo hiciera.
    nodes.sort((a, b) => a.offsetTop - b.offsetTop)

    const linea = chrome + 8

    const resolver = () => {
      let vigente: string | null = nodes[0]?.id ?? null
      for (const node of nodes) {
        if (node.getBoundingClientRect().top - linea <= 0.5) vigente = node.id
        else break
      }
      setSectionId(vigente)
    }

    const observer = new IntersectionObserver(resolver, {
      threshold: [0, 0.01, 0.25, 0.5, 0.75, 1],
    })

    nodes.forEach((node) => observer.observe(node))

    /* El observador solo reacciona al cruzar sus umbrales; dentro de una
       sección alta puede haber mucho desplazamiento sin un solo aviso. El
       oyente de scroll cubre ese hueco, en `requestAnimationFrame` para no
       recalcular por evento. */
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        resolver()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [isLanding])

  if (!isLanding) return pathname
  return sectionId ? `/#${sectionId}` : null
}
