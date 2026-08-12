import Image from 'next/image'
import React from 'react'

/**
 * Logo horizontal oficial en la pantalla de acceso del panel.
 * Payload sirve el login sobre fondo claro, así que corresponde la versión oscura.
 */
export const AdminLogo: React.FC = () => (
  <Image
    src="/brand/kaizen-logo-horizontal-dark.png"
    alt="Kaizen Casa de Bolsa"
    width={482}
    height={130}
    priority
    style={{ width: '13.5rem', height: 'auto' }}
  />
)

export default AdminLogo
