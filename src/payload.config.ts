import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { assertRequiredEnv, databaseUri, isProduction, payloadSecret, serverUrl } from '@/lib/env'

import { AdminUsers } from './payload/collections/AdminUsers'
import { Documents } from './payload/collections/Documents'
import { Media } from './payload/collections/Media'
import { Publications } from './payload/collections/Publications'
import { Subscribers } from './payload/collections/Subscribers'

const dirname = path.dirname(fileURLToPath(import.meta.url))

assertRequiredEnv()

/* ¿La URL pública apunta a la propia máquina? En ese caso el sitio se sirve por
   HTTP y con puerto variable. */
const isLocalHost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(serverUrl)

/* `cors` y `csrf` solo se declaran cuando hay un dominio real que proteger.
   Payload compara el `Origin` de cada petición autenticada contra esta lista y,
   si no encaja, resuelve la sesión como anónima: el login devuelve 200, la
   petición siguiente llega sin usuario y el panel te devuelve al login.
   En local eso ocurría con cualquier desviación del valor exacto de
   `NEXT_PUBLIC_SERVER_URL` —otro puerto, `127.0.0.1` en vez de `localhost`, o
   una petición sin cabecera `Origin`—, que es justo el rebote que se estaba
   viendo. El proyecto de referencia no declara ninguna de las dos y por eso no
   lo sufre. Fuera de local se mantienen, donde sí aportan. */
/* `serverURL` entra en el mismo paquete: aunque `csrf` no se declare, Payload
   toma la URL del servidor como origen admitido implícito, así que fijarla
   reintroduce el rechazo por sí sola. El proyecto de referencia tampoco la
   declara. Sin ella, Payload deduce el origen de cada petición. */
const originGuards = isLocalHost
  ? {}
  : { serverURL: serverUrl, cors: [serverUrl], csrf: [serverUrl] }

export default buildConfig({
  admin: {
    user: AdminUsers.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · Kaizen Casa de Bolsa',
      description: 'Panel administrativo de Kaizen Casa de Bolsa.',
      icons: [{ rel: 'icon', type: 'image/png', url: '/brand/kaizen-isotipo.png' }],
    },
    components: {
      graphics: {
        Logo: '@/payload/components/AdminLogo#AdminLogo',
        Icon: '@/payload/components/AdminIcon#AdminIcon',
      },
    },
  },
  collections: [AdminUsers, Media, Documents, Publications, Subscribers],
  editor: lexicalEditor(),
  secret: payloadSecret(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: databaseUri() },
    // En local se usa el push de desarrollo de Payload; staging y producción
    // aplican migraciones versionadas y revisadas.
    push: !isProduction,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  ...originGuards,
  // La web pública consume Payload por Local API; no hace falta exponer GraphQL.
  graphQL: { disable: true },
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { es, en },
  },
  sharp,
  plugins: [],
})
