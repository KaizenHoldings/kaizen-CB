import React from 'react'

import { Icon, type IconName } from './Icon'

type EmptyStateProps = {
  icon?: IconName
  title: string
  description: React.ReactNode
  surface?: 'light' | 'dark'
  /** Acción opcional: un enlace de contacto, por ejemplo. */
  action?: React.ReactNode
  /** `status` anuncia el cambio a lectores de pantalla tras una interacción. */
  live?: boolean
}

/**
 * Estado vacío compartido: se usa igual cuando todavía no hay contenido
 * publicado y cuando un filtro no devuelve resultados. Explica qué pasa y qué
 * puede hacer la persona, sin fingir contenido.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'info',
  title,
  description,
  surface = 'light',
  action,
  live = false,
}) => {
  const isDark = surface === 'dark'

  return (
    <div
      role={live ? 'status' : undefined}
      className={[
        'flex flex-col items-start gap-4 rounded-[16px] px-6 py-10 sm:px-8',
        isDark
          ? 'bg-white/[0.06] text-tint'
          : 'bg-pearl text-muted',
      ].join(' ')}
    >
      <span className="kcb-chip" data-surface={isDark ? 'dark' : undefined} data-size="sm">
        <Icon name={icon} className="size-5" />
      </span>
      <div className="kcb-measure">
        <p
          className={[
            'font-[family-name:var(--font-display)] text-lg font-semibold',
            isDark ? 'text-white' : 'text-navy',
          ].join(' ')}
        >
          {title}
        </p>
        <div className="mt-2 text-[0.9375rem] leading-relaxed">{description}</div>
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  )
}
