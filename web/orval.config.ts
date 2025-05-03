export default {
  api: {
    input: './openapi.yaml',
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/endpoints',
      schemas: 'src/shared/api/models',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: 'http://localhost:3000',
      mock: true,
      override: {
        mutator: {
          path: './src/shared/api/http.ts',
          name: 'http',
        },
      },
    }
  },
  zod: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: 'src/shared/api/endpoints',
      fileExtension: '.zod.ts',
    },
  },
};