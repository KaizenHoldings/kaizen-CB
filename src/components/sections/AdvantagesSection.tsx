import React from 'react'

import { BentoReveal } from '@/components/ui/BentoReveal'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SITE } from '@/lib/site'

/**
 * Ventajas de invertir con Kaizen.
 *
 * La referencia incluía un punto sobre «beneficios fiscales» marcado como
 * pendiente de verificar. No se publica: una ventaja tributaria sin respaldo
 * legal validado no puede presentarse como confirmada.
 */
/* `cell` define el reparto bento en escritorio. La colocación automática de la
   rejilla hace el resto: la celda mayor ocupa dos columnas y dos filas, y las
   siguientes van cayendo en los huecos que deja. */
const ADVANTAGES: Array<{
  icon: IconName
  title: string
  description: string
  cell?: string
  featured?: boolean
}> = [
  {
    icon: 'coins',
    title: 'Acceso a financiamiento',
    description: 'Conectamos a tu empresa con el capital del mercado de valores.',
    cell: 'lg:col-span-2 lg:row-span-2',
    featured: true,
  },
  {
    icon: 'trend',
    title: 'Instrumentos de renta fija y variable',
    description:
      'Alternativas orientadas a preservar y hacer crecer tu patrimonio, con su riesgo explicado.',
  },
  {
    icon: 'grid',
    title: 'Diversificación',
    description: 'Distribuye tu inversión entre distintos sectores e instrumentos.',
  },
  {
    icon: 'scale',
    title: 'Mercado regulado',
    description: `Operamos bajo la supervisión de la ${SITE.regulator}.`,
  },
  {
    icon: 'headset',
    title: 'Asesoría personalizada',
    description: 'Un ejecutivo te acompaña según tu perfil y tus objetivos.',
    cell: 'lg:col-span-2',
  },
]

export const AdvantagesSection: React.FC = () => (
  <section
    id="ventajas"
    /* La pantalla es un mínimo, no una medida fija: el bento la llena cuando
       hay sitio y crece cuando el contenido lo pide. Con un alto cerrado, cada
       milímetro de relleno se lo quitaba al texto y acababa recortándolo en
       pantallas bajas; así el reparto se resuelve solo.
       `svh` en lugar de `vh` para que la barra del navegador móvil no deje la
       sección más alta que la ventana real.
       Relleno vertical simétrico: antes el superior reservaba la altura del
       cromo fijo y el inferior era otra medida distinta, así que el bloque
       quedaba descentrado (92/54 px en escritorio). Los 5 rem del escalón móvil
       ya superan la altura del cromo (4,25 rem), de modo que el titular sigue
       librando la barra fija sin necesidad de un cálculo aparte. */
    className="kcb-section flex min-h-[100svh] flex-col bg-white"
    aria-labelledby="ventajas-titulo"
  >
    <div className="kcb-container flex min-h-0 flex-1 flex-col">
      <SectionHeading
        id="ventajas-titulo"
        surface="light"
        title="¿Por qué invertir con Kaizen?"
        description="Porque la confianza se construye explicando. Te mostramos lo que puedes esperar de cada instrumento, incluido su riesgo, antes de que decidas."
      />

      {/* Entra distinto del resto de secciones: en lugar del fundido de
          bloque, cada celda llega desde su lado hasta armar el bento. Por eso
          no lleva `Reveal`, que fundiría el conjunto por encima y duplicaría la
          transición.
          Las filas estiran para llenar la sección, pero nunca bajan de una
          altura legible: por debajo de ese suelo el bloque prefiere crecer y
          que la página se desplace antes que apretar el texto. */}
      <BentoReveal className="mt-[clamp(1rem,2.5vh,2rem)] grid min-h-0 flex-1 gap-[clamp(0.25rem,0.7vh,0.375rem)] sm:grid-cols-2 lg:auto-rows-[minmax(clamp(8.5rem,19vh,12rem),1fr)] lg:grid-cols-3">
          {ADVANTAGES.map((advantage) => (
            <li
              key={advantage.title}
              className={[
                // Celdas navy sobre el blanco de la sección: la separación la
                // marca el propio hueco, sin necesidad de filete.
                // El margen interior se mide en `vh` porque el enemigo aquí es
                // la altura: en una pantalla baja se ajusta solo en lugar de
                // robarle sitio al texto.
                'group flex min-h-0 flex-col gap-[clamp(0.5rem,1.4vh,0.75rem)] bg-[#0d2d43]',
                // La celda mayor puede permitirse más aire que las pequeñas.
                advantage.featured
                  ? 'p-[clamp(1.5rem,0.5rem+2.6vh,2.5rem)]'
                  : 'p-[clamp(1.25rem,0.25rem+2vh,1.75rem)]',
                advantage.cell ?? '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* En la celda mayor el icono sube de tamaño: con el pequeño se
                  perdía frente al área de la tarjeta. */}
              <span
                className="kcb-chip"
                data-surface="dark"
                data-size={advantage.featured ? undefined : 'sm'}
              >
                {/* `motion-safe:` deja el efecto fuera cuando el sistema pide
                    movimiento reducido; sin él la escala se aplicaría igual.
                    Los dos factores difieren porque las bases difieren: el
                    icono pequeño parte de 20 px y el destacado de 28, así que
                    con 150 % y 125 % ambos llegan a unos 30-35 px y el gesto se
                    percibe igual de intenso en toda la rejilla. */}
                <Icon
                  name={advantage.icon}
                  className={[
                    'transition-transform duration-300 ease-out',
                    advantage.featured
                      ? 'size-7 motion-safe:group-hover:scale-125'
                      : 'size-5 motion-safe:group-hover:scale-150',
                  ].join(' ')}
                />
              </span>

              {/* La celda destacada crece de escala; el resto conserva su
                  tamaño para que el bloque siga leyéndose parejo. */}
              <div className={advantage.featured ? 'mt-auto' : ''}>
                <h3
                  className={[
                    'font-[family-name:var(--font-display)] font-semibold text-balance text-white',
                    advantage.featured
                      ? 'text-[clamp(1.35rem,1.15rem+1vw,1.875rem)] leading-[1.15]'
                      : 'text-[clamp(1rem,0.94rem+0.2vw,1.125rem)] leading-[1.25]',
                  ].join(' ')}
                >
                  {advantage.title}
                </h3>
                <p
                  className={[
                    'mt-[clamp(0.375rem,0.9vh,0.5rem)] leading-relaxed text-pretty text-tint',
                    advantage.featured
                      ? 'max-w-[46ch] text-[clamp(0.9375rem,0.85rem+0.35vw,1.0625rem)]'
                      : 'text-[clamp(0.875rem,0.84rem+0.15vw,0.9375rem)]',
                  ].join(' ')}
                >
                  {advantage.description}
                </p>
              </div>
            </li>
          ))}
      </BentoReveal>
    </div>
  </section>
)
