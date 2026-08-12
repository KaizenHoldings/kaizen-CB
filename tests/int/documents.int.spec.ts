import { describe, expect, it } from 'vitest'

import type { DocumentRepository } from '@/modules/documents/data/document.repository'
import type { DocumentCategory, PublicDocument } from '@/modules/documents/domain/document'
import { DocumentService } from '@/modules/documents/services/document.service'

const doc = (overrides: Partial<PublicDocument> & { id: string }): PublicDocument => ({
  slug: `doc-${overrides.id}`,
  title: `Documento ${overrides.id}`,
  description: null,
  category: 'financial-statement',
  intent: 'download',
  periodYear: null,
  periodMonth: null,
  periodLabel: null,
  publishedAt: '2026-01-01T00:00:00.000Z',
  effectiveDate: null,
  sortOrder: 0,
  file: null,
  ...overrides,
})

const repositoryOf = (documents: PublicDocument[]): DocumentRepository => ({
  async findPublished({ categories } = {}) {
    return categories?.length
      ? documents.filter((document) => categories.includes(document.category))
      : documents
  },
})

describe('DocumentService.financialStatementArchive', () => {
  it('agrupa por año y ordena de más reciente a más antiguo', async () => {
    const service = new DocumentService(
      repositoryOf([
        doc({ id: '1', periodYear: 2025, periodMonth: 11 }),
        doc({ id: '2', periodYear: 2026, periodMonth: 1 }),
        doc({ id: '3', periodYear: 2026, periodMonth: 4 }),
        doc({ id: '4', periodYear: 2025, periodMonth: 12 }),
      ]),
    )

    const archive = await service.financialStatementArchive()

    expect(archive.availableYears).toEqual([2026, 2025])
    expect(archive.totalDocuments).toBe(4)
    expect(archive.years[0]!.documents.map((d) => d.periodMonth)).toEqual([4, 1])
    expect(archive.years[1]!.documents.map((d) => d.periodMonth)).toEqual([12, 11])
  })

  it('descarta un estado financiero sin año en lugar de inventarle un periodo', async () => {
    const service = new DocumentService(
      repositoryOf([doc({ id: '1', periodYear: null }), doc({ id: '2', periodYear: 2026 })]),
    )

    const archive = await service.financialStatementArchive()

    expect(archive.totalDocuments).toBe(1)
    expect(archive.availableYears).toEqual([2026])
  })

  it('devuelve un archivo vacío coherente cuando no hay nada publicado', async () => {
    const archive = await new DocumentService(repositoryOf([])).financialStatementArchive()

    expect(archive.years).toEqual([])
    expect(archive.availableYears).toEqual([])
    expect(archive.totalDocuments).toBe(0)
  })
})

describe('DocumentService.listSupportingDocuments', () => {
  it('separa por categoría y respeta el orden manual antes que la fecha', async () => {
    const service = new DocumentService(
      repositoryOf([
        doc({
          id: 'a',
          category: 'institutional',
          sortOrder: 2,
          publishedAt: '2026-05-01T00:00:00.000Z',
        }),
        doc({
          id: 'b',
          category: 'institutional',
          sortOrder: 1,
          publishedAt: '2024-01-01T00:00:00.000Z',
        }),
        doc({ id: 'c', category: 'compliance' }),
        doc({ id: 'd', category: 'reference' }),
      ]),
    )

    const grouped = await service.listSupportingDocuments()

    expect(grouped.institutional.map((d) => d.id)).toEqual(['b', 'a'])
    expect(grouped.compliance).toHaveLength(1)
    expect(grouped.reference).toHaveLength(1)
    expect(grouped['financial-statement']).toEqual([])
  })

  it('pide solo las categorías que necesita', async () => {
    const requested: DocumentCategory[][] = []
    const service = new DocumentService({
      async findPublished({ categories } = {}) {
        if (categories) requested.push(categories)
        return []
      },
    })

    await service.listSupportingDocuments()

    expect(requested).toEqual([['institutional', 'compliance', 'reference']])
  })
})
