import React from 'react'

import { ActionButton } from '@/components/ui/ActionButton'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Reveal } from '@/components/ui/Reveal'

type Product = {
  title: string
  description: string
  icon: IconName
}

/**
 * Catálogo de productos. Texto institucional permanente: vive en el componente
 * de su sección, no en Payload.
 */
const PRODUCTS: Product[] = [
  {
    title: 'Pagaré bursátil',
    icon: 'doc',
    description: 'Financiamiento a corto plazo emitido a través del mercado de valores.',
  },
  {
    title: 'Estructuración',
    icon: 'layers',
    description: 'Diseñamos la estrategia de emisión óptima para cada empresa.',
  },
  {
    title: 'Emisiones',
    icon: 'bank',
    description: 'Bonos, papeles comerciales y obligaciones en la Bolsa de Valores de Caracas.',
  },
  {
    title: 'Colocación de emisiones',
    icon: 'network',
    description: 'Colocamos tu emisión entre los inversionistas del mercado.',
  },
  {
    title: 'Finanzas corporativas',
    icon: 'briefcase',
    description: 'Valoración, fusiones y adquisiciones, y consultoría estratégica.',
  },
  {
    title: 'Titularización',
    icon: 'convert',
    description: 'Transformamos tus activos en títulos negociables para obtener liquidez.',
  },
  {
    title: 'Negociación de valores',
    icon: 'exchange',
    description: 'Compra y venta de instrumentos financieros en el mercado bursátil.',
  },
  {
    title: 'Cartera administrada',
    icon: 'compass',
    description: 'Gestionamos tu portafolio según tus metas y tu perfil de riesgo.',
  },
  {
    title: 'Reporto',
    icon: 'cycle',
    description: 'Financiamiento de corto plazo respaldado por títulos valores.',
  },
]

/**
 * Catálogo en rejilla: las nueve soluciones a la vez, sin gesto que descubrir.
 *
 * Sustituye a la franja magnética que había antes. Aquella exigía recorrer y
 * pulsar para leer cada descripción; aquí las nueve se comparan de un vistazo,
 * que es lo que pide un catálogo institucional.
 */
export const ProductsSection: React.FC = () => (
  <section
    id="productos"
    className="kcb-section scroll-mt-[var(--kcb-sticky-offset)] bg-pearl py-16 md:py-24"
    aria-labelledby="productos-titulo"
  >
    <div className="kcb-container">
      <Reveal>
        <h2
          id="productos-titulo"
          className="mx-auto max-w-3xl text-center font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.35rem+1.9vw,2.75rem)] leading-[1.12] font-light tracking-[-0.02em] text-balance text-navy"
        >
          Soluciones financieras integrales
        </h2>
      </Reveal>

      <Reveal>
        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
          {PRODUCTS.map((product) => (
            <li
              key={product.title}
              /* `gap-4` sustituye a los márgenes que separaban imagen, título
                 y descripción. El estirado de la rejilla iguala el alto de las
                 tarjetas de una misma fila aunque las descripciones ocupen
                 distinto número de líneas. */
              className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-white p-6 transition-shadow duration-300 ease-[var(--ease-kcb)] hover:shadow-[var(--shadow-soft-sm)] lg:p-8"
            >
              {/* Decorativo: el título nombra el producto, así que el icono no
                  aporta nombre accesible.
                  `strokeWidth` baja de 1.7 a 1.25 porque el trazo escala con el
                  dibujo: a `size-8` el valor de la familia —pensado para
                  `size-4`/`size-5`— se vería notablemente más grueso. Bajarlo
                  conserva el peso óptico de BRAND.md §10 a este tamaño. */}
              <Icon name={product.icon} className="size-8 text-navy" strokeWidth={1.25} />

              <h3 className="font-[family-name:var(--font-display)] text-[1.125rem] leading-[1.35] font-light text-balance text-navy">
                {product.title}
              </h3>

              <p className="text-[0.9375rem] leading-relaxed text-pretty text-muted">
                {product.description}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-12 flex justify-center lg:mt-16">
        <ActionButton href="/contacto" surface="light" emphasis="primary">
          Quiero asesoría
        </ActionButton>
      </Reveal>
    </div>
  </section>
)
