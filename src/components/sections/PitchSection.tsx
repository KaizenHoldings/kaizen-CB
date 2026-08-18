import React from 'react'

import { PitchCard } from '@/components/sections/PitchCard'
import { ActionButton } from '@/components/ui/ActionButton'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Las dos rutas del sitio —persona y empresa— son la tesis de la página: pesan
 * igual y ninguna es un añadido de la otra. De ahí que las dos tarjetas sean
 * idénticas en tamaño y tratamiento, y solo cambie la fotografía.
 *
 * Texto institucional permanente: vive aquí, no en Payload.
 */
/* Anclas puras, no `/#...`: así `ActionButton` renderiza un `<a>` nativo y el
   navegador dispara `hashchange`, que es lo que escucha `RegistrationTabs`.
   Con el `Link` de Next el hash cambiaba pero el evento no llegaba y la
   pestaña jurídica no se activaba. */
const ROUTES = [
  {
    href: '#registro-natural',
    title: 'Invierto por mi cuenta',
    description: 'Haz crecer tu patrimonio con acompañamiento de un asesor en cada decisión.',
    video: '/img/pitchSection/opt1_video.mp4',
    flipVideo: true,
  },
  {
    href: '#registro-juridica',
    title: 'Represento a una empresa',
    description: 'Financia, estructura y emite en el mercado de valores venezolano.',
    video: '/img/pitchSection/opt2_video.mp4',
  },
]

export const PitchSection: React.FC = () => (
  <section
    id="propuesta"
    className="kcb-section flex min-h-[50dvh] flex-col justify-center bg-[#184771]"
    aria-labelledby="propuesta-titulo"
  >
    <Reveal className="kcb-container">
      <h2
        id="propuesta-titulo"
        className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.35rem+1.9vw,2.75rem)] leading-[1.12] font-light tracking-[-0.02em] text-balance text-white"
      >
        Elige tu punto de partida
      </h2>

      <ul
        /* Sangrado hacia fuera igual al relleno interior de la tarjeta: así el
           texto queda a plomo con el titular sin pegarlo al borde blanco.
           Es simétrico, de modo que la rejilla sigue centrada en el contenedor,
           y cada escalón coincide con el relleno del contenedor
           —`clamp(1.25rem, 4vw, 3rem)`—, así que nunca desborda. */
        className="mt-7 -mx-5 grid gap-6 sm:-mx-6 lg:mt-10 lg:-mx-8 lg:grid-cols-2 lg:gap-10"
      >
        {ROUTES.map((route) => (
          <PitchCard key={route.href} video={route.video} flipVideo={route.flipVideo}>
            <div className="relative z-10 flex flex-col items-start bg-gradient-to-r from-[#0e2d41] via-[#0e2d41] to-[#0e2d41]/70 p-5 text-left sm:p-6 lg:p-8">
              {/* El título deja de ser enlace: ahora la acción la lleva el botón
                  «Comenzar». Con la capa `after` que cubría la tarjeta, ese
                  botón habría quedado debajo del área pulsable del título y no
                  se podría accionar; y dos enlaces al mismo destino en la misma
                  tarjeta duplicarían el control sin añadir nada. */}
              <h3 className="font-[family-name:var(--font-display)] text-[1.125rem] leading-[1.35] font-normal text-balance text-white font-light">
                {route.title}
              </h3>

              {/* Sin sangrado: título, descripción y botón comparten eje con
                  el titular de la sección. */}
              <p className="mt-6 max-w-[32ch] text-base leading-relaxed text-pretty text-tint lg:mt-10">
                {route.description}
              </p>

              {/* `mt-auto` lo fija abajo: las dos tarjetas alinean su botón
                  aunque las descripciones ocupen distinto número de líneas. */}
              <div className="mt-8 lg:mt-auto lg:pt-10">
                <ActionButton
                  href={route.href}
                  surface="dark"
                  emphasis="primary"
                  className="kcb-action--pitch-hover"
                  ariaLabel={`Comenzar: ${route.title}`}
                >
                  Comenzar
                </ActionButton>
              </div>
            </div>
          </PitchCard>
        ))}
      </ul>
    </Reveal>
  </section>
)
