import React from 'react'

import { NewsletterForm } from '@/components/sections/NewsletterForm'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'

/* Cierra la página como tarjeta, no como banda: por eso no lleva relleno
   superior propio —el de la sección anterior ya lo aporta y sumarlos abriría el
   doble de hueco— y el inferior iguala el paso del ritmo compartido. El hueco
   visual queda así idéntico por arriba y por abajo. */
export const NewsletterSection: React.FC = () => (
  <section id="newsletter" className="bg-white pb-[clamp(4rem,8vw,7.5rem)]" aria-labelledby="newsletter-titulo">
    <div className="kcb-container">
      <Reveal>
        <div className="kcb-gradient grid gap-10 rounded-2xl p-8 text-white sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <span className="kcb-chip" data-surface="dark">
              <Icon name="mail" className="size-5" />
            </span>
            <h2
              id="newsletter-titulo"
              className="mt-6 text-[clamp(1.5rem,1.25rem+1.2vw,2.125rem)] font-light text-white"
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
