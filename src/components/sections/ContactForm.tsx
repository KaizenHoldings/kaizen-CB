'use client'

import React, { useId, useRef, useState } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon } from '@/components/ui/Icon'
import type { Dictionary } from '@/dictionaries/getDictionary'
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

/* Se guarda el `status` que devuelve la ruta, no su texto. El servidor decide
   el resultado; cómo se dice es cosa del idioma que se está viendo, y el correo
   interno para la institución sigue siendo en castellano pase lo que pase. */
type EstadoServidor = keyof Dictionary['contact']['form']['status']

type Estado =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'done'; ok: boolean; status: EstadoServidor }

/**
 * Formulario de contacto.
 *
 * Entrega el mensaje en `POST /api/contact`, que lo remite al buzón de la
 * institución por Microsoft Graph. El navegador no conoce ninguna credencial:
 * de la respuesta solo lee `status` y un texto en castellano.
 *
 * La validación de forma sigue siendo la del navegador (`required`,
 * `type="email"`), que ya la anuncia a las tecnologías asistivas; el servidor
 * la repite porque nunca se confía en el cliente.
 */
export const ContactForm: React.FC<{ dict: Dictionary['contact']['form'] }> = ({ dict }) => {
  const baseId = useId()
  const nameId = `${baseId}-nombre`
  const emailId = `${baseId}-correo`
  const messageId = `${baseId}-mensaje`
  const statusId = `${baseId}-estado`

  /* Los campos pasan a estado controlado por una razón concreta: limpiarlos al
     terminar bien. Un `reset()` sobre el formulario borraría también el acuse. */
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [estado, setEstado] = useState<Estado>({ kind: 'idle' })
  const honeypotRef = useRef<HTMLInputElement>(null)

  const enviando = estado.kind === 'sending'

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (enviando) return

    setEstado({ kind: 'sending' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          correo,
          mensaje,
          company: honeypotRef.current?.value ?? '',
        }),
      })

      const payload = (await response.json()) as { status: string; message: string }
      const ok = payload.status === 'sent'
      const status: EstadoServidor =
        payload.status in dict.status ? (payload.status as EstadoServidor) : 'error'

      setEstado({ kind: 'done', ok, status })

      // Solo se vacían los campos cuando el mensaje salió de verdad: si falló,
      // quien escribe conserva su texto para reintentar.
      if (ok) {
        setNombre('')
        setCorreo('')
        setMensaje('')

        /* Importación dinámica, no en la cabecera del módulo: SweetAlert2 pesa
           lo suyo y solo hace falta en este instante. Así no viaja en el bundle
           de quien abre la página de contacto y no llega a enviar nada. */
        const { default: Swal } = await import('sweetalert2')
        await Swal.fire({
          icon: 'success',
          title: dict.alertTitle,
          confirmButtonText: dict.alertConfirm,
          // Navy de marca, el mismo que `--color-navy`.
          confirmButtonColor: '#0E3048',
        })
      }
    } catch {
      setEstado({ kind: 'done', ok: false, status: 'error' })
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-[var(--shadow-soft-sm)] sm:p-8">
      <h2
        className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,1.15rem+1vw,1.875rem)] font-light text-navy"
        suppressHydrationWarning
      >
        {dict.title}
      </h2>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5" noValidate={false}>
        <div>
          <label htmlFor={nameId} className={LABEL}>
            {dict.nameLabel}
          </label>
          <input
            id={nameId}
            name="nombre"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            disabled={enviando}
            value={nombre}
            placeholder={dict.namePlaceholder}
            className={`${FIELD} min-h-12`}
            onChange={(event) => setNombre(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor={emailId} className={LABEL}>
            {dict.emailLabel}
          </label>
          <input
            id={emailId}
            name="correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            disabled={enviando}
            value={correo}
            placeholder={dict.emailPlaceholder}
            className={`${FIELD} min-h-12`}
            onChange={(event) => setCorreo(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor={messageId} className={LABEL}>
            {dict.messageLabel}
          </label>
          <textarea
            id={messageId}
            name="mensaje"
            rows={5}
            required
            maxLength={4000}
            disabled={enviando}
            value={mensaje}
            placeholder={dict.messagePlaceholder}
            className={`${FIELD} resize-y py-3 leading-relaxed`}
            onChange={(event) => setMensaje(event.target.value)}
          />
        </div>

        {/* Trampa para bots: fuera del flujo visual y del orden de tabulación. */}
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="kcb-visually-hidden"
        />

        <div className="pt-1">
          {/* `loading` ya deshabilita —`ActionButton` resuelve
              `disabled={disabled || loading}`— y añade el indicador y
              `aria-busy`. `disabled` se declara igualmente para que la intención
              se lea en el propio marcado y no dependa de conocer el componente.
              El aspecto del estado lo pone `.kcb-action:disabled` en
              `buttons.css`, según BUTTON_SYSTEM.md. */}
          <ActionButton
            type="submit"
            surface="light"
            emphasis="primary"
            loading={enviando}
            disabled={enviando}
          >
            {enviando ? dict.sending : dict.submit}
          </ActionButton>
        </div>

        {/* `role="status"` anuncia el acuse sin robar el foco. */}
        <p id={statusId} role="status" aria-live="polite" className="min-h-0">
          {estado.kind === 'done' ? (
            <span className="flex items-start gap-2 text-[0.9375rem] leading-relaxed text-muted">
              <Icon
                name={estado.ok ? 'check' : 'alert'}
                className={`mt-0.5 size-4 shrink-0 ${estado.ok ? 'text-emerald' : 'text-negative'}`}
              />
              <span>
                {dict.status[estado.status]}
                {/* Si el envío falló, la vía directa sigue disponible: no se deja
                    a quien escribe sin salida. */}
                {estado.ok ? null : (
                  <>
                    {' '}
                    {dict.fallback}{' '}
                    <a href={SITE.contact.emailHref} className="kcb-link">
                      {SITE.contact.email}
                    </a>
                    .
                  </>
                )}
              </span>
            </span>
          ) : null}
        </p>
      </form>
    </div>
  )
}
