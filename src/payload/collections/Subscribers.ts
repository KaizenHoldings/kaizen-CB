import type { CollectionConfig } from 'payload'

import { staffOnly, superAdminOnly } from '../access/roles'

/**
 * Registro de suscripciones al newsletter.
 *
 * La escritura pública NO pasa por esta colección: la ruta `/api/newsletter`
 * valida, normaliza y limita el tráfico, y solo entonces usa la Local API con
 * `overrideAccess`. Por eso `create` es `false` para cualquier petición
 * autenticada o anónima que llegue por la API REST de Payload.
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Suscriptor', plural: 'Suscriptores' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'consentAccepted', 'source', 'createdAt'],
    description:
      'Correos registrados desde el formulario público. Son datos personales: trátalos conforme a la política de privacidad y no los exportes sin autorización.',
    listSearchableFields: ['email'],
  },
  access: {
    read: staffOnly,
    // Nadie crea suscriptores por API: solo el endpoint controlado.
    create: () => false,
    update: staffOnly,
    delete: superAdminOnly,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Correo electrónico',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Se guarda normalizado en minúsculas y sin espacios.',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { label: 'Pendiente de confirmación', value: 'pending' },
        { label: 'Activo', value: 'active' },
        { label: 'Dado de baja', value: 'unsubscribed' },
      ],
      admin: {
        description:
          'Las nuevas suscripciones entran como «Pendiente». Pasarán a «Activo» automáticamente cuando se conecte el proveedor de correo con doble confirmación.',
      },
    },
    {
      name: 'consentAccepted',
      type: 'checkbox',
      label: 'Consentimiento otorgado',
      required: true,
      defaultValue: false,
      admin: {
        description: 'Marcado por la persona al enviar el formulario. No lo edites manualmente.',
        readOnly: true,
      },
    },
    {
      name: 'consentTimestamp',
      type: 'date',
      label: 'Fecha del consentimiento',
      admin: {
        description: 'Momento exacto en que se aceptó recibir comunicaciones.',
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime', displayFormat: "d MMM yyyy, HH:mm" },
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Origen',
      admin: {
        description: 'Sección de la web desde la que se registró. Ejemplo: «newsletter-home».',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (typeof data?.email === 'string') {
          data.email = data.email.trim().toLowerCase()
        }
        return data
      },
    ],
  },
  timestamps: true,
}
