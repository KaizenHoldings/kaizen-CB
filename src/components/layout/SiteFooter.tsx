import Link from 'next/link'
import React from 'react'

import { Icon } from '@/components/ui/Icon'
import { Logo } from '@/components/ui/Logo'
import { NAV_LINKS, SITE } from '@/lib/site'
import type { Dictionary } from '@/dictionaries/getDictionary'
import { localeHref, type Locale } from '@/lib/i18n'

/* Solo el destino: las etiquetas viven en `footer.productLinks` y se emparejan
   por índice, igual que en el resto de secciones. */
const PRODUCT_HREFS = [
  '/#productos',
  '/#productos',
  '/#productos',
  '/#productos',
  '/#registro',
] as const

export const SiteFooter: React.FC<{
  dict: Dictionary['nav']
  footer: Dictionary['footer']
  locale: Locale
}> = ({ dict, footer, locale }) => (
  <footer className="kcb-gradient text-white">
    <div className="kcb-container py-16 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Logo variant="light" className="h-10 w-auto" />
          <p className="kcb-measure mt-6 text-[0.9375rem] leading-relaxed text-tint">
            {footer.tagline}
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
            suppressHydrationWarning
          >
            {footer.navegacion}
          </h2>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={localeHref(locale, link.href)}
                  className="text-tint transition-colors hover:text-white"
                >
                  {dict[link.key]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={localeHref(locale, '/publicaciones')}
                className="text-tint transition-colors hover:text-white"
              >
                {dict.publicaciones}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-productos">
          <h2
            id="footer-productos"
            className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-[0.08em] text-white uppercase"
            suppressHydrationWarning
          >
            {footer.productos}
          </h2>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            {footer.productLinks.map((label, index) => (
              <li key={label}>
                <Link
                  href={localeHref(locale, PRODUCT_HREFS[index] ?? '/#productos')}
                  className="text-tint transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="kcb-hairline-light mt-14 flex flex-col gap-3 pt-8 text-[0.8125rem] text-tint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}. {footer.derechos}
        </p>
        <p>{footer.regulados.replace('{regulator}', SITE.regulator)}</p>
      </div>
    </div>
  </footer>
)
