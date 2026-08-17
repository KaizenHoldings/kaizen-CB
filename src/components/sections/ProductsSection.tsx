import React from 'react'

import { MagneticCarousel, type MagneticItem } from '@/components/sections/MagneticCarousel'
import { ActionButton } from '@/components/ui/ActionButton'
import { Reveal } from '@/components/ui/Reveal'

/**
 * Catálogo de productos. Texto institucional permanente: vive en el componente
 * de su sección, no en Payload.
 *
 * Las imágenes son provisionales —recursos ya presentes en el proyecto— y se
 * sustituyen cambiando solo la ruta de cada entrada.
 */
const PRODUCTS: MagneticItem[] = [
  {
    title: 'Pagaré bursátil',
    description: 'Financiamiento a corto plazo emitido a través del mercado de valores.',
    image: '/img/products/1.jpg',
  },
  {
    title: 'Estructuración',
    description: 'Diseñamos la estrategia de emisión óptima para cada empresa.',
    image: '/img/products/2.jpg',
  },
  {
    title: 'Emisiones',
    description: 'Bonos, papeles comerciales y obligaciones en la Bolsa de Valores de Caracas.',
    image: '/img/products/3.jpg',
  },
  {
    title: 'Colocación de emisiones',
    description: 'Colocamos tu emisión entre los inversionistas del mercado.',
    image: '/img/products/4.jpg',
  },
  {
    title: 'Finanzas corporativas',
    description: 'Valoración, fusiones y adquisiciones, y consultoría estratégica.',
    image: '/img/products/5.jpg',
  },
  {
    title: 'Titularización',
    description: 'Transformamos tus activos en títulos negociables para obtener liquidez.',
    image: '/img/products/6.jpg',
  },
  {
    title: 'Negociación de valores',
    description: 'Compra y venta de instrumentos financieros en el mercado bursátil.',
    image: '/img/products/71.jpg',
  },
  {
    title: 'Cartera administrada',
    description: 'Gestionamos tu portafolio según tus metas y tu perfil de riesgo.',
    image: '/img/products/8.jpg',
  },
  {
    title: 'Reporto',
    description: 'Financiamiento de corto plazo respaldado por títulos valores.',
    image: '/img/products/9.jpg',
  },
]

/**
 * Bloque institucional oscuro: el título se mantiene en la retícula de
 * contenido y la franja se extiende a todo el ancho de la sección.
 */
export const ProductsSection: React.FC = () => (
  <section
    id="productos"
    /* Alto exacto de pantalla. No usa `kcb-section` porque su relleno vertical
       —hasta 7.5rem por lado— impediría que el bloque cupiese; el margen de
       anclaje sí se conserva. La reserva superior deja libre el cromo fijo
       para que el título no quede bajo el navbar. */
    className="flex h-[100dvh] flex-col bg-[#184771] py-16 lg:py-24"
    aria-labelledby="productos-titulo"
  >
    <Reveal className="kcb-container">
      <h2
        id="productos-titulo"
        className="mx-auto max-w-3xl text-center font-[family-name:var(--font-display)] text-[clamp(1.75rem,1.35rem+1.9vw,2.75rem)] leading-[1.12] font-light tracking-[-0.02em] text-white"
      >
        Soluciones financieras integrales
      </h2>
    </Reveal>

    {/* La franja se queda con el espacio sobrante: `min-h-0` permite que
        encoja por debajo de su contenido en pantallas bajas. */}
    <div className="mt-4 min-h-0 flex-1 lg:mt-5">
      <MagneticCarousel items={PRODUCTS} label="Soluciones financieras" />
    </div>

    <Reveal className="kcb-container mt-2 flex shrink-0 justify-center lg:mt-3">
      <ActionButton href="/contacto" surface="dark" emphasis="secondary">
        Quiero asesoría
      </ActionButton>
    </Reveal>
  </section>
)
