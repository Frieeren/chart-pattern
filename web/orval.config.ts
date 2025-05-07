export default {
  api: {
    input: './openapi.json',
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/endpoints',
      schemas: 'src/shared/api/models',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: 'http://localhost:8000',
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
      target: './openapi.json',
    },
    output: {
      mode: 'tags-split',
      client: 'zod',
      target: 'src/shared/api/endpoints',
      fileExtension: '.zod.ts',
    },
  },
};