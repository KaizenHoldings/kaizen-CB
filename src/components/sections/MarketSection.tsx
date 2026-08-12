import React from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatDecimal, formatVariation } from '@/lib/format'
import {
  DIRECTION_LABELS,
  DIRECTION_SYMBOLS,
  UNAVAILABLE_MESSAGES,
  type MarketDataSnapshot,
} from '@/modules/market-data/domain/market-quote'

/**
 * Tabla de cotizaciones.
 *
 * Consume el mismo modelo normalizado que la cinta superior, pero pide su
 * propio snapshot: no asume que ambas provendrán siempre de la misma fuente.
 * Sin datos verificables muestra un estado explícito de no disponibilidad; no
 * hay cifras de ejemplo.
 */
export const MarketSection: React.FC<{ snapshot: MarketDataSnapshot }> = ({ snapshot }) => (
  <section id="mercado" className="kcb-section bg-white" aria-labelledby="mercado-titulo">
    <div className="kcb-container">
      <SectionHeading
        id="mercado-titulo"
        title="Información de mercado"
        description="Precios de referencia del mercado de valores venezolano. Toda cifra se publica con su fuente, su unidad y su hora de actualización."
      />

      <div className="mt-10">
        {snapshot.status === 'unavailable' ? (
          <EmptyState
            icon="info"
            title="Todavía no publicamos cotizaciones"
            description={
              <>
                <p>{UNAVAILABLE_MESSAGES[snapshot.reason]}</p>
                <p className="mt-2">
                  Publicaremos los precios en cuanto la conexión con la fuente oficial esté
                  confirmada. Mientras tanto, no mostramos valores de ejemplo: una cifra sin fuente
                  verificable no es información de mercado.
                </p>
              </>
            }
          />
        ) : (
          <figure className="m-0">
            <div className="overflow-x-auto rounded-[16px] border border-line">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <caption className="kcb-visually-hidden">
                  Precios de referencia por instrumento, con su variación respecto al cierre
                  anterior.
                </caption>
                <thead>
                  <tr className="bg-pearl">
                    <th
                      scope="col"
                      className="px-5 py-3.5 font-[family-name:var(--font-display)] text-[0.8125rem] font-semibold tracking-[0.04em] text-navy uppercase"
                    >
                      Instrumento
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 font-[family-name:var(--font-display)] text-[0.8125rem] font-semibold tracking-[0.04em] text-navy uppercase"
                    >
                      Símbolo
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-right font-[family-name:var(--font-display)] text-[0.8125rem] font-semibold tracking-[0.04em] text-navy uppercase"
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-right font-[family-name:var(--font-display)] text-[0.8125rem] font-semibold tracking-[0.04em] text-navy uppercase"
                    >
                      Variación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.quotes.map((quote) => (
                    <tr key={quote.id} className="border-t border-line">
                      <th scope="row" className="px-5 py-4 text-[0.9375rem] font-medium text-navy">
                        {quote.name}
                      </th>
                      <td className="px-5 py-4 text-[0.9375rem] text-muted">{quote.symbol}</td>
                      <td className="px-5 py-4 text-right text-[0.9375rem] text-ink" data-tabular>
                        {quote.unit} {formatDecimal(quote.value)}
                      </td>
                      <td
                        className="px-5 py-4 text-right text-[0.9375rem] font-semibold"
                        data-tabular
                      >
                        {quote.changePercent === null ? (
                          <span className="text-muted">Sin variación publicada</span>
                        ) : (
                          <span
                            className={
                              quote.direction === 'up'
                                ? 'text-positive'
                                : quote.direction === 'down'
                                  ? 'text-negative'
                                  : 'text-muted'
                            }
                          >
                            <span aria-hidden="true">{DIRECTION_SYMBOLS[quote.direction]}</span>{' '}
                            {formatVariation(quote.changePercent)}
                            <span className="kcb-visually-hidden">
                              {' '}
                              ({DIRECTION_LABELS[quote.direction]})
                            </span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <figcaption className="mt-4 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
              <span>
                Fuente: <span className="font-medium text-ink">{snapshot.source.name}</span>
              </span>
              <span>
                Actualizado el{' '}
                <time dateTime={snapshot.updatedAt}>
                  {new Date(snapshot.updatedAt).toLocaleString('es-VE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </span>
            </figcaption>

            {snapshot.isSimulated ? (
              <p className="mt-4 rounded-[12px] bg-tint px-4 py-3 text-sm text-navy">
                <strong className="font-semibold">Datos simulados.</strong> Estas cifras existen
                solo para revisión visual en desarrollo y no representan precios reales del mercado.
              </p>
            ) : null}
          </figure>
        )}
      </div>
    </div>
  </section>
)
