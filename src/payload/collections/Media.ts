import path from 'path'
import { fileURLToPath } from 'url'

import type { CollectionConfig } from 'payload'

import { staffOnly, superAdminOnly } from '../access/roles'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Lista blanca explícita. Payload valida el MIME declarado y, en conjunto con
 * `sharp`, verifica que las imágenes sean realmente imágenes. No se admiten
 * ejecutables, archivos comprimidos ni tipos arbitrarios.
 */
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
]

const ALLOWED_EXTENSIONS = [
  'pdf',
  'xlsx',
  'xls',
  'docx',
  'jpg',
  'jpeg',
  'png',
  'webp',
  'svg',
] as const

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Archivo', plural: 'Archivos' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'title',
    defaultColumns: ['title', 'fileCategory', 'filename', 'mimeType', 'filesize'],
    description:
      'Documentos e imágenes que se publican en la web. Sube el archivo, descríbelo y luego enlázalo desde un documento o una publicación.',
  },
  access: {
    // Cualquier visitante puede descargar un archivo cuyo enlace es público;
    // la escritura queda reservada al personal administrativo.
    read: () => true,
    create: staffOnly,
    update: staffOnly,
    delete: superAdminOnly,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../../media'),
    mimeTypes: ALLOWED_MIME_TYPES,
    // 25 MB: suficiente para estados financieros escaneados sin abrir la puerta
    // a cargas abusivas.
    filesRequiredOnCreate: true,
    imageSizes: [
      {
        name: 'card',
        width: 640,
        height: 400,
        position: 'centre',
        withoutEnlargement: true,
      },
      {
        name: 'wide',
        width: 1280,
        height: 720,
        position: 'centre',
        withoutEnlargement: true,
      },
    ],
    adminThumbnail: 'card',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
      admin: {
        description: 'Nombre legible del archivo dentro del panel. Ejemplo: «Balance abril 2026».',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
      admin: {
        description:
          'Obligatorio para imágenes: describe lo que muestra para quien usa lector de pantalla. Déjalo vacío en archivos PDF o de hoja de cálculo.',
        condition: (data) => typeof data?.mimeType === 'string' && data.mimeType.startsWith('image/'),
      },
      validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
        const mime = typeof data?.mimeType === 'string' ? data.mimeType : ''
        if (mime.startsWith('image/') && (typeof value !== 'string' || value.trim().length === 0)) {
          return 'Describe la imagen para lectores de pantalla.'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      admin: {
        description: 'Nota interna opcional: contexto, origen o vigencia del archivo.',
      },
    },
    {
      name: 'fileCategory',
      type: 'select',
      label: 'Categoría del archivo',
      required: true,
      defaultValue: 'document',
      index: true,
      options: [
        { label: 'Documento descargable (PDF, XLSX, DOCX)', value: 'document' },
        { label: 'Imagen de publicación', value: 'publication-image' },
        { label: 'Imagen institucional', value: 'institutional-image' },
      ],
      admin: {
        description: 'Sirve para filtrar la biblioteca cuando crece.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, req }) => {
        const uploaded = req.file
        if (!uploaded) return data

        const extension = uploaded.name.split('.').pop()?.toLowerCase() ?? ''
        if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
          throw new Error(
            `La extensión «.${extension}» no está permitida. Formatos admitidos: ${ALLOWED_EXTENSIONS.join(', ')}.`,
          )
        }

        const MAX_BYTES = 25 * 1024 * 1024
        if (uploaded.size > MAX_BYTES) {
          throw new Error('El archivo supera el máximo de 25 MB.')
        }

        return data
      },
    ],
  },
  timestamps: true,
}
