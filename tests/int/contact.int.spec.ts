import http from 'node:http'
import type { AddressInfo } from 'node:net'

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { createGraphMailer, type Mailer } from '@/integrations/email/graph-mailer'
import { unconfiguredMailer } from '@/integrations/email/unconfigured-mailer'
import {
  buildContactEmailHtml,
  CONTACT_SUBJECT,
  escapeHtml,
  validateContact,
} from '@/modules/contact/domain/contact'
import { ContactService } from '@/modules/contact/services/contact.service'

/** Doble del cliente de correo: ninguna prueba llega a Microsoft. */
const buzonFalso = (resultado: 'sent' | 'error' = 'sent') => {
  const enviados: Array<{ to: string; subject: string; html: string }> = []
  const mailer: Mailer = {
    name: 'test',
    isConfigured: true,
    async send(mensaje) {
      enviados.push(mensaje)
      return { status: resultado }
    },
  }
  return { mailer, enviados }
}

let contador = 0
const contexto = () => ({ clientKey: `test-contacto-${Date.now()}-${contador++}` })

const valido = {
  name: 'María Pérez',
  email: 'maria@empresa.com',
  message: 'Quisiera información sobre renta fija.',
}

describe('validación del formulario de contacto', () => {
  it('acepta un envío completo', () => {
    expect(validateContact(valido)).toBe(true)
  })

  it('rechaza campos vacíos y correos mal formados', () => {
    expect(validateContact({ ...valido, name: '   ' })).toBe(false)
    expect(validateContact({ ...valido, message: '' })).toBe(false)
    expect(validateContact({ ...valido, email: 'no-es-correo' })).toBe(false)
  })

  it('rechaza un mensaje desmesurado', () => {
    expect(validateContact({ ...valido, message: 'a'.repeat(4001) })).toBe(false)
  })
})

describe('cuerpo del correo', () => {
  const html = buildContactEmailHtml(valido, new Date('2026-04-12T15:30:00Z'))

  it('usa el asunto exacto acordado', () => {
    expect(CONTACT_SUBJECT).toBe('Correo de prueba - implementación de formulario')
  })

  it('pide confirmación de que la integración funciona', () => {
    expect(html).toContain('confirmaran la recepción')
    expect(html).toContain('la integración del formulario opera correctamente')
  })

  it('incluye los datos remitidos', () => {
    expect(html).toContain('María Pérez')
    expect(html).toContain('maria@empresa.com')
    expect(html).toContain('Quisiera información sobre renta fija.')
  })

  it('no lleva ningún emoji ni icono', () => {
    // Rangos de pictogramas, emoticonos, símbolos varios y dingbats.
    const pictogramas =
      /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u
    expect(pictogramas.test(html)).toBe(false)
  })

  it('escapa el HTML que llegue en los campos', () => {
    const conAtaque = buildContactEmailHtml(
      { ...valido, name: '<script>alert(1)</script>' },
      new Date(),
    )
    expect(conAtaque).not.toContain('<script>alert(1)</script>')
    expect(conAtaque).toContain('&lt;script&gt;')
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })
})

describe('ContactService', () => {
  it('entrega el mensaje al destinatario configurado', async () => {
    const { mailer, enviados } = buzonFalso()
    const service = new ContactService(mailer, 'contacto@kaizen.example')

    const r = await service.send(valido, contexto())

    expect(r.status).toBe('sent')
    expect(enviados).toHaveLength(1)
    expect(enviados[0]!.to).toBe('contacto@kaizen.example')
    expect(enviados[0]!.subject).toBe(CONTACT_SUBJECT)
  })

  it('no envía nada si los datos no son válidos', async () => {
    const { mailer, enviados } = buzonFalso()
    const service = new ContactService(mailer, 'contacto@kaizen.example')

    const r = await service.send({ ...valido, email: 'roto' }, contexto())

    expect(r.status).toBe('invalid')
    expect(enviados).toHaveLength(0)
  })

  it('sin destinatario no finge una entrega', async () => {
    const { mailer, enviados } = buzonFalso()
    /* Cadena vacía y no `undefined`: pasar `undefined` a un parámetro con valor
       por defecto **dispara ese valor por defecto**, así que el servicio acababa
       cogiendo el `CONTACT_FORM_RECIPIENT` real y la prueba pasaba solo mientras
       la variable no existía. Ambos valores son falsos para el guardia
       `if (!this.recipient)`, que es lo que se quiere ejercitar. */
    const service = new ContactService(mailer, '')

    const r = await service.send(valido, contexto())

    expect(r.status).toBe('error')
    expect(enviados).toHaveLength(0)
  })

  it('un fallo del buzón llega como error, nunca como enviado', async () => {
    const { mailer } = buzonFalso('error')
    const service = new ContactService(mailer, 'contacto@kaizen.example')

    expect((await service.send(valido, contexto())).status).toBe('error')
  })

  it('limita la tasa por origen', async () => {
    const { mailer } = buzonFalso()
    const service = new ContactService(mailer, 'contacto@kaizen.example')
    const mismoCliente = contexto()

    const estados: string[] = []
    for (let i = 0; i < 5; i += 1) {
      estados.push((await service.send(valido, mismoCliente)).status)
    }

    expect(estados.filter((e) => e === 'sent')).toHaveLength(3)
    expect(estados.filter((e) => e === 'rate-limited')).toHaveLength(2)
  })

  it('sin credenciales de Graph no se da por enviado', async () => {
    expect(unconfiguredMailer.isConfigured).toBe(false)
    expect((await unconfiguredMailer.send({ to: 'a@b.com', subject: 's', html: '<p></p>' })).status).toBe(
      'error',
    )
  })
})

/**
 * El cliente de Graph se ejercita contra un servidor local que imita a Entra ID
 * y a la API. No se llama a Microsoft: una prueba no debe enviar correo real.
 */
describe('cliente de Microsoft Graph', () => {
  let servidor: http.Server
  let puerto = 0
  let peticiones: Array<{ url: string; auth?: string; body: unknown }> = []
  let tokenOk = true
  let envioOk = true

  beforeAll(async () => {
    servidor = http.createServer((req, res) => {
      let cuerpo = ''
      req.on('data', (t) => (cuerpo += t))
      req.on('end', () => {
        peticiones.push({
          url: req.url ?? '',
          auth: req.headers.authorization,
          body: cuerpo.startsWith('{') ? JSON.parse(cuerpo) : cuerpo,
        })

        if ((req.url ?? '').includes('/oauth2/')) {
          if (!tokenOk) {
            res.writeHead(401, { 'content-type': 'application/json' })
            return res.end(
              JSON.stringify({ error: 'invalid_client', error_description: 'secreto caducado' }),
            )
          }
          res.writeHead(200, { 'content-type': 'application/json' })
          return res.end(JSON.stringify({ access_token: 'token-de-prueba', expires_in: 3600 }))
        }

        if (!envioOk) {
          res.writeHead(403, { 'content-type': 'application/json' })
          return res.end(
            JSON.stringify({ error: { code: 'ErrorAccessDenied', message: 'sin permiso' } }),
          )
        }
        res.writeHead(202)
        res.end()
      })
    })

    await new Promise<void>((r) => servidor.listen(0, '127.0.0.1', r))
    puerto = (servidor.address() as AddressInfo).port
  })

  afterAll(async () => {
    await new Promise<void>((r) => servidor.close(() => r()))
  })

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

  const cliente = () =>
    createGraphMailer({
      tenantId: 'inquilino',
      clientId: 'aplicacion',
      clientSecret: 'secreto',
      senderEmail: 'no-reply@kaizen.example',
    })

  it('pide el token y envía con él', async () => {
    peticiones = []
    tokenOk = true
    envioOk = true

    const r = await conServidorLocal(() =>
      cliente().send({ to: 'destino@kaizen.example', subject: 'Asunto', html: '<p>Hola</p>' }),
    )

    expect(r.status).toBe('sent')
    expect(peticiones[0]!.url).toContain('/oauth2/v2.0/token')
    expect(peticiones[1]!.url).toBe('/v1.0/users/no-reply%40kaizen.example/sendMail')
    expect(peticiones[1]!.auth).toBe('Bearer token-de-prueba')
    expect(peticiones[1]!.body).toMatchObject({
      message: {
        subject: 'Asunto',
        body: { contentType: 'HTML', content: '<p>Hola</p>' },
        toRecipients: [{ emailAddress: { address: 'destino@kaizen.example' } }],
      },
    })
  })

  it('reutiliza el token entre envíos', async () => {
    peticiones = []
    tokenOk = true
    envioOk = true

    const c = cliente()
    await conServidorLocal(async () => {
      await c.send({ to: 'a@b.com', subject: 's', html: '<p></p>' })
      await c.send({ to: 'a@b.com', subject: 's', html: '<p></p>' })
    })

    const tokens = peticiones.filter((p) => p.url.includes('/oauth2/'))
    expect(tokens).toHaveLength(1)
  })

  it('un token rechazado no se convierte en un envío', async () => {
    peticiones = []
    tokenOk = false

    const r = await conServidorLocal(() =>
      cliente().send({ to: 'a@b.com', subject: 's', html: '<p></p>' }),
    )

    expect(r.status).toBe('error')
    expect(peticiones.filter((p) => p.url.includes('sendMail'))).toHaveLength(0)
  })

  it('un rechazo de la API es error, no entrega', async () => {
    peticiones = []
    tokenOk = true
    envioOk = false

    const r = await conServidorLocal(() =>
      cliente().send({ to: 'a@b.com', subject: 's', html: '<p></p>' }),
    )

    expect(r.status).toBe('error')
  })
})
