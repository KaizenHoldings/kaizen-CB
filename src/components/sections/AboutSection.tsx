import React from 'react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Valores institucionales. Texto permanente de la marca.
 *
 * Se componen como una lista de definiciones a dos columnas —nombre grande,
 * explicación al lado— y no como tarjetas de icono, título y párrafo: ese
 * patrón ya lo usan las ventajas y repetirlo aquí convertiría la página en una
 * sucesión de bloques idénticos.
 */
const VALUES: Array<{ title: string; description: string }> = [
  {
    title: 'Integridad',
    description: 'Actuamos con honestidad, franqueza y transparencia en cada operación.',
  },
  {
    title: 'Confiabilidad',
    description: 'Resguardamos los intereses de nuestros clientes con rigor técnico.',
  },
  {
    title: 'Compromiso',
    description: 'Calidad de servicio y eficacia en los tiempos de respuesta.',
  },
  {
    title: 'Ser Kaizen',
    description: 'Perfeccionamos cada proceso y servicio, paso a paso, todos los días.',
  },
]

export const AboutSection: React.FC = () => (
  <section id="nosotros" className="kcb-section bg-white" aria-labelledby="nosotros-titulo">
    <div className="kcb-container">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <SectionHeading
          id="nosotros-titulo"
          title="Una alianza financiera para el mercado venezolano"
          description="Somos una institución financiera con un equipo de profesionales de amplia experiencia. Diseñamos productos de renta fija y variable para promover un mercado más eficiente, trabajando junto a cada cliente para mitigar riesgos y aprovechar oportunidades."
        />

        <div className="lg:pt-2">
          {/* Filete de 1px: un borde lateral de color más grueso convierte la
              cita en un callout, que no es el lenguaje de esta página. */}
          <blockquote className="border-s border-blue ps-6">
            <p className="font-[family-name:var(--font-display)] text-[clamp(1.125rem,1rem+0.6vw,1.375rem)] leading-snug font-medium text-navy">
              Crear relaciones duraderas que impacten de forma positiva al ecosistema empresarial
              venezolano.
            </p>
            <footer className="mt-3 text-sm text-muted">Nuestro propósito</footer>
          </blockquote>
        </div>
      </div>

      <Reveal className="mt-16 lg:mt-20">
        <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-muted uppercase">
          Lo que nos sostiene
        </h3>

        <dl className="mt-2 grid sm:grid-cols-2 sm:gap-x-14">
          {VALUES.map((value) => (
            <div key={value.title} className="kcb-hairline py-6 sm:flex sm:items-baseline sm:gap-6">
              <dt className="font-[family-name:var(--font-display)] text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] font-semibold text-navy sm:w-[9rem] sm:shrink-0">
                {value.title}
              </dt>
              <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted sm:mt-0">
                {value.description}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  </section>
)
