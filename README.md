# Kaizen Casa de Bolsa

Web institucional y panel administrativo de **Kaizen Casa de Bolsa**, en una única
aplicación Next.js con Payload integrado y PostgreSQL.

- Web pública: `http://localhost:3000`
- Panel administrativo: `http://localhost:3000/admin`

## Documentos que mandan

Estos archivos son la fuente de verdad del proyecto y no se modifican desde el código:

| Archivo | Qué define |
|---|---|
| `TECHNICAL_ARCHITECTURE (1).md` | Stack, capas, control de acceso y reglas de seguridad |
| `BRAND.md` | Paleta, tipografía, logo, iconografía y tono de voz |
| `BUTTON_SYSTEM.md` | Comportamiento del Action Button y del Download Button |
| `PRODUCT.md` | Verdad de producto, audiencias y decisiones pendientes |
| `kcb_reference.html` | Referencia de contenido y estructura (no se copia literalmente) |

## Puesta en marcha

Requiere Node 20+ y un PostgreSQL accesible.

```bash
cp .env.example .env     # completa DATABASE_URI y PAYLOAD_SECRET
npm install
npm run dev
```

En el primer arranque, `http://localhost:3000/admin` muestra la pantalla de
creación de la cuenta inicial de Payload. **Esa primera cuenta se promueve
automáticamente a `super-admin`**; las siguientes las crea un Super Admin desde
el panel, con el rol que corresponda.

### Variables de entorno

Solo `NEXT_PUBLIC_SERVER_URL` es pública. `DATABASE_URI`, `PAYLOAD_SECRET` y las
claves de correo o almacenamiento son exclusivamente de servidor y nunca deben
llevar el prefijo `NEXT_PUBLIC_`. `.env` está en `.gitignore`.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build de producción |
| `npm run typecheck` | TypeScript en modo estricto |
| `npm run lint` | ESLint |
| `npm test` | Pruebas de servicios, mapeadores y control de acceso |
| `npm run generate:types` | Regenera `src/payload-types.ts` |
| `npm run generate:importmap` | Regenera el import map del panel |
| `npm run migrate:create` | Crea una migración a partir del esquema actual |
| `npm run migrate` | Aplica migraciones pendientes |
| `npm run migrate:status` | Estado de las migraciones |

En desarrollo, Payload sincroniza el esquema automáticamente (`push`). En
staging y producción **debe** usarse `npm run migrate`: el push queda desactivado
cuando `NODE_ENV=production`.

## Organización

```text
src/
├── app/(frontend)/      Web pública, rutas, estados y endpoint de newsletter
├── app/(payload)/       Panel y API de Payload (generado)
├── components/
│   ├── layout/          Cinta de mercado, navbar, footer
│   ├── sections/        Una sección del landing por componente
│   └── ui/              Botones, iconos, tarjetas y estados compartidos
├── modules/             Dominio: documents · publications · subscriptions ·
│                        market-data · communications (domain / services / data)
├── integrations/        Límites externos: market-data · email · storage
├── payload/             Colecciones, control de acceso, campos y hooks
├── lib/                 Entorno, formato, rate limiting, cliente de Payload
├── styles/              Tokens de marca y sistema de botones
└── migrations/          Migraciones versionadas de PostgreSQL
```

Reglas que sostienen esta estructura:

- Un componente visual **nunca** consulta PostgreSQL ni una API externa. Pide
  datos a un servicio, que a su vez usa un repositorio.
- Los repositorios devuelven modelos de dominio, no documentos crudos de Payload.
- El texto institucional permanente vive en el componente de su sección. Payload
  administra solo lo que debe publicarse sin desplegar código.
- Server Components por defecto; `"use client"` solo donde hay interacción,
  Motion o una API de navegador.

## Contenido administrable

| Colección | Para qué sirve |
|---|---|
| `admin-users` | Cuentas del panel, con rol `super-admin` o `editor` |
| `media` | Archivos e imágenes, con tipo MIME y tamaño restringidos |
| `documents` | Documentación institucional, estados financieros, cumplimiento y referencia |
| `publications` | Newsletters, cumplimiento y actualizaciones de mercado |
| `subscribers` | Suscripciones recibidas desde la web |

`documents` y `publications` tienen borradores, versiones, autosave y vista
previa. La web pública solo muestra lo publicado.

## Decisiones pendientes

No deben inventarse; están registradas en `PRODUCT.md` y reflejadas en el código
mediante estados explícitos:

- **API oficial de mercado / Banco Central.** La cinta y la tabla de cotizaciones
  muestran un estado de no disponibilidad. Al confirmarse, se implementa
  `MarketDataProvider` en `src/integrations/market-data/bcv-provider.ts` y se
  configura `MARKET_DATA_PROVIDER=bcv` con `BCV_API_URL`.
- **Formularios de apertura de cuenta** (persona natural y jurídica). La sección
  de registro muestra un estado de integración pendiente y deriva al contacto.
- **Proveedor de correo.** `src/integrations/email/` tiene el contrato y una
  implementación que no envía. Los envíos masivos no deben ejecutarse dentro de
  una petición web.
- **Almacenamiento de archivos en producción.** Hoy se usa disco local. Si la
  plataforma de destino no tiene disco persistente, hay que instalar un storage
  adapter aprobado antes de desplegar.
- **Dominio de producción.** Por eso no se declara una URL canónica absoluta.

## Notas del entorno

El proyecto está dentro de una carpeta sincronizada con OneDrive. La sincronización
puede bloquear archivos de `.next` y hacer fallar un build con `EPERM`; si ocurre,
basta con borrar `.next` y repetir el build (`npm run devsafe` lo hace en desarrollo).
