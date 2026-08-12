import type { DocumentRepository } from '../data/document.repository'
import { payloadDocumentRepository } from '../data/document.repository'
import type {
  DocumentCategory,
  FinancialStatementArchive,
  PublicDocument,
} from '../domain/document'

/**
 * Reglas de orden, agrupación y vigencia de los documentos públicos.
 *
 * Toda la lógica vive aquí: ningún componente vuelve a decidir cómo se ordena
 * un estado financiero ni qué cuenta como periodo más reciente.
 */
export class DocumentService {
  constructor(private readonly repository: DocumentRepository = payloadDocumentRepository) {}

  /** Documentos de una categoría, ya ordenados para presentarse. */
  async listByCategory(category: DocumentCategory): Promise<PublicDocument[]> {
    const documents = await this.repository.findPublished({ categories: [category] })
    return this.sortForDisplay(documents)
  }

  /**
   * Estados financieros agrupados por año, del más reciente al más antiguo, y
   * dentro de cada año del mes más reciente al más antiguo.
   */
  async financialStatementArchive(): Promise<FinancialStatementArchive> {
    const documents = await this.repository.findPublished({ categories: ['financial-statement'] })

    const byYear = new Map<number, PublicDocument[]>()
    for (const document of documents) {
      const year = document.periodYear
      if (year === null) continue // la colección exige año en esta categoría
      const bucket = byYear.get(year)
      if (bucket) bucket.push(document)
      else byYear.set(year, [document])
    }

    const years = [...byYear.entries()]
      .sort(([a], [b]) => b - a)
      .map(([year, docs]) => ({
        year,
        documents: docs.sort(
          (a, b) =>
            (b.periodMonth ?? 0) - (a.periodMonth ?? 0) ||
            a.sortOrder - b.sortOrder ||
            b.publishedAt.localeCompare(a.publishedAt),
        ),
      }))

    return {
      years,
      availableYears: years.map((group) => group.year),
      totalDocuments: years.reduce((total, group) => total + group.documents.length, 0),
    }
  }

  /** Documentos institucionales, de cumplimiento y de referencia en una sola pasada. */
  async listSupportingDocuments(): Promise<Record<DocumentCategory, PublicDocument[]>> {
    const documents = await this.repository.findPublished({
      categories: ['institutional', 'compliance', 'reference'],
    })

    const grouped: Record<DocumentCategory, PublicDocument[]> = {
      institutional: [],
      'financial-statement': [],
      compliance: [],
      reference: [],
    }

    for (const document of documents) {
      grouped[document.category].push(document)
    }

    for (const category of Object.keys(grouped) as DocumentCategory[]) {
      grouped[category] = this.sortForDisplay(grouped[category])
    }

    return grouped
  }

  /**
   * Orden general: primero el orden manual cuando el editor lo definió, luego
   * el periodo y por último la fecha de publicación, siempre descendente.
   */
  private sortForDisplay(documents: PublicDocument[]): PublicDocument[] {
    return [...documents].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        (b.periodYear ?? 0) - (a.periodYear ?? 0) ||
        (b.periodMonth ?? 0) - (a.periodMonth ?? 0) ||
        b.publishedAt.localeCompare(a.publishedAt),
    )
  }
}

export const documentService = new DocumentService()
