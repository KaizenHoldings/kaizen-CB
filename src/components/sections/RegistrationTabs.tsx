'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import React, { useEffect, useState } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SITE } from '@/lib/site'

type Track = 'natural' | 'juridica'

/* La vía de registro vive dentro de la pestaña, no en una condición aparte:
   así el panel solo puede ofrecer la que corresponde a la persona activa, y
   emparejarlas mal deja de ser posible por construcción. */
const TABS: Array<{
  id: Track
  label: string
  icon: IconName
  intro: string
  form: { href: string; label: string }
}> = [
  {
    id: 'natural',
    label: 'Persona natural',
    icon: 'user',
    intro:
      'Abres tu cuenta a tu nombre para invertir en instrumentos del mercado de valores venezolano.',
    form: {
      href: '/registro/persona-natural',
      label: 'Formulario de Identificación de Clientes Persona Natural Kaizen Casa de Bolsa',
    },
  },
  {
    id: 'juridica',
    label: 'Persona jurídica',
    icon: 'building',
    intro:
      'Registras a tu empresa para invertir, financiarte o emitir en el mercado de valores.',
    form: {
      href: '/registro/persona-juridica',
      label: 'Formulario de Identificación de Clientes PJ -Kaizen Casa de Bolsa',
    },
  },
]

/**
 * El anclaje `#registro-natural` / `#registro-juridica` preselecciona la
 * pestaña, de modo que las dos rutas del hero llegan al lugar correcto y el
 * enlace se puede compartir.
 */
const trackFromHash = (hash: string): Track | null => {
  if (hash === '#registro-juridica') return 'juridica'
  if (hash === '#registro-natural') return 'natural'
  return null
}

export const RegistrationTabs: React.FC = () => {
  const [active, setActive] = useState<Track>('natural')
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const sync = () => {
      const track = trackFromHash(window.location.hash)
      if (track) setActive(track)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const activeTab = TABS.find((tab) => tab.id === active) ?? TABS[0]!

  return (
    <div>
      <div
        role="tablist"
        aria-label="Tipo de persona"
        className="flex w-full max-w-md gap-1 rounded-full bg-tint p-1 sm:inline-flex sm:w-auto"
      >
        {TABS.map((tab) => {
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`registro-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`registro-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.id)}
              className={[
                'flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-3 font-[family-name:var(--font-display)] text-[0.875rem] font-semibold transition-colors duration-200 sm:flex-none sm:px-6 sm:whitespace-nowrap sm:text-[0.9375rem]',
                selected
                  ? 'bg-white text-navy shadow-[var(--shadow-soft-sm)]'
                  : 'text-muted hover:text-navy',
              ].join(' ')}
            >
              <Icon name={tab.icon} className="size-[1.125rem] shrink-0" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab.id}
          role="tabpanel"
          id={`registro-panel-${activeTab.id}`}
          aria-labelledby={`registro-tab-${activeTab.id}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 rounded-2xl bg-pearl p-6 sm:p-10"
        >
          <p className="kcb-measure text-[1.0625rem] leading-relaxed text-ink">{activeTab.intro}</p>

          {/* Formularios de identificación. Se abren en un diálogo dentro de la
              página: así el visitante no pierde el contexto de la sección ni
              acaba en una pestaña suelta de un dominio ajeno.
              Apilados en móvil y en fila desde `sm`, siguiendo el mismo patrón
              que el resto de pares de acciones de la sección. */}
          <div className="mt-8">
            {/* El formulario dejó de ser un diálogo y vive en su propia página:
                `ActionButton` con `href` renderiza el `Link` de Next, así que la
                navegación es del enrutador y no de un manejador propio. */}
            <ActionButton href={activeTab.form.href} surface="light" emphasis="secondary">
              {activeTab.form.label}
            </ActionButton>
          </div>

          {/* El aviso de «formulario no habilitado» se retiró al entrar en
              servicio los formularios: contradecía al botón que tiene encima.
              Quedan las vías de contacto, que siguen siendo válidas. */}
          <div className="kcb-hairline mt-8 flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
            <ActionButton href={SITE.contact.emailHref} surface="light" emphasis="primary">
              Escríbenos por correo
            </ActionButton>
            <a
              href={SITE.contact.phoneHref}
              className="inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold text-navy hover:text-blue"
            >
              <Icon name="phone" className="size-[1.125rem]" />
              {SITE.contact.phone}
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
