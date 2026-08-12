import type { MetadataRoute } from 'next'

import { serverUrl } from '@/lib/env'
import { publicationService } from '@/modules/publications/services/publication.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await publicationService.listSlugs()
  const now = new Date()

  return [
    { url: `${serverUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    {
      url: `${serverUrl}/publicaciones`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...slugs.map((slug) => ({
      url: `${serverUrl}/publicaciones/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
