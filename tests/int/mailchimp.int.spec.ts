import http from 'node:http'
import type { AddressInfo } from 'node:net'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createMailchimpProvider } from '@/integrations/newsletter/mailchimp-provider'
import { unconfiguredAudienceProvider } from '@/integrations/newsletter/unconfigured-audience-provider'

/**
 * El proveedor se ejercita contra un servidor local que imita a Mailchimp.
 *
 * No se llama a la API real: dar de alta una dirección en la audiencia del
 * cliente es una escritura sobre datos de producción, y una prueba no debe
 * dejar rastro en un servicio de terceros.
 */

type Modo =
  | 'ok'
  | 'existe'
  | 'existe-traducido'
  | 'invalido'
  | 'clave-mala'
  | 'cuerpo-no-json'

let modo: Modo = 'ok'
let recibido: { url: string; auth?: string; contentType?: string; body: unknown } | null = null
let servidor: http.Server
let puerto = 0

const RESPUESTAS: Record<Modo, { estado: number; cuerpo: string; tipo: string }> = {
  ok: {
    estado: 200,
    tipo: 'application/json',
    cuerpo: JSON.stringify({ id: 'abc', status: 'subscribed' }),
  },
  existe: {
    estado: 400,
    tipo: 'application/json',
    cuerpo: JSON.stringify({
      title: 'Member Exists',
      status: 400,
      detail: 'nombre@empresa.com is already a list member. Use PUT to insert or update.',
    }),
  },
  // El título llega traducido según la cuenta; el detalle es lo que sostiene la
  // detección en ese caso.
  'existe-traducido': {
    estado: 400,
    tipo: 'application/json',
    cuerpo: JSON.stringify({
      title: 'Miembro existente',
      status: 400,
      detail: 'nombre@empresa.com is already a list member.',
    }),
  },
  invalido: {
    estado: 400,
    tipo: 'application/json',
    cuerpo: JSON.stringify({ title: 'Invalid Resource', status: 400, detail: 'Invalid email' }),
  },
  'clave-mala': {
    estado: 401,
    tipo: 'application/json',
    cuerpo: JSON.stringify({ title: 'API Key Invalid', status: 401 }),
  },
  'cuerpo-no-json': { estado: 500, tipo: 'text/html', cuerpo: '<html>error</html>' },
}

beforeAll(async () => {
  servidor = http.createServer((req, res) => {
    let cuerpo = ''
    req.on('data', (trozo) => (cuerpo += trozo))
    req.on('end', () => {
      recibido = {
        url: req.url ?? '',
        auth: req.headers.authorization,
        contentType: req.headers['content-type'],
        body: cuerpo ? JSON.parse(cuerpo) : null,
      }
      const r = RESPUESTAS[modo]
      res.writeHead(r.estado, { 'content-type': r.tipo })
      res.end(r.cuerpo)
    })
  })

  await new Promise<void>((resolve) => servidor.listen(0, '127.0.0.1', resolve))
  puerto = (servidor.address() as AddressInfo).port
})

afterAll(async () => {
  await new Promise<void>((resolve) => servidor.close(() => resolve()))
})

/* El proveedor construye la URL de Mailchimp a partir del prefijo. Para la
   prueba se reescribe el destino al servidor local conservando la ruta, que es
   justamente lo que se quiere comprobar. */
const conServidorLocal = async <T>(accion: () => Promise<T>): Promise<T> => {
  const original = globalThis.fetch
  globalThis.fetch = ((url: string | URL | Request, init?: RequestInit) => {
    const destino = new URL(String(url))
    return original(`http://127.0.0.1:${puerto}${destino.pathname}`, init)
  }) as typeof fetch

  try {
    return await accion()
  } finally {
    globalThis.fetch = original
  }
}

const proveedor = () =>
  createMailchimpProvider({
    apiKey: 'clave-de-prueba',
    serverPrefix: 'us21',
    audienceId: 'lista123',
  })

describe('proveedor de audiencia de Mailchimp', () => {
  it('construye la petición que espera la API', async () => {
    modo = 'ok'
    await conServidorLocal(() => proveedor().subscribe({ email: 'nombre@empresa.com' }))

    expect(recibido?.url).toBe('/3.0/lists/lista123/members')
    /* Autenticación básica, la documentada por Mailchimp: usuario literal
       `apikey` y la clave como contraseña. */
    expect(recibido?.auth).toBe(
      `Basic ${Buffer.from('apikey:clave-de-prueba').toString('base64')}`,
    )
    expect(recibido?.contentType).toBe('application/json')
    expect(recibido?.body).toEqual({
      email_address: 'nombre@empresa.com',
      status: 'subscribed',
    })
  })

  it('da por suscrita una respuesta correcta', async () => {
    modo = 'ok'
    const r = await conServidorLocal(() => proveedor().subscribe({ email: 'a@b.com' }))
    expect(r.status).toBe('subscribed')
  })

  it('reconoce «Member Exists» por el título', async () => {
    modo = 'existe'
    const r = await conServidorLocal(() => proveedor().subscribe({ email: 'a@b.com' }))
    expect(r.status).toBe('already-subscribed')
  })

  it('reconoce un correo ya suscrito aunque el título llegue traducido', async () => {
    modo = 'existe-traducido'
    const r = await conServidorLocal(() => proveedor().subscribe({ email: 'a@b.com' }))
    expect(r.status).toBe('already-subscribed')
  })

  it('no confunde otro 400 con un correo ya suscrito', async () => {
    modo = 'invalido'
    const r = await conServidorLocal(() => proveedor().subscribe({ email: 'a@b.com' }))
    expect(r.status).toBe('error')
  })

  it('trata una clave inválida como error, no como alta', async () => {
    modo = 'clave-mala'
    const r = await conServidorLocal(() => proveedor().subscribe({ email: 'a@b.com' }))
    expect(r.status).toBe('error')
  })

  it('sobrevive a un cuerpo que no es JSON', async () => {
    modo = 'cuerpo-no-json'
    const r = await conServidorLocal(() => proveedor().subscribe({ email: 'a@b.com' }))
    expect(r.status).toBe('error')
  })

  it('sin credenciales no finge un alta', async () => {
    const r = await unconfiguredAudienceProvider.subscribe({ email: 'a@b.com' })
    expect(r.status).toBe('error')
    expect(unconfiguredAudienceProvider.isConfigured).toBe(false)
  })
})
