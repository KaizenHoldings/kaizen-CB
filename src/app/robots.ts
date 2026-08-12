import type { MetadataRoute } from 'next'

import { serverUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // El panel y la API interna nunca deben indexarse.
        disallow: ['/admin', '/admin/', '/api/'],
      },
    ],
    sitemap: `${serverUrl}/sitemap.xml`,
  }
}
