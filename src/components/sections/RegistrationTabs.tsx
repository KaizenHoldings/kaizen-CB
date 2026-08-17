'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import React, { useEffect, useState } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SITE } from '@/lib/site'

type Track = 'natural' | 'juridica'

const TABS: Array<{
  id: Track
  label: string
  icon: IconName
  intro: string
}> = [
  {
    id: 'natural',
    label: 'Persona natural',
    icon: 'user',
    intro:
      'Abres tu cuenta a tu nombre para invertir en instrumentos del mercado de valores venezolano.',
  },
  {
    id: 'juridica',
    label: 'Persona jurídica',
    icon: 'building',
    intro:
      'Registras a tu empresa para invertir, financiarte o emitir en el mercado de valores.',
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

          {/* Una sola superficie elevada: el estado vive dentro del panel, no en
              una tarjeta anidada. */}
          <div className="kcb-hairline mt-8 pt-8">
            <div className="flex items-start gap-3">
              <span className="kcb-chip" data-size="sm">
                <Icon name="clock" className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-navy">
                  El formulario en línea todavía no está habilitado
                </h3>
                <p className="kcb-measure mt-2 text-[0.9375rem] leading-relaxed text-muted">
                  Estamos terminando de integrar el formulario de apertura de cuenta para{' '}
                  {activeTab.label.toLowerCase()}. Mientras tanto, escríbenos o llámanos y un asesor
                  te indica los recaudos que necesitas y te acompaña en el registro.
                </p>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  No envíes documentos personales por esta web: tu asesor te indicará el canal
                  seguro para consignarlos.
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
