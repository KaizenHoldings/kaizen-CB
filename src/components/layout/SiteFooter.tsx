import Link from 'next/link'
import React from 'react'

import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { NAV_LINKS, SITE } from '@/lib/site'

const PRODUCT_LINKS = [
  { href: '/#productos', label: 'Finanzas corporativas' },
  { href: '/#productos', label: 'Intermediación de títulos' },
  { href: '/#productos', label: 'Cartera administrada' },
  { href: '/#productos', label: 'Emisiones' },
  { href: '/#registro', label: 'Abre tu cuenta' },
] as const

export const SiteFooter: React.FC = () => (
  <footer className="kcb-gradient text-white">
    <div className="kcb-container py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Logo variant="light" className="h-10 w-auto" />
          <p className="kcb-measure mt-6 text-[0.9375rem] leading-relaxed text-tint">
            Institución financiera dedicada a crear relaciones duraderas que impacten de forma
            positiva al ecosistema empresarial venezolano.
          </p>

          <ul className="mt-8 space-y-3 text-[0.9375rem] text-tint">
            <li className="flex items-start gap-3">
              <Icon name="pin" className="mt-0.5 size-[1.125rem] shrink-0 text-chart-light" />
              <span>{SITE.contact.address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="phone" className="size-[1.125rem] shrink-0 text-chart-light" />
              <a href={SITE.contact.phoneHref} className="hover:text-white">
                {SITE.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="mail" className="size-[1.125rem] shrink-0 text-chart-light" />
              <a href={SITE.contact.emailHref} className="break-all hover:text-white">
                {SITE.contact.email}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-labelledby="footer-nav">
          <h2
            id="footer-nav"
            className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-white uppercase"
          >
            Navegación
          </h2>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-tint transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/publicaciones" className="text-tint transition-colors hover:text-white">
                Publicaciones
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-productos">
          <h2
            id="footer-productos"
            className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-white uppercase"
          >
            Productos
          </h2>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            {PRODUCT_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-tint transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="kcb-hairline-light mt-14 flex flex-col gap-3 pt-8 text-[0.8125rem] text-tint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.
        </p>
        <p>Regulados por la {SITE.regulator}.</p>
      </div>
    </div>
  </footer>
)
