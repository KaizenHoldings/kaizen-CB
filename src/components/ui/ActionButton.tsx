import Link from 'next/link'
import React from 'react'

import { Icon } from './Icon'

type Surface = 'light' | 'dark' | 'blue'
type Emphasis = 'primary' | 'secondary' | 'accent'

type CommonProps = {
  children: React.ReactNode
  surface?: Surface
  emphasis?: Emphasis
  fullWidth?: boolean
  ariaLabel?: string
  className?: string
  id?: string
}

type ButtonProps = CommonProps & {
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  /** Acción asíncrona en curso: conserva la etiqueta y anuncia `aria-busy`. */
  loading?: boolean
  form?: string
}

type LinkProps = CommonProps & {
  href: string
  /** Fuerza `<a>` en lugar de `Link` para destinos externos o descargas. */
  external?: boolean
  download?: boolean | string
  target?: '_blank'
  /** Efecto lateral al navegar; por ejemplo, cerrar el menú móvil. */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export type ActionButtonProps = ButtonProps | LinkProps

const isLink = (props: ActionButtonProps): props is LinkProps => typeof props.href === 'string'

/**
 * Contenido animado del botón.
 *
 * Las dos flechas y la etiqueta duplicada son decorativas: se ocultan a
 * tecnologías asistivas para que el control conserve un único nombre
 * accesible, que proviene del texto real o de `aria-label`.
 */
const ActionButtonInner: React.FC<{ children: React.ReactNode; loading?: boolean }> = ({
  children,
  loading,
}) => (
  <>
    <Icon name="arrowRight" className="kcb-action__arrow kcb-action__arrow--enter" />
    {loading ? <span className="kcb-action__spinner" aria-hidden="true" /> : null}
    <span className="kcb-action__label">{children}</span>
    <span className="kcb-action__fill" aria-hidden="true" />
    <Icon name="arrowRight" className="kcb-action__arrow kcb-action__arrow--exit" />
  </>
)

/**
 * CTA principal del sitio. Único componente para todo el proyecto: la variante
 * se elige por la superficie real sobre la que se apoya, no por la sección.
 *
 * No debe usarse en hamburguesas, tabs, acordeones, paginación, iconos
 * sociales, controles de formulario ni descargas de documentos.
 */
export const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const {
    children,
    surface = 'light',
    emphasis = 'primary',
    fullWidth = false,
    ariaLabel,
    className,
    id,
  } = props

  const shared = {
    id,
    className: ['kcb-action', className].filter(Boolean).join(' '),
    'data-surface': surface,
    'data-emphasis': emphasis,
    'data-full-width': fullWidth ? 'true' : undefined,
    'aria-label': ariaLabel,
  }

  if (isLink(props)) {
    const { href, external, download, target, onClick } = props
    const useAnchor = external || Boolean(download) || /^(https?:|mailto:|tel:|#)/.test(href)

    if (useAnchor) {
      return (
        <a
          {...shared}
          href={href}
          download={download}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          onClick={onClick}
        >
          <ActionButtonInner>{children}</ActionButtonInner>
        </a>
      )
    }

    return (
      <Link {...shared} href={href} onClick={onClick}>
        <ActionButtonInner>{children}</ActionButtonInner>
      </Link>
    )
  }

  const { type = 'button', onClick, disabled, loading, form } = props

  return (
    <button
      {...shared}
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      <ActionButtonInner loading={loading}>{children}</ActionButtonInner>
    </button>
  )
}
