import { describe, expect, it } from 'vitest'

import {
  fileTypeLabel,
  formatFileSize,
  formatShortDate,
  formatVariation,
  monthNameCapitalized,
} from '@/lib/format'

describe('formatFileSize', () => {
  it('devuelve null cuando no hay tamaño: nunca se inventa un valor', () => {
    expect(formatFileSize(null)).toBeNull()
    expect(formatFileSize(undefined)).toBeNull()
    expect(formatFileSize(0)).toBeNull()
    expect(formatFileSize(Number.NaN)).toBeNull()
  })

  it('usa coma decimal y la unidad adecuada', () => {
    expect(formatFileSize(900)).toBe('900 B')
    expect(formatFileSize(2_516_582)).toBe('2,4 MB')
    expect(formatFileSize(15 * 1024 * 1024)).toBe('15 MB')
  })
})

describe('fileTypeLabel', () => {
  it('reconoce los MIME admitidos por la colección de archivos', () => {
    expect(fileTypeLabel('application/pdf', 'balance.pdf')).toBe('PDF')
    expect(
      fileTypeLabel(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'datos.xlsx',
      ),
    ).toBe('XLSX')
  })

  it('cae en la extensión cuando el MIME es desconocido, y en null si no hay ninguna', () => {
    expect(fileTypeLabel('application/octet-stream', 'informe.csv')).toBe('CSV')
    expect(fileTypeLabel(null, null)).toBeNull()
  })
})

describe('formatVariation', () => {
  it('acompaña siempre el número con su signo', () => {
    expect(formatVariation(1.85)).toBe('+1,85 %')
    expect(formatVariation(-0.62)).toBe('−0,62 %')
    expect(formatVariation(0)).toBe('0,00 %')
  })
})

describe('fechas', () => {
  it('formatea en español y devuelve null ante una fecha inválida', () => {
    expect(formatShortDate('2026-04-30T00:00:00.000Z')).toBe('30 abr 2026')
    expect(formatShortDate('no-es-una-fecha')).toBeNull()
    expect(formatShortDate(null)).toBeNull()
  })

  it('nombra los meses en español', () => {
    expect(monthNameCapitalized(4)).toBe('Abril')
    expect(monthNameCapitalized(12)).toBe('Diciembre')
  })
})
