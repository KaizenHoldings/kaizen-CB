import React from 'react'

import { ContactForm } from '@/components/sections/ContactForm'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SITE } from '@/lib/site'

const CHANNELS: Array<{
  icon: IconName
  label: string
  value: string
  href?: string
}> = [
  { icon: 'pin', label: 'Dirección', value: SITE.contact.address },
  { icon: 'phone', label: 'Teléfono', value: SITE.contact.phone, href: SITE.contact.phoneHref },
  { icon: 'mail', label: 'Correo', value: SITE.contact.email, href: SITE.contact.emailHref },
]

/**
 * Contacto. Vive en su propia página, no en la landing.
 *
 * `level` es configurable porque ahí el título es el encabezado principal del
 * documento; si la sección volviera a incrustarse en otra página, basta con
 * dejarlo en 2 para no romper la jerarquía.
 */
export const ContactSection: React.FC<{ level?: 1 | 2 }> = ({ level = 2 }) => (
  <section id="contacto" className="kcb-section bg-tint" aria-labelledby="contacto-titulo">
    <div className="kcb-container">
      {/* Dos columnas en escritorio —datos a un lado, formulario al otro— y una
          sola columna apilada por debajo de `lg`, con los datos primero: son la
          vía de contacto que sí funciona hoy. */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="contacto-titulo"
            level={level}
            title="Estamos listos para atenderte"
            description="Conversemos sobre tus objetivos financieros. Te respondemos en días hábiles."
          />
          <ul className="mt-12">
            {CHANNELS.map((channel) => (
              <li key={channel.label} className="kcb-hairline flex gap-4 py-5">
                <span className="kcb-chip" data-size="sm">
                  <Icon name={channel.icon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold text-navy">
                    {channel.label}
                  </h3>
                  {channel.href ? (
                    <a href={channel.href} className="kcb-link mt-1 inline-block break-words">
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-[0.9375rem] leading-relaxed text-muted">
                      {channel.value}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ContactForm />
      </div>
    </div>
  </section>
)
