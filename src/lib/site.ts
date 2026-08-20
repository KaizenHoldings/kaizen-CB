import { serverUrl } from './env'

/**
 * Datos institucionales permanentes del sitio.
 *
 * Es texto estático de la marca —no contenido administrable— y por eso vive en
 * el código, no en Payload. Todo proviene de la referencia oficial del
 * proyecto: no se añade aquí ningún canal ni dato sin confirmar.
 */
export const SITE = {
  name: 'Kaizen Casa de Bolsa',
  shortName: 'Kaizen',
  description:
    'Conectamos a personas y empresas con las oportunidades del mercado de valores en Venezuela, con acompañamiento cercano en cada decisión.',
  url: serverUrl,
  locale: 'es_VE',
  contact: {
    address:
      'Av. Altagracia, Edif. Caracas Campus, Nivel Plaza OF S/N, Sector La Trinidad, Caracas, Venezuela.',
    phone: '+58 212 750 8846',
    phoneHref: 'tel:+582127508846',
    email: 'info@kaizencasadebolsa.com',
    emailHref: 'mailto:info@kaizencasadebolsa.com',
  },
  regulator: 'Superintendencia Nacional de Valores',
} as const

/** Destinos de la navegación principal. Un solo origen para navbar, menú móvil y footer. */
export const NAV_LINKS = [
  { href: '/#inicio', label: 'Inicio' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#productos', label: 'Productos' },
  { href: '/#informacion-financiera', label: 'Información financiera' },
  { href: '/#cumplimiento', label: 'Cumplimiento' },
  { href: '/contacto', label: 'Contacto' },
] as const

/**
 * Navegación de escritorio: omite «Inicio» porque el logo ya cumple esa
 * función, y así la barra cabe sin apretar las etiquetas largas. El menú móvil
 * y el footer sí lo conservan, donde no compite por espacio.
 */
export const DESKTOP_NAV_LINKS = NAV_LINKS.filter((link) => link.href !== '/#inicio')
