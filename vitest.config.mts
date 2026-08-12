import path from 'path'
import { fileURLToPath } from 'url'

import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // `server-only` es un centinela de bundling: en Node lanza al importarse.
      // Las pruebas ejercitan justamente esos módulos de servidor, así que se
      // sustituye por un módulo vacío.
      'server-only': path.resolve(dirname, 'tests/helpers/server-only.ts'),
    },
  },
  test: {
    // Los servicios y repositorios son código de servidor: no necesitan DOM.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // Payload abre un pool de PostgreSQL: un solo proceso evita colisiones.
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
