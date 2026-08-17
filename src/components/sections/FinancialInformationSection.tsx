import React from 'react'

import { DocumentBrowser } from '@/components/sections/DocumentBrowser'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type {
  DocumentCategory,
  FinancialStatementArchive,
  PublicDocument,
} from '@/modules/documents/domain/document'

/**
 * Información financiera y documentos.
 *
 * Reemplaza el muro de tarjetas idénticas de la referencia por una consulta
 * estructurada: primero se elige el tipo de documentación, y dentro de los
 * estados financieros se filtra por año. Todo el contenido proviene de Payload.
 */
export const FinancialInformationSection: React.FC<{
  archive: FinancialStatementArchive
  supporting: Record<DocumentCategory, PublicDocument[]>
}> = ({ archive, supporting }) => (
  <section
    id="informacion-financiera"
    className="kcb-section bg-pearl"
    aria-labelledby="informacion-financiera-titulo"
  >
    <Reveal className="kcb-container">
      {/* Segundo peso focal de la página: la documentación pública es la
          evidencia sobre la que descansa la tesis, y su escala lo dice. */}
      <SectionHeading
        id="informacion-financiera-titulo"
        size="lead"
        title="Información financiera y documentos"
        description="Documentación institucional y estados financieros conforme a los requerimientos del regulador. Cada archivo indica su periodo, su formato y su tamaño real, y ninguno se enlaza si no existe."
      />

      <div className="mt-12">
        <DocumentBrowser
          archive={archive}
          institutional={supporting.institutional}
          compliance={supporting.compliance}
          reference={supporting.reference}
        />
      </div>
    </Reveal>
  </section>
)
