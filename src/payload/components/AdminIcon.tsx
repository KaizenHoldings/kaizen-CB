import Image from 'next/image'
import React from 'react'

/** Isotipo oficial en la barra de navegación del panel (contexto compacto). */
export const AdminIcon: React.FC = () => (
  <Image
    src="/brand/kaizen-isotipo.png"
    alt="Kaizen Casa de Bolsa"
    width={119}
    height={130}
    style={{ width: '1.5rem', height: 'auto' }}
  />
)

export default AdminIcon
