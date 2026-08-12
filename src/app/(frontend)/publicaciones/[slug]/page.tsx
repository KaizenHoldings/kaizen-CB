import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { DocumentRow } from '@/components/ui/DocumentRow'
import { Icon } from '@/components/ui/Icon'
import { formatLongDate, toDateTimeAttribute } from '@/lib/format'
import {
  PUBLICATION_TYPE_LABELS,
  PUBLICATION_TYPE_TOKENS,
} from '@/modules/publications/domain/publication'
import { publicationService } from '@/modules/publications/services/publication.service'

type Params = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await publicationService.listSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const publication = await publicationService.getBySlug(slug)

  if (!publication) return { title: 'Publicación no encontrada' }

  const title = publication.metaTitle ?? publication.title
  const description = publication.metaDescription ?? publication.excerpt

  return {
    title,
    description,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/publicaciones/${publication.slug}`,
      publishedTime: publication.publishedAt,
      modifiedTime: publication.updatedAt,
      images: publication.image ? [{ url: publication.image.url, alt: publication.image.alt }] : undefined,
    },
  }
}

export default async function PublicationPage({ params }: Params) {
  const { slug } = await params
  const publication = await publicationService.getBySlug(slug)

  if (!publication) notFound()

  const tokens = PUBLICATION_TYPE_TOKENS[publication.type]
  const dateLabel = formatLongDate(publication.publishedAt)

  return (
    <article className="bg-white">
      <div className="kcb-container py-12 lg:py-20">
        <nav aria-label="Ruta de navegación" className="mb-8">
          <Link
            href="/publicaciones"
            className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-blue hover:text-navy"
          >
            <Icon name="arrowRight" className="size-4 rotate-180" />
            Todas las publicaciones
          </Link>
        </nav>

        <header className="max-w-3xl">
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
                className="text-[0.9375rem] text-muted"
              >
                {dateLabel}
              </time>
            ) : null}
          </div>

          <h1 className="mt-5 text-balance text-[clamp(1.875rem,1.5rem+1.9vw,2.75rem)] leading-tight font-bold text-navy">
            {publication.title}
          </h1>

          <p className="kcb-measure mt-5 text-[1.125rem] leading-relaxed text-muted">
            {publication.excerpt}
          </p>
        </header>

        {publication.image ? (
          <figure className="mt-10 overflow-hidden rounded-[20px] bg-tint">
            <Image
              src={publication.image.url}
              alt={publication.image.alt}
              width={publication.image.width ?? 1280}
              height={publication.image.height ?? 720}
              sizes="(min-width: 1024px) 60rem, 100vw"
              className="h-auto w-full object-cover"
              priority
            />
          </figure>
        ) : null}

        <div className="kcb-richtext mt-12 max-w-[68ch]">
          <RichText data={publication.body as SerializedEditorState} />
        </div>

        {publication.relatedDocument ? (
          <section aria-labelledby="documento-relacionado" className="mt-14 max-w-[68ch]">
            <h2
              id="documento-relacionado"
              className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-muted uppercase"
            >
              Documento relacionado
            </h2>
            <ul className="mt-3">
              <DocumentRow document={publication.relatedDocument} />
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  )
}
