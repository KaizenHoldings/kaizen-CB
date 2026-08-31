/**
 * Modelo de dominio del formulario de contacto.
 *
 * Comparte la validación de correo con las suscripciones: es la misma regla y
 * duplicarla garantizaría que las dos acaben divergiendo.
 */

import { isValidEmail } from '@/modules/subscriptions/domain/subscription'

export type ContactOutcome =
  | { status: 'sent' }
  | { status: 'invalid' }
  | { status: 'rate-limited' }
  | { status: 'error' }

export type ContactRequest = {
  name: string
  email: string
  message: string
}

/** Topes de longitud. No son validación de contenido: acotan el abuso. */
export const LIMITS = { name: 120, email: 254, message: 4000 } as const

export const validateContact = (request: ContactRequest): boolean => {
  const name = request.name.trim()
  const message = request.message.trim()

  return (
    name.length > 0 &&
    name.length <= LIMITS.name &&
    isValidEmail(request.email) &&
    message.length > 0 &&
    message.length <= LIMITS.message
  )
}

/** Asunto fijo indicado por el cliente para esta fase de pruebas. */
export const CONTACT_SUBJECT = 'Correo de prueba - implementación de formulario'

export const CONTACT_MESSAGES: Record<ContactOutcome['status'], string> = {
  sent: 'Mensaje enviado exitosamente.',
  invalid: 'Revisa los datos del formulario: falta algo o no es válido.',
  'rate-limited': 'Recibimos varios mensajes desde aquí. Inténtalo de nuevo en unos minutos.',
  error: 'Hubo un error al enviar el mensaje.',
}

/**
 * Escapa el texto que entra en el HTML del correo.
 *
 * El nombre y el mensaje los escribe cualquiera desde un formulario público. Sin
 * escapar, un `<script>` o una etiqueta suelta llegarían al buzón de la
 * institución dentro de un correo en HTML, y algunos clientes los interpretan.
 */
export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/** Conserva los saltos de línea del mensaje al pasarlo a HTML. */
const toParagraphs = (value: string): string =>
  escapeHtml(value)
    .split(/\r?\n/)
    .map((linea) => (linea.trim().length > 0 ? linea : '&nbsp;'))
    .join('<br />')

/**
 * Cuerpo del aviso que recibe la institución.
 *
 * Registro formal y sin un solo emoji ni icono, por indicación expresa: es un
 * correo institucional de una casa de bolsa. Abre pidiendo la confirmación de
 * que la integración funciona y sigue con el resumen de lo enviado.
 *
 * Estilos en línea y tabla de una sola columna: los clientes de correo no
 * aplican hojas externas y su soporte de CSS moderno es irregular.
 */
export const buildContactEmailHtml = (request: ContactRequest, receivedAt: Date): string => {
  const fecha = new Intl.DateTimeFormat('es-VE', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Caracas',
  }).format(receivedAt)

  const fila = (etiqueta: string, valor: string) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e6ebf0;vertical-align:top;width:180px;color:#5a6b7a;font-size:14px;">
            ${escapeHtml(etiqueta)}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e6ebf0;vertical-align:top;color:#0e3048;font-size:14px;">
            ${valor}
          </td>
        </tr>`

  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f4f7f9;font-family:Segoe UI,Arial,Helvetica,sans-serif;color:#0e3048;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6ebf0;border-radius:8px;">
      <tr>
        <td style="padding:32px 32px 8px 32px;">
          <p style="margin:0 0 4px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6b7a;">
            Kaizen Casa de Bolsa
          </p>
          <h1 style="margin:0;font-size:20px;font-weight:600;color:#0e3048;">
            Correo enviado desde el formulario de contacto del sitio web institucional
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px 0 32px;font-size:15px;line-height:1.6;">
          <p style="margin:0 0 16px 0;">
            Este mensaje ha sido enviado desde el sitio web de Kaizen Casa de Bolsa.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 32px;">
          <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#5a6b7a;">
            Datos remitidos desde el formulario
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
            ${fila('Nombre completo', escapeHtml(request.name.trim()))}
            ${fila('Correo electrónico', `<a href="mailto:${escapeHtml(request.email.trim())}" style="color:#1f558b;">${escapeHtml(request.email.trim())}</a>`)}
            ${fila('Fecha de recepción', escapeHtml(fecha))}
            ${fila('Mensaje', toParagraphs(request.message.trim()))}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px 32px 32px;font-size:15px;line-height:1.6;">
          <p style="margin:0 0 16px 0;">
            Quedamos atentos a sus comentarios.
          </p>
          <p style="margin:0;color:#5a6b7a;font-size:13px;">
            Mensaje generado automáticamente por el sitio web de Kaizen Casa de Bolsa.
            Para responder a la persona remitente, utilice la dirección indicada en el
            campo «Correo electrónico».
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
