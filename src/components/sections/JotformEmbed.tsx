'use client'

import Script from 'next/script'
import React, { useEffect, useState } from 'react'

/** Jotform expone su manejador en `window` cuando su script termina de cargar. */
declare global {
  interface Window {
    jotformEmbedHandler?: (selector: string, origin: string) => void
  }
}

const JOTFORM_ORIGIN = 'https://form.jotform.com'

type JotformEmbedProps = {
  /** Identificador del formulario en Jotform. */
  formId: string
  /** Título accesible del marco. */
  title: string
}

/**
 * Formulario de Jotform incrustado a página completa.
 *
 * El manejador de Jotform es lo que ajusta el alto del marco al contenido real
 * del formulario y lo que gestiona su comunicación por `postMessage`; sin él el
 * marco se quedaría en su altura inicial y el formulario aparecería recortado.
 * Se invoca cuando el script está listo, no al montar, porque el orden de carga
 * no está garantizado.
 */
export const JotformEmbed: React.FC<JotformEmbedProps> = ({ formId, title }) => {
  const [scriptReady, setScriptReady] = useState(false)
  const iframeId = `JotFormIFrame-${formId}`

  useEffect(() => {
    if (!scriptReady) return
    if (typeof window.jotformEmbedHandler !== 'function') return
    window.jotformEmbedHandler(`iframe[id='${iframeId}']`, JOTFORM_ORIGIN)
  }, [scriptReady, iframeId])

  return (
    <>
      <Script
        src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />

      <iframe
        id={iframeId}
        title={title}
        src={`${JOTFORM_ORIGIN}/${formId}`}
        allow="geolocation; microphone; camera; fullscreen; payment"
        scrolling="no"
        className="block w-full"
        style={{ minWidth: '100%', maxWidth: '100%', height: '539px', border: 'none' }}
      />
    </>
  )
}
