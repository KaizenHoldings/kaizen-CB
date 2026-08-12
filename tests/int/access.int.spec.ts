import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

import { samplePdfBuffer } from '../helpers/sample-pdf'

/**
 * Pruebas de control de acceso contra PostgreSQL real.
 *
 * Cubren lo que el proyecto exige verificar: lectura pública limitada a
 * contenido publicado, separación de roles y cierre de la escritura pública.
 * Todo lo que crean se elimina al terminar.
 */
let payload: Payload

const SUFFIX = `${Date.now()}`
const superAdminEmail = `super.${SUFFIX}@pruebas.local`
const editorEmail = `editor.${SUFFIX}@pruebas.local`
const password = 'Prueba-Segura-2026'

let superAdminId: number | string
let editorId: number | string
let mediaId: number
let publishedId: number | string
let draftId: number | string

beforeAll(async () => {
  payload = await getPayload({ config: await config })

  const superAdmin = await payload.create({
    collection: 'admin-users',
    overrideAccess: true,
    data: { email: superAdminEmail, password, name: 'Super de prueba', role: 'super-admin' },
  })
  superAdminId = superAdmin.id

  const editor = await payload.create({
    collection: 'admin-users',
    overrideAccess: true,
    data: { email: editorEmail, password, name: 'Editor de prueba', role: 'editor' },
  })
  editorId = editor.id

  const pdf = samplePdfBuffer()
  const media = await payload.create({
    collection: 'media',
    overrideAccess: true,
    data: { title: `Archivo de prueba ${SUFFIX}`, fileCategory: 'document' },
    file: {
      data: pdf,
      mimetype: 'application/pdf',
      name: `prueba-${SUFFIX}.pdf`,
      size: pdf.byteLength,
    },
  })
  mediaId = media.id as number

  const published = await payload.create({
    collection: 'documents',
    overrideAccess: true,
    draft: false,
    data: {
      title: `Publicado ${SUFFIX}`,
      slug: `publicado-${SUFFIX}`,
      category: 'institutional',
      intent: 'download',
      file: mediaId,
      publishedAt: new Date().toISOString(),
      _status: 'published',
    },
  })
  publishedId = published.id

  const draft = await payload.create({
    collection: 'documents',
    overrideAccess: true,
    draft: true,
    data: {
      title: `Borrador ${SUFFIX}`,
      slug: `borrador-${SUFFIX}`,
      category: 'institutional',
      intent: 'download',
      file: mediaId,
      publishedAt: new Date().toISOString(),
      _status: 'draft',
    },
  })
  draftId = draft.id
})

afterAll(async () => {
  const remove = async (collection: 'documents' | 'media' | 'admin-users', id?: number | string) => {
    if (id === undefined) return
    await payload.delete({ collection, id, overrideAccess: true }).catch(() => undefined)
  }

  await remove('documents', publishedId)
  await remove('documents', draftId)
  await remove('media', mediaId)
  await remove('admin-users', editorId)
  await remove('admin-users', superAdminId)
})

describe('lectura pública de documentos', () => {
  it('una visitante anónima solo ve documentos publicados', async () => {
    const result = await payload.find({
      collection: 'documents',
      overrideAccess: false,
      user: null,
      draft: false,
      pagination: false,
      where: { slug: { in: [`publicado-${SUFFIX}`, `borrador-${SUFFIX}`] } },
    })

    const slugs = result.docs.map((doc) => doc.slug)
    expect(slugs).toContain(`publicado-${SUFFIX}`)
    expect(slugs).not.toContain(`borrador-${SUFFIX}`)
  })

  it('el personal administrativo sí ve el borrador', async () => {
    const editor = await payload.findByID({
      collection: 'admin-users',
      id: editorId,
      overrideAccess: true,
    })

    const result = await payload.find({
      collection: 'documents',
      overrideAccess: false,
      user: { ...editor, collection: 'admin-users' },
      draft: true,
      pagination: false,
      where: { slug: { equals: `borrador-${SUFFIX}` } },
    })

    expect(result.docs).toHaveLength(1)
  })
})

describe('separación de roles', () => {
  it('un editor no puede crear usuarios administrativos', async () => {
    const editor = await payload.findByID({
      collection: 'admin-users',
      id: editorId,
      overrideAccess: true,
    })

    await expect(
      payload.create({
        collection: 'admin-users',
        overrideAccess: false,
        user: { ...editor, collection: 'admin-users' },
        data: {
          email: `intruso.${SUFFIX}@pruebas.local`,
          password,
          name: 'Intruso',
          role: 'super-admin',
        },
      }),
    ).rejects.toThrow()
  })

  it('un editor sí puede crear documentos', async () => {
    const editor = await payload.findByID({
      collection: 'admin-users',
      id: editorId,
      overrideAccess: true,
    })

    const created = await payload.create({
      collection: 'documents',
      overrideAccess: false,
      user: { ...editor, collection: 'admin-users' },
      draft: true,
      data: {
        title: `Creado por editor ${SUFFIX}`,
        slug: `creado-editor-${SUFFIX}`,
        category: 'compliance',
        intent: 'download',
        file: mediaId,
        publishedAt: new Date().toISOString(),
        _status: 'draft',
      },
    })

    expect(created.id).toBeDefined()

    await payload.delete({ collection: 'documents', id: created.id, overrideAccess: true })
  })

  it('una cuenta desactivada pierde el acceso aunque conserve su rol', async () => {
    const suspendedEmail = `suspendido.${SUFFIX}@pruebas.local`
    const suspended = await payload.create({
      collection: 'admin-users',
      overrideAccess: true,
      data: { email: suspendedEmail, password, name: 'Suspendido', role: 'editor', isActive: false },
    })

    await expect(
      payload.create({
        collection: 'documents',
        overrideAccess: false,
        user: { ...suspended, collection: 'admin-users' },
        data: {
          title: 'No debería crearse',
          slug: `no-deberia-${SUFFIX}`,
          category: 'compliance',
          intent: 'download',
          file: mediaId,
          publishedAt: new Date().toISOString(),
        },
      }),
    ).rejects.toThrow()

    await payload.delete({ collection: 'admin-users', id: suspended.id, overrideAccess: true })
  })
})

describe('escritura pública', () => {
  it('nadie puede crear suscriptores por la API: solo el endpoint controlado', async () => {
    await expect(
      payload.create({
        collection: 'subscribers',
        overrideAccess: false,
        user: null,
        data: { email: `anonimo.${SUFFIX}@pruebas.local`, status: 'pending', consentAccepted: true },
      }),
    ).rejects.toThrow()
  })

  it('una visitante anónima no puede crear documentos', async () => {
    await expect(
      payload.create({
        collection: 'documents',
        overrideAccess: false,
        user: null,
        data: {
          title: 'No autorizado',
          slug: `no-autorizado-${SUFFIX}`,
          category: 'institutional',
          intent: 'download',
          file: mediaId,
          publishedAt: new Date().toISOString(),
        },
      }),
    ).rejects.toThrow()
  })

  it('la lista de suscriptores no es legible sin sesión', async () => {
    await expect(
      payload.find({ collection: 'subscribers', overrideAccess: false, user: null }),
    ).rejects.toThrow()
  })
})
