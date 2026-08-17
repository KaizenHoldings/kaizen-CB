import React from 'react'

import { AboutSection } from '@/components/sections/AboutSection'
import { AdvantagesSection } from '@/components/sections/AdvantagesSection'
import { ComplianceSection } from '@/components/sections/ComplianceSection'
import { FinancialInformationSection } from '@/components/sections/FinancialInformationSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { MarketSection } from '@/components/sections/MarketSection'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { PitchSection } from '@/components/sections/PitchSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { RegistrationSection } from '@/components/sections/RegistrationSection'
import { StepsSection } from '@/components/sections/StepsSection'
import { documentService } from '@/modules/documents/services/document.service'
import { marketDataService } from '@/modules/market-data/services/market-data.service'
import { publicationService } from '@/modules/publications/services/publication.service'

/**
 * Landing pública.
 *
 * Server Component: obtiene el contenido administrable a través de los
 * servicios de dominio, que a su vez usan la Local API de Payload. Ningún
 * componente visual consulta la base de datos ni una API externa.
 */
export default async function HomePage() {
  const [archive, supporting, publications, marketSnapshot] = await Promise.all([
    documentService.financialStatementArchive(),
    documentService.listSupportingDocuments(),
    publicationService.listLatest(3),
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
      <FinancialInformationSection archive={archive} supporting={supporting} />
      <ComplianceSection publications={publications} />
      <StepsSection />
      <RegistrationSection />
      <NewsletterSection />
    </>
  )
}
