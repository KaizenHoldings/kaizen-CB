import React from 'react'

import { AboutSection } from '@/components/sections/AboutSection'
import { AdvantagesSection } from '@/components/sections/AdvantagesSection'
import { RAIL_LIMIT } from '@/components/sections/CategoryRail'
import { ComplianceSection } from '@/components/sections/ComplianceSection'
import { FinancialInformationSection } from '@/components/sections/FinancialInformationSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { MarketSection } from '@/components/sections/MarketSection'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { PitchSection } from '@/components/sections/PitchSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { RegistrationSection } from '@/components/sections/RegistrationSection'
import { StepsSection } from '@/components/sections/StepsSection'

import { marketDataService } from '@/modules/market-data/services/market-data.service'
import { PUBLICATION_TYPES } from '@/modules/publications/domain/publication'
import { publicationService } from '@/modules/publications/services/publication.service'

/* Sin caché de ruta: la página se renderiza en cada petición.
   Los datos vienen de Payload por Local API, no por `fetch`, así que no hay
   petición individual a la que ponerle `cache: 'no-store'`; lo que guardaba
   contenido antiguo era el prerenderizado de la ruta —quedaba estática con
   revalidación de una hora—. `force-dynamic` es el equivalente de segmento.
   Sigue disponible en Next 16 porque `cacheComponents` no está activado; con esa
   opción encendida, esta configuración desaparecería. */
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

/**
 * Landing pública.
 *
 * Server Component: obtiene el contenido administrable a través de los
 * servicios de dominio, que a su vez usan la Local API de Payload. Ningún
 * componente visual consulta la base de datos ni una API externa.
 */
export default async function HomePage() {
  const [publications, marketSnapshot] = await Promise.all([
    /* Suficientes para llenar un carril por tipo: la sección agrupa en memoria y
       cada grupo muestra hasta `RAIL_LIMIT`. Pidiendo solo tres, cada carril se
       quedaba con una sola tarjeta. */
    publicationService.listLatest(PUBLICATION_TYPES.length * RAIL_LIMIT),
    marketDataService.getSnapshot(),
  ])

  return (
    <>
      <HeroSection />
      <PitchSection />
      <AboutSection />
      <ProductsSection />
      <AdvantagesSection />
      <MarketSection snapshot={marketSnapshot} />
      <FinancialInformationSection />
      <ComplianceSection publications={publications} />
      <StepsSection />
      <RegistrationSection />
      <NewsletterSection />
    </>
  )
}
