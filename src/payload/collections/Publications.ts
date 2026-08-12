import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly, superAdminOnly } from '../access/roles'
import { slugField } from '../fields/slug'
import { CACHE_TAGS, revalidateOnChange, revalidateOnDelete } from '../hooks/revalidate'

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publicación', plural: 'Publicaciones' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'publishedAt', '_status'],
    description:
      'Newsletters, material de cumplimiento y actualizaciones de mercado. Solo se muestran en la web las publicaciones en estado «Publicado».',
    listSearchableFields: ['title', 'excerpt'],
    preview: (doc) =>
      typeof doc?.slug === 'string'
        ? `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/publicaciones/${doc.slug}`
        : null,
  },
  access: {
    read: publishedOrStaff,
    create: staffOnly,
    update: staffOnly,
    delete: superAdminOnly,
    readVersions: staffOnly,
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
      schedulePublish: false,
    },
    maxPerDoc: 30,
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
              maxLength: 180,
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Resumen',
              required: true,
              maxLength: 320,
              admin: {
                description:
                  'Dos o tres frases que se muestran en la tarjeta y en los resultados de búsqueda. Máximo 320 caracteres.',
              },
            },
            {
              name: 'body',
              type: 'richText',
              label: 'Contenido',
              required: true,
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
              admin: {
                description:
                  'Empieza los apartados con encabezado de nivel 2: el título de la página ya ocupa el nivel 1.',
              },
            },
          ],
        },
        {
          label: 'Recursos',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen destacada',
              admin: {
                description:
                  'Opcional. Se muestra en la tarjeta y al compartir el enlace. Recuerda cargarla con texto alternativo.',
              },
              filterOptions: () => ({
                mimeType: { like: 'image' },
              }),
            },
            {
              name: 'relatedDocument',
              type: 'relationship',
              relationTo: 'documents',
              label: 'Documento relacionado',
              admin: {
                description:
                  'Opcional. Si la publicación acompaña a un PDF (una circular, un informe), enlázalo aquí para que aparezca su botón de descarga.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Título para buscadores',
              maxLength: 70,
              admin: {
                description: 'Si lo dejas vacío se usa el título de la publicación.',
              },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Descripción para buscadores',
              maxLength: 170,
              admin: {
                description: 'Si la dejas vacía se usa el resumen.',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'type',
      type: 'select',
      label: 'Tipo',
      required: true,
      defaultValue: 'newsletter',
      index: true,
      options: [
        { label: 'Newsletter', value: 'newsletter' },
        { label: 'Cumplimiento', value: 'compliance' },
        { label: 'Actualización de mercado', value: 'market-update' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Define en qué filtro aparece dentro de la web.',
      },
    },
    slugField('title'),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de publicación',
      required: true,
      defaultValue: () => new Date().toISOString(),
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateOnChange(CACHE_TAGS.publications)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.publications)],
  },
  timestamps: true,
}
