import React from 'react'

import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Dictionary } from '@/dictionaries/getDictionary'

/**
 * Pasos para abrir una cuenta.
 *
 * La numeración se conserva porque la secuencia es información: el orden
 * importa y cada paso depende del anterior.
 */

export const StepsSection: React.FC<{ dict: Dictionary['steps'] }> = ({ dict }) => (
  <section id="pasos" className="kcb-section bg-tint" aria-labelledby="pasos-titulo">
    <Reveal className="kcb-container">
      <SectionHeading id="pasos-titulo" title={dict.title} description={dict.description} />
      <ol className="mt-12 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
        {dict.items.map((step, index) => (
          <li key={step.title} className="relative py-6">
            {/* La línea conecta los pasos consecutivos en desktop; es decorativa. */}
            <span
              aria-hidden="true"
              className={[
                'absolute top-[2.4rem] hidden h-px bg-line lg:block',
                index === dict.items.length - 1 ? 'lg:hidden' : 'start-[3.25rem] end-[-2rem]',
              ].join(' ')}
            />
            <span className="relative flex size-11 items-center justify-center rounded-full bg-navy font-[family-name:var(--font-display)] text-lg font-semibold text-white">
              {index + 1}
            </span>
            <h3
              className="mt-5 font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-navy"
              suppressHydrationWarning
            >
              {step.title}
            </h3>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  </section>
)
