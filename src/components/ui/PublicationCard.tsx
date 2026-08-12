import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Icon } from '@/components/ui/Icon'
import { formatShortDate, toDateTimeAttribute } from '@/lib/format'
import {
  PUBLICATION_TYPE_LABELS,
  PUBLICATION_TYPE_TOKENS,
  type PublicationSummary,
} from '@/modules/publications/domain/publication'

/**
 * Tarjeta de publicación.
 *
 * El tipo se comunica con texto además de color, y el enlace envuelve el
 * título —no la tarjeta completa— para que el nombre accesible sea preciso.
 */
export const PublicationCard: React.FC<{
  publication: PublicationSummary
  /**
   * Nivel del título de la tarjeta. En la home cuelga del h2 de su sección
   * (h3); en el índice de publicaciones cuelga del h1 de la página (h2). Sin
   * esta prop, una de las dos vistas saltaría un nivel de encabezado.
   */
  headingLevel?: 2 | 3
}> = ({ publication, headingLevel = 3 }) => {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const tokens = PUBLICATION_TYPE_TOKENS[publication.type]
  const dateLabel = formatShortDate(publication.publishedAt)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-[0_10px_28px_-16px_rgba(14,48,72,0.26)] transition-shadow duration-300 hover:shadow-[0_20px_50px_-22px_rgba(14,48,72,0.28)]">
      {publication.image ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-tint">
          <Image
            src={publication.image.url}
            alt={publication.image.alt}
            fill
            sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="kcb-tag"
            style={{ backgroundColor: tokens.background, color: tokens.foreground }}
          >
            {PUBLICATION_TYPE_LABELS[publication.type]}
          </span>
          {dateLabel ? (
            <time
              dateTime={toDateTimeAttribute(publication.publishedAt)}
              className="text-sm text-muted"
            >
              {dateLabel}
            </time>
          ) : null}
          {publication.hasAttachment ? (
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Icon name="doc" className="size-4" />
              Con documento
            </span>
          ) : null}
        </div>

        <Heading className="mt-4 font-[family-name:var(--font-display)] text-[1.0625rem] leading-snug font-semibold text-navy">
          <Link
            href={`/publicaciones/${publication.slug}`}
            className="underline-offset-4 hover:underline"
          >
            {publication.title}
          </Link>
        </Heading>

        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{publication.excerpt}</p>

        <p className="mt-5 flex items-center gap-1.5 pt-1 font-[family-name:var(--font-display)] text-sm font-semibold text-blue">
          Leer la publicación
          <Icon
            name="arrowRight"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </p>
      </div>
    </article>
  )
}
