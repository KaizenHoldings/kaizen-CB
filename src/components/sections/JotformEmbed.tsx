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
 * del formulario y lo que gestiona su comunicación por `postMessage`. Se invoca
 * cuando el script está listo, no al montar, porque el orden de carga no está
 * garantizado.
 *
 * La estrategia es `afterInteractive` y no `lazyOnload`: en estas páginas el
 * formulario *es* el contenido, y con la carga diferida al reposo llegaba tarde
 * —medido, el marco se quedaba en sus 539 px iniciales—. Con `scrolling="no"`
 * eso deja el resto del formulario fuera de alcance, así que el ajuste de alto
 * no es un adorno: es lo que lo hace utilizable.
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
        strategy="afterInteractive"
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
