import React from 'react'

import { DownloadButton } from '@/components/ui/DownloadButton'
import { Icon } from '@/components/ui/Icon'
import { formatShortDate, toDateTimeAttribute } from '@/lib/format'
import type { PublicDocument } from '@/modules/documents/domain/document'

/**
 * Fila de documento.
 *
 * El título es el enlace principal cuando el archivo existe; el botón de
 * descarga es el control compacto de apoyo. Tipo, periodo, fecha y tamaño real
 * se leen sin necesidad de hover.
 */
export const DocumentRow: React.FC<{
  document: PublicDocument
  surface?: 'light' | 'dark'
}> = ({ document, surface = 'light' }) => {
  const isDark = surface === 'dark'
  const publishedLabel = formatShortDate(document.publishedAt)

  // Metadatos reales únicamente: nada se rellena con valores inventados.
  const meta = [
    document.periodLabel,
    document.file?.typeLabel,
    document.file?.sizeLabel,
    publishedLabel ? `Publicado el ${publishedLabel}` : null,
  ].filter(Boolean) as string[]

  const title = document.file ? (
    <a
      href={document.file.url}
      download={document.intent === 'download' ? document.file.filename : undefined}
      target={document.intent === 'open' ? '_blank' : undefined}
      rel={document.intent === 'open' ? 'noopener noreferrer' : undefined}
      className={[
        'font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold underline-offset-4 hover:underline',
        isDark ? 'text-white' : 'text-navy',
      ].join(' ')}
    >
      {document.title}
    </a>
  ) : (
    <span
      className={[
        'font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold',
        isDark ? 'text-white' : 'text-navy',
      ].join(' ')}
    >
      {document.title}
    </span>
  )

  /* Raíz `div`, no `li`: la fila es contenido, no intrínsecamente un elemento
     de lista. Como `li` no se podía reutilizar dentro de una tarjeta de carril
     —que ya es el `li` del carrusel— y anidar `li` dentro de `li` es HTML
     inválido, que además rompía la hidratación. Quien la use como lista pone su
     propio `li` alrededor; las clases visuales siguen aquí, intactas. */
  return (
    <div
      className={[
        'flex items-start gap-4 border-t py-5',
        isDark ? 'border-white/16' : 'border-line',
      ].join(' ')}
    >
      <span className="kcb-chip" data-surface={isDark ? 'dark' : undefined} data-size="sm">
        <Icon name="doc" className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        {title}

        {document.description ? (
          <p
            className={[
              'kcb-measure mt-1.5 text-[0.9375rem] leading-relaxed',
              isDark ? 'text-tint' : 'text-muted',
            ].join(' ')}
          >
            {document.description}
          </p>
        ) : null}

        <p
          className={['mt-2 text-sm', isDark ? 'text-tint/85' : 'text-muted'].join(' ')}
          data-tabular
        >
          {meta.length > 0 ? (
            meta.map((item, index) => (
              <React.Fragment key={item}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <span>{item}</span>
              </React.Fragment>
            ))
          ) : (
            <span>Sin archivo disponible</span>
          )}
        </p>

        {document.effectiveDate ? (
          <p className={['mt-1 text-sm', isDark ? 'text-tint/85' : 'text-muted'].join(' ')}>
            Vigente desde{' '}
            <time dateTime={toDateTimeAttribute(document.effectiveDate)}>
              {formatShortDate(document.effectiveDate)}
            </time>
          </p>
        ) : null}
      </div>

      <div className="shrink-0 pt-0.5">
        <DownloadButton
          href={document.file?.url ?? null}
          fileName={document.file?.filename}
          fileType={document.file?.typeLabel}
          fileSize={document.file?.sizeLabel}
          documentTitle={document.title}
          intent={document.intent}
          surface={surface}
          tooltipSide="start"
        />
      </div>
    </div>
  )
}
