'use client'

import React, { useId, useRef, useState } from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon } from '@/components/ui/Icon'
import {
  isValidEmail,
  SUBSCRIPTION_MESSAGES,
  type SubscriptionOutcome,
} from '@/modules/subscriptions/domain/subscription'

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'done'; status: SubscriptionOutcome['status']; message: string }

/**
 * Formulario público de suscripción.
 *
 * Valida en cliente para dar respuesta inmediata, pero la decisión real la toma
 * el servidor: el endpoint vuelve a validar, normaliza, registra el
 * consentimiento y limita la tasa. Los mensajes son genéricos y nunca revelan
 * si un correo ya estaba registrado.
 */
export const NewsletterForm: React.FC = () => {
  const [state, setState] = useState<FormState>({ kind: 'idle' })
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const emailId = useId()
  const consentId = useId()
  const errorId = useId()
  const statusId = useId()

  const submitting = state.kind === 'submitting'
  const succeeded = state.kind === 'done' && state.status === 'accepted'

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setClientError(null)

    if (!isValidEmail(email)) {
      setClientError(SUBSCRIPTION_MESSAGES['invalid-email'])
      return
    }

    if (!consent) {
      setClientError(SUBSCRIPTION_MESSAGES['consent-required'])
      return
    }

    setState({ kind: 'submitting' })

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          consentAccepted: consent,
          company: honeypotRef.current?.value ?? '',
        }),
      })

      const payload = (await response.json()) as {
        status: SubscriptionOutcome['status']
        message: string
      }

      setState({ kind: 'done', status: payload.status, message: payload.message })

      if (payload.status === 'accepted') {
        setEmail('')
        setConsent(false)
      }
    } catch {
      setState({ kind: 'done', status: 'error', message: SUBSCRIPTION_MESSAGES.error })
    }
  }

  const describedBy = [clientError ? errorId : null, state.kind === 'done' ? statusId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor={emailId}
            className="block font-[family-name:var(--font-display)] text-sm font-semibold text-white"
          >
            Tu correo electrónico
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={clientError ? true : undefined}
            aria-describedby={describedBy || undefined}
            placeholder="nombre@empresa.com"
            className="mt-2 min-h-12 w-full rounded-xl border border-white/28 bg-white/12 px-4 text-[1rem] text-white placeholder:text-white/60 focus-visible:border-white focus-visible:bg-white/18"
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

        <div className="flex items-start gap-3">
          <input
            id={consentId}
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 size-[1.125rem] shrink-0 accent-emerald"
          />
          <label htmlFor={consentId} className="text-[0.9375rem] leading-relaxed text-tint">
            Autorizo a Kaizen Casa de Bolsa a enviarme comunicaciones por correo electrónico.
          </label>
        </div>

        {clientError ? (
          <p
            id={errorId}
            role="alert"
            className="flex items-start gap-2 text-[0.9375rem] font-medium text-negative-on-navy"
          >
            <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
            {clientError}
          </p>
        ) : null}

        <div>
          <ActionButton
            type="submit"
            surface="blue"
            emphasis="accent"
            loading={submitting}
            disabled={succeeded}
          >
            {submitting ? 'Enviando…' : succeeded ? 'Suscripción registrada' : 'Suscribirme'}
          </ActionButton>
        </div>

        {/* Región viva: el resultado se anuncia aunque el foco siga en el botón. */}
        <p id={statusId} role="status" aria-live="polite" className="min-h-6 text-[0.9375rem]">
          {state.kind === 'done' ? (
            <span
              className={[
                'flex items-start gap-2 font-medium',
                state.status === 'accepted' ? 'text-positive-on-navy' : 'text-negative-on-navy',
              ].join(' ')}
            >
              <Icon
                name={state.status === 'accepted' ? 'check' : 'alert'}
                className="mt-0.5 size-4 shrink-0"
              />
              {state.message}
            </span>
          ) : null}
        </p>
      </div>
    </form>
  )
}
