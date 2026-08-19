import React from 'react'

import { PitchImage } from '@/components/sections/PitchImage'

import { ActionButton } from '@/components/ui/ActionButton'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Las dos rutas del sitio —persona y empresa— son la tesis de la página: pesan
 * igual y ninguna es un añadido de la otra. De ahí que las dos tarjetas sean
 * idénticas en tratamiento y compartan altura.
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
  },
  {
    href: '#registro-juridica',
    title: 'Represento a una empresa',
    description: 'Financia, estructura y emite en el mercado de valores venezolano.',
  },
]

/** Una sola fotografía sostiene la sección entera. Decorativa: los títulos de
 *  las tarjetas ya nombran cada ruta. */
const IMAGE = '/img/pitchSection/opt1.jpg'

export const PitchSection: React.FC = () => (
  <section
    id="propuesta"
    /* Alto de pantalla como mínimo, no como medida fija: si el contenido pide
       más —apilado en móvil— la sección crece en lugar de recortarlo. `dvh`
       descuenta la barra del navegador móvil. */
    className="scroll-mt-[var(--kcb-sticky-offset)] bg-white min-h-[100dvh]"
    aria-labelledby="propuesta-titulo"
  >
    {/* Sin relleno vertical propio: la sección va a sangre y su alto lo marcan
        la fotografía y el relleno de la columna de contenido. */}
    <div className="grid min-h-[inherit] grid-cols-1 lg:grid-cols-5">
      {/* Reparto asimétrico 40/60: la fotografía cede ancho para que las dos
          tarjetas respiren. Cinco columnas en lugar de doce porque la
          proporción pedida cae exacta en quintos —2 y 3— y no hace falta una
          rejilla más fina para expresarla. */}
      <PitchImage
        src={IMAGE}
        className="aspect-[4/3] lg:col-span-2 lg:aspect-auto lg:h-full lg:min-h-[40rem]"
      />

      <Reveal className="flex flex-col justify-center p-8 lg:col-span-3 lg:p-16 xl:p-24">
        <h2
          id="propuesta-titulo"
          className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.35rem+1.9vw,2.75rem)] leading-[1.12] font-light tracking-[-0.02em] text-balance text-navy"
        >
          Elige tu punto de partida
        </h2>

        {/* `items-stretch` es implícito en la rejilla, y el `flex flex-col` de
            cada tarjeta con `mt-auto` en el botón es lo que iguala su altura
            aunque las descripciones ocupen distinto número de líneas. */}
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ROUTES.map((route) => (
            <li
              key={route.href}
              className="flex flex-col rounded-2xl border border-line bg-white p-6 transition-shadow duration-300 ease-[var(--ease-kcb)] hover:shadow-[var(--shadow-soft-sm)] has-[a:focus-visible]:shadow-[var(--shadow-soft-sm)] lg:p-8"
            >
              <h3 className="font-[family-name:var(--font-display)] text-[1.125rem] leading-[1.35] font-light text-balance text-navy">
                {route.title}
              </h3>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-pretty text-muted">
                {route.description}
              </p>

              {/* `mt-auto` lo fija abajo: las dos tarjetas alinean su botón. */}
              <div className="mt-auto pt-8">
                <ActionButton
                  href={route.href}
                  surface="light"
                  emphasis="primary"
                  className="kcb-action--pitch-hover"
                  ariaLabel={`Comenzar: ${route.title}`}
                >
                  Comenzar
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  </section>
)
