import Image from 'next/image'
import React from 'react'

type LogoProps = {
  /** `dark` = logo oscuro para fondos claros. `light` = logo claro para Navy/Blue. */
  variant: 'dark' | 'light'
  className?: string
  priority?: boolean
  /** Cuando el logo es puramente decorativo junto a un texto que ya nombra la marca. */
  decorative?: boolean
}

/**
 * Logo horizontal oficial. Se sirve como archivo desde `public/brand/`, con su
 * proporción original 482 × 130 y sin recolorear.
 */
export const Logo: React.FC<LogoProps> = ({
  variant,
  className,
  priority = false,
  decorative = false,
}) => (
  <Image
    src={
      variant === 'dark'
        ? '/brand/kaizen-logo-horizontal-dark.png'
        : '/brand/kaizen-logo-horizontal-light.png'
    }
    alt={decorative ? '' : 'Kaizen Casa de Bolsa'}
    aria-hidden={decorative || undefined}
    width={482}
    height={130}
    priority={priority}
    className={className}
  />
)

/** Isotipo oficial, para contextos compactos. Proporción 119 × 130. */
export const Isotipo: React.FC<{ className?: string; decorative?: boolean }> = ({
  className,
  decorative = true,
}) => (
  <Image
    src="/brand/kaizen-isotipo.png"
    alt={decorative ? '' : 'Kaizen Casa de Bolsa'}
    aria-hidden={decorative || undefined}
    width={119}
    height={130}
    className={className}
  />
)
