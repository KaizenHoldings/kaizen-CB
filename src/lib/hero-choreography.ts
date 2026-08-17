/**
 * Coreografía de entrada del primer viewport.
 *
 * Los tiempos viven aquí y no repartidos por los componentes porque la
 * secuencia cruza dos árboles distintos —el hero y la cabecera global, que no
 * comparten padre—: si cada uno llevara sus números, bastaría tocar uno para
 * que el conjunto dejara de encajar sin que nada lo delatara.
 *
 * La curva es `[0.33, 1, 0.68, 1]`: un ease-out más suave que el anterior
 * —arranca menos brusco y se posa despacio—, sin rebote. Nada de muelles: esto
 * es una entrada institucional.
 */
export const HERO_EASE = [0.33, 1, 0.68, 1] as const

/** Fundido único cuando el sistema pide movimiento reducido: sin recorridos,
 *  sin recortes y sin escalonar, todo a la vez. */
export const HERO_REDUCED = { duration: 0.35, ease: 'easeOut' as const, delay: 0 }

/* Los pasos se solapan a propósito: cada uno arranca mientras el anterior aún
   se está posando, de modo que la secuencia se lee como un movimiento continuo
   y no como cuatro gestos encadenados. La entrada completa se cierra a los
   2,5 s. */
export const HERO_STEPS = {
  /** 1 · El campo interactivo se forma desde la derecha. */
  field: { duration: 1.5, delay: 0 },
  /** 2 · La cabecera cae en su sitio. */
  header: { duration: 1, delay: 0.5 },
  /** 3 · «Invertir con visión». */
  titleFirst: { duration: 1, delay: 1 },
  /** 4 · «crecer con confianza» y los botones, juntos. */
  titleSecond: { duration: 1, delay: 1.5 },
} as const

type Step = keyof typeof HERO_STEPS

/** Transición de un paso, ya resuelta según la preferencia de movimiento. */
export const heroTransition = (step: Step, reduced: boolean) =>
  reduced ? HERO_REDUCED : { ...HERO_STEPS[step], ease: HERO_EASE }
