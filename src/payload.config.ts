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

export default buildConfig({
  serverURL: serverUrl,
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
  cors: [serverUrl],
  csrf: [serverUrl],
  // La web pública consume Payload por Local API; no hace falta exponer GraphQL.
  graphQL: { disable: true },
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { es, en },
  },
  sharp,
  plugins: [],
})
