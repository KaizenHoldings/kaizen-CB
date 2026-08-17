'use client'

import React, { useId, useState } from 'react'

import { Icon } from '@/components/ui/Icon'
import { formatDecimal, formatVariation } from '@/lib/format'
import {
  DIRECTION_LABELS,
  DIRECTION_SYMBOLS,
  type MarketDataSnapshot,
  type MarketQuote,
} from '@/modules/market-data/domain/market-quote'

import styles from './MarketTicker.module.css'

/**
 * Cinta superior de información de mercado.
 *
 * Es arquitectónicamente independiente del navbar: recibe el snapshot ya
 * normalizado desde el servidor y no conoce el proveedor. Nunca presenta
 * valores de ejemplo como información oficial.
 *
 * Sin fuente disponible la cinta no se dibuja: una barra fija ocupando el
 * borde superior solo para anunciar que no hay datos cuesta más de lo que
 * informa. El estado de no disponibilidad se sigue comunicando donde importa,
 * en la sección de mercado, y el contrato del proveedor no cambia.
 */
export const MarketTicker: React.FC<{ snapshot: MarketDataSnapshot }> = ({ snapshot }) => {
  const [paused, setPaused] = useState(false)
  const trackId = useId()

  if (snapshot.status === 'unavailable') return null

  const { quotes, source, updatedAt, isSimulated } = snapshot
  const updated = new Date(updatedAt)
  const updatedLabel = updated.toLocaleString('es-VE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <aside className={styles.bar} aria-label="Información de mercado">
      <div className={styles.inner}>
        <p className={styles.status}>
          {isSimulated ? (
            <span className={styles.simulated}>Datos simulados</span>
          ) : (
            <span className={styles.live}>
              <span className={styles.liveDot} aria-hidden="true" />
              En vivo
            </span>
          )}
        </p>

        <div className={styles.viewport}>
          <div
            id={trackId}
            className={styles.track}
            data-paused={paused ? 'true' : undefined}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <TickerRow quotes={quotes} />
            {/* Copia para el bucle continuo: se oculta a lectores de pantalla. */}
            <TickerRow quotes={quotes} duplicate />
          </div>
        </div>

        <div className={styles.controls}>
          <p className={styles.source}>
            <span className={styles.sourceName}>{source.name}</span>
            <span aria-hidden="true"> · </span>
            <time dateTime={updated.toISOString()}>{updatedLabel}</time>
          </p>
          <button
            type="button"
            className={styles.pause}
            aria-pressed={paused}
            aria-controls={trackId}
            onClick={() => setPaused((value) => !value)}
          >
            <Icon name={paused ? 'play' : 'pause'} className={styles.pauseIcon} />
            <span className="kcb-visually-hidden">
              {paused ? 'Reanudar el desplazamiento de la cinta' : 'Pausar el desplazamiento de la cinta'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}

const TickerRow: React.FC<{ quotes: MarketQuote[]; duplicate?: boolean }> = ({
  quotes,
  duplicate = false,
}) => (
  <ul className={styles.row} aria-hidden={duplicate || undefined}>
    {quotes.map((quote) => (
      <li key={`${duplicate ? 'dup-' : ''}${quote.id}`} className={styles.item}>
        <span className={styles.symbol}>{quote.symbol}</span>
        <span className={styles.value} data-tabular>
          {quote.unit} {formatDecimal(quote.value)}
        </span>
        {quote.changePercent === null ? (
          <span className={styles.change} data-direction="flat">
            <span aria-hidden="true">{DIRECTION_SYMBOLS.flat}</span> sin variación publicada
          </span>
        ) : (
          <span className={styles.change} data-direction={quote.direction} data-tabular>
            <span aria-hidden="true">{DIRECTION_SYMBOLS[quote.direction]}</span>{' '}
            {formatVariation(quote.changePercent)}
            <span className="kcb-visually-hidden"> ({DIRECTION_LABELS[quote.direction]})</span>
          </span>
        )}
      </li>
    ))}
  </ul>
)
