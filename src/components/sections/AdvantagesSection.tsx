import React from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SITE } from '@/lib/site'

/**
 * Ventajas de invertir con Kaizen.
 *
 * La referencia incluía un punto sobre «beneficios fiscales» marcado como
 * pendiente de verificar. No se publica: una ventaja tributaria sin respaldo
 * legal validado no puede presentarse como confirmada.
 */
const ADVANTAGES: Array<{ icon: IconName; title: string; description: string }> = [
  {
    icon: 'coins',
    title: 'Acceso a financiamiento',
    description: 'Conectamos a tu empresa con el capital del mercado de valores.',
  },
  {
    icon: 'trend',
    title: 'Instrumentos de renta fija y variable',
    description:
      'Alternativas orientadas a preservar y hacer crecer tu patrimonio, con su riesgo explicado.',
  },
  {
    icon: 'grid',
    title: 'Diversificación',
    description: 'Distribuye tu inversión entre distintos sectores e instrumentos.',
  },
  {
    icon: 'scale',
    title: 'Mercado regulado',
    description: `Operamos bajo la supervisión de la ${SITE.regulator}.`,
  },
  {
    icon: 'headset',
    title: 'Asesoría personalizada',
    description: 'Un ejecutivo te acompaña según tu perfil y tus objetivos.',
  },
]

export const AdvantagesSection: React.FC = () => (
  <section id="ventajas" className="kcb-section kcb-gradient text-white" aria-labelledby="ventajas-titulo">
    <div className="kcb-container">
      <SectionHeading
        id="ventajas-titulo"
        surface="dark"
        title="¿Por qué invertir con Kaizen?"
        description="Porque la confianza se construye explicando. Te mostramos lo que puedes esperar de cada instrumento, incluido su riesgo, antes de que decidas."
      />

      {/* Fundido sin desplazamiento: la banda oscura entra distinto del resto
          de secciones, para que la página no repita una única transición. */}
      <Reveal motionStyle="none">
        <ul className="mt-14 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((advantage) => (
            <li key={advantage.title} className="kcb-hairline-light flex gap-4 py-7">
              <span className="kcb-chip" data-surface="dark" data-size="sm">
                <Icon name={advantage.icon} className="size-5" />
              </span>
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-white">
                  {advantage.title}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-tint">
                  {advantage.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
)
