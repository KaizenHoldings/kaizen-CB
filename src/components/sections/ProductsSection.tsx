import React from 'react'

import { ProductList, type Product } from '@/components/sections/ProductList'
import { ActionButton } from '@/components/ui/ActionButton'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Catálogo de productos. Texto institucional permanente: vive en el componente
 * de su sección, no en Payload.
 *
 * Cada producto declara a qué recorrido sirve, de modo que el filtro de la
 * interfaz refleje una diferencia real y no una etiqueta decorativa.
 */
const PRODUCTS: Product[] = [
  {
    icon: 'doc',
    title: 'Pagaré bursátil',
    description: 'Financiamiento a corto plazo emitido a través del mercado de valores.',
    tracks: ['company'],
  },
  {
    icon: 'layers',
    title: 'Estructuración',
    description: 'Diseñamos la estrategia de emisión óptima para cada empresa.',
    tracks: ['company'],
  },
  {
    icon: 'coins',
    title: 'Emisiones',
    description: 'Bonos, papeles comerciales y obligaciones en la Bolsa de Valores de Caracas.',
    tracks: ['company'],
  },
  {
    icon: 'network',
    title: 'Agente de colocación primaria',
    description: 'Colocamos tu emisión entre los inversionistas del mercado.',
    tracks: ['company'],
  },
  {
    icon: 'bank',
    title: 'Finanzas corporativas',
    description: 'Valoración, fusiones y adquisiciones, y consultoría estratégica.',
    tracks: ['company'],
  },
  {
    icon: 'convert',
    title: 'Titularización',
    description: 'Transformamos tus activos en títulos negociables para obtener liquidez.',
    tracks: ['company'],
  },
  {
    icon: 'exchange',
    title: 'Intermediación de títulos',
    description: 'Compra y venta de instrumentos financieros en el mercado bursátil.',
    tracks: ['person', 'company'],
  },
  {
    icon: 'briefcase',
    title: 'Cartera administrada',
    description: 'Gestionamos tu portafolio según tus metas y tu perfil de riesgo.',
    tracks: ['person', 'company'],
  },
  {
    icon: 'cycle',
    title: 'Reporto',
    description: 'Financiamiento de corto plazo respaldado por títulos valores.',
    tracks: ['person', 'company'],
  },
]

export const ProductsSection: React.FC = () => (
  <section id="productos" className="kcb-section bg-tint" aria-labelledby="productos-titulo">
    <div className="kcb-container">
      <SectionHeading
        id="productos-titulo"
        title="Soluciones financieras integrales"
        description="Un portafolio completo para financiar, invertir y hacer crecer tu patrimonio. Filtra según quién eres para ver primero lo que te corresponde."
      />

      <div className="mt-12">
        <ProductList products={PRODUCTS} />
      </div>

      <Reveal className="mt-12 flex justify-center">
        <ActionButton href="/#contacto" surface="light" emphasis="secondary">
          Quiero asesoría
        </ActionButton>
      </Reveal>
    </div>
  </section>
)
