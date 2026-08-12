import React from 'react'

import { RegistrationTabs } from '@/components/sections/RegistrationTabs'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Registro de persona natural y jurídica.
 *
 * La integración definitiva del formulario regulado todavía no está
 * confirmada: no existe proveedor, URL ni esquema de recaudos aprobado en el
 * proyecto. En lugar de un formulario falso o un embed roto, la sección
 * muestra el recorrido completo con un estado honesto de integración
 * pendiente y una vía de contacto que sí funciona.
 */
export const RegistrationSection: React.FC = () => (
  <section id="registro" className="kcb-section bg-white" aria-labelledby="registro-titulo">
    <div className="kcb-container">
      <SectionHeading
        id="registro-titulo"
        title="Regístrate con nosotros"
        description="Elige tu tipo de persona para ver los pasos que te corresponden. Un asesor te acompaña durante todo el proceso."
      />

      <div className="mt-12">
        <RegistrationTabs />
      </div>
    </div>
  </section>
)
