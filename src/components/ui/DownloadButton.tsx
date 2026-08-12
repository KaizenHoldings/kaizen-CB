import React from 'react'

type Surface = 'light' | 'dark' | 'blue'

export type DownloadButtonProps = {
  /** URL real del archivo. `null` cuando no existe: se renderiza deshabilitado. */
  href: string | null
  /** Nombre con el que se guarda el archivo al descargarlo. */
  fileName?: string | null
  /** Etiqueta del tipo: «PDF», «XLSX»… `null` si no se conoce. */
  fileType?: string | null
  /** Tamaño real ya formateado. `null` si Payload no lo registró: no se inventa. */
  fileSize?: string | null
  /** Nombre del documento, para construir el nombre accesible completo. */
  documentTitle: string
  surface?: Surface
  /** `open` abre en pestaña nueva en vez de descargar. */
  intent?: 'download' | 'open'
  /** Lado del tooltip. Se decide por composición para evitar desbordamiento. */
  tooltipSide?: 'end' | 'start'
}

/**
 * Control compacto de descarga de documentos.
 *
 * El tooltip es complementario: el tipo y el tamaño también aparecen en la
 * tarjeta y dentro del nombre accesible, de modo que la información nunca
 * depende de tener hover.
 */
export const DownloadButton: React.FC<DownloadButtonProps> = ({
  href,
  fileName,
  fileType,
  fileSize,
  documentTitle,
  surface = 'light',
  intent = 'download',
  tooltipSide = 'end',
}) => {
  const actionLabel = intent === 'open' ? 'Abrir' : 'Descargar'

  // Solo se enuncian los metadatos que existen de verdad.
  const details = [fileType, fileSize].filter(Boolean).join(' · ')
  const tooltip = details ? `${actionLabel} ${details}` : actionLabel
  const accessibleName = details
    ? `${actionLabel} ${documentTitle}. ${details}`
    : `${actionLabel} ${documentTitle}`

  const icon = (
    <span className="kcb-download__icon" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="kcb-download__arrow"
        focusable="false"
      >
        <path d="M12 3.5v11M7 10l5 5 5-5" />
      </svg>
      <span className="kcb-download__tray" />
    </span>
  )

  // Archivo no disponible: se conserva la información del documento y se
  // retira la acción, en vez de mostrar un enlace roto.
  if (!href) {
    return (
      <span
        className="kcb-download"
        data-surface={surface}
        aria-disabled="true"
        role="link"
        aria-label={`${documentTitle}: archivo no disponible`}
        title="Archivo no disponible"
      >
        {icon}
      </span>
    )
  }

  const isExternalTarget = intent === 'open'

  return (
    <a
      className="kcb-download"
      data-surface={surface}
      data-tooltip-side={tooltipSide}
      href={href}
      download={intent === 'download' ? (fileName ?? true) : undefined}
      target={isExternalTarget ? '_blank' : undefined}
      rel={isExternalTarget ? 'noopener noreferrer' : undefined}
      aria-label={accessibleName}
    >
      {icon}
      <span className="kcb-download__tooltip" role="tooltip" aria-hidden="true">
        {tooltip}
      </span>
    </a>
  )
}
