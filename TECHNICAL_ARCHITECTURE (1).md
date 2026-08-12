# Technical Architecture — Kaizen Casa de Bolsa

## 1. Propósito

Este documento define la arquitectura técnica, las responsabilidades de cada capa y las reglas que deben respetarse durante el desarrollo de la web de **Kaizen Casa de Bolsa**.

`kcb_reference.html` es una referencia de estructura, contenido, jerarquía e intención funcional. Su HTML, CSS y JavaScript no deben copiarse literalmente. La implementación final debe reconstruirse con el stack y la organización definidos aquí.

Este archivo no define la identidad visual ni el comportamiento detallado de los botones. Para esos temas se deben consultar `BRAND.md` y `BUTTON_SYSTEM.md`.

---

## 2. Fuentes de verdad

Ante una contradicción técnica, se debe respetar este orden:

1. Requisitos expresos del proyecto.
2. `TECHNICAL_ARCHITECTURE.md`.
3. Configuración y contratos ya implementados en el repositorio.
4. `kcb_reference.html`.
5. Recomendaciones generales de los skills.

La skill  `impeccable` pueden mejorar experiencia, accesibilidad, composición, responsive y acabado visual, pero no deben cambiar el stack, la separación por capas, los modelos de acceso ni las reglas de seguridad de este documento.

---

## 3. Stack tecnológico

### Aplicación y CMS

- **Next.js:** framework principal, usando App Router.
- **Payload:** CMS y backend administrativo integrado en la aplicación Next.js.
- **TypeScript:** lenguaje del proyecto, con modo estricto.
- **Tailwind CSS:** sistema principal de estilos.
- **Motion:** animaciones e interacciones mediante `motion/react`.
- **PostgreSQL:** persistencia relacional de Payload y de los datos administrables.
- **`@payloadcms/db-postgres`:** adaptador oficial de PostgreSQL para Payload.

### Estado

- **Estado local de React:** primera opción para interacción limitada a un componente.
- **Zustand:** únicamente para estado de interfaz realmente compartido entre componentes distantes.
- **LocalStorage:** únicamente para preferencias no sensibles que deban sobrevivir a una recarga.

Zustand y LocalStorage no deben utilizarse para almacenar sesiones administrativas, contraseñas, tokens, permisos, documentos privados ni datos personales sensibles.

### Dependencias

No se debe añadir una librería sin comprobar que:

1. Resuelve una necesidad real del proyecto.
2. La funcionalidad no está cubierta de manera razonable por Next.js, Payload, Tailwind, Motion o APIs nativas.
3. Es compatible con las versiones instaladas.
4. Su impacto en rendimiento y mantenimiento es aceptable.

Los ejemplos de botones recibidos usan `styled-components`, pero la implementación final debe trasladarlos a Tailwind y/o CSS modular. No se debe instalar `styled-components` únicamente para reproducir esos ejemplos.

### Inicialización de Payload y PostgreSQL

Si el proyecto todavía no contiene una aplicación Payload funcional, se autoriza inicializarla directamente con el comando oficial:

```bash
npx create-payload-app
```

Durante la inicialización se debe seleccionar PostgreSQL como base de datos y conservar Next.js como aplicación principal. El proceso puede instalar las dependencias necesarias, generar la estructura inicial de Payload y configurar el adaptador oficial de PostgreSQL.

También se autoriza crear de una vez una base de datos PostgreSQL dedicada al proyecto y completar su conexión en las variables de entorno. No es necesario detener el desarrollo para solicitar una segunda confirmación cuando se trate de la base de desarrollo y el entorno ya disponga de PostgreSQL o de un proveedor previamente configurado.

Reglas para esta inicialización:

- Revisar primero si el repositorio ya tiene Next.js, Payload, `payload.config.ts`, migraciones o una conexión PostgreSQL configurada.
- No reinicializar el proyecto ni ejecutar `create-payload-app` sobre una instalación funcional.
- No sobrescribir, eliminar o reutilizar una base existente sin comprobar explícitamente que pertenece a este proyecto.
- Crear una base dedicada con un nombre identificable para Kaizen Casa de Bolsa.
- Guardar la conexión en `DATABASE_URI` o en la variable exigida por la configuración instalada.
- No escribir credenciales reales en el código, documentación o control de versiones.
- Ejecutar la inicialización del esquema o las migraciones requeridas por Payload.
- Verificar la conexión y el acceso al panel administrativo antes de continuar con las colecciones.
- No contratar infraestructura externa, activar un plan de pago ni crear recursos de producción sin autorización específica.

Si no existe un servidor PostgreSQL disponible, se puede preparar una instancia local de desarrollo dentro de la infraestructura autorizada del proyecto. La creación de una base remota de producción queda sujeta al proveedor y al proceso de despliegue definidos.

---

## 4. Principios arquitectónicos

1. **Aplicación unificada:** frontend público y panel de Payload deben convivir en el mismo proyecto Next.js.
2. **Separación de responsabilidades:** la interfaz, la lógica de negocio, el acceso a datos y las integraciones externas deben permanecer desacoplados.
3. **Server first:** utilizar Server Components por defecto. Agregar `"use client"` solo cuando exista interacción, estado de navegador, Motion o una API exclusiva del cliente.
4. **Secciones encapsuladas:** cada sección del landing debe ser un componente independiente.
5. **Servicios por dominio:** la lógica común debe encapsularse en clases o servicios con una responsabilidad concreta.
6. **Inversión de dependencias:** los servicios de negocio dependen de interfaces; los repositorios e integraciones implementan esas interfaces.
7. **Seguridad por diseño:** ninguna credencial o secreto debe llegar al navegador.
8. **CMS con alcance explícito:** Payload administra contenido dinámico; no debe convertirse automáticamente en un page builder para toda la web.
9. **Accesibilidad desde el origen:** semántica, teclado, foco, contraste y movimiento reducido forman parte de la definición de terminado.
10. **Simplicidad:** no crear abstracciones anticipadas ni duplicar capacidades que Payload ya ofrece.

---

## 5. Regla de contenido

El texto institucional y estático del landing debe permanecer dentro de los componentes de cada sección, según la instrucción del proyecto.

Ejemplos de texto estático:

- Hero y llamados institucionales.
- Quiénes somos y valores.
- Descripción general de productos.
- Ventajas y pasos para abrir una cuenta.
- Encabezados y textos permanentes de contacto.

Payload será la fuente de verdad únicamente para contenido que deba administrarse, publicarse, sustituirse o crecer sin desplegar código:

- Documentación institucional.
- Estados financieros.
- Documentos de referencia y cumplimiento.
- Publicaciones y newsletters.
- Archivos multimedia asociados.
- Suscripciones al newsletter.

No se debe extraer todo el copy estático a un JSON global ni duplicarlo en Payload. Si posteriormente se decide administrar una sección completa desde el CMS, esa ampliación debe documentarse antes de implementarse.

---

## 6. Capas del código

### 6.1. Capa visual

Responsable de lo que el visitante ve y utiliza.

Incluye:

- Pages y layouts de Next.js.
- Secciones del landing.
- Navbar, ticker, footer y navegación móvil.
- Componentes UI reutilizables.
- Formularios y estados visuales.
- Animaciones y hooks exclusivamente visuales.

Reglas:

- No llamar directamente a PostgreSQL, Payload REST o servicios externos desde un componente visual.
- No incluir lógica de negocio compleja.
- No acceder directamente a LocalStorage fuera de un hook o store dedicado.
- Cada sección principal del landing debe vivir en su propio componente.
- Los componentes que solo presentan datos deben mantenerse como Server Components cuando sea posible.

### 6.2. Capa de modelo de negocio

Responsable de las operaciones y reglas de la aplicación.

Servicios previstos:

- `DocumentService`: consulta, agrupación, orden y publicación visible de documentos.
- `PublicationService`: consulta de publicaciones y newsletters publicadas.
- `SubscriptionService`: validación y registro de suscripciones.
- `MarketDataService`: normalización y disponibilidad de la cinta de datos del mercado o Banco Central.
- `CommunicationService`: lógica común de formularios o comunicaciones futuras.

Reglas:

- Los servicios no deben importar componentes React.
- Deben recibir repositorios o proveedores mediante contratos.
- Deben devolver objetos tipados y normalizados para la capa visual.
- La lógica de orden, vigencia, publicación y categorización debe vivir aquí, no repetida en distintos componentes.

### 6.3. Capa de datos

Responsable de leer y escribir los datos internos.

Incluye:

- Repositorios de documentos, publicaciones y suscriptores.
- Implementaciones basadas en Payload Local API.
- Mapeadores entre documentos de Payload y modelos de negocio.
- Queries, paginación y ordenamiento.
- Fixtures o mocks estrictamente de desarrollo y pruebas.

Reglas:

- El frontend no debe conocer la forma interna completa de las colecciones de Payload.
- Los datos se transforman a DTOs o modelos de dominio antes de llegar a la UI.
- Las consultas públicas solo pueden devolver contenido publicado y campos permitidos.
- No crear un segundo ORM para operar las tablas administradas por Payload.

### 6.4. Capa de integración

Responsable de servicios externos y límites de infraestructura.

Incluye:

- Proveedor futuro de datos del Banco Central o mercado.
- Proveedor de correo para confirmaciones y envíos.
- Almacenamiento externo de archivos cuando se despliegue en infraestructura sin disco persistente.
- Mapas, formularios externos o servicios autorizados.

Reglas:

- Toda integración debe tener una interfaz y una implementación concreta.
- Las credenciales se utilizan únicamente en servidor.
- Los timeouts, reintentos, logs y fallbacks deben gestionarse en esta capa.
- Los componentes no deben llamar directamente a una API externa.

---

## 7. Organización recomendada

La estructura puede adaptarse a la plantilla de Payload instalada, pero debe conservar estas responsabilidades:

```text
src/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   └── (payload)/
│       ├── admin/
│       ├── api/
│       └── layout.tsx
├── components/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── modules/
│   ├── documents/
│   │   ├── domain/
│   │   ├── services/
│   │   └── data/
│   ├── publications/
│   ├── subscriptions/
│   └── market-data/
├── integrations/
│   ├── market-data/
│   ├── email/
│   └── storage/
├── payload/
│   ├── collections/
│   ├── globals/
│   ├── access/
│   ├── hooks/
│   └── fields/
├── lib/
├── styles/
├── types/
└── payload.config.ts
```

El proyecto debe mantener los route groups y archivos obligatorios generados por la versión de Payload instalada. No se deben renombrar o mover mecánicamente si eso rompe el panel administrativo o las rutas automáticas.

---

## 8. Estructura del landing

La estructura conceptual debe partir de `kcb_reference.html`:

1. Cinta superior de información de mercado/Banco Central.
2. Navbar.
3. Hero.
4. Quiénes somos y valores.
5. Productos.
6. Ventajas.
7. Cotizaciones o información de mercado.
8. Información financiera y documentos.
9. Cumplimiento, publicaciones y documentos de referencia.
10. Pasos para abrir una cuenta.
11. Registro de persona natural o jurídica.
12. Contacto.
13. Suscripción al newsletter.
14. Footer.

Cada bloque debe ser un componente de sección. Esta lista guía la implementación inicial, pero `ui-ux-pro-max` puede mejorar la arquitectura de información, especialmente la consulta de documentos, sin eliminar contenido requerido.

---

## 9. Payload: panel administrativo

### 9.1. Acceso

- El panel debe utilizar la autenticación nativa de Payload.
- La colección autenticable debe ser `users` o `admin-users`.
- El correo funcionará como identificador de usuario y la contraseña será administrada por Payload.
- No crear una autenticación paralela ni guardar credenciales manualmente.
- El acceso administrativo debe quedar restringido mediante `access.admin` y reglas por rol.
- La sesión debe permanecer en cookies seguras y HTTP-only; nunca en LocalStorage.

### 9.2. Roles iniciales

- **Super Admin:** administra usuarios, roles, configuración y todo el contenido.
- **Editor:** administra documentos, publicaciones, newsletters y archivos, sin poder modificar usuarios o configuración crítica.

No se deben añadir más roles hasta que exista una necesidad operativa confirmada.

### 9.3. Colecciones

#### `admin-users`

- `email`
- `password` administrado por Payload
- `name`
- `role`: `super-admin | editor`
- estado activo/inactivo cuando sea necesario

#### `media`

Colección con uploads habilitados para imágenes y archivos administrables.

Campos complementarios:

- `alt`
- `title`
- `description`
- `fileCategory`
- metadatos técnicos generados por Payload

Los tipos MIME y tamaños deben restringirse según el uso real. No permitir ejecutables ni archivos arbitrarios.

#### `documents`

Colección única para mantener una experiencia administrativa sencilla.

Campos mínimos:

- `title`
- `slug`
- `category`: `institutional | financial-statement | reference | compliance`
- `file`: relación con `media`
- `description`
- `periodMonth`, cuando aplique
- `periodYear`, cuando aplique
- `publishedAt`
- `effectiveDate`, cuando aplique
- `sortOrder`
- `status`: borrador o publicado mediante drafts/versions

La web debe agrupar y presentar estos documentos de manera clara por categoría, año y periodo. Los estados financieros deben ordenarse del más reciente al más antiguo.

#### `publications`

Colección para newsletters, artículos de cumplimiento y novedades.

Campos mínimos:

- `title`
- `slug`
- `type`: `newsletter | compliance | market-update`
- `excerpt`
- `body` en rich text
- `featuredImage`, opcional
- `relatedDocument`, opcional
- `publishedAt`
- `status` mediante drafts/versions
- metadata SEO cuando sea necesaria

Debe permitir borradores, vista previa y publicación deliberada. No mostrar documentos en borrador en la web pública.

#### `subscribers`

Colección para las suscripciones recibidas desde la web.

Campos mínimos:

- `email`, único y normalizado
- `status`: `pending | active | unsubscribed`
- `consentAccepted`
- `consentTimestamp`
- `source`
- timestamps de Payload

La respuesta pública nunca debe revelar si un correo específico ya existe. La integración de envíos masivos o doble confirmación podrá conectarse posteriormente mediante un proveedor de correo.

### 9.4. Versiones y publicación

- Habilitar drafts y versions en documentos publicables.
- Utilizar autosave cuando mejore el trabajo editorial.
- Permitir publicación programada solo cuando exista el proceso operativo para ejecutarla y supervisarla.
- Conservar historial suficiente para recuperar cambios editoriales.

### 9.5. Acceso público

- Lectura pública: únicamente documentos y publicaciones con estado publicado.
- Escritura pública: únicamente el endpoint controlado de suscripción.
- Creación, actualización y eliminación: usuarios administrativos autorizados.
- Las operaciones de Local API que actúen en nombre de un usuario deben respetar explícitamente el control de acceso.

---

## 10. PostgreSQL y migraciones

- Payload debe conectarse mediante `@payloadcms/db-postgres`.
- La cadena de conexión debe almacenarse en `DATABASE_URI` o en la variable definida por la configuración real.
- El entorno local puede usar el mecanismo de sincronización de desarrollo de Payload.
- Staging y producción deben utilizar migraciones versionadas y revisadas.
- Las migraciones deben ejecutarse como parte controlada del proceso de despliegue.
- No editar tablas de Payload manualmente en producción.
- Los respaldos y restauraciones de PostgreSQL deben formar parte del plan operativo del despliegue.

PostgreSQL guarda los registros y metadatos. Los binarios subidos no deben almacenarse en una carpeta efímera en producción. Si el proveedor de hosting no ofrece disco persistente, se debe configurar un storage adapter compatible y mantener en PostgreSQL la referencia del archivo.

---

## 11. Cinta del Banco Central y datos de mercado

La cinta superior aún no dispone de una API confirmada. Debe implementarse mediante un contrato desacoplado:

```ts
export interface MarketDataProvider {
  getTickerData(): Promise<MarketQuote[]>;
}
```

Implementaciones previstas:

- `UnavailableMarketDataProvider`: estado inicial seguro cuando no existe fuente oficial.
- `MockMarketDataProvider`: únicamente para desarrollo, pruebas y revisión visual.
- `BcvMarketDataProvider`: implementación futura cuando se confirme la API, sus términos y el esquema de respuesta.

Reglas:

- Consultar la fuente desde el servidor.
- No exponer API keys al navegador.
- Normalizar moneda, símbolos, fecha, zona horaria y variación antes de llegar a la UI.
- Mostrar fuente y hora de actualización.
- Usar caché o revalidación para evitar solicitudes innecesarias.
- Implementar timeout y fallback.
- No presentar valores de ejemplo como información real.
- Si no hay datos, mostrar un estado discreto de no disponibilidad; no ocultar un error con cifras inventadas.
- La animación debe pausarse con interacción del usuario y respetar `prefers-reduced-motion`.

La cinta y la tabla de cotizaciones pueden consumir el mismo modelo normalizado, pero no deben asumir que siempre provendrán de la misma fuente.

---

## 12. Documentos y experiencia de consulta

El bloque del HTML de referencia debe reinterpretarse para ser más limpio y escalable.

Requisitos funcionales:

- Separar documentación institucional, estados financieros y documentos de referencia.
- Permitir filtrar por categoría y año cuando el volumen lo justifique.
- Ordenar estados financieros por periodo descendente.
- Mostrar título, tipo de archivo, periodo, fecha y tamaño cuando estén disponibles.
- Abrir o descargar el archivo según la intención configurada.
- Usar el botón de descarga definido en `BUTTON_SYSTEM.md`.
- Mantener nombres de archivo legibles y URLs estables.
- Incluir estados vacío, carga y error.
- No cargar por adelantado todos los PDFs.

---

## 13. Newsletter y publicaciones

Se deben distinguir dos conceptos:

1. **Publicaciones/newsletters:** contenido editorial creado y publicado desde Payload.
2. **Suscriptores:** personas que registran su correo para recibir comunicaciones.

El formulario público debe:

- Validar en cliente para retroalimentación inmediata y nuevamente en servidor.
- Normalizar el correo.
- Registrar consentimiento.
- Aplicar protección contra abuso y rate limiting.
- Responder con mensajes genéricos que no expongan registros existentes.
- Mostrar estados de envío, éxito y error accesibles.

El envío de campañas no debe implementarse como un bucle improvisado dentro de una petición web. Cuando se defina el proveedor, se debe integrar mediante un servicio de correo o una tarea en segundo plano.

---

## 14. Formularios de apertura de cuenta

El HTML contempla persona natural y jurídica. La integración definitiva aún debe confirmarse.

Reglas:

- Encapsular cada formulario o embed en un componente.
- No colocar secretos o tokens privados en el código del cliente.
- Validar el origen y las políticas del proveedor externo si se usa un iframe.
- No persistir recaudos sensibles en LocalStorage.
- Si la carga de recaudos pasa a Payload, crear una colección privada y controles de acceso específicos antes de implementarla; no reutilizar la colección pública de documentos.
- Mantener separación estricta entre documentación pública y recaudos personales.

---

## 15. Variables de entorno

Crear `.env.example` sin valores reales.

Variables previstas, sujetas a la configuración instalada:

```bash
DATABASE_URI=
PAYLOAD_SECRET=
NEXT_PUBLIC_SERVER_URL=

BCV_API_URL=
BCV_API_KEY=

EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=

STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
```

Reglas:

- Solo variables deliberadamente públicas pueden usar `NEXT_PUBLIC_`.
- `PAYLOAD_SECRET`, credenciales de PostgreSQL, claves de correo y storage son exclusivamente de servidor.
- No registrar secretos en logs.
- No incluir `.env` real en control de versiones.
- Validar variables obligatorias al iniciar la aplicación.

---

## 16. Renderizado, caché e invalidación

- Usar Server Components para obtener documentos y publicaciones mediante Payload Local API.
- Evitar solicitar al REST API interno desde el mismo servidor si la Local API resuelve el caso.
- El contenido público puede cachearse de forma controlada.
- Los hooks de publicación de Payload deben invalidar las rutas o etiquetas correspondientes.
- El panel administrativo y las vistas de borrador no deben servirse desde caché pública.
- Las tablas o listados grandes deben paginarse.

---

## 17. Seguridad

- Utilizar la autenticación, recuperación de contraseña y controles de acceso de Payload.
- Configurar intentos máximos, bloqueo y políticas de sesión apropiadas.
- Aplicar RBAC en colecciones y panel administrativo.
- Validar tipo MIME, extensión y tamaño de uploads.
- Sanitizar o renderizar de forma segura el rich text.
- Proteger formularios públicos contra automatización y abuso.
- No confiar únicamente en validaciones del cliente.
- No exponer errores internos, stack traces o detalles de PostgreSQL.
- Configurar cabeceras de seguridad compatibles con embeds autorizados.
- Auditar dependencias y mantenerlas actualizadas de forma deliberada.

---

## 18. Accesibilidad y movimiento

- HTML semántico y landmarks correctos.
- Navegación completa mediante teclado.
- Foco visible en todos los controles.
- Contraste conforme a WCAG AA.
- Labels, descripciones y errores asociados a sus campos.
- No depender únicamente del color para variaciones positivas o negativas.
- Tablas con encabezados y contexto accesible.
- Tooltips como complemento, nunca como única etiqueta.
- Motion debe respetar `prefers-reduced-motion`.
- La cinta animada debe poder pausarse y no debe impedir la lectura.

---

## 19. Rendimiento

- Usar `next/image` para imágenes rasterizadas.
- Preferir el SVG oficial del logo cuando exista como archivo independiente.
- No conservar logos o fotografías como base64 dentro del código final.
- Cargar Motion únicamente en componentes que realmente lo necesitan.
- Evitar convertir toda una sección en Client Component por una interacción pequeña.
- Cargar documentos bajo demanda.
- Minimizar JavaScript de terceros y embeds.
- Reservar dimensiones para imágenes e iframes para evitar layout shift.

---

## 20. Validación y calidad

Antes de considerar terminada una implementación se debe ejecutar:

- TypeScript.
- Lint.
- Build de producción.
- Pruebas unitarias de servicios y mapeadores críticos.
- Pruebas de acceso para roles y contenido publicado/borrador.
- Pruebas de endpoints públicos.
- Revisión responsive.
- Revisión de teclado, foco, contraste y movimiento reducido.
- Verificación de migraciones en un entorno no productivo.

No deben quedar `TODO`, valores de mercado ficticios en producción, enlaces `#`, credenciales de ejemplo activas, documentos rotos ni colecciones públicas sin controles de acceso.

---

## 21. Decisiones pendientes

Estas decisiones no deben inventarse durante el desarrollo:

- API oficial y contrato de datos del Banco Central o mercado.
- Proveedor de almacenamiento de archivos en producción.
- Proveedor de correo y estrategia de campañas.
- Integración definitiva de formularios de persona natural y jurídica.
- Política de retención para suscriptores, versiones y documentos.
- Dominio final y URLs de producción.
- Requisitos adicionales de cumplimiento para tratamiento de datos y recaudos.

---

## 22. Referencias oficiales

- [Instalación de Payload en Next.js](https://payloadcms.com/docs/getting-started/installation)
- [Adaptador PostgreSQL de Payload](https://payloadcms.com/docs/database/postgres)
- [Autenticación de Payload](https://payloadcms.com/docs/authentication/overview)
- [Access Control de Payload](https://payloadcms.com/docs/access-control/overview)
- [Uploads de Payload](https://payloadcms.com/docs/upload/overview)
- [Drafts y publicación](https://payloadcms.com/docs/versions/drafts)
- [Migraciones de Payload](https://payloadcms.com/docs/database/migrations)
