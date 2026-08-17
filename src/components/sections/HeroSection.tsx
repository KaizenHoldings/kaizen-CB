import Image from 'next/image'
import React from 'react'

import { HeroField } from '@/components/sections/HeroField'
import { HeroIntro } from '@/components/sections/HeroIntro'
import { ActionButton } from '@/components/ui/ActionButton'

/**
 * Primer viewport: el momento de marca.
 *
 * Fotografía institucional al fondo, velada por una capa Navy que garantiza
 * el contraste del titular sobre cualquier zona de la imagen; encima, el
 * campo de líneas. El texto de venta vive en `PitchSection`, justo debajo.
 *
 * La sección sigue siendo de servidor. Solo dos piezas cruzan al cliente —el
 * campo interactivo y el bloque de titular y botonera—, porque son las únicas
 * que necesitan movimiento; la fotografía, los velos y los propios botones se
 * renderizan en el servidor y viajan como `children`.
 */
export const HeroSection: React.FC = () => (
  <section
    id="inicio"
    // Anula la reserva de cromo de `main`: el hero empieza en el borde real de
    // la página y su fotografía pasa por detrás del navbar transparente.
    className="relative isolate mt-[calc(var(--kcb-chrome-height)*-1)] overflow-hidden bg-navy"
  >
    {/* Foto de fondo. `priority`: está en el primer viewport y es el elemento
        de mayor peso visual de la carga inicial. */}
    <Image
      src="/img/hero4.png"
      alt=""
      aria-hidden="true"
      fill
      priority
      sizes="100vw"
      className="pointer-events-none -z-20 object-cover"
    />

    {/* Capa Navy: sostiene la legibilidad del titular en blanco sobre las
        zonas claras de la foto. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-navy/70" />

    {/* Refuerzo Navy solo en la franja superior: da contraste fiable al navbar
        transparente sobre cualquier zona de la foto y se disuelve enseguida,
        sin oscurecer el resto del hero. */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 bg-gradient-to-b from-navy/75 to-transparent"
    />

    <HeroField />

    {/* El hero ocupa la pantalla completa; el padding superior reserva la
        altura del cromo fijo para que el titular nunca quede debajo. */}
    <HeroIntro
      className="kcb-container relative flex min-h-[100dvh] flex-col justify-center pt-[calc(var(--kcb-chrome-height)+4rem)] pb-16 lg:pb-28"
      actions={
        <>
          <ActionButton
            href="/#registro"
            surface="dark"
            emphasis="primary"
            className="kcb-action--navy-hover"
          >
            Abre tu cuenta
          </ActionButton>
          <ActionButton href="/#productos" surface="dark" emphasis="secondary">
            Ver productos
          </ActionButton>
        </>
      }
    />
  </section>
)
