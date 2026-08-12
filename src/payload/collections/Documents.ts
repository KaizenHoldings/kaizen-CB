import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staffOnly, superAdminOnly } from '../access/roles'
import { slugField } from '../fields/slug'
import { CACHE_TAGS, revalidateOnChange, revalidateOnDelete } from '../hooks/revalidate'

const CURRENT_YEAR = new Date().getFullYear()

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Documento', plural: 'Documentos' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'periodYear', 'periodMonth', 'publishedAt', '_status'],
    description:
      'Documentación institucional, estados financieros, material de cumplimiento y documentos de referencia que se publican en la web.',
    listSearchableFields: ['title', 'description'],
    preview: (doc) =>
      `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}/#informacion-financiera${
        typeof doc?.slug === 'string' ? `?doc=${doc.slug}` : ''
      }`,
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
    maxPerDoc: 20,
  },
  defaultSort: ['-periodYear', '-periodMonth', 'sortOrder', '-publishedAt'],
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
              admin: {
                description:
                  'Cómo se verá en la web. Ejemplo: «Estados financieros — abril 2026» o «Organigrama funcional».',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción',
              admin: {
                description:
                  'Una o dos frases que expliquen de qué trata el documento. Se muestra bajo el título.',
              },
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              label: 'Archivo',
              required: true,
              admin: {
                description:
                  'Sube primero el archivo en «Archivos» y selecciónalo aquí. La web muestra su tipo y tamaño reales.',
              },
            },
            {
              name: 'intent',
              type: 'select',
              label: 'Al hacer clic',
              required: true,
              defaultValue: 'download',
              options: [
                { label: 'Descargar el archivo', value: 'download' },
                { label: 'Abrirlo en una pestaña nueva', value: 'open' },
              ],
              admin: {
                description: 'Los PDF extensos suelen leerse mejor abiertos en una pestaña.',
              },
            },
          ],
        },
        {
          label: 'Clasificación',
          fields: [
            {
              name: 'category',
              type: 'select',
              label: 'Categoría',
              required: true,
              index: true,
              defaultValue: 'institutional',
              options: [
                { label: 'Documentación institucional', value: 'institutional' },
                { label: 'Estados financieros', value: 'financial-statement' },
                { label: 'Cumplimiento', value: 'compliance' },
                { label: 'Documento de referencia', value: 'reference' },
              ],
              admin: {
                description:
                  'Determina en qué bloque de la web aparece el documento. Los estados financieros se agrupan por año y mes.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'periodYear',
                  type: 'number',
                  label: 'Año del periodo',
                  min: 1990,
                  max: CURRENT_YEAR + 2,
                  index: true,
                  admin: {
                    width: '50%',
                    description: 'Obligatorio en estados financieros.',
                  },
                },
                {
                  name: 'periodMonth',
                  type: 'select',
                  label: 'Mes del periodo',
                  index: true,
                  options: [
                    { label: 'Enero', value: '1' },
                    { label: 'Febrero', value: '2' },
                    { label: 'Marzo', value: '3' },
                    { label: 'Abril', value: '4' },
                    { label: 'Mayo', value: '5' },
                    { label: 'Junio', value: '6' },
                    { label: 'Julio', value: '7' },
                    { label: 'Agosto', value: '8' },
                    { label: 'Septiembre', value: '9' },
                    { label: 'Octubre', value: '10' },
                    { label: 'Noviembre', value: '11' },
                    { label: 'Diciembre', value: '12' },
                  ],
                  admin: {
                    width: '50%',
                    description: 'Déjalo vacío en documentos anuales o sin periodicidad.',
                  },
                },
              ],
            },
            {
              name: 'effectiveDate',
              type: 'date',
              label: 'Vigente desde',
              admin: {
                date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' },
                description:
                  'Solo para normativa o documentos con entrada en vigencia. Permite distinguir lo vigente de lo histórico.',
              },
            },
          ],
        },
      ],
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
        description: 'Ordena los documentos dentro de su bloque.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Orden manual',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        step: 1,
        description:
          'Solo si necesitas forzar el orden dentro de su bloque. Menor número aparece primero; deja 0 para el orden por fecha.',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        // Un estado financiero sin periodo no puede agruparse ni ordenarse.
        if (data.category === 'financial-statement' && !data.periodYear) {
          throw new Error('Indica el año del periodo para un estado financiero.')
        }
        return data
      },
    ],
    afterChange: [revalidateOnChange(CACHE_TAGS.documents)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.documents)],
  },
  timestamps: true,
}
