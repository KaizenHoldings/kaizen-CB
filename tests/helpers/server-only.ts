/**
 * Sustituto de `server-only` en las pruebas.
 *
 * El paquete real existe para que un bundle de cliente falle al importar
 * código de servidor. Bajo Vitest ese código es exactamente lo que se prueba,
 * así que el alias de `vitest.config.mts` apunta aquí.
 */
export {}
