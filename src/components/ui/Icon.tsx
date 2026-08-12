import React from 'react'

/**
 * Familia de iconos del proyecto: trazo lineal y geométrico, stroke 1.7,
 * extremos redondeados, caja de 24. Un único componente compartido, para no
 * duplicar SVG completos por cada botón o tarjeta.
 *
 * Los iconos decorativos se ocultan a tecnologías asistivas; cuando un icono
 * transmite información, se le pasa `title` y recibe `role="img"`.
 */
const PATHS = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowDown: <path d="M12 4v13M6.5 11.5 12 17l5.5-5.5" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  shield: <path d="M12 3.5 19 6v5.5c0 4-3 7.4-7 9-4-1.6-7-5-7-9V6z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  steps: (
    <>
      <path d="M3.5 20.5h4v-4h-4zM7.5 16.5h4v-5h-4zM11.5 11.5h4v-5h-4zM15.5 6.5h4v-3h-4z" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  layers: <path d="m12 3 8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5 12 21l8-4.5" />,
  coins: (
    <>
      <ellipse cx="12" cy="6.5" rx="7" ry="3" />
      <path d="M5 6.5v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" />
      <path d="M5 11.5v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="5" cy="18" r="2.2" />
      <circle cx="19" cy="18" r="2.2" />
      <path d="M12 7.2v4.3M12 11.5 6.4 16.2M12 11.5l5.6 4.7" />
    </>
  ),
  bank: (
    <>
      <path d="M3.5 9.5 12 4.5l8.5 5" />
      <path d="M5.5 9.5v8M10 9.5v8M14 9.5v8M18.5 9.5v8M3.5 20.5h17" />
    </>
  ),
  exchange: <path d="M4 8h13l-3.5-3.5M20 16H7l3.5 3.5" />,
  briefcase: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17" />
    </>
  ),
  cycle: (
    <>
      <path d="M4.5 12a7.5 7.5 0 0 1 12.9-5.2l2 2M19.5 12a7.5 7.5 0 0 1-12.9 5.2l-2-2" />
      <path d="M19.5 4.5v4.3h-4.3M4.5 19.5v-4.3h4.3" />
    </>
  ),
  convert: <path d="M4 8.5 7.5 5 11 8.5M7.5 5v9M20 15.5 16.5 19 13 15.5M16.5 19v-9" />,
  trend: (
    <>
      <path d="M3.5 16.5 9 11l3.5 3.5L20.5 6.5" />
      <path d="M20.5 11V6.5H16" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4.5v15M7.5 19.5h9" />
      <path d="m12 6.5-4.5 1.8 2.2 4.6a2.4 2.4 0 0 1-4.4 0L7.5 8.3M12 6.5l4.5 1.8-2.2 4.6a2.4 2.4 0 0 0 4.4 0L16.5 8.3" />
    </>
  ),
  headset: (
    <>
      <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
      <rect x="3" y="12.5" width="3.6" height="6" rx="1.8" />
      <rect x="17.4" y="12.5" width="3.6" height="6" rx="1.8" />
      <path d="M19 18.5a4 4 0 0 1-4 3h-2" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="M8 14.5v3M12 10v7.5M16 6.5v11" />
    </>
  ),
  sitemap: (
    <>
      <rect x="9" y="3.5" width="6" height="4" rx="1.2" />
      <rect x="3" y="16.5" width="6" height="4" rx="1.2" />
      <rect x="15" y="16.5" width="6" height="4" rx="1.2" />
      <path d="M12 7.5v4M6 16.5v-2.5h12v2.5" />
    </>
  ),
  pin: (
    <>
      <path d="M12 20.5c3.7-3.8 6.5-6.9 6.5-10.3a6.5 6.5 0 1 0-13 0c0 3.4 2.8 6.5 6.5 10.3z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  phone: (
    <path d="M5 4.5h2.7l1.8 4.4-1.9 1a10.6 10.6 0 0 0 4.5 4.5l1-1.9 4.4 1.8v2.7a1.8 1.8 0 0 1-1.9 1.8A15.4 15.4 0 0 1 3.2 6.4 1.8 1.8 0 0 1 5 4.5z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m3.5 7.5 8.5 5.5 8.5-5.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5V5.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15" />
      <path d="M14 10.5h5a1 1 0 0 1 1 1v9M3 20.5h18" />
      <path d="M7.5 8h3M7.5 12h3M7.5 16h3M17 14h0M17 17.5h0" />
    </>
  ),
  spark: (
    <path d="m12 3.5 1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 21 19.5H3z" />
      <path d="M12 10v3.8M12 16.6v.2" />
    </>
  ),
  pause: <path d="M9.5 5.5v13M14.5 5.5v13" />,
  play: <path d="M7.5 5.5 18 12 7.5 18.5z" />,
  external: <path d="M14 5h5v5M19 5l-8 8M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10" />,
} as const

export type IconName = keyof typeof PATHS

export type IconProps = {
  name: IconName
  /** Etiqueta accesible. Sin ella, el icono es decorativo y queda oculto. */
  title?: string
  className?: string
  strokeWidth?: number
}

export const Icon: React.FC<IconProps> = ({ name, title, className, strokeWidth = 1.7 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={title ? undefined : true}
    role={title ? 'img' : undefined}
    focusable="false"
  >
    {title ? <title>{title}</title> : null}
    {PATHS[name]}
  </svg>
)
