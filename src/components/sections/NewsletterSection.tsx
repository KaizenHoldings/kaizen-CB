import React from 'react'

import { NewsletterForm } from '@/components/sections/NewsletterForm'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'

export const NewsletterSection: React.FC = () => (
  <section id="newsletter" className="bg-white pb-20 lg:pb-28" aria-labelledby="newsletter-titulo">
    <div className="kcb-container">
      <Reveal>
        <div className="kcb-gradient grid gap-10 rounded-[24px] p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <span className="kcb-chip" data-surface="dark">
              <Icon name="mail" className="size-5" />
            </span>
            <h2
              id="newsletter-titulo"
              className="mt-6 text-[clamp(1.5rem,1.25rem+1.2vw,2.125rem)] font-semibold text-white"
            >
              Recibe nuestro newsletter
            </h2>
            <p className="kcb-measure mt-4 text-[1.0625rem] leading-relaxed text-tint">
              Análisis del mercado, novedades regulatorias y publicaciones de Kaizen, directamente
              en tu correo. Puedes darte de baja cuando quieras.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </Reveal>
    </div>
  </section>
)
