import React from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Dictionary } from '@/dictionaries/getDictionary'
import { localeHref, type Locale } from '@/lib/i18n'

/**
 * Información financiera y documentos.
 *
 * En la portada se invita al usuario a consultar la documentación completa
 * que vive en `/documentos`.
 */
export const FinancialInformationSection: React.FC<{
  dict: Dictionary['financial']
  locale: Locale
}> = ({ dict, locale }) => {
  return (
    <section
      id="informacion-financiera"
      className="kcb-section bg-pearl relative overflow-hidden"
      aria-labelledby="informacion-financiera-titulo"
    >
      <div className="absolute inset-0 z-0 bg-financial-pattern opacity-[0.06]"></div>
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-pearl to-transparent"></div>
      <Reveal className="kcb-container relative z-10">
        {/* Segundo peso focal de la página: la documentación pública es la
            evidencia sobre la que descansa la tesis, y su escala lo dice. */}
        <SectionHeading
          id="informacion-financiera-titulo"
          size="lead"
          title={dict.title}
          description={dict.description}
        />

        <div className="mt-8 flex lg:mt-12">
          <ActionButton href={localeHref(locale, '/documentos')} surface="light" emphasis="primary">
            {dict.cta}
          </ActionButton>
        </div>
      </Reveal>
    </section>
  )
}
