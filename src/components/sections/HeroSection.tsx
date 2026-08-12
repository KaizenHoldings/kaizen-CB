import Link from 'next/link'
import React from 'react'

import { HeroTrajectory } from '@/components/sections/HeroTrajectory'
import { Icon } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'
import { SITE } from '@/lib/site'

/**
 * Primer viewport.
 *
 * Expone de inmediato las dos rutas del sitio —persona y empresa—, que son la
 * tesis de la página: los dos recorridos pesan igual y ninguno es un añadido
 * del otro. El texto institucional permanente vive aquí, no en Payload.
 */
const ROUTES = [
  {
    href: '/#registro-natural',
    icon: 'user' as const,
    title: 'Invierto por mi cuenta',
    description: 'Haz crecer tu patrimonio con acompañamiento de un asesor en cada decisión.',
  },
  {
    href: '/#registro-juridica',
    icon: 'building' as const,
    title: 'Represento a una empresa',
    description: 'Financia, estructura y emite en el mercado de valores venezolano.',
  },
]

export const HeroSection: React.FC = () => (
  <section
    id="inicio"
    className="kcb-gradient relative overflow-hidden text-white"
    aria-labelledby="hero-titulo"
  >
    <div className="kcb-container relative py-16 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        <div>
          <Reveal trigger="mount">
            <h1
              id="hero-titulo"
              className="text-balance text-[clamp(2.25rem,1.6rem+3.1vw,3.75rem)] leading-[1.06] font-bold text-white"
            >
              Invertir con visión,
              <br />
              crecer con confianza
            </h1>
          </Reveal>

          <Reveal trigger="mount" delay={0.08}>
            <p className="kcb-measure mt-6 text-[1.0625rem] leading-relaxed text-tint sm:text-lg">
              Conectamos a personas y empresas con las oportunidades del mercado de valores, con el
              respaldo de un equipo de gran trayectoria en el sector financiero.
            </p>
          </Reveal>

          <Reveal trigger="mount" delay={0.16}>
            <div className="mt-10">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-chart-light uppercase">
                Elige tu punto de partida
              </h2>

              {/* Filetes, no cajas: cada ruta es una columna separada por una
                  línea. `subgrid` alinea título, descripción y acción entre
                  columnas aunque un título ocupe dos líneas y el otro una. */}
              <ul className="mt-2 grid sm:grid-cols-2 sm:grid-rows-[auto_1fr_auto]">
                {ROUTES.map((route) => (
                  <li
                    key={route.href}
                    className="border-t border-white/25 sm:row-span-3 sm:grid sm:grid-rows-subgrid sm:not-first:border-s sm:not-first:ps-8"
                  >
                    <Link
                      href={route.href}
                      className="group flex flex-col gap-2 py-6 pe-4 sm:row-span-3 sm:grid sm:grid-rows-subgrid sm:gap-0 sm:pb-2"
                    >
                      <span className="flex items-start gap-2.5 sm:pb-2">
                        <Icon name={route.icon} className="mt-1 size-5 shrink-0 text-chart-light" />
                        <span className="font-[family-name:var(--font-display)] text-[1.125rem] leading-snug font-semibold text-balance text-white">
                          {route.title}
                        </span>
                      </span>
                      <span className="text-[0.9375rem] leading-relaxed text-tint">
                        {route.description}
                      </span>
                      <span className="flex items-center gap-1.5 pt-3 font-[family-name:var(--font-display)] text-sm font-semibold text-white underline decoration-white/40 decoration-1 underline-offset-4 transition-colors duration-300 group-hover:decoration-white">
                        Comenzar
                        <Icon
                          name="arrowRight"
                          className="size-4 no-underline transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal trigger="mount" delay={0.24}>
            <p className="mt-8 flex items-start gap-2.5 text-sm text-tint/85">
              <Icon name="scale" className="mt-0.5 size-4 shrink-0 text-chart-light" />
              <span>
                Operamos bajo la supervisión de la {SITE.regulator}. Toda inversión en el mercado de
                valores implica riesgo: conversamos contigo antes de recomendarte nada.
              </span>
            </p>
          </Reveal>
        </div>

        <HeroTrajectory />
      </div>
    </div>
  </section>
)
