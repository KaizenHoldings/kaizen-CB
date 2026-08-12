import React from 'react'

type SectionHeadingProps = {
  /** Id del encabezado; la sección lo referencia con `aria-labelledby`. */
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  level?: 2 | 3
  surface?: 'light' | 'dark'
  align?: 'start' | 'center'
  /**
   * `lead` da a una sección el segundo peso focal de la página. Se reserva a
   * la información financiera: es la evidencia sobre la que descansa la tesis.
   */
  size?: 'default' | 'lead'
  /** Contenido opcional a la derecha en desktop: filtros, fecha de corte… */
  aside?: React.ReactNode
}

/**
 * Encabezado de sección. Sin etiqueta superior: el título carga su propio peso
 * y la descripción lo explica.
 *
 * No anima: la entrada de sección se aplica al contenido, no al título, para
 * que la lectura empiece de inmediato.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  title,
  description,
  level = 2,
  surface = 'light',
  align = 'start',
  size = 'default',
  aside,
}) => {
  const Heading = level === 2 ? 'h2' : 'h3'
  const isDark = surface === 'dark'

  const titleSize =
    level === 3
      ? 'text-[clamp(1.35rem,1.15rem+1vw,1.875rem)]'
      : size === 'lead'
        ? 'text-[clamp(2.125rem,1.55rem+2.6vw,3.5rem)]'
        : 'text-[clamp(1.75rem,1.35rem+1.9vw,2.75rem)]'

  return (
    <div
      className={[
        'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between',
        align === 'center' ? 'items-center text-center lg:flex-col lg:text-center' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-3xl'}>
        <Heading
          id={id}
          className={[
            'text-balance font-semibold',
            titleSize,
            isDark ? 'text-white' : 'text-navy',
          ].join(' ')}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className={[
              'kcb-measure mt-4 leading-relaxed',
              size === 'lead' ? 'text-[1.125rem]' : 'text-[1.0625rem]',
              align === 'center' ? 'mx-auto' : '',
              isDark ? 'text-tint' : 'text-muted',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {description}
          </p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  )
}
