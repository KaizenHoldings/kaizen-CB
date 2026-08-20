import React from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Información financiera y documentos.
 *
 * En la portada se invita al usuario a consultar la documentación completa
 * que vive en `/documentos`.
 */
export const FinancialInformationSection: React.FC = () => {
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
          title="Información financiera y documentos"
          description="Documentación institucional y estados financieros conforme a los requerimientos del regulador. Cada archivo indica su periodo, su formato y su tamaño real, y ninguno se enlaza si no existe."
        />

        <div className="mt-8 flex lg:mt-12">
          <ActionButton href="/documentos" surface="light" emphasis="primary">
            Ver documentos
          </ActionButton>
        </div>
      </Reveal>
    </section>
  )
}
