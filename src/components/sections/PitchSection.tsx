import Image from 'next/image'
import React from 'react'

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
    image: '/img/pitchSection/personal.opt.jpg',
  },
  {
    href: '#registro-juridica',
    title: 'Represento a una empresa',
    description: 'Financia, estructura y emite en el mercado de valores venezolano.',
    image: '/img/pitchSection/bussines.opt.jpg',
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
          <li
            key={route.href}
            className="group relative grid grid-cols-1 bg-white transition-shadow duration-300 ease-[var(--ease-kcb)] hover:shadow-[var(--shadow-soft)] has-[a:focus-visible]:shadow-[var(--shadow-soft)] sm:grid-cols-[minmax(0,1fr)_44%]"
          >
            <div className="flex flex-col items-start p-5 text-left sm:p-6 lg:p-8">
              {/* El título deja de ser enlace: ahora la acción la lleva el botón
                  «Comenzar». Con la capa `after` que cubría la tarjeta, ese
                  botón habría quedado debajo del área pulsable del título y no
                  se podría accionar; y dos enlaces al mismo destino en la misma
                  tarjeta duplicarían el control sin añadir nada. */}
              <h3 className="font-[family-name:var(--font-display)] text-[1.125rem] leading-[1.35] font-normal text-balance text-ink capitalize">
                {route.title}
              </h3>

              {/* Sin sangrado: título, descripción y botón comparten eje con
                  el titular de la sección. */}
              <p className="mt-6 max-w-[32ch] text-base leading-relaxed text-pretty text-muted lg:mt-10">
                {route.description}
              </p>

              {/* `mt-auto` lo fija abajo: las dos tarjetas alinean su botón
                  aunque las descripciones ocupen distinto número de líneas. */}
              <div className="mt-8 lg:mt-auto lg:pt-10">
                <ActionButton
                  href={route.href}
                  surface="light"
                  emphasis="primary"
                  ariaLabel={`Comenzar: ${route.title}`}
                >
                  Comenzar
                </ActionButton>
              </div>
            </div>

            {/* Decorativa: el título ya nombra la ruta. En una sola columna la
                imagen no hereda el alto de la fila, así que toma proporción. */}
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-52">
              <Image
                src={route.image}
                alt=""
                fill
                sizes="(max-width: 64rem) 45vw, 24rem"
                className="object-cover transition-transform duration-500 ease-[var(--ease-kcb)] motion-safe:group-hover:scale-105 motion-safe:group-has-[a:focus-visible]:scale-105"
              />
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  </section>
)
