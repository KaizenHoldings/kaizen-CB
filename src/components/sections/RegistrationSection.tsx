import React from 'react'

import { RegistrationTabs } from '@/components/sections/RegistrationTabs'
import { Reveal } from '@/components/ui/Reveal'
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
    {/* Anclas de destino de las tarjetas de «Elige tu punto de partida».
        Van por encima del encabezado, no dentro de las pestañas: colocadas allí
        el desplazamiento aterrizaba 111 px por debajo y el título de la sección
        quedaba fuera de pantalla. `RegistrationTabs` sigue leyendo el fragmento
        para preseleccionar la pestaña. */}
    <span id="registro-natural" className="block scroll-mt-[var(--kcb-sticky-offset)]" />
    <span id="registro-juridica" className="block scroll-mt-[var(--kcb-sticky-offset)]" />

    <Reveal className="kcb-container">
      <SectionHeading
        id="registro-titulo"
        title="Regístrate con nosotros"
        description="Elige tu tipo de persona para ver los pasos que te corresponden. Un asesor te acompaña durante todo el proceso."
      />

      <div className="mt-12">
        <RegistrationTabs />
      </div>
    </Reveal>
  </section>
)
