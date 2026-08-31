import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { DEFAULT_LOCALE, LOCALES, isLocale } from '@/lib/i18n'

/**
 * Enrutado por idioma del sitio público.
 *
 * Se llama `proxy` y no `middleware` porque en Next 16 esa convención está
 * deprecada y renombrada; el archivo `middleware.js` sigue funcionando, pero
 * emite aviso. Ver `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
 */

/** Primer idioma admitido que declare el navegador, si lo hay. */
const negotiate = (header: string | null): string | null => {
  if (!header) return null

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: (tag ?? '').trim().toLowerCase(), q: q ? Number(q) : 1 }
    })
    .filter((entry) => entry.tag.length > 0)
    .sort((a, b) => b.q - a.q)

  for (const { tag } of preferred) {
    // `es-VE` y `en-US` deben resolver a `es` y `en`.
    const base = tag.split('-')[0]!
    if (isLocale(base)) return base
  }

  return null
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ya lleva idioma: no hay nada que decidir.
  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )
  if (hasLocale) return NextResponse.next()

  const locale = negotiate(request.headers.get('accept-language')) ?? DEFAULT_LOCALE
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(url)
}

export const config = {
  /* Exclusiones críticas, por este orden dentro del lookahead:
     - `admin`  → el panel de Payload, que no debe recibir prefijo de idioma.
     - `api`    → las rutas de Payload y las propias del sitio.
     - `_next`  → build, imágenes optimizadas y tipografías.
     - `.*\..*` → cualquier ruta con punto: los metadatos (`robots.txt`,
       `sitemap.xml`, `favicon.ico`) y todo lo servido desde `public/`.

     Sin `matcher` el proxy corre en **cada** petición, incluidas las de
     `_next/static`, y ahí devolvía 500: la página llegaba sin hoja de estilos
     y sin hidratar. La documentación lo advierte de forma explícita.

     La barra invertida doble no es adorno. En el literal de TypeScript `\\.`
     produce la cadena `\.`, que es el punto literal. Escrita como `.` sin
     escapar, la subexpresión pasa a ser `.*..*` —«cualquier ruta de al menos
     un carácter»—, el lookahead la rechaza entera y el patrón acaba casando
     solo la raíz. Es exactamente el fallo que tenía: `/` redirigía y ninguna
     otra ruta llegaba al proxy. */
  matcher: ['/((?!admin|api|_next|.*\\..*).*)'],
}
