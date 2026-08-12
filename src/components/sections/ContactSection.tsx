import React from 'react'

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

export const ContactSection: React.FC = () => (
  <section id="contacto" className="kcb-section bg-tint" aria-labelledby="contacto-titulo">
    <div className="kcb-container">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="contacto-titulo"
            title="Estamos listos para atenderte"
            description="Conversemos sobre tus objetivos financieros. Te respondemos en días hábiles."
          />
          <ul className="mt-10">
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
        {/* Dimensiones reservadas por `aspect-ratio` para no provocar salto de
              maquetación mientras carga el mapa. */}
        <div className="aspect-[4/3] overflow-hidden rounded-[20px] bg-tint-2 shadow-[0_20px_50px_-22px_rgba(14,48,72,0.28)] lg:aspect-[5/4]">
          <iframe
            src="https://www.google.com/maps?q=Edificio%20Caracas%20Campus%2C%20Av.%20Altagracia%2C%20La%20Trinidad%2C%20Caracas%2C%20Venezuela&output=embed"
            title="Ubicación de Kaizen Casa de Bolsa en el mapa"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full border-0"
          />
        </div>
      </div>
    </div>
  </section>
)
