'use client'

import { useEffect, useState } from 'react'

/**
 * Preferencia de movimiento del sistema.
 *
 * Arranca en `false` porque es lo único que el servidor puede saber: el primer
 * render del cliente coincide así con el HTML servido y no hay aviso de
 * hidratación. El valor real se establece al montar.
 *
 * No se usa `useReducedMotion` de Motion porque devuelve `null` en el servidor
 * y el valor real en el cliente, que es justo la discrepancia que ya provocó un
 * aviso de hidratación en la cabecera al principio del proyecto.
 */
export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return reduced
}
