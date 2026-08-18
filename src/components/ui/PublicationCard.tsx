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
 * El tipo se comunica con texto además de color.
 *
 * Toda la tarjeta es el área pulsable: el enlace de «Leer la publicación»
 * extiende su zona sensible con una capa `before` que cubre la tarjeta entera.
 * El título deja de ser enlace por eso mismo —esa capa lo taparía, y dos
 * enlaces al mismo destino en una tarjeta duplican el control sin añadir nada—.
 * El nombre accesible lo da un `aria-label` que incorpora el título, para que
 * el enlace no se anuncie como un genérico «Leer la publicación».
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
    <article className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white border border-line shadow-[var(--shadow-soft-sm)] transition-shadow duration-300 hover:shadow-[var(--shadow-soft)] has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-[3px] has-[a:focus-visible]:outline-emerald">
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

        <Heading className="mt-4 font-[family-name:var(--font-display)] text-[1.0625rem] leading-snug font-semibold text-navy underline-offset-4 group-hover:underline">
          {publication.title}
        </Heading>

        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{publication.excerpt}</p>

        {/* `before:absolute before:inset-0` extiende la zona sensible del enlace
            a toda la tarjeta sin cambiar el árbol ni la maquetación: la capa no
            ocupa espacio, solo intercepta el puntero. */}
        <Link
          href={`/publicaciones/${publication.slug}`}
          aria-label={`Leer la publicación: ${publication.title}`}
          className="mt-5 flex items-center gap-1.5 pt-1 font-[family-name:var(--font-display)] text-sm font-semibold text-blue before:absolute before:inset-0 before:content-[''] focus-visible:outline-none"
        >
          Leer la publicación
          <Icon
            name="arrowRight"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </article>
  )
}
