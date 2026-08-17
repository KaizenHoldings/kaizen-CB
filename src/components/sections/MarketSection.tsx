import React from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { Reveal } from '@/components/ui/Reveal'
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
  <section id="mercado" className="kcb-section bg-[#184771]" aria-labelledby="mercado-titulo">
    <Reveal className="kcb-container">
      <SectionHeading
        id="mercado-titulo"
        surface="dark"
        title="Información de mercado"
        description="Precios de referencia del mercado de valores venezolano. Toda cifra se publica con su fuente, su unidad y su hora de actualización."
      />

      <div className="mt-12">
        {snapshot.status === 'unavailable' ? (
          <EmptyState
            icon="info"
            surface="dark"
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
            {/* Sobre el fondo oscuro la tabla deja de ser una tarjeta blanca y
                la delimita solo el filete. Sin relleno a propósito: un velo
                claro aclara el fondo y `--color-negative-on-navy`, calibrado
                contra el navy puro, se quedaba en 4.05:1. Directamente sobre
                #184771 sube a 4.77:1 y toda la tabla cumple AA. */}
            <div className="overflow-x-auto rounded-2xl border border-white/15">
              <table className="w-full min-w-[36rem] border-collapse text-left">
                <caption className="kcb-visually-hidden">
                  Precios de referencia por instrumento, con su variación respecto al cierre
                  anterior.
                </caption>
                <thead>
                  <tr className="bg-white/[0.08]">
                    <th
                      scope="col"
                      className="px-5 py-3.5 font-[family-name:var(--font-display)] text-[0.875rem] font-semibold tracking-[0.08em] text-white uppercase"
                    >
                      Instrumento
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 font-[family-name:var(--font-display)] text-[0.875rem] font-semibold tracking-[0.08em] text-white uppercase"
                    >
                      Símbolo
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-right font-[family-name:var(--font-display)] text-[0.875rem] font-semibold tracking-[0.08em] text-white uppercase"
                    >
                      Precio
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-3.5 text-right font-[family-name:var(--font-display)] text-[0.875rem] font-semibold tracking-[0.08em] text-white uppercase"
                    >
                      Variación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.quotes.map((quote) => (
                    <tr key={quote.id} className="border-t border-white/10">
                      <th scope="row" className="px-5 py-4 text-[0.9375rem] font-medium text-white">
                        {quote.name}
                      </th>
                      <td className="px-5 py-4 text-[0.9375rem] text-tint">{quote.symbol}</td>
                      <td className="px-5 py-4 text-right text-[0.9375rem] text-white" data-tabular>
                        {quote.unit} {formatDecimal(quote.value)}
                      </td>
                      <td
                        className="px-5 py-4 text-right text-[0.9375rem] font-semibold"
                        data-tabular
                      >
                        {quote.changePercent === null ? (
                          <span className="text-tint">Sin variación publicada</span>
                        ) : (
                          <span
                            className={
                              quote.direction === 'up'
                                ? 'text-positive-on-navy'
                                : quote.direction === 'down'
                                  ? 'text-negative-on-navy'
                                  : 'text-tint'
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

            <figcaption className="mt-4 flex flex-col gap-1 text-sm text-tint sm:flex-row sm:items-center sm:justify-between">
              <span>
                Fuente: <span className="font-medium text-white">{snapshot.source.name}</span>
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
              <p className="mt-4 rounded-xl bg-tint px-4 py-3 text-sm text-navy">
                <strong className="font-semibold">Datos simulados.</strong> Estas cifras existen
                solo para revisión visual en desarrollo y no representan precios reales del mercado.
              </p>
            ) : null}
          </figure>
        )}
      </div>
    </Reveal>
  </section>
)
