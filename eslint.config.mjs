import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescriptConfig from 'eslint-config-next/typescript'

/**
 * `eslint-config-next` 16 ya publica configuración plana: se consume directa,
 * sin el puente `FlatCompat`, que en esta versión falla al serializar el
 * plugin de React.
 */
const eslintConfig = [
  ...coreWebVitals,
  ...typescriptConfig,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    ignores: [
      '.next/',
      'media/',
      // Recursos de skills externos al código de la aplicación.
      '.agents/',
      '.claude/',
      // Salida generada por Payload: no se edita a mano.
      'src/payload-types.ts',
      'src/payload-generated-schema.ts',
      'src/migrations/**',
      'src/app/(payload)/admin/importMap.js',
    ],
  },
]

export default eslintConfig
