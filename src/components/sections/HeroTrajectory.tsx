import React from 'react'

import { Isotipo } from '@/components/ui/Logo'

import styles from './HeroTrajectory.module.css'

/**
 * Recurso gráfico del hero: una trayectoria ascendente contenida.
 *
 * Es geometría vectorial exacta —no una ilustración—, sin cifras ni ejes, para
 * no sugerir un rendimiento concreto ni parecer una pantalla de trading.
 *
 * El trazado se dibuja con CSS, no con JavaScript: la animación solo se activa
 * cuando la raíz lleva `data-motion="on"`, de modo que sin JavaScript o con
 * movimiento reducido la curva aparece completa en lugar de quedar en blanco.
 * Por eso este componente es de servidor y no carga Motion.
 */
const LINE = 'M0 268 C 62 250, 104 224, 152 188 S 236 132, 284 96 S 352 52, 380 34'
const AREA = `${LINE} L400 320 L0 320 Z`

export const HeroTrajectory: React.FC = () => (
  <div className="relative hidden lg:block" aria-hidden="true">
    <div className="relative overflow-hidden rounded-[20px] border border-white/15 bg-white/[0.05] p-8">
      <svg viewBox="0 0 400 320" className="block h-auto w-full" role="presentation" focusable="false">
        <defs>
          <linearGradient id="kcb-hero-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9DC2E6" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#9DC2E6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Retícula discreta: da escala sin convertirse en decoración. */}
        <g stroke="rgba(255,255,255,0.09)" strokeWidth="1">
          <line x1="0" y1="72" x2="400" y2="72" />
          <line x1="0" y1="144" x2="400" y2="144" />
          <line x1="0" y1="216" x2="400" y2="216" />
          <line x1="0" y1="288" x2="400" y2="288" />
        </g>

        <path d={AREA} fill="url(#kcb-hero-area)" className={styles.area} />

        {/* `pathLength="1"` normaliza el trazo para animar el guion con CSS. */}
        <path
          d={LINE}
          pathLength="1"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          className={styles.line}
        />

        <circle cx="380" cy="34" r="5" fill="#FFFFFF" className={styles.dot} />
      </svg>

      <div className="absolute end-8 bottom-8 rounded-[14px] bg-white/95 p-3.5 shadow-[0_18px_40px_-24px_rgba(14,48,72,0.75)]">
        <Isotipo className="h-9 w-auto" />
      </div>
    </div>
  </div>
)
