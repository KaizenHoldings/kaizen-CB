import type { MetadataRoute } from 'next'

import { serverUrl } from '@/lib/env'
import { DEFAULT_LOCALE, LOCALES } from '@/lib/i18n'
import { publicationService } from '@/modules/publications/services/publication.service'

/** Rutas neutras y su peso. El prefijo de idioma lo pone `entry`. */
const ROUTES = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/publicaciones', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/documentos', changeFrequency: 'weekly', priority: 0.8 },
  /* Los formularios de registro se excluyen: son destinos de un flujo, no
     contenido que deba indexarse. Sus páginas ya lo declaran con `robots`. */
  { path: '/contacto', changeFrequency: 'yearly', priority: 0.7 },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await publicationService.listSlugs()
  const now = new Date()

  /* Cada ruta se publica una vez por idioma, y las versiones se declaran
     hermanas con `alternates.languages`. Sin esa declaración los buscadores ven
     `/es/contacto` y `/en/contacto` como dos páginas distintas que compiten
     entre sí; con ella, como la misma página en dos idiomas.

     El canónico es el castellano: es el idioma por defecto del sitio y el de la
     institución. */
  const entry = (
    path: string,
    changeFrequency: 'weekly' | 'monthly' | 'yearly',
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${serverUrl}/${DEFAULT_LOCALE}${path || '/'}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `${serverUrl}/${locale}${path || '/'}`]),
      ),
    },
  })

  return [
    ...ROUTES.map((route) => entry(route.path, route.changeFrequency, route.priority)),
    /* Las publicaciones comparten `slug` entre idiomas: el contenido viene de
       Payload en un solo idioma y no se traduce, así que la única variación es
       el cromo de la página. */
    ...slugs.map((slug) => entry(`/publicaciones/${slug}`, 'monthly', 0.6)),
  ]
}
