'use client'

import React, { useId, useState } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon } from '@/components/ui/Icon'
import { SITE } from '@/lib/site'

/* Estilo común de los campos. Superficie blanca sobre el fondo Tint de la
   sección, filete discreto y foco visible con el anillo Esmeralda del sistema,
   que es el único color reservado para señalar foco. */
const FIELD =
  'mt-2 w-full rounded-xl border border-line bg-white px-4 text-[1rem] text-ink placeholder:text-muted/70 ' +
  'transition-[border-color,box-shadow] duration-200 ease-[var(--ease-kcb)] ' +
  'hover:border-navy/35 ' +
  'focus-visible:border-navy focus-visible:outline-3 focus-visible:outline-offset-[3px] focus-visible:outline-emerald'

const LABEL = 'font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold text-navy'

/**
 * Formulario de contacto.
 *
 * **No envía a ningún sitio.** El backend todavía no está definido, así que el
 * `submit` se queda en el cliente: no se inventa un endpoint ni se promete una
 * entrega que no ocurre. El acuse dice exactamente eso, para no dar por enviado
 * un mensaje que nadie ha recibido.
 *
 * La validación es la del navegador (`required`, `type="email"`): sin capa
 * propia que duplique lo que la plataforma ya hace bien y ya anuncia a las
 * tecnologías asistivas.
 */
export const ContactForm: React.FC = () => {
  const baseId = useId()
  const nameId = `${baseId}-nombre`
  const emailId = `${baseId}-correo`
  const messageId = `${baseId}-mensaje`
  const statusId = `${baseId}-estado`

  const [sent, setSent] = useState(false)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-soft-sm)] sm:p-8">
      <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,1.15rem+1vw,1.875rem)] font-light text-navy">
        Escríbenos
      </h2>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5" noValidate={false}>
        <div>
          <label htmlFor={nameId} className={LABEL}>
            Nombre completo
          </label>
          <input
            id={nameId}
            name="nombre"
            type="text"
            autoComplete="name"
            required
            placeholder="Nombre y apellido"
            className={`${FIELD} min-h-12`}
            onChange={() => setSent(false)}
          />
        </div>

        <div>
          <label htmlFor={emailId} className={LABEL}>
            Correo electrónico
          </label>
          <input
            id={emailId}
            name="correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="nombre@empresa.com"
            className={`${FIELD} min-h-12`}
            onChange={() => setSent(false)}
          />
        </div>

        <div>
          <label htmlFor={messageId} className={LABEL}>
            Mensaje
          </label>
          <textarea
            id={messageId}
            name="mensaje"
            rows={5}
            required
            placeholder="Cuéntanos en qué podemos ayudarte."
            className={`${FIELD} resize-y py-3 leading-relaxed`}
            onChange={() => setSent(false)}
          />
        </div>

        <div className="pt-1">
          <ActionButton type="submit" surface="light" emphasis="primary">
            Enviar mensaje
          </ActionButton>
        </div>

        {/* `role="status"` anuncia el acuse sin robar el foco. */}
        <p id={statusId} role="status" aria-live="polite" className="min-h-0">
          {sent ? (
            <span className="flex items-start gap-2 text-[0.9375rem] leading-relaxed text-muted">
              <Icon name="info" className="mt-0.5 size-4 shrink-0 text-navy" />
              <span>
                Gracias por escribirnos. El envío automático todavía no está habilitado, así que
                escríbenos directamente a{' '}
                <a href={SITE.contact.emailHref} className="kcb-link">
                  {SITE.contact.email}
                </a>{' '}
                mientras lo activamos.
              </span>
            </span>
          ) : null}
        </p>
      </form>
    </div>
  )
}
