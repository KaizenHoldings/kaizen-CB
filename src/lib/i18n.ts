/**
 * Idiomas del sitio público.
 *
 * El panel de Payload queda fuera: vive en su propio grupo de rutas y su
 * interfaz ya se traduce con la configuración `i18n` de Payload.
 */
export const LOCALES = ['es', 'en'] as const

export type Locale = (typeof LOCALES)[number]

/** Español: es el idioma institucional y el que se sirve sin prefijo explícito. */
export const DEFAULT_LOCALE: Locale = 'es'

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)

/**
 * Antepone el idioma a una ruta interna.
 *
 * Un destino que ya viaja con prefijo no volvería a recibirlo, y un ancla suelta
 * —`#registro-natural`— se devuelve tal cual: no es una ruta, es una posición
 * dentro de la página actual.
 *
 * Sin esto cada enlace interno provocaría un salto extra por el `proxy`, que
 * tendría que redirigir de `/contacto` a `/es/contacto` en cada clic.
 */
export const localeHref = (locale: Locale, href: string): string => {
  if (!href.startsWith('/')) return href
  if (LOCALES.some((l) => href === `/${l}` || href.startsWith(`/${l}/`) || href.startsWith(`/${l}#`)))
    return href

  const rest = href === '/' ? '' : href
  return `/${locale}${rest}`
}

/**
 * Ruta sin prefijo de idioma: la inversa de `localeHref`.
 *
 * Existe porque `usePathname` devuelve siempre la ruta real —`/es/contacto`—
 * mientras que `NAV_LINKS` guarda destinos neutros —`/contacto`—. Comparar
 * ambas sin normalizar dejaba la navegación sin indicador activo en todas las
 * páginas. La portada de un idioma —`/es`— se normaliza a `/`.
 */
export const stripLocale = (pathname: string): string => {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1)
  }
  return pathname
}
