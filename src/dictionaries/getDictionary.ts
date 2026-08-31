import 'server-only'

import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n'

import type es from './es.json'

/**
 * Forma del diccionario, deducida del archivo español.
 *
 * `es.json` es la fuente de verdad: si se añade una clave allí y falta en
 * `en.json`, el typecheck lo detecta en lugar de dejar un hueco que solo se
 * vería en producción.
 */
export type Dictionary = typeof es

/* Importaciones dinámicas, no un objeto ya resuelto: así el idioma que no se
   pide no entra en el bundle del servidor de esa petición. */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  es: () => import('./es.json').then((module) => module.default),
  en: () => import('./en.json').then((module) => module.default as Dictionary),
}

/**
 * Carga el diccionario de un idioma. Solo se invoca desde el servidor.
 *
 * Repliega al idioma por defecto si la clave no existe: es la única puerta de
 * entrada al diccionario y no debe reventar por un valor que se colara desde
 * fuera del enrutador.
 */
export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  (dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE])()
